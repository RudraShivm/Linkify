import axios from 'axios';
import React  from 'react';
import { jsPDF as jspdf } from 'jspdf';
import 'jspdf-autotable';
import { Link, useParams,useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { baseurl } from '../../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/alert" title="alert icons">Alert icons created by feen - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/free-icons/warning" title="warning icons">Warning icons created by Creatype - Flaticon</a> */}
function Orders() {
    const { mgr_id } = useParams();
    const [invoiceRow, setInvoiceRow] = useState([]);
    const [tableType, setTableType] = useState('All');
    const [filteredRows, setFilteredRows] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if(tableType === 'All'){
            axios.get(`${baseurl}/users/employee/delivery_mgr/${mgr_id}/invoice`)
            .then(res => {
                setInvoiceRow(res.data);
                setFilteredRows(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }else{
            const filtered = invoiceRow.filter((row) => row.status === tableType);
            setFilteredRows(filtered);
        }
    }, [tableType, mgr_id]);

    
    const switchAll = () => {
        setTableType('All');
    }
    const switchDue = () => {
        setTableType('delivery-pending');
    }
    const switchDelivered = () => {
        setTableType('delivered');
    }

    const exportPDF = () => {
        const doc = new jspdf();
        doc.setFontSize(22);
        const title = `${tableType.charAt(0).toUpperCase() + tableType.slice(1)} Orders`;
        const txtWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const x = (doc.internal.pageSize.width - txtWidth) / 2;
        doc.text(title, 105, 30, null, null, 'center');
        doc.line(x, 33, x + txtWidth, 33); // underline
        doc.setFontSize(12);
        doc.text(`Delivery Manager ID : ${mgr_id}`, 13, 50);
        const headers = ["ID", "Sub ID", "Product ID", "Model", "Customer ID", "Quantity", "Place Date", "Expected Delivery Date", "Paid Amount", "Status"];
        let prevOrderId = null;
        let prevDeliveryDate = null;
        let prevStatus = null;
        const data = filteredRows.map((order, index) => {
            let idCell = '';
            let deliveryDateCell = '';
            let statusCell = '';
            if (order.order_id !== prevOrderId) {
                idCell = order.order_id;
                prevOrderId = order.order_id;
            }
            if (order.exp_delivery_date.split('T')[0] !== prevDeliveryDate) {
                deliveryDateCell = order.exp_delivery_date.split('T')[0];
                prevDeliveryDate = order.exp_delivery_date.split('T')[0];
            }
            if (order.status !== prevStatus) {
                statusCell = order.status;
                prevStatus = order.status;
            }
            return [
                idCell,
                order.order_sub_id,
                order.product_id,
                order.model,
                order.customer_id,
                order.qty,
                order.order_place_date.split('T')[0],
                deliveryDateCell,
                order.paid_amount,
                statusCell
            ];
        });
        doc.autoTable({
            startY: 60,
            head: [headers],
            body: data,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 1, overflow: 'linebreak' },
            headStyles: { fillColor: [51, 187, 241], textColor: [255, 255, 255] }
        });
        doc.save(`${tableType}-orders-${mgr_id}.pdf`);
    }

    const handleClick = (status,order_id) => {
        if (status === 'delivery-pending') {
            navigate(`/user/employee/delivery_mgr/home/${mgr_id}/invoice/${order_id}`);
        } else if (status === 'delivered') {
            return;
        }
    }
    return (
    <>
    <div className='heading'>Orders</div>
    <div className='tab-container'>
        <button onClick={switchAll} id={`${tableType==="All" ? "All":""}`}>All</button>
        <button onClick={switchDue} id={`${tableType==="delivery-pending" ? "delivery-pending":""}`}>Pending</button>
        <button onClick={switchDelivered} id={`${tableType==="delivered" ? "delivered":""}`}>Delivered</button>
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
                filteredRows.map((order, index) => {
                    const isSameOrderId = index > 0 && order.order_id === invoiceRow[index - 1].order_id;
                    return (
                        <tr key={`${order.order_id}-${order.order_sub_id}`}>
                            {!isSameOrderId && <td rowSpan={invoiceRow.filter(o => o.order_id === order.order_id).length} className='table-td'  >{order.order_id}</td>}
                            <td className='table-td'>{order.order_sub_id}</td>
                            <td className='table-td'>
                            <Link to={`/user/employee/warehouse_mgr/home/${mgr_id}/products/${order.product_id}`}>
                                {order.product_id}
                            </Link></td>
                            <td className='table-td'>{order.model}</td>
                            <td className='table-td'>{order.customer_id}</td>
                            <td className='table-td'>{order.qty}</td>
                            <td className='table-td'>{(`${order.order_place_date}`).split('T')[0]}</td>
                            {!isSameOrderId && 
                            <td rowSpan={invoiceRow.filter(o => o.order_id === order.order_id).length} className='table-td'>
                                    {(`${order.exp_delivery_date}`).split('T')[0]}
                            </td>
                            } 
                            <td className='table-td'>{order.paid_amount}</td>
                            {!isSameOrderId && 
                            <td rowSpan={invoiceRow.filter(o => o.order_id === order.order_id).length} className='order-item-status wmgr-order-item-status table-td'>
                                <div className={` ${order.status}`} onClick={()=>{handleClick(order.status,order.order_id)}}>
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