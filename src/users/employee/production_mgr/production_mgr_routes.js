import Home from "./Home";

import React from "react";
import Product_Stock from "./Product_Stock";
import Raw_Stock from "./Raw_Stock";
import Report_Production from "./Report_Production";
import Dashboard from "./Dashboard";
import Factory_Requests from "./Factory_Requests";
import Warehouse_Requests from "./Warehouse_Requests";
import Stock from "./Stock";
export const production_mgr_routes = [
  {
    path: "/user/employee/production_mgr/home/:mgr_id",
    element: React.createElement(Home),
    children: [
      {
        path: "/user/employee/production_mgr/home/:mgr_id/stock",
        element: React.createElement(Stock),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/product_stock",
        element: React.createElement(Product_Stock),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/raw_stock",
        element: React.createElement(Raw_Stock),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/report_production",
        element: React.createElement(Report_Production),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/dashboard",
        element: React.createElement(Dashboard),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/warehouse_requests",
        element: React.createElement(Warehouse_Requests),
      },
      {
        path: "/user/employee/production_mgr/home/:mgr_id/factory_requests",
        element: React.createElement(Factory_Requests),
      },
    ],
  },
];
