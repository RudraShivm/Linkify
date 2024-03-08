import React from "react";
import Home from "./Home";
import CreateEmployee from "./CreateEmployee";
import EditEmployee from "./EditEmployee";
import Statistics from "./Statistics";
import CreateProduct from "./CreateProduct";

export const admin_routes = [
  {
    path: "/admin/:admin_id/home",
    element: React.createElement(Home),
    children: [
      {
        path: "/admin/:admin_id/home/create_employee",
        element: React.createElement(CreateEmployee),
      },
      {
        path: "/admin/:admin_id/home/edit_employee",
        element: React.createElement(EditEmployee),
      },
      {
        path: "/admin/:admin_id/home/statistics",
        element: React.createElement(Statistics),
      },
      {
        path: "/admin/:admin_id/home/create_product",
        element: React.createElement(CreateProduct),
      },
    ],
  },
];
