import cors from "cors";
import express from "express";
import multer from "multer";
import process from "process";
import stripe from "stripe";
import {
  addToCart,
  confirmDeliveryRetailer,
  createEmployee,
  createFactoryReq,
  createInvoice,
  createInvoiceFactory,
  getAdminPass,
  getAllDeliveryMgrInfo,
  getAllProductInfo,
  getAllProductionMgrInfo,
  getAllSupplyMgrInfo,
  getAllWareMgrInfo,
  getCart,
  getDeliveryMgrInfo,
  getDeliveryMgrPass,
  getFactoryDeliveryMgr,
  getFactoryReqProductionMgr,
  getFactoryReqSupplyMgr,
  getFactoryStock,
  getFactoryinfo,
  getGroupedOrders,
  getInvoice,
  getInvoiceDeliveryMgr,
  getInvoiceWarehouse,
  getMissingLogs,
  getOrders,
  getOrdersByID,
  getPendingDemand,
  getPendingOrderNumber,
  getPendingOrders,
  getPendingWareReqNumber,
  getProcessingDemand,
  getProcessingOrderNumber,
  getProcessingOrders,
  getProductInfoByID,
  getProductMgrPass,
  getProductionLog,
  getRawStock,
  getRetailerOrdersID,
  getRetailerOrdersbyID,
  getRetailerPass,
  getSupplyMgrInfo,
  getSupplyMgrPass,
  getWareInvoiceDelivery,
  getWareMgrInfo,
  getWareMgrPass,
  getWareRequests,
  getWareRequestsFactory,
  getWareRequests_with_d_filter,
  getWareRequests_with_df_filter,
  getWareRequests_with_f_filter,
  getWareRequests_with_s_filter,
  getWareRequests_with_sd_filter,
  getWareRequests_with_sdf_filter,
  getWareRequests_with_sf_filter,
  getWarehouseDeliveryMgr,
  getWarehouseStock,
  makeProductionLog,
  makeWareReq,
  makeWarehouseDelivery,
  placeOrder,
  processOrder,
  processReqProductionMgr,
  processReqSupplyMgr,
  queryCart,
  setCart,
  submitInvoiceSupplyMgr,
  updateCart,
} from "./database.js";
const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const stripeInstance = stripe(
  "sk_test_51OiJl9Lgd2pARuX3fCxFbkgZuJGLzlTJi4dzbjJss22wyOlj9UeD64HTy0XlTYrtdH2Y3PUPoG8QiT9TEQKOsV3I00r6vLRxn0"
);

app.post(
  "/users/employee/supply_mgr/:supply_mgr_id/factory_req/:req_id/submit_invoice",
  upload.single("pdf"),
  async (req, res) => {
    await submitInvoiceSupplyMgr(req.file, req.params.req_id).then((result) => {
      res.send(result);
    });
  }
);

app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/orders",
  async (req, res) => {
    const result = await getOrders(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/orders/:order_id",
  async (req, res) => {
    const result = await getOrdersByID(
      req.params.warehouse_mgr_id,
      req.params.order_id
    );
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/orders/nearingOrders",
  async (req, res) => {
    let result = await getGroupedOrders(req.params.warehouse_mgr_id);
    result = result.filter((order) => {
      const diff = new Date(order.exp_delivery_date) - new Date();
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      if (diffInDays >= 5 && diffInDays <= 10) {
        return true;
      } else {
        return false;
      }
    });
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/orders/expiredOrders",
  async (req, res) => {
    let result = await getGroupedOrders(req.params.warehouse_mgr_id);
    result = result.filter((order) => {
      const diff = new Date(order.exp_delivery_date) - new Date();
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      if (diffInDays < 0) {
        return true;
      } else {
        return false;
      }
    });
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/pendingorders",
  async (req, res) => {
    const result = await getPendingOrders(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/processingorders",
  async (req, res) => {
    const result = await getProcessingOrders(req.params.warehouse_mgr_id);
    res.send(result);
  }
);

app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/pending_demand",
  async (req, res) => {
    const result = await getPendingDemand(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/processing_demand",
  async (req, res) => {
    const result = await getProcessingDemand(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/orders/processOrder",
  async (req, res) => {
    const result = await processOrder(req.params.warehouse_mgr_id, req.body.id);
    if (result === "Order processed successfully") {
      const orders = await getOrders(req.params.warehouse_mgr_id);
      res.send(orders);
      return;
    }
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/ware_req",
  async (req, res) => {
    if (
      req.query.warehouse_stock_id != 0 &&
      req.query.request_date != "1700-01-01" &&
      req.query.factory_id != 0
    ) {
      const result = await getWareRequests_with_sdf_filter(
        req.params.warehouse_mgr_id,
        req.query.warehouse_stock_id,
        req.query.request_date,
        req.query.factory_id
      );
      res.send(result);
    } else if (
      req.query.warehouse_stock_id != 0 &&
      req.query.request_date != "1700-01-01"
    ) {
      const result = await getWareRequests_with_sd_filter(
        req.params.warehouse_mgr_id,
        req.query.warehouse_stock_id,
        req.query.request_date
      );
      res.send(result);
    } else if (
      req.query.request_date != "1700-01-01" &&
      req.query.factory_id != 0
    ) {
      const result = await getWareRequests_with_df_filter(
        req.params.warehouse_mgr_id,
        req.query.request_date,
        req.query.factory_id
      );
      res.send(result);
    } else if (req.query.warehouse_stock_id != 0 && req.query.factory_id != 0) {
      const result = await getWareRequests_with_sf_filter(
        req.params.warehouse_mgr_id,
        req.query.warehouse_stock_id,
        req.query.factory_id
      );
      res.send(result);
    } else if (req.query.warehouse_stock_id != 0) {
      const result = await getWareRequests_with_s_filter(
        req.params.warehouse_mgr_id,
        req.query.warehouse_stock_id
      );
      res.send(result);
    } else if (req.query.request_date != "1700-01-01") {
      const result = await getWareRequests_with_d_filter(
        req.params.warehouse_mgr_id,
        req.query.request_date
      );
      res.send(result);
    } else if (req.query.factory_id != 0) {
      const result = await getWareRequests_with_f_filter(
        req.params.warehouse_mgr_id,
        req.query.factory_id
      );
      res.send(result);
    } else {
      const result = await getWareRequests(req.params.warehouse_mgr_id);
      res.send(result);
    }
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/ware_req",
  async (req, res) => {
    const result = await getWareRequestsFactory(req.params.production_mgr_id);
    // console.log(result);
    res.send(result);
  }
);
app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/ware_invoice",
  async (req, res) => {
    const result = await getWareInvoiceDelivery(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/delivery_mgr/:delivery_mgr_id/ware_invoice/make_delivery",
  async (req, res) => {
    const promises = req.body.data.map((item) => {
      if (req.body.data.some((item) => item.status === "delivered")) {
        return "Delivery already recorded for request(s)";
      }
      return makeWarehouseDelivery(item.id, item.warehouse_id);
    });
    try {
      const results = await Promise.all(promises);
      if (
        results.every(
          (result) => result === "Warehouse delivery confirmed successfully"
        )
      ) {
        res.send("All Warehouse Deliveries Confirmed");
      } else {
        res.send("Some warehouse deliveries were not created successfully");
      }
    } catch (err) {
      console.log(err);
      res.send("Error occured while making warehouse delivery");
    }
  }
);
app.post(
  "/users/employee/production_mgr/:production_mgr_id/ware_req/:req_id/process",
  async (req, res) => {
    await processReqProductionMgr(req.params.req_id);
    const result = await getWareRequestsFactory(req.params.production_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/supply_mgr/:supply_mgr_id/factory_req/:req_id/process",
  async (req, res) => {
    await processReqSupplyMgr(req.params.req_id);
    const result = await getFactoryReqSupplyMgr(req.params.supply_mgr_id);
    res.send(result);
  }
);
app.get("/factory_info", async (req, res) => {
  const result = await getFactoryinfo();
  res.send(result);
});
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/warehouse_stock",
  async (req, res) => {
    const result = await getWarehouseStock(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/ware_req/submit",
  async (req, res) => {
    const result = await makeWareReq(
      req.body.warehouse_id,
      req.body.ware_stock_id,
      req.body.factory_id,
      req.body.qty
    );
    res.send(result);
  }
);
// app.get("/pic", async (req, res) => {
//   const result = await getPic(1230000026);
//   console.log("result" + result);
//   if (result.length > 0) {
//     const imageData = result[0].profile_picture;
//     res.writeHead(200, {
//       "Content-Type": "image/png",
//       "Content-Length": imageData.length,
//     });
//     res.end(imageData);
//   } else {
//     return "No image found";
//   }
// });

app.post(
  "/users/admin/create_employee",
  multer().single("profile_picture"),
  async (req, res) => {
    console.log(req.body);
    console.log(req.file); // This will log the uploaded file

    // You can access the uploaded file from req.file
    const profile_picture = req.file.buffer;

    await createEmployee(
      req.body.employeeType,
      req.body.name,
      profile_picture,
      req.body.nid,
      req.body.mobile_no,
      req.body.password,
      req.body.joining_date,
      req.body.salary,
      req.body.department_id,
      req.body.delivery_type
    ).then((result) => {
      console.log("result" + result);
      res.send(result);
    });
  }
);
app.get("/users/admin/ware_mgr",
  async (req, res) => {
    const result = await getAllWareMgrInfo();
    res.send(result);
  }
);
app.get("/users/admin/production_mgr",
  async (req, res) => {
    const result = await getAllProductionMgrInfo();
    res.send(result);
  }
);
app.get("/users/admin/delivery_mgr",
  async (req, res) => {
    const result = await getAllDeliveryMgrInfo();
    res.send(result);
  }
);
app.get("/users/admin/supply_mgr",
  async (req, res) => {
    const result = await getAllSupplyMgrInfo();
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/password",
  async (req, res) => {
    const result = await getWareMgrPass(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get("/users/retailer/:retailer_id/password", async (req, res) => {
  const result = await getRetailerPass(req.params.retailer_id);
  res.send(result);
});
app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/password",
  async (req, res) => {
    const result = await getDeliveryMgrPass(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/password",
  async (req, res) => {
    const result = await getProductMgrPass(req.params.production_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/supply_mgr/:supply_mgr_id/password",
  async (req, res) => {
    const result = await getSupplyMgrPass(req.params.supply_mgr_id);
    res.send(result);
  }
);
app.get("/users/admin/:admin_id/password", async (req, res) => {
  const result = await getAdminPass(req.params.admin_id);
  res.send(result);
});
app.get(
  "/users/employee/production_mgr/:production_mgr_id/product_stock",
  async (req, res) => {
    const result = await getFactoryStock();
    res.send(result);
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/raw_stock",
  async (req, res) => {
    const result = await getRawStock(req.params.production_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/report_log",
  async (req, res) => {
    const result = await getProductionLog(req.params.production_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/factory_requests",
  async (req, res) => {
    const result = await getFactoryReqProductionMgr(
      req.params.production_mgr_id
    );
    res.send(result);
  }
);
app.get(
  "/users/employee/supply_mgr/:supply_mgr_id/factory_requests",
  async (req, res) => {
    console.log(req.params.supply_mgr_id);
    const result = await getFactoryReqSupplyMgr(req.params.supply_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/production_mgr/:production_mgr_id/submit_factory_req",
  async (req, res) => {
    console.log("aaaaaa" + JSON.stringify(req.body.data));
    const promises = req.body.data.map(async (data) => {
      return createFactoryReq(
        req.params.production_mgr_id,
        data.qty,
        data.stock_id
      );
    });
    try {
      const results = await Promise.all(promises);
      console.log(results);
      if (
        results.every(
          (result) => result === "Factory request created successfully"
        )
      ) {
        res.send("Factory request created successfully");
      } else {
        res.send("Some factory request(s) were not created successfully");
      }
    } catch (err) {
      console.log(err);
      res.send("Error occured while creating factory request");
    }
  }
);
app.post(
  "/users/employee/production_mgr/:production_mgr_id/report_log",
  async (req, res) => {
    const promises = req.body.data.map((data) => {
      return makeProductionLog(
        req.params.production_mgr_id,
        data.date,
        data.qty
      );
    });
    try {
      const results = await Promise.all(promises);
      if (
        results.every(
          (result) => result === "Production log created successfully"
        )
      ) {
        console.log("s");
        res.send("All production logs created successfully");
      } else if (
        results.some((result) => result === "Production log already exists")
      ) {
        res.send("Some production logs were already created!");
      } else if (
        results.some((result) => result === "Insufficient raw material")
      ) {
        res.send("Insufficient raw material for some log(s). Try again!");
      }
    } catch (err) {
      console.log(err);
      res.send("Error occured while making production log");
    }
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/warehouse_requests",
  async (req, res) => {
    const result = await getRawStock();
    res.send(result);
  }
);
app.get(
  "/users/employee/production_mgr/:production_mgr_id/missing_logs",
  async (req, res) => {
    const result = await getMissingLogs(req.params.production_mgr_id);
    res.send(result);
  }
);
app.get("/users/employee/products/:product_id", async (req, res) => {
  const result = await getProductInfoByID(req.params.product_id);
  res.send(result);
});
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/profile",
  async (req, res) => {
    const result = await getWareMgrInfo(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/profile",
  async (req, res) => {
    const result = await getDeliveryMgrInfo(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/supply_mgr/:supply_mgr_id/profile",
  async (req, res) => {
    const result = await getSupplyMgrInfo(req.params.supply_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/dashboard/pending_order_number",
  async (req, res) => {
    const result = await getPendingOrderNumber(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/dashboard/processing_order_number",
  async (req, res) => {
    const result = await getProcessingOrderNumber(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/dashboard/pending_ware_req_number",
  async (req, res) => {
    const result = await getPendingWareReqNumber(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.get("/users/retailer/home/:retailer_id/products", async (req, res) => {
  const result = await getAllProductInfo();
  res.send(result);
});
app.get(
  "/users/retailer/home/:retailer_id/products/:product_id",
  async (req, res) => {
    const result = await getProductInfoByID(req.params.product_id);
    res.send(result);
  }
);

app.post(
  "/users/retailer/home/:retailer_id/products/:product_id/addToCart",
  async (req, res) => {
    const result = await addToCart(
      req.params.retailer_id,
      req.params.product_id,
      req.body.qty
    );
    res.send(result);
  }
);
app.post(
  "/users/retailer/home/:retailer_id/products/:product_id/updateCart",
  async (req, res) => {
    const result = await updateCart(
      req.params.retailer_id,
      req.params.product_id,
      req.body.qty
    );
    res.send(result);
  }
);
app.get(
  "/users/retailer/home/:retailer_id/products/:product_id/queryCart",
  async (req, res) => {
    const result = await queryCart(
      req.params.retailer_id,
      req.params.product_id
    );
    res.send(result);
  }
);
app.get("/users/retailer/home/:retailer_id/getCart", async (req, res) => {
  const result = await getCart(req.params.retailer_id);
  res.send(result);
});
app.post("/users/retailer/home/:retailer_id/setCart", async (req, res) => {
  const result = await setCart(req.params.retailer_id, req.body.cartInfo);
  res.send(result);
});
app.post(
  "/users/retailer/home/:retailer_id/create-payment-session",
  async (req, res) => {
    try {
      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.cartInfo.map((item) => {
          return {
            price_data: {
              currency: "bdt",
              product_data: {
                name: item.name,
                images: [
                  `http://localhost:3000/public/products/${item.picture3}.png`,
                ],
              },
              unit_amount: item.unit_price * 100,
            },
            quantity: item.qty,
          };
        }),
        success_url: `http://localhost:3000/users/retailer/home/${req.params.retailer_id}/success`,
        cancel_url: `http://localhost:3000/users/retailer/home/${req.params.retailer_id}/cancel`,
      });
      res.send({ url: session.url });
    } catch (err) {
      console.log(err);
    }
  }
);
app.post("/users/retailer/home/:retailer_id/placeOrder", async (req, res) => {
  const result = await placeOrder(req.body.cartInfo, req.params.retailer_id);
  res.send(result);
});
app.get("/users/retailer/home/:retailer_id/ordersID", async (req, res) => {
  const result = await getRetailerOrdersID(req.params.retailer_id);
  res.send(result);
});
app.get(
  "/users/retailer/home/:retailer_id/orders/:order_id",
  async (req, res) => {
    const result = await getRetailerOrdersbyID(
      req.params.retailer_id,
      req.params.order_id
    );
    res.send(result);
  }
);

app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/invoice",
  async (req, res) => {
    const result = await getInvoiceDeliveryMgr(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/retailer/home/:retailer_id/orders/:order_id/invoice",
  async (req, res) => {
    const result = await getInvoice(req.params.order_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/warehouse",
  async (req, res) => {
    const result = await getWarehouseDeliveryMgr(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/delivery_mgr/:delivery_mgr_id/factory",
  async (req, res) => {
    const result = await getFactoryDeliveryMgr(req.params.delivery_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/:order_id/createInvoice",
  async (req, res) => {
    await getInvoice(req.params.order_id).then(async (res2) => {
      if (res2.length === 0) {
        const promises = req.body.data.map((order) => {
          return createInvoice(
            order.id,
            order.sub_id,
            order.qty,
            order.warehouse_stock_id,
            req.params.warehouse_mgr_id,
            order.product_id,
            order.paid_amount
          );
        });

        try {
          const results = await Promise.all(promises);
          if (
            results.every((result) => result === "Invoice created successfully")
          ) {
            res.send("All invoices created successfully");
          } else {
            res.send("Some invoices were not created successfully");
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("An error occurred while creating invoices");
        }
      } else {
        res.send("Invoice already created");
      }
    });
  }
);
app.post(
  "/users/employee/production_mgr/:production_mgr_id/createInvoice",
  async (req, res) => {
    const promises2 = req.body.data.map((req2) => {
      return getInvoiceWarehouse(req2.id);
    });
    try {
      const results2 = await Promise.all(promises2);
      if (results2.every((result) => result.length === 0)) {
        if (
          req.body.data.every(
            (req2) => req2.factory_available_qty >= req2.issue_qty
          )
        ) {
          const promises = req.body.data.map((req2) => {
            return createInvoiceFactory(
              req.params.production_mgr_id,
              req2.id,
              req2.factory_id,
              req2.ware_stock_id,
              req2.issue_qty,
              req2.factory_stock_id
            );
          });

          try {
            const results = await Promise.all(promises);
            if (
              results.every(
                (result) => result === "Invoice created successfully"
              )
            ) {
              res.send("All invoices created successfully");
            } else {
              res.send("Some invoices were not created successfully");
            }
          } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred while creating invoices");
          }
        } else {
          res.send("Insufficient stock");
        }
      } else {
        res.send("Invoice already created");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating invoices");
    }
  }
);

app.post(
  "/users/employee/delivery_mgr/:delivery_mgr_id/retailer/invoice/confirm_delivery",
  async (req, res) => {
    const result = await confirmDeliveryRetailer(req.body.order_id);
    if (result === "Order delivery confirmed successfully") {
      res.send(result);
    } else {
      res.send("Order delivery confirmation failed");
    }
  }
);

app.use((err, req, res) => {
  console.error(err.stack);
  if (err.message === "Not Found") {
    res.status(404).send("Not Found");
  } else {
    res.status(500).send("Something broke!");
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server ready on port ${port}`));