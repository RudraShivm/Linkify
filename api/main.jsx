import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from '../src/login/Main_login.jsx'
import Emp_login from '../src/login/Emp_login.jsx';
import { warehouse_mgr_routes } from '../src/users/employee/warehouse_mgr/warehouse_mgr_routes.js';
import { production_mgr_routes } from '../src/users/employee/production_mgr/production_mgr_routes.js';
import { retailer_routes }  from '../src/users/retailer/retailer_routes.js';
import Main_login from '../src/login/Main_login.jsx';
import WarehouseLogin from '../src/login/WarehouseLogin.jsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: <Main_login />,
  },
  ...warehouse_mgr_routes,
  ...production_mgr_routes,
  ...retailer_routes,
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);