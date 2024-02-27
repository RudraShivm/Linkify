import Home from "./Home";

import React from "react";

export const production_mgr_routes = [
  {
    path: "/user/employee/production_mgr/home/:mgr_id",
    element: React.createElement(Home),
  },
  //   {
  //     path: "/user/employee/warehouse_mgr/orders/:mgr_id",
  //     element: React.createElement(Orders),

  //   },
  //   {
  //     path: "/user/employee/warehouse_mgr/ware_req/:mgr_id",
  //     element: React.createElement(Ware_req),

  //   },
];
