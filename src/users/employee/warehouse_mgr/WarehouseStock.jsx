import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'
import './WarehouseStock.css'
function WarehouseStock() {
    const {mgr_id}=useParams();
    const [warehouseStock, setWarehouseStock] = useState([]);
    const [pendingDemand, setPendingDemand] = useState([]);
    const [processingDemand, setProcessingDemand] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/warehouse_stock`)
        .then(res => {
            setWarehouseStock(res.data);
        }).catch(err => {
            console.log(err);
        });

        axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/pending_demand`)
        .then(res => {
            setPendingDemand(res.data);
        }).catch(err => {
            console.log(err);
        });
        
        axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/processing_demand`)
        .then(res => {
            setProcessingDemand(res.data);
        }).catch(err => {
            console.log(err);
        });
    },[mgr_id]);
    return (
    <>
    <h1 className='heading'>Warehouse Stocks</h1>
    <p className='info'>Manager ID :: {mgr_id}</p>
    <div className='table-container'>
        <table className='table'>
            <thead>
                <tr>
                <th className='table-th'>Warehouse Stock ID</th>
                <th className='table-th'>Product ID</th>
                <th className='table-th'>Model</th>
                <th className='table-th'>Min Delivery Time (days)</th>
                <th className='table-th'>Quantity</th>
                <th className='table-th'>Pending Demand</th>
                <th className='table-th'>Processing Demand</th>

                </tr>
            </thead>
            <tbody>
            {
                warehouseStock.map((stock, index) => {
                    return (
                        <tr key={stock.product_id}>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{stock.id}</td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}><Link to={`/user/employee/warehouse_mgr/home/${mgr_id}/products/${stock.product_id}`}>
                                {stock.product_id}
                            </Link></td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{stock.model}</td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{stock.minimum_delivery_time}</td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{stock.available_qty}</td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{pendingDemand.find(product => product.warehouse_stock_id === stock.id)?.demand_qty || 0}</td>
                            <td className={`table-td ${stock.available_qty==0 ? "red" : ""}`}>{processingDemand.find(product => product.warehouse_stock_id === stock.id)?.demand_qty || 0}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
      
    </div>
    </>
  )
}

export default WarehouseStock
