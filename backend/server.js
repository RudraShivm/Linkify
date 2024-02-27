import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import process from "process";
import {
  addToCart,
  createInvoice,
  getAllProductInfo,
  getCart,
  getFactoryinfo,
  getGroupedOrders,
  getInvoice,
  getOrders,
  getOrdersByID,
  getPendingDemand,
  getPendingOrderNumber,
  getPendingOrders,
  getPendingWareReqNumber,
  getProcessingDemand,
  getProcessingOrders,
  getProductInfoByID,
  getProductMgrPass,
  getRetailerOrdersID,
  getRetailerOrdersbyID,
  getRetailerPass,
  getWareMgrInfo,
  getWareMgrPass,
  getWareRequests,
  getWareRequests_with_d_filter,
  getWareRequests_with_df_filter,
  getWareRequests_with_f_filter,
  getWareRequests_with_s_filter,
  getWareRequests_with_sd_filter,
  getWareRequests_with_sdf_filter,
  getWareRequests_with_sf_filter,
  getWareStocks,
  makeWareReq,
  placeOrder,
  processOrder,
  queryCart,
  setCart,
  updateCart,
} from "./database.js";
dotenv.config();

const app = express();
app.use(cors());
import stripe from "stripe";
app.use(express.json());

const stripeInstance = stripe(
  "sk_test_51OiJl9Lgd2pARuX3fCxFbkgZuJGLzlTJi4dzbjJss22wyOlj9UeD64HTy0XlTYrtdH2Y3PUPoG8QiT9TEQKOsV3I00r6vLRxn0"
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
    console.log(result);
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
app.get("/factory_info", async (req, res) => {
  const result = await getFactoryinfo();
  res.send(result);
});
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/warehouse_stock",
  async (req, res) => {
    const result = await getWareStocks(req.params.warehouse_mgr_id);
    res.send(result);
  }
);
app.post(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/ware_req/submit",
  async (req, res) => {
    const result = await makeWareReq(
      req.body.warehouse_id,
      req.body.production_mgr_id,
      req.body.ware_stock_id,
      req.body.qty
    );
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
  "/users/employee/production_mgr/:production_mgr_id/password",
  async (req, res) => {
    const result = await getProductMgrPass(req.params.production_mgr_id);
    res.send(result);
  }
);
app.get(
  "/users/employee/warehouse_mgr/:warehouse_mgr_id/profile",
  async (req, res) => {
    const result = await getWareMgrInfo(req.params.warehouse_mgr_id);
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
app.get(
  "/users/retailer/home/warehouse_mgr/products/:product_id",
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
  // console.log(req.body.cartInfo);
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
  "/users/retailer/home/:retailer_id/orders/:order_id/invoice",
  async (req, res) => {
    const result = await getInvoice(req.params.order_id);
    res.send(result);
  }
);
app.post("/users/employee/warehouse_mgr/:warehouse_mgr_id/:order_id/createInvoice", async (req, res) => {
  try {
    console.log(req.body);

      const promises = req.body.data.map(order =>{ 
          createInvoice(order.id, order.sub_id, order.qty, order.warehouse_stock_id, req.params.warehouse_mgr_id, order.product_id)
      });
      const results = await Promise.all(promises);
      if (results.every(result => result.data === 'Invoice created successfully')) {
          res.send("All invoices created successfully");
      } else {
          res.send("Some invoices were not created successfully");
      }
  } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred while creating invoices");
  }
});
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(3000, () => console.log("Server ready"));
