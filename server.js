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
  getInvoiceProductionMgr,
  getInvoiceWarehouse,
  getMissingLogs,
  getOrders,
  getOrdersByID,
  getPendingDemand,
  getPendingOrderNumber,
  getPendingOrders,
  getPendingWareReqNumber,
  getPic,
  getProcessingDemand,
  getProcessingOrderNumber,
  getProcessingOrders,
  getProductInfoByID,
  getProductInfoByID2,
  getProductMgrPass,
  getProductionLog,
  getProductionMgrInfo,
  getProfilePic,
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
  updateEmployee,
  updateProduct,
} from "./src/backend/database.js";

const app = express();

const allowedOrigins = ["https://vermillion-marzipan-f7ee38.netlify.app", "http://localhost:5173"];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const stripeInstance = stripe("sk_test_51OiJl9Lgd2pARuX3fCxFbkgZuJGLzlTJi4dzbjJss22wyOlj9UeD64HTy0XlTYrtdH2Y3PUPoG8QiT9TEQKOsV3I00r6vLRxn0");

app.post("/users/employee/supply_mgr/:supply_mgr_id/factory_req/:req_id/submit_invoice", upload.single("pdf"), async (req, res) => {
  await submitInvoiceSupplyMgr(req.file, req.params.req_id).then((result) => {
    res.send(result);
  });
});

app.get("/users/employee/warehouse_mgr/:warehouse_mgr_id/orders", async (req, res) => {
  const result = await getOrders(req.params.warehouse_mgr_id);
  res.send(result);
});

//... (remaining routes) ...

app.post("/users/admin/update_product", multer({ limits: { fieldSize: 5 * 1024 * 1024 } }).fields([{ name: "picture_1", maxCount: 1 }, { name: "picture_2", maxCount: 1 }, { name: "picture_3", maxCount: 1 }]), async (req, res) => {
  const picture_1 = req.files.picture_1[0]?.buffer;
  const picture_2 = req.files.picture_2[0]?.buffer;
  const picture_3 = req.files.picture_3[0]?.buffer;
  await updateProduct(req.body.id, req.body.name, req.body.model, req.body.series, req.body.description, req.body.unit_price, req.body.minimum_delivery_time, picture_1, picture_2, picture_3).then((result) => {
    res.send(result);
  });
});

function sendImage(result, res, str) {
  if (result.length > 0) {
    const imageData = result[0][str];
    res.writeHead(200, { "Content-Type": "image/png", "Content-Length": imageData.length });
    res.end(imageData);
  } else {
    res.send("No image found");
  }
}

app.get("/users/pic1/:id", async (req, res) => {
  const result = await getPic(req.params.id, "picture_1");
  sendImage(result, res, "picture_1");
});

app.get("/users/pic2/:id", async (req, res) => {
  const result = await getPic(req.params.id, "picture_2");
  sendImage(result, res, "picture_2");
});

app.get("/users/pic3/:id", async (req, res) => {
  const result = await getPic(req.params.id, "picture_3");
  sendImage(result, res, "picture_3");
});

//... (remaining routes) ...

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
