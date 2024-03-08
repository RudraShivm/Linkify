import React from 'react'
import Home from './Home'
import Profile from './Profile'
import Orders from './Orders'
import Dashboard from './Dashboard'
import Invoice from './Invoice'
import Warehouse_requests from './Warehouse_requests'
import WareInvoice from './WareInvoice'
export const delivey_mgr_routes=[
    {
        path: "/user/employee/delivery_mgr/home/:mgr_id",
        element: React.createElement(Home),
        children: [
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/profile",
                element: React.createElement(Profile),
            },
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/orders",
                element: React.createElement(Orders),
            },
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/warehouse_requests",
                element: React.createElement(Warehouse_requests),
            },
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/warehouse_requests/confirm_delivery",
                element: React.createElement(WareInvoice),
            },
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/dashboard",
                element: React.createElement(Dashboard), 
            },
            {
                path: "/user/employee/delivery_mgr/home/:mgr_id/invoice/:order_id",
                element: React.createElement(Invoice), 
            },
        ]
    },
    
]