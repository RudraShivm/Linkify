import React from "react";
import Dashboard from "./Dashboard";
import Filter from "./Filter";
import Home from "./Home";
import Orders from "./Orders";
import Profile from "./Profile";
import Submit_ware_req from "./Submit_ware_req";
import Ware_req from "./Ware_req";
import Product from "./Product";
import WarehouseStock from "./WarehouseStock";
import NotificationComponent from "./Notification";
import Invoice from "./Invoice";
import InvoiceForm from "./InvoiceForm";
export const warehouse_mgr_routes = [
  {
    path: "/user/employee/warehouse_mgr/home/:mgr_id",
    element: React.createElement(Home),
    children: [
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/orders",
        element: React.createElement(Orders),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/notification",
        element: React.createElement(NotificationComponent),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/warehouse_stock",
        element: React.createElement(WarehouseStock),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/Invoice/*",
        element: React.createElement(Invoice),
        children: [
          
        ],
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/Invoice/:order_id/form",
        element: React.createElement(InvoiceForm),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/ware_req/*",
        element: React.createElement(Ware_req),
        children: [
          {
            path: "submit",
            element: React.createElement(Submit_ware_req),
          },
          {
            path: "filter",
            element: React.createElement(Filter, {
              changeQueryData: () => {
                console.log("got here");
              },
            }),
          },
        ],
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/products/:product_id",
        element: React.createElement(Product),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/profile",
        element: React.createElement(Profile),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/dashboard",
        element: React.createElement(Dashboard),
      },
      {
        path: "/user/employee/warehouse_mgr/home/:mgr_id/submit_ware_req",
        element: React.createElement(Submit_ware_req),
      },
    ],
  },
];
