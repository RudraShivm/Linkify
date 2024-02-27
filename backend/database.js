import dotenv from "dotenv";
import process from "process";
import pg from "pg";
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

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Linkify",
//   password: "123",
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})
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
  console.log(order_id, warehouse_mgr_id);
  const res = await pool.query(
    `SELECT Orders.*,P.name,P.model,P.picture1,C.store_name,C.owner_name,C.city,WS.available_qty,WS.id AS warehouse_stock_id
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
  console.log(res.rows);
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
    GROUP BY W.id
    ORDER BY W.id::INTEGER ASC;`,
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
    GROUP BY W.id
    ORDER BY W.id::INTEGER ASC;`,
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
    console.log(
      "processing qty: " +
        processing_qty +
        " available qty: " +
        orders.rows[i].available_qty +
        " order qty: " +
        orders.rows[i].qty
    );
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
export async function getRetailerPass(reatailer_id) {
  const res = await pool.query(
    `SELECT passwords FROM Customer
      WHERE id = $1`,
    [reatailer_id]
  );
  console.log(res.rows);
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
      WHERE M.id = $1`,
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
export async function getPendingWareReqNumber(warehouse_mgr_id) {
  const res = await pool.query(`SELECT * FROM get_ware_req_no($1)`, [
    warehouse_mgr_id,
  ]);
  return res.rows;
}
export async function getWareStocks(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT P.*, W.*
    FROM warehouse_stock W JOIN warehouse_mgr M ON W.warehouse_id=M.warehouse_id
    JOIN Product P ON W.product_id=P.id
    WHERE M.id = $1`,
    [warehouse_mgr_id]
  );
  return res.rows;
}
export async function makeWareReq(
  warehouse_id,
  production_mgr_id,
  ware_stock_id,
  qty
) {
  await pool.query(
    `INSERT INTO Ware_request(warehouse_id,production_mgr_id,ware_stock_id,request_date,qty) VALUES ($1,$2,$3,now(),$4)`,
    [warehouse_id, production_mgr_id, ware_stock_id, qty]
  );
}

export async function getWareRequests(warehouse_mgr_id) {
  const res = await pool.query(
    `SELECT W.* ,R.*,P.factory_id,P.city
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

export async function getProductbyID(product_id) {
  const res = await pool.query(
    `SELECT name,model
    FROM Product
    WHERE id=$1`,
    [product_id]
  );
  return res.rows;
}

export async function getInvoice(order_id) {
  const res = await pool.query(
    `SELECT *
    FROM Customer_invoice
    WHERE order_id = $1`,
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
  product_id
) {
  const compatible_delivery_mgr_ID = await pool.query(
    `SELECT M.id as M_id, COUNT(CI.order_id) as countOrder
    FROM Delivery_mgr M
    JOIN 
    (
    SELECT C.city
    FROM Orders O JOIN Customer C ON O.customer_id=C.id
    WHERE O.id = $1
    GROUP BY C.city
    ) R
    ON M.branch_city= R.city
    LEFT OUTER JOIN Customer_invoice CI ON CI.delivery_mgr_id=M.id
    GROUP BY M.id
    ORDER BY countOrder ASC;`,
    [order_id]
  );
  await pool.query(
    `INSERT INTO Customer_invoice (order_id,order_sub_id,qty,ware_stock_id,warehouse_mgr_id,delivery_mgr_id,product_id) VALUES
    ($1,$2,$3,$4,$5,$6,$7)`,
    [
      order_id,
      order_sub_id,
      qty,
      warehouse_stock_id,
      warehouse_mgr_id,
      compatible_delivery_mgr_ID.rows[0]?.m_id,
      product_id,
    ]
  );
  return "Invoice created successfully";
}
