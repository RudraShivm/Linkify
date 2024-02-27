import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./InvoiceForm.css";
function InvoiceForm() {
    let params = useParams();
    const [order, setOrder] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const id = params.order_id;
    const mgr_id = params.mgr_id;
    useEffect(() => {
        axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/orders/${id}`)
        .then(res => {
            setOrder(res.data);
            // console.log(res.data);
            setTotalAmount(res.data.reduce((sum, currentOrder) => sum + (currentOrder?.paid_amount || 0), 0));
        }).catch(err => {
            console.log(err);
        });
    }, [id, mgr_id]);
    const numberWithCommas = (x) => {
        return x !== undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    };

    const handleClick = () => {
        axios.post(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/${id}/createInvoice`, {data: order})
        .then((res) => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

  return(
    <>
        <div className='heading'>Invoice📃</div>
    <div className='invoice-form-container'>
    <table style={{ border: 'none', backgroundColor: 'transparent' }}>
    <tbody>
        <tr>
            <td><b>Order ID</b></td>
            <td>{id}</td>
        </tr>
        <tr>
            <td><b>Order Place Date</b></td>
            <td>{order[0]?.order_place_date.split(`T`)[0]}</td>
        </tr>
        <tr>
            <td style={{'paddingRight':'100px'}}><b>Retailer Store Name</b></td>
            <td>{order[0]?.store_name}</td>
        </tr>
        <tr>
            <td><b>Owner Name</b></td>
            <td>{order[0]?.owner_name}</td>
        </tr>
        <tr>
            <td><b>Paid Amount</b></td>
            <td>{numberWithCommas(totalAmount)} bdt</td>
        </tr>
    </tbody>
    </table>
    <table className=' invoice-table'>
    <thead>
        <tr>
        <th className='table-th'> Warehouse Stock ID</th>
        <th className='table-th'> Product-ID</th>
        <th className='table-th'> Product Name</th>
        <th className='table-th'> Model</th>
        <th className='table-th'> Demand</th>
        <th className='table-th'> Available Qty</th>
        <th className='table-th'> Paid Amount</th>
        </tr>
    </thead>    
    <tbody>
    {
        order.map((order) => {
            return(
                <tr key={order.product_id}>
                    <td className='table-td'>{order.warehouse_stock_id}</td>
                    <td className='table-td'>{order.product_id}</td>
                    <td className='table-td'>{order.name}</td>
                    <td className='table-td'>{order.model}</td>
                    <td className='table-td'>{order.qty}</td>
                    <td className='table-td'>{order.available_qty}</td>
                    <td className='table-td'>{numberWithCommas(order.paid_amount)} bdt</td>
                </tr>            
            );
        }
    )}
    </tbody>
    </table>
    </div>
    <div className='btn-container'>
        <button type="submit" className='btn submit-button' id='sub_ware_req_btn' onClick={handleClick}>Submit Invoice</button>
    </div>
    <div className='extra-box'></div>
    </>
  )
}

export default InvoiceForm
