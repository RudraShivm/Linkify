import React from 'react'
import { useParams,Link, useNavigate, Route, Routes } from 'react-router-dom'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { baseurl } from '../../../baseurl';
function Invoice() {
    const {mgr_id}=useParams();
    const [processingorders, setProcessingorders] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/processingorders`)
        .then(res => {
            setProcessingorders(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [mgr_id]);
    const handleClick = (id, status) => {
        navigate(`/user/employee/warehouse_mgr/home/${mgr_id}/Invoice/${id}/form`);
    }
  return (
    <div>
        <h1 className='heading'>Processing Order List</h1>
        <p className='info'>Manager ID :: {mgr_id}</p>
        <div className='table-container'>
        <table className='table' id='processingorders-table'>
            <thead>
            <tr>
                <th className='table-th'>ID</th>
                <th className='table-th'>Sub ID</th>
                <th className='table-th'>Product ID</th>
                <th className='table-th'>Model</th>
                <th className='table-th'>Customer ID</th>
                <th className='table-th'>Quantity</th>
                <th className='table-th'>Place Date</th>
                <th className='table-th'>Expected Delivery Date</th>
                <th className='table-th'>Paid Amount</th>
                <th className='table-th'>Status</th>
            </tr>
            </thead>
            <tbody>   
            {
                processingorders.map((order, index) => {
                    const isSameOrderId = index > 0 && order.id === processingorders[index - 1].id;
                    return (
                        <tr key={`${order.id}-${order.sub_id}`}>
                            {!isSameOrderId && <td rowSpan={processingorders.filter(o => o.id === order.id).length} className='table-td'>{order.id}</td>}
                            <td className='table-td'>{order.sub_id}</td>
                            <td className='table-td'>
                            <Link to={`/user/employee/warehouse_mgr/home/${mgr_id}/products/${order.product_id}`}>
                                {order.product_id}
                            </Link></td>
                            <td className='table-td'>{order.model}</td>
                            <td className='table-td'>{order.customer_id}</td>
                            <td className='table-td'>{order.qty}</td>
                            <td className='table-td'>{(`${order.order_place_date}`).split('T')[0]}</td>
                            {!isSameOrderId && 
                            <td rowSpan={processingorders.filter(o => o.id === order.id).length} className='table-td'>
                                    {(`${order.exp_delivery_date}`).split('T')[0]}
                            </td>
                            } 
                            <td className='table-td'>{order.paid_amount}</td>
                            {!isSameOrderId && 
                            <td rowSpan={processingorders.filter(o => o.id === order.id).length} className='order-item-status wmgr-order-item-status table-td'>
                                <div className={` ${order.status}`} onClick={()=>{handleClick(order.id, order.status)}}>
                                    {order.status}
                                </div>    
                            </td>
                            }                           

                        </tr>
                    );
                })}
            </tbody>
        </table>
        </div>
    </div>
)}

export default Invoice
