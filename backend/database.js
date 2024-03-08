import dotenv from "dotenv";
import process from "process";
import pg from "pg";
import { raw } from "mysql2";
dotenv.config();

// const pool = pg
//   .createPool({
//     host: "localhost",
//     user: "doraemon",
//     password: "nobita",
//     database: "linkify",
//     timezone: "+00:00",
//   })
//   .promise();
const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Linkify2",
  password: "123",
  port: 5432,
});
// const pool = new Pool({
//   connectionString: process.env.POSTGRESS_URL,
// })
export async function getOrders(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT Orders.*,P.model,P.picture1 
    FROM Orders JOIN Product P ON Orders.product_id = P.id
    WHERE warehouse_mgr_id = $1
    Order BY 
    CASE 
      WHEN Orders.status = 'pending' THEN 1
      WHEN Orders.status = 'processing' THEN 2
      WHEN Orders.status = 'delivered' THEN 3
      ELSE 4
    END, 
    Orders.order_place_date DESC,
    SUBSTR(Orders.id,1,10)::INTEGER ASC, 
    SUBSTR(Orders.id,12,length(Orders.id))::INTEGER ASC, 
    Orders.sub_id ASC;`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getOrdersByID(warehouse_mgr_id, order_id) {
  const res = await pool.query(
    `SELECT Orders.*,W.name as mgr_name,P.name,P.model,P.picture1,C.store_name,C.owner_name,C.city,WS.available_qty,WS.id AS warehouse_stock_id
    FROM Orders 
    JOIN Product P ON Orders.product_id = P.id
    JOIN Customer C ON Orders.customer_id = C.id
    JOIN Warehouse_mgr W ON Orders.warehouse_mgr_id = W.id
    JOIN Warehouse WH ON W.warehouse_id = WH.id
    JOIN Warehouse_stock WS ON Orders.product_id = WS.product_id AND W.warehouse_id = WS.warehouse_id
    WHERE warehouse_mgr_id = $1 AND Orders.id = $2
    Order BY 
    CASE 
      WHEN Orders.status = 'pending' THEN 1
      WHEN Orders.status = 'processing' THEN 2
      WHEN Orders.status = 'delivered' THEN 3
      ELSE 4
    END, 
    Orders.order_place_date DESC,
    SUBSTR(Orders.id,1,10)::INTEGER ASC, 
    SUBSTR(Orders.id,12,length(Orders.id))::INTEGER ASC, 
    Orders.sub_id ASC;`,
    [warehouse_mgr_id, order_id]
  );
  return res.rows;
}
export async function getGroupedOrders(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT id,MAX(exp_delivery_date) as max_date
    FROM Orders
    WHERE warehouse_mgr_id = $1 
    GROUP BY id`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getPendingOrders(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT Orders.*,P.model,P.picture1 
    FROM Orders JOIN Product P ON Orders.product_id = P.id
    WHERE warehouse_mgr_id = $1 AND status = 'pending'
    Order BY  
    CASE 
      WHEN Orders.status = 'pending' THEN 1
      WHEN Orders.status = 'processing' THEN 2
      WHEN Orders.status = 'delivered' THEN 3
      ELSE 4
    END,
    Orders.order_place_date DESC,
    SUBSTR(Orders.id,1,10)::INTEGER ASC, 
    SUBSTR(Orders.id,12,length(Orders.id))::INTEGER ASC, 
    Orders.sub_id ASC;`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getPendingDemand(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT W.id AS warehouse_stock_id,SUM(O.qty) AS demand_qty
    FROM Orders O JOIN warehouse_mgr Wm ON O.warehouse_mgr_id=Wm.id 
    RIGHT OUTER JOIN warehouse_stock W ON O.product_id=W.product_id AND W.warehouse_id=Wm.warehouse_id
    WHERE O.warehouse_mgr_id= $1 AND O.status='pending'
    GROUP BY W.id`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getProcessingDemand(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT W.id AS warehouse_stock_id,SUM(O.qty) AS demand_qty
    FROM Orders O JOIN warehouse_mgr Wm ON O.warehouse_mgr_id=Wm.id 
    RIGHT OUTER JOIN warehouse_stock W ON O.product_id=W.product_id AND W.warehouse_id=Wm.warehouse_id
    WHERE O.warehouse_mgr_id= $1 AND O.status='processing'
    GROUP BY W.id`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getProcessingOrders(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT Orders.*,P.model,P.picture1 
    FROM Orders JOIN Product P ON Orders.product_id = P.id
    WHERE warehouse_mgr_id = $1 AND status = 'processing'
    Order BY 
    CASE 
      WHEN Orders.status = 'pending' THEN 1
      WHEN Orders.status = 'processing' THEN 2
      WHEN Orders.status = 'delivered' THEN 3
      ELSE 4
    END, 
    Orders.order_place_date DESC,
    SUBSTR(Orders.id,1,10)::INTEGER ASC, 
    SUBSTR(Orders.id,12,length(Orders.id))::INTEGER ASC, 
    Orders.sub_id ASC;`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function processOrder(warehouse_mgr_id, order_id) {
  let available = true;

  const orders = await pool.query(
    `SELECT O.*, W.*
    FROM Orders O
    JOIN (SELECT WS.id AS warehouse_stock_id,WS.available_qty,WS.product_id,WM.id  FROM Warehouse_stock WS JOIN Warehouse_mgr WM ON WS.warehouse_id=WM.warehouse_id) W
    ON O.product_id=W.product_id
    WHERE W.id = $1 AND O.id = $2`,
    [warehouse_mgr_id, order_id]
  );

  const processingDemand = await getProcessingDemand(warehouse_mgr_id);
  for (let i = 0; i < orders.rows.length; i++) {
    let processing_qty =
      processingDemand.find(
        (product) =>
          product.warehouse_stock_id === orders.rows[i].warehouse_stock_id
      )?.demand_qty || 0;

    if (orders.rows[i].qty > orders.rows[i].available_qty - processing_qty) {
      available = false;
      break;
    }
  }
  if (available) {
    await pool.query(
      `UPDATE Orders SET status = 'processing' WHERE warehouse_mgr_id = $1 AND id = $2`,
      [warehouse_mgr_id, order_id]
    );
    return "Order processed successfully";
  } else {
    return "Insufficient stock";
  }
}
export async function getWareMgrPass(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT passwords FROM Warehouse_mgr
      WHERE id = $1`,
    [warehouse_mgr_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getRetailerPass(retailer_id) {
  const res = await pool.query(
    `SELECT passwords FROM Customer
      WHERE id = $1`,
    [retailer_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getDeliveryMgrPass(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT passwords FROM Delivery_mgr
      WHERE id = $1`,
    [delivery_mgr_id]
  );
  console.log(res.rows);
  return res.rows;
}

export async function getAllWareMgrInfo() {
  const res = await pool.query(
    `SELECT * FROM Warehouse_mgr`,
    []
  );
  return res.rows;
}
export async function getAllProductionMgrInfo() {
  const res = await pool.query(
    `SELECT * FROM Production_mgr`,
    []
  );
  return res.rows;
}
export async function getAllDeliveryMgrInfo() {
  const res = await pool.query(
    `SELECT * FROM Delivery_mgr`,
    []
  );
  return res.rows;
}
export async function getAllSupplyMgrInfo() {
  const res = await pool.query(
    `SELECT * FROM Supply_mgr`,
    []
  );
  return res.rows;
}

export async function getWareMgrInfo(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT * FROM Warehouse_mgr
      WHERE id = $1`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getRetailerInfo(retailer_id) {
  const res = await pool.query(
    `SELECT * FROM Customer
      WHERE id = $1`,
    [retailer_id]
  );
  return res.rows;
}
export async function getFactoryinfo() {
  const res = await pool.query(`SELECT * FROM Factory`);
  return res.rows;
}
export async function getWarehouseStock(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT W.*,P.id as product_id,P.name
      FROM Warehouse_stock W 
      JOIN Warehouse_mgr M USING(warehouse_id)
      JOIN Product P ON W.product_id = P.id
      WHERE M.id = $1
      ORDER BY W.id ASC`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getPendingOrderNumber(warehouse_mgr_id) {
  const res = await pool.query(`SELECT * FROM get_pending_order_no($1)`, [
    warehouse_mgr_id,
  ]);
  return res.rows;
}
export async function getProcessingOrderNumber(warehouse_mgr_id) {
  const res = await pool.query(`SELECT * FROM get_processing_order_no($1)`, [
    warehouse_mgr_id,
  ]);
  return res.rows;
}
export async function getPendingWareReqNumber(warehouse_mgr_id) {
  const res = await pool.query(`SELECT * FROM get_ware_req_no($1)`, [
    warehouse_mgr_id,
  ]);
  return res.rows;
}
// export async function getWareStocks(warehouse_mgr_id) {
//   const res = await pool.query(
//     `SELECT P.*, W.*
//     FROM warehouse_stock W JOIN warehouse_mgr M ON W.warehouse_id=M.warehouse_id
//     JOIN Product P ON W.product_id=P.id
//     WHERE M.id = $1`,
//     [warehouse_mgr_id]
//   );
//   return res.rows;
// }
export async function makeWareReq(
  warehouse_id,
  ware_stock_id,
  factory_id,
  qty
) {
  const production_mgr_id = await pool.query(
    `SELECT PR.id, SUM(CASE WHEN WR.id IS NULL THEN 0 ELSE 1 END) as count
    FROM production_mgr PR 
    LEFT OUTER JOIN Ware_request WR ON PR.id = WR.production_mgr_id
    WHERE factory_id = $1
    GROUP BY PR.id
    ORDER BY count ASC;`,
    [factory_id]
  );
  await pool.query(
    `INSERT INTO Ware_request(warehouse_id,production_mgr_id,ware_stock_id,request_date,qty) VALUES ($1,$2,$3,now(),$4)`,
    [warehouse_id, production_mgr_id.rows[0]?.id, ware_stock_id, qty]
  );
}
// export async function getPic(warehouse_mgr_id) {
//   const res = await pool.query(
//     `SELECT profile_picture FROM Warehouse_mgr
//       WHERE id = $1`,
//     [warehouse_mgr_id]
//   );
//   return res.rows;
// }
export async function createEmployee(
  employee_type,
  name,
  profile_picture,
  nid,
  mobile_no,
  password,
  joining_date,
  salary,
  department_id,
  delivery_type
) {
  const pattern = /^\d{3}-\d{3}-\d{4}$/;
  if (!pattern.test(nid)) {
    return "NID is not valid";
  }
  if (
    mobile_no.toString().substring(0, 2) != "01" ||
    mobile_no.toString().length !== 11
  ) {
    return "Mobile number is not valid";
  }
  if(password.length < 8 || password.length > 20 ){
    return "Password length should be between 8 to 20";
  }
  if (employee_type === "warehouse_manager") {
    return pool
      .query(`SELECT * FROM Warehouse WHERE id = $1`, [department_id])
      .then((res) => {
        if (res.rows.length > 0) {
          return pool.query(
            `INSERT INTO Warehouse_mgr(name,profile_picture,nid,mobile_no,passwords,joining_date,salary,warehouse_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              name,
              profile_picture,
              nid,
              mobile_no,
              password,
              joining_date,
              salary,
              department_id,
            ]
          );
        } else {
          console.log("Warehouse not found");
          return "Warehouse not found";
        }
      })
      .then((res) => {
        if (res === "Warehouse not found") {
          return "Warehouse not found";
        } else {
          return "Employee created successfully";
        }
      })
      .catch((error) => {
        console.log(error);
        return "Error in creating employee";
      });
  } else if (employee_type === "production_manager") {
    return pool
      .query(`SELECT * FROM Factory WHERE id = $1`, [department_id])
      .then((res) => {
        if (res.rows.length > 0) {
          return pool.query(
            `INSERT INTO Production_mgr(name,profile_picture,nid,mobile_no,passwords,joining_date,salary,factory_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              name,
              profile_picture,
              nid,
              mobile_no,
              password,
              joining_date,
              salary,
              department_id,
            ]
          );
        } else {
          return "Factory not found";
        }
      })
      .catch((error) => {
        console.log(error);
        return "Error in creating employee";
      });
  } else if (employee_type === "supply_manager") {
    return pool
      .query(`SELECT * FROM Factory WHERE id = $1`, [department_id])
      .then((res) => {
        if (res.rows.length > 0) {
          return pool.query(
            `INSERT INTO Supply_mgr(name,profile_picture,nid,mobile_no,passwords,joining_date,salary,factory_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              name,
              profile_picture,
              nid,
              mobile_no,
              password,
              joining_date,
              salary,
              department_id,
            ]
          );
        } else {
          return "Factory not found";
        }
      })
      .catch((error) => {
        console.log(error);
        return "Error in creating employee";
      });
  } else if (employee_type === "delivery_manager") {
    if (delivery_type[0] === "warehouse") {
      return pool
        .query(`SELECT * FROM Warehouse WHERE id = $1`, [department_id])
        .then((res) => {
          if (res.rows.length > 0) {
            console.log("warehousdddddddde");
            return pool
              .query(
                `INSERT INTO Delivery_mgr(name,profile_picture,nid,mobile_no,passwords,joining_date,salary) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                [
                  name,
                  profile_picture,
                  nid,
                  mobile_no,
                  password,
                  joining_date,
                  salary,
                ]
              )
              .then((res) => {
                return pool.query(
                  `INSERT INTO Warehouse_delivery(warehouse_id,delivery_mgr_id) VALUES ($1,$2)`,
                  [department_id, res.rows[0].id]
                );
              })
              .then(() => {
                return "Employee created successfully";
              });
          } else {
            return "Warehouse not found";
          }
        })
        .catch((error) => {
          console.log(error);
          return "Error in creating employee";
        });
    } else if (delivery_type[0] === "factory") {
      return pool
        .query(`SELECT * FROM Factory WHERE id = $1`, [department_id])
        .then((res) => {
          if (res.rows.length > 0) {
            return pool
              .query(
                `INSERT INTO Delivery_mgr(name,profile_picture,nid,mobile_no,passwords,joining_date,salary) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                [
                  name,
                  profile_picture,
                  nid,
                  mobile_no,
                  password,
                  joining_date,
                  salary,
                ]
              )
              .then((res) => {
                return pool.query(
                  `INSERT INTO Factory_delivery(factory_id,delivery_mgr_id) VALUES ($1,$2)`,
                  [department_id, res.rows[0].id]
                );
              })
              .then(() => {
                return "Employee created successfully";
              });
          } else {
            return "Factory not found";
          }
        })
        .catch((error) => {
          console.log(error);
          return "Error in creating employee";
        });
    }
  }
}
export async function processReqProductionMgr(req_id) {
  await pool.query(
    `UPDATE Ware_request SET status = 'processing' WHERE id = $1`,
    [req_id]
  );
}
export async function processReqSupplyMgr(req_id) {
  await pool.query(
    `UPDATE Factory_request SET status = 'processing' WHERE id = $1`,
    [req_id]
  );
}
export async function submitInvoiceSupplyMgr(file, request_id) {
  const { buffer } = file;
  console.log("ds");
  return pool
    .query(
      "INSERT INTO Factory_invoice (factory_req_id,invoice_file) VALUES ($2,$1)",
      [buffer, request_id]
    )
    .then(() => {
      return pool.query(
        "UPDATE Factory_request SET status = 'completed' WHERE id = $1",
        [request_id]
      );
    })
    .then(() => {
      return "Invoice submitted successfully";
    })
    .catch((error) => {
      console.error(error);
      return "Error in submitting invoice";
    });
}
export async function getWareRequestsFactory(production_mgr_id) {
  const res = await pool.query(
    `SELECT WR.*,R.available_qty,R.product_id,R.model,P.factory_id,P.name as mgr_name,R.name,F.factory_stock_id,R.city,F.available_qty as factory_available_qty
    FROM Ware_request WR 
    JOIN Production_mgr P ON P.id=WR.production_mgr_id
    JOIN Factory F ON P.factory_id=F.id
    JOIN (
      SELECT W.id,W.available_qty,PR.id as product_id,PR.name,PR.model,WH.city as city 
      FROM Warehouse_stock W
      JOIN Product PR on W.product_id = PR.id
      JOIN Warehouse WH ON W.warehouse_id = WH.id
    ) R ON WR.ware_stock_id = R.id
    WHERE P.id = $1
    ORDER BY WR.request_date DESC`,
    [production_mgr_id]
  );
  return res.rows;
}
export async function getWareInvoiceDelivery(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT WR.*,R.available_qty,R.product_id,R.model,P.factory_id,P.name as mgr_name,R.name,F.factory_stock_id,R.city,F.available_qty as factory_available_qty,D.name as delivery_mgr_name,WI.issue_date,WI.issue_qty
    FROM Ware_request WR 
    JOIN Ware_invoice WI ON WR.id=WI.ware_req_id
    JOIN Delivery_mgr D ON WI.delivery_mgr_id=D.id
    JOIN Production_mgr P ON P.id=WR.production_mgr_id
    JOIN Factory F ON P.factory_id=F.id
    JOIN (
      SELECT W.id,W.available_qty,PR.id as product_id,PR.name,PR.model,WH.city as city 
      FROM Warehouse_stock W
      JOIN Product PR on W.product_id = PR.id
      JOIN Warehouse WH ON W.warehouse_id = WH.id
    ) R ON WR.ware_stock_id = R.id
    WHERE WI.delivery_mgr_id = $1
    ORDER BY 
    CASE 
      WHEN WR.status = 'delivery-pending' THEN 1
      WHEN WR.status = 'delivered' THEN 2
      ELSE 3
    END, 
    WR.warehouse_id ASC,
    WR.request_date DESC`,
    [delivery_mgr_id]
  );
  return res.rows;
}
export async function getWareRequests(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT W.* ,R.id as ware_stock_id,R.product_id,R.model,P.factory_id,P.city
    FROM Ware_request W 
    JOIN 
    Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    JOIN (
      SELECT W.id,PR.id as product_id,PR.model,PR.picture1
      FROM Warehouse_stock W JOIN Product PR on W.product_id = PR.id
    ) R ON W.ware_stock_id = R.id
    WHERE M.id = $1
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function getWareRequests_with_s_filter(
  warehouse_mgr_id,
  warehouse_stock_id
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.ware_stock_id = $2
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, warehouse_stock_id]
  );
  return res.rows;
}
export async function getWareRequests_with_d_filter(
  warehouse_mgr_id,
  request_date
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.request_date = $2
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, request_date]
  );
  return res.rows;
}
export async function getWareRequests_with_f_filter(
  warehouse_mgr_id,
  factory_id
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND P.factory_id = $2
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, factory_id]
  );
  return res.rows;
}
export async function getWareRequests_with_sf_filter(
  warehouse_mgr_id,
  warehouse_stock_id,
  factory_id
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.ware_stock_id = $2 AND P.factory_id = $3
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, warehouse_stock_id, factory_id]
  );
  return res.rows;
}
export async function getWareRequests_with_df_filter(
  warehouse_mgr_id,
  request_date,
  factory_id
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.request_date= $2 AND P.factory_id = $3
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, request_date, factory_id]
  );
  return res.rows;
}
export async function getWareRequests_with_sd_filter(
  warehouse_mgr_id,
  warehouse_stock_id,
  request_date
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.ware_stock_id = $2 AND W.request_date = $3
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, warehouse_stock_id, request_date]
  );
  return res.rows;
}
export async function getWareRequests_with_sdf_filter(
  warehouse_mgr_id,
  warehouse_stock_id,
  request_date,
  factory_id
) {
  const res = await pool.query(
    `SELECT W.* ,P.factory_id,P.city
    FROM Ware_request W JOIN Warehouse_mgr M USING(warehouse_id)
    JOIN 
    (SELECT Production_mgr.id,Production_mgr.factory_id,Factory.city
    FROM Production_mgr JOIN Factory ON Production_mgr.factory_id = Factory.id)
    P ON W.production_mgr_id = P.id
    WHERE M.id = $1 AND W.ware_stock_id = $2 AND W.request_date = $3 AND P.factory_id = $4
    ORDER BY W.request_date DESC`,
    [warehouse_mgr_id, warehouse_stock_id, request_date, factory_id]
  );
  return res.rows;
}

export async function getProductMgrPass(production_mgr_id) {
  const res = await pool.query(
    `SELECT passwords FROM Production_mgr
    WHERE id = $1`,
    [production_mgr_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getSupplyMgrPass(supply_mgr_id) {
  const res = await pool.query(
    `SELECT passwords FROM Supply_mgr
      WHERE id = $1`,
    [supply_mgr_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getAdminPass(admin_id) {
  const res = await pool.query(
    `SELECT secret FROM Admin
      WHERE id = $1`,
    [admin_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getAllProductInfo() {
  const res = await pool.query(`SELECT * FROM Product`);
  return res.rows;
}
export async function getProductInfoByID(product_id) {
  const res = await pool.query(
    `SELECT * FROM Product
    WHERE id = $1`,
    [product_id]
  );
  return res.rows;
}

export async function addToCart(retailer_id, product_id, qty) {
  await pool.query(
    `INSERT INTO Cart(customer_id,product_id,qty) VALUES ($1,$2,$3)`,
    [retailer_id, product_id, qty]
  );
}
export async function queryCart(retailer_id, product_id) {
  const res = await pool.query(
    `
  SELECT *
  FROM Cart
  WHERE customer_id=$1 AND product_id=$2`,
    [retailer_id, product_id]
  );
  return res.rows;
}
export async function getCart(retailer_id) {
  const res = await pool.query(
    `
  SELECT C.*,P.name,P.unit_price,P.picture1
  FROM Cart C JOIN Product P ON C.product_id = P.id
  WHERE C.customer_id=$1`,
    [retailer_id]
  );
  return res.rows;
}
export async function setCart(retailer_id, cart_array = []) {
  await pool.query(`DELETE FROM Cart WHERE customer_id = $1`, [retailer_id]);
  cart_array.forEach(async (item) => {
    await pool.query(
      `INSERT INTO Cart(customer_id,product_id,qty) VALUES ($1,$2,$3)`,
      [retailer_id, item.product_id, item.qty]
    );
  });
}
export async function updateCart(retailer_id, product_id, qty) {
  await pool.query(
    `UPDATE Cart SET qty=$1 WHERE customer_id=$2 AND product_id=$3`,
    [qty, retailer_id, product_id]
  );
}
function mysqlDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
export async function placeOrder(cartInfo, retailer_id) {
  const res = await pool.query(
    `SELECT order_count,city FROM Customer WHERE id = $1`,
    [retailer_id]
  );
  const res3 = await pool.query(
    `SELECT M.id as M_id, COUNT(O.id) as Pending_order
    FROM warehouse_mgr M 
    JOIN warehouse W ON M.warehouse_id = W.id
    LEFT JOIN Orders O ON O.warehouse_mgr_id = M.id AND O.status = 'pending'
    WHERE W.city = $1
    GROUP BY M.id
    ORDER BY Pending_order DESC;`,
    [res.rows[0]?.city]
  );
  let i = 1;
  let maxTime = 0;
  cartInfo.forEach(async (item) => {
    const res2 = await pool.query(
      `SELECT minimum_delivery_time FROM Product WHERE id=$1`,
      [item.product_id]
    );
    const deliveryTime = Number(res2.rows[0]?.minimum_delivery_time);
    if (!isNaN(deliveryTime)) {
      if (deliveryTime > maxTime) {
        maxTime = deliveryTime;
      }
    }
  });
  cartInfo.forEach(async (item) => {
    const res4 = await pool.query(
      `SELECT unit_price FROM Product WHERE id=$1`,
      [item.product_id]
    );
    await pool.query(
      `INSERT INTO Orders (id,sub_id, product_id, customer_id, warehouse_mgr_id, qty, order_place_date, exp_delivery_date, paid_amount, status) VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        `${retailer_id}-${res.rows[0]?.order_count + 1}`,
        i++,
        item.product_id,
        retailer_id,
        res3.rows[0]?.m_id,
        item.qty,
        mysqlDate(),
        mysqlDate(addDays(new Date(), maxTime)),
        item.qty * res4.rows[0]?.unit_price,
        "pending",
      ]
    );
  });
  await pool.query(`CALL post_order_placement($1)`, [retailer_id]);
  return "Order placed successfully";
}
export async function getRetailerOrdersID(retailer_id) {
  const res = await pool.query(
    `SELECT O.id 
    FROM Orders O
    WHERE customer_id = $1
    GROUP BY O.id,O.order_place_date 
    ORDER BY O.order_place_date DESC,
    SUBSTR(O.id,12,length(O.id))::INTEGER DESC`,
    [retailer_id]
  );
  return res.rows;
}

export async function getRetailerOrdersbyID(retailer_id, order_id) {
  const res = await pool.query(
    `SELECT O.* 
    FROM Orders O
    WHERE customer_id = $1 AND id=$2`,
    [retailer_id, order_id]
  );
  return res.rows;
}

export async function getDeliveryMgrInfo(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT * FROM Delivery_mgr
      WHERE id = $1`,
    [delivery_mgr_id]
  );
  return res.rows;
}
export async function getSupplyMgrInfo(supply_mgr_id) {
  const res = await pool.query(
    `SELECT * FROM Supply_mgr
      WHERE id = $1`,
    [supply_mgr_id]
  );
  return res.rows;
}

export async function getProductbyID(product_id) {
  const res = await pool.query(
    `SELECT name,model
    FROM Product
    WHERE id=$1`,
    [product_id]
  );
  return res.rows;
}

export async function getAllInvoice() {
  const res = await pool.query(
    `SELECT C.*,D.name as delivery_mgr_name,W.name as warehouse_mgr_name,CC.id as customer_id,CC.store_name,CC.owner_name,CC.city,O.order_place_date,P.name,P.model,O.exp_delivery_date,O.status
    FROM Customer_invoice C 
    JOIN Orders O ON C.order_id = O.id AND C.order_sub_id = O.sub_id
    JOIN Product P ON C.product_id = P.id
    JOIN Customer CC ON O.customer_id = CC.id
    JOIN Delivery_mgr D ON C.delivery_mgr_id = D.id
    JOIN Warehouse_mgr W ON C.warehouse_mgr_id = W.id
    ORDER BY 
    CASE 
      WHEN O.status = 'delivery-pending' THEN 1
      WHEN O.status = 'completed' THEN 2
      ELSE 4
    END,
    O.exp_delivery_date DESC,
    C.order_sub_id ASC`
  );
  return res.rows == undefined ? [] : res.rows;
}
export async function getInvoiceDeliveryMgr(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT C.*,D.name as delivery_mgr_name,W.name as warehouse_mgr_name,CC.id as customer_id,CC.store_name,CC.owner_name,CC.city,O.order_place_date,P.name,P.model,O.exp_delivery_date,O.status
    FROM Customer_invoice C 
    JOIN Orders O ON C.order_id = O.id AND C.order_sub_id = O.sub_id
    JOIN Product P ON C.product_id = P.id
    JOIN Customer CC ON O.customer_id = CC.id
    JOIN Delivery_mgr D ON C.delivery_mgr_id = D.id
    JOIN Warehouse_mgr W ON C.warehouse_mgr_id = W.id
    WHERE C.delivery_mgr_id = $1
    ORDER BY 
    CASE 
      WHEN O.status = 'delivery-pending' THEN 1
      WHEN O.status = 'completed' THEN 2
      ELSE 4
    END,
    O.exp_delivery_date DESC,
    C.order_sub_id ASC`,
    [delivery_mgr_id]
  );
  return res.rows == undefined ? [] : res.rows;
}
export async function getInvoice(order_id) {
  const res = await pool.query(
    `SELECT C.*,D.name as delivery_mgr_name,W.name as warehouse_mgr_name,CC.store_name,CC.owner_name,CC.city,O.order_place_date,P.name,P.model,O.exp_delivery_date
    FROM Customer_invoice C 
    JOIN Orders O ON C.order_id = O.id AND C.order_sub_id = O.sub_id
    JOIN Product P ON C.product_id = P.id
    JOIN Customer CC ON O.customer_id = CC.id
    JOIN Delivery_mgr D ON C.delivery_mgr_id = D.id
    JOIN Warehouse_mgr W ON C.warehouse_mgr_id = W.id
    WHERE C.order_id = $1`,
    [order_id]
  );
  return res.rows == undefined ? [] : res.rows;
}
export async function createInvoice(
  order_id,
  order_sub_id,
  qty,
  warehouse_stock_id,
  warehouse_mgr_id,
  product_id,
  paid_amount
) {
  const compatible_delivery_mgr_ID = await pool.query(
    `SELECT M.id as M_id, COUNT(CI.order_id) as countOrder
    FROM Delivery_mgr M
    JOIN 
    Warehouse_delivery WD ON M.id = WD.delivery_mgr_id
    JOIN Warehouse_mgr W ON W.warehouse_id = WD.warehouse_id
    LEFT OUTER JOIN Customer_invoice CI ON CI.delivery_mgr_id=M.id
    WHERE W.id = $1
    GROUP BY M.id
    ORDER BY countOrder ASC;`,
    [warehouse_mgr_id]
  );
  await pool.query(
    `INSERT INTO Customer_invoice (order_id,order_sub_id,qty,ware_stock_id,warehouse_mgr_id,delivery_mgr_id,product_id,paid_amount) VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      order_id,
      order_sub_id,
      qty,
      warehouse_stock_id,
      warehouse_mgr_id,
      compatible_delivery_mgr_ID.rows[0]?.m_id,
      product_id,
      paid_amount,
    ]
  );
  await pool.query(
    `UPDATE Warehouse_stock SET available_qty = available_qty - $1 WHERE id = $2`,
    [qty, warehouse_stock_id]
  );
  //have to do many works here
  await pool.query(
    `UPDATE Orders SET status = 'delivery-pending' WHERE id = $1`,
    [order_id]
  );
  return "Invoice created successfully";
}

export async function getInvoiceWarehouse(ware_req_id) {
  const res = await pool.query(
    `SELECT W.*
    FROM Ware_invoice W
    WHERE W.ware_req_id = $1`,
    [ware_req_id]
  );
  return res.rows;
}

export async function createInvoiceFactory(
  production_mgr_id,
  ware_req_id,
  factory_id,
  ware_stock_id,
  issue_qty,
  factory_stock_id
) {
  const compatible_delivery_mgr_ID = await pool.query(
    `SELECT M.id as M_id, COUNT(WI.ware_req_id) as countOrder
    FROM Delivery_mgr M
    JOIN 
    Factory_delivery WD ON M.id = WD.delivery_mgr_id
    JOIN Production_mgr P ON P.factory_id = WD.factory_id
    LEFT OUTER JOIN Ware_invoice WI ON WI.delivery_mgr_id=M.id
    WHERE P.id = $1
    GROUP BY M.id
    ORDER BY countOrder ASC;`,
    [production_mgr_id]
  );
  return pool
    .query(
      `INSERT INTO Ware_invoice(ware_req_id,factory_id,ware_stock_id,issue_date,issue_qty,delivery_mgr_id) values ($1,$2,$3,$4,$5,$6)`,
      [
        ware_req_id,
        factory_id,
        ware_stock_id,
        mysqlDate(),
        issue_qty,
        compatible_delivery_mgr_ID.rows[0]?.m_id,
      ]
    )
    .then(() => {
      return pool.query(
        `UPDATE Factory SET available_qty = available_qty - $1 WHERE factory_stock_id = $2`,
        [issue_qty, factory_stock_id]
      );
    })
    .then(() => {
      return pool.query(
        `UPDATE Ware_request SET status = 'delivery-pending' WHERE id = $1`,
        [ware_req_id]
      );
    })
    .then(() => {
      return "Invoice created successfully";
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
}

export async function confirmDeliveryRetailer(order_id) {
  try {
    return await pool
      .query(`UPDATE Orders SET status = 'delivered' WHERE id = $1`, [order_id])
      .then(() => {
        return pool.query(
          `UPDATE Customer_invoice SET delivery_date=CURRENT_DATE WHERE order_id=$1`,
          [order_id]
        );
      })
      .then(() => {
        return "Order delivery confirmed successfully";
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getFactoryStockbyID(production_mgr_id) {
  const res = await pool.query(
    `SELECT F.*,P.name,P.model
    FROM Factory F
    JOIN Product P ON F.product_id = P.id
    JOIN Production_mgr M ON F.id = M.factory_id
    WHERE M.id = $1`,
    [production_mgr_id]
  );
  return res.rows;
}
export async function getFactoryStock() {
  const res = await pool.query(
    `SELECT F.*,P.name,P.model
    FROM Factory F
    JOIN Product P ON F.product_id = P.id
    ORDER BY P.id ASC`
  );
  console.log(res.rows);
  return res.rows;
}
export async function getRawStock(production_mgr_id) {
  const res = await pool.query(
    `SELECT F.*,R.id as raw_id,R.name,R.company,R.type,S.manager_name,S.email_address
    FROM Factory_raw_stock F
    JOIN Production_mgr M ON F.factory_id = M.factory_id
    JOIN Raw_material R ON R.id = F.raw_mat_id
    JOIN Supplier S ON R.company = S.company
    WHERE M.id = $1`,
    [production_mgr_id]
  );
  console.log(res.rows);
  return res.rows;
}
export async function getProductionLog(production_mgr_id) {
  const res = await pool.query(
    `SELECT P.*,PM.factory_id
    FROM Factory_production_log P
    JOIN Production_mgr PM ON PM.factory_id = P.factory_id
    WHERE PM.id = $1`,
    [production_mgr_id]
  );
  return res.rows;
}
export async function makeProductionLog(production_mgr_id, date, qty) {
  const factoryID = await pool.query(
    `SELECT factory_id FROM Production_mgr WHERE id = $1`,
    [production_mgr_id]
  );
  const log = await pool.query(
    `SELECT * FROM Factory_production_log WHERE factory_id = $1 AND date = TO_DATE($2,'YYYY-MM-DD')`,
    [factoryID.rows[0]?.factory_id, date]
  );
  const raw_stock = await pool.query(
    `SELECT FR.*,PR.qty 
    FROM Factory_raw_stock FR 
    JOIN Factory F ON FR.factory_id = F.id
    JOIN Product_raw_rel PR ON PR.product_id=F.product_id AND PR.raw_material_id=FR.raw_mat_id 
    WHERE factory_id = $1`,
    [factoryID.rows[0]?.factory_id]
  );
  try {
    if (log.rows.length == 0) {
      if (
        raw_stock.rows.every((item) => item.available_qty >= item.qty * qty)
      ) {
        await pool.query(
          `INSERT INTO Factory_production_log(factory_id,date,qty) VALUES ($1,TO_DATE($2,'YYYY-MM-DD'),$3)`,
          [factoryID.rows[0]?.factory_id, date, qty]
        );
        await pool.query(
          `UPDATE Factory SET available_qty = available_qty + $1 WHERE id = $2`,
          [qty, factoryID.rows[0]?.factory_id]
        );
        for (const item of raw_stock.rows) {
          console.log(JSON.stringify(item));
          await pool.query(
            `UPDATE Factory_raw_stock SET available_qty = available_qty - ($2::integer * $1::integer) WHERE factory_id = $3 AND raw_mat_id = $4`,
            [qty, item.qty, factoryID.rows[0]?.factory_id, item.raw_mat_id]
          );
        }
        return "Production log created successfully";
      } else {
        return "Insufficient raw material";
      }
    } else {
      return "Production log already exists";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getMissingLogs(production_mgr_id) {
  const factoryID = await pool.query(
    `SELECT factory_id FROM Production_mgr WHERE id = $1`,
    [production_mgr_id]
  );
  const res = await pool.query(
    `WITH date_range AS (
      SELECT generate_series(
        TO_DATE('2024-03-01','YYYY-MM-DD'),
        CURRENT_DATE,
        '1 day'::interval
      ) AS date
    )
    SELECT date_range.date
    FROM date_range
    LEFT JOIN factory_production_log ON factory_production_log.date = date_range.date AND factory_production_log.factory_id = $1
    WHERE factory_production_log.date IS NULL;`,
    [factoryID.rows[0]?.factory_id]
  );
  return res.rows;
}
export async function getFactoryReqProductionMgr(production_mgr_id) {
  const res = await pool.query(
    `SELECT F.*,R.name as raw_name,R.type,R.company,FR.*
    FROM Factory_request FR
    JOIN Factory_raw_stock F ON FR.factory_raw_stock_id = F.id
    JOIN Raw_material R ON F.raw_mat_id = R.id
    WHERE FR.production_mgr_id = $1`,
    [production_mgr_id]
  );
  return res.rows;
}
export async function getFactoryReqSupplyMgr(supply_mgr_id) {
  const res = await pool.query(
    `SELECT F.*,R.name as raw_name,R.type,R.company,FR.*
    FROM Factory_request FR
    JOIN Factory_raw_stock F ON FR.factory_raw_stock_id = F.id
    JOIN Supply_mgr S ON F.factory_id = S.factory_id
    JOIN Raw_material R ON F.raw_mat_id = R.id
    WHERE S.id = $1`,
    [supply_mgr_id]
  );
  return res.rows;
}

export async function createFactoryReq(production_mgr_id, qty, stock_id) {
  return pool
    .query(
      `INSERT INTO Factory_request(req_date,production_mgr_id,status,factory_raw_stock_id,qty) VALUES (CURRENT_DATE,$1,'pending',$2,$3)`,
      [production_mgr_id, stock_id, qty]
    )
    .then(() => {
      return "Factory request created successfully";
    })
    .catch((error) => {
      console.error(error);
      return "Error occured while creating factory request";
    });
}
export async function getWarehouseDeliveryMgr(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT D.delivery_mgr_id
    FROM Warehouse_delivery D
    WHERE D.delivery_mgr_id = $1`,
    [delivery_mgr_id]
  );
  return res.rows;
}
export async function getFactoryDeliveryMgr(delivery_mgr_id) {
  const res = await pool.query(
    `SELECT D.delivery_mgr_id
    FROM Factory_delivery D
    WHERE D.delivery_mgr_id = $1`,
    [delivery_mgr_id]
  );
  return res.rows;
}

export async function makeWarehouseDelivery(ware_req_id, warehouse_id) {
  try {
    return await pool
      .query(`UPDATE Ware_request SET status = 'delivered' WHERE id = $1`, [
        ware_req_id,
      ])
      .then(() => {
        return pool.query(
          `UPDATE Ware_invoice SET delivery_date = CURRENT_DATE WHERE ware_req_id = $1`,
          [ware_req_id]
        );
      })
      .then(() => {
        return pool.query(
          `UPDATE Warehouse_stock SET available_qty = available_qty + (SELECT qty FROM Ware_request WHERE id = $1) WHERE warehouse_id = $2`,
          [ware_req_id, warehouse_id]
        );
      })
      .then(() => {
        return "Warehouse delivery confirmed successfully";
      });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getWareInvoiceStatusDelivery(ware_req_id) {
  const res = await pool.query(
    `SELECT status
    FROM Ware_request
    WHERE id = $1`,
    [ware_req_id]
  );
  return res.rows;
}
