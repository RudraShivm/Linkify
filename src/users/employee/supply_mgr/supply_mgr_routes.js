import React from "react";
import Home from "./Home";
import FactoryRequests from "./FactoryRequests";
import Profile from "./Profile";
import InvoiceForm from "./InvoiceForm";
export const supply_mgr_routes = [
  {
    path: "/user/employee/supply_mgr/home/:mgr_id",
    element: React.createElement(Home),
    children: [
      {
        path: "/user/employee/supply_mgr/home/:mgr_id/profile",
        element: React.createElement(Profile),
      },
      {
        path: "/user/employee/supply_mgr/home/:mgr_id/factory_requests",
        element: React.createElement(FactoryRequests),
      },
      {
        path: "/user/employee/supply_mgr/home/:mgr_id/invoice_form",
        element: React.createElement(InvoiceForm),
      },
    ],
  },
];
