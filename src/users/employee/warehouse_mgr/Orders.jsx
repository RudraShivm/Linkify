import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import './orders.css';
import { jsPDF as jspdf } from 'jspdf'
import 'jspdf-autotable';
import { useRef } from 'react';
const Orders = () => {
    const { mgr_id } = useParams();
    const [orders, setOrders] = useState([]);
    const [tableType, setTableType] = useState('All');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
  const timeoutRef = useRef(null);
    const url=`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/orders`;

    useEffect(() => {
        axios.get(url)
        .then(res => {
            setOrders(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [url]);

    useEffect(() => {
    if(tableType === 'All'){
        axios.get(url)
        .then(res => {
            setOrders(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }else if(tableType === 'Pending'){
            axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/pendingorders`)
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }else if(tableType === 'Processing'){
            axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/processingorders`)
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }
    }, [tableType, url, mgr_id]);


    const exportPDF = () => {
        const doc = new jspdf();
        doc.text(`${tableType} Orders`, 80, 10);
        const headers = ["ID", "Sub ID", "Product ID", "Model", "Quantity", "Delivery Date"];
        let prevOrderId = null;
        let prevDeliveryDate = null;
        const data = orders.map(order => {
            let idCell = '';
            let deliveryDateCell = '';
            if (order.id !== prevOrderId) {
                idCell = order.id;
                prevOrderId = order.id;
            }
            if (order.exp_delivery_date.split('T')[0] !== prevDeliveryDate) {
                deliveryDateCell = order.exp_delivery_date.split('T')[0];
                prevDeliveryDate = order.exp_delivery_date.split('T')[0];
            }
            return [
                idCell,
                order.sub_id,
                order.product_id,
                order.model,
                order.qty,
                deliveryDateCell
            ];
        });
        doc.autoTable({
            head: [headers],
            body: data
        });
        doc.save(`${tableType}-orders-${mgr_id}.pdf`);
    }
    const handleClick = (id, status) => {
        if(status === 'pending'){
            axios.post(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/orders/processOrder`, {id:id})
            .then (res => {
                if(res.data==='Insufficient stock'){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerVisible(true);
                    setBannerinfo('Insufficient Stock!');
                    setBannerColor('red');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                }else{
                    console.log(res.data);
                    setOrders(res.data);
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerVisible(true);
                    setBannerinfo('Order Added to Processing Successfully!');
                    setBannerColor('green');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
    const switchAll = () => {
        setTableType('All');
    }
    const switchPending = () => {
        setTableType('Pending');
        console.log(tableType);
    }
    const switchProcessing = () => {
        setTableType('Processing');
    }
    return (
        <>
        <></>
        {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
        <h1 className='heading'>Order List</h1>

      <div className='tab-container'>
        <button onClick={switchAll} id={`${tableType==="All" ? "All":""}`}>All</button>
        <button onClick={switchPending} id={`${tableType==="Pending" ? "Pending":""}`}>Pending</button>
        <button onClick={switchProcessing} id={`${tableType==="Processing" ? "Processing":""}`}>Processing</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
        <p className='info'>Manager ID :: {mgr_id}</p>
        <div className='table-container'>
        <table className='table' id='orders-table'>
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
                orders.map((order, index) => {
                    const isSameOrderId = index > 0 && order.id === orders[index - 1].id;
                    return (
                        <tr key={`${order.id}-${order.sub_id}`}>
                            {!isSameOrderId && <td rowSpan={orders.filter(o => o.id === order.id).length} className='table-td'>{order.id}</td>}
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
                            <td rowSpan={orders.filter(o => o.id === order.id).length} className='table-td'>
                                    {(`${order.exp_delivery_date}`).split('T')[0]}
                            </td>
                            } 
                            <td className='table-td'>{order.paid_amount}</td>
                            {!isSameOrderId && 
                            <td rowSpan={orders.filter(o => o.id === order.id).length} className='order-item-status wmgr-order-item-status table-td'>
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
        </>
    );
}

export default Orders;