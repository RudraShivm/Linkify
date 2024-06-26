import axios from 'axios';
import React  from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Dashboard.css';
import Notification from './Notification';
import NotificationComponent from './Notification';
import { baseurl } from '../../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/alert" title="alert icons">Alert icons created by feen - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/free-icons/warning" title="warning icons">Warning icons created by Creatype - Flaticon</a> */}
function Dashboard() {
    const { mgr_id } = useParams();
    const [orderno,setOrderno]=useState(0);
    const [processingOrderNo,setProcessingOrderNo]=useState(0);
    const [reqno,setReqno]=useState(0);
    const [stock,setStock]=useState([]);
    const [nearingOrders,setNearingOrders]=useState([]);
    const [expiredOrders,setExpiredOrders]=useState([]);
    const url1=`/user/employee/warehouse_mgr/home/${mgr_id}/orders`;
    const url2=`/user/employee/warehouse_mgr/home/${mgr_id}/ware_req`;
    const url3=`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/dashboard/pending_order_number`;
    const url4=`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/dashboard/pending_ware_req_number`;
    const url5=`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/warehouse_stock`;
    const url6= `${baseurl}/users/employee/warehouse_mgr/${mgr_id}/orders/nearingOrders`;
    const url7= `${baseurl}/users/employee/warehouse_mgr/${mgr_id}/orders/expiredOrders`;
    const url8=`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/dashboard/processing_order_number`;
    useEffect(()=>{
        axios.get(url3)
        .then(res=>{
            setOrderno(res.data[0]?.get_pending_order_no);
        })
        .catch(err=>{
            console.log(err)
        })

        axios.get(url4)
        .then(res=>{
            setReqno(res.data[0]?.get_ware_req_no);
        })
        .catch(err=>{
            console.log(err)
        })

        axios.get(url5)
        .then(res=>{
            setStock(res.data);
        })
        .catch(err=>{
            console.log(err)
        })

        axios.get(url6)
        .then(res=>{
            setNearingOrders(res.data);
        })
        .catch(err=>{
            console.log(err)
        })
        axios.get(url7)
        .then(res=>{
            setExpiredOrders(res.data);
        })
        .catch(err=>{
            console.log(err)
        })

        axios.get(url8)
        .then(res=>{
            setProcessingOrderNo(res.data[0]?.get_processing_order_no);
        })
    },[setOrderno,setReqno,url3,url4,url5, url6])
    return (
        <>
    <div className='heading'>Dashboard</div>
    <div className='dashboard-container'>
    <div className='card-container'>
        <Link to={url1} className='link'>
            <div className='card'>
                Orders
                <div className='warning'>
                    <img src='/warning.png' id='warning'/>
                    {`${nearingOrders.length} nearing orders`}
                </div>
                <div className='warning2'>
                    <img src='/warning.png' id='warning'/>
                    {`${expiredOrders.length} expired orders`}
                </div>
                <div className='details'>
                    <div>
                    {orderno==null?0:orderno} pending orders
                    </div>
                    <div>
                    {processingOrderNo==null?0:processingOrderNo} processing orders
                    </div>
                </div>
            </div>
        </Link>
        <Link to={url2} className='link'>
            <div className='card'>
                Ware Request
                <div className='details'>
                    <div>
                    {reqno==null?0:reqno} pending requests
                    </div>
                </div>
            </div>
        </Link>
    </div>
    <NotificationComponent/>
    </div>
    </>
  )
}

export default Dashboard;