import React from "react";
import Home from "./Home";
import Login from "../../login/RetailerLogin";
import Products from "./component/Products";
import Product from "./Product";
import Orders from "./Orders";
import Cart from "./Cart";
import Success from "./Success";
import Cancel from "./Cancel";
export const retailer_routes = [
  {
    path: "/user/retailer/login",
    element: React.createElement(Login),
  },
  {
    path: "/user/retailer/home/:retailer_id",
    element: React.createElement(Home),
    children: [
      {
        path: "/user/retailer/home/:retailer_id/orders/",
        element: React.createElement(Orders),
      },
      {
        path: "/user/retailer/home/:retailer_id/cart/",
        element: React.createElement(Cart),
      },
      {
        path: "/user/retailer/home/:retailer_id/products/",
        element: React.createElement(Products),
      },
      {
        path: "/user/retailer/home/:retailer_id/products/:product_id/*",
        element: React.createElement(Product),
      },
      {
        path: "/user/retailer/home/:retailer_id/success/",
        element: React.createElement(Success),
      },
      {
        path: "/user/retailer/home/:retailer_id/cancel/",
        element: React.createElement(Cancel),
      },
      //   {
      //     path: "/user/employee/warehouse_mgr/home/:mgr_id/ware_req/*",
      //     element: React.createElement(Ware_req),
      //     children: [
      //       {
      //         path: "submit",
      //         element: React.createElement(Submit_ware_req),
      //       },
      //       {
      //         path: "filter",
      //         element: React.createElement(Filter, { changeQueryData: ()=>{console.log("got here")} }),
      //       },
      //     ],
      //   },
      //   {
      //     path: "/user/employee/warehouse_mgr/home/:mgr_id/profile",
      //     element: React.createElement(Profile),
      //   },
      //   {
      //     path: "/user/employee/warehouse_mgr/home/:mgr_id/dashboard",
      //     element: React.createElement(Dashboard),
      //   },
      //   {
      //     path: "/user/employee/warehouse_mgr/home/:mgr_id/submit_ware_req",
      //     element: React.createElement(Submit_ware_req),
      //   },
    ],
  },
];

