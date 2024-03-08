import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main_login from './login/Main_login.jsx';
import { delivey_mgr_routes } from './users/employee/delivery_mgr/delivery_mgr_routes.js';
import { production_mgr_routes } from './users/employee/production_mgr/production_mgr_routes.js';
import { warehouse_mgr_routes } from './users/employee/warehouse_mgr/warehouse_mgr_routes.js';
import { retailer_routes } from './users/retailer/retailer_routes.js';
import { supply_mgr_routes } from './users/employee/supply_mgr/supply_mgr_routes.js';
import { admin_routes } from './users/admin/admin_routes.js';
import AdminLogin from './login/AdminLogin.jsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Main_login />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  ...warehouse_mgr_routes,
  ...production_mgr_routes,
  ...retailer_routes,
  ...delivey_mgr_routes,
  ...supply_mgr_routes,
  ...admin_routes,
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);