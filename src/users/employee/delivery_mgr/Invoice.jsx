import axios from 'axios';
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';
function Invoice() {
    let params = useParams();
    const [invoice, setInvoice] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const id = params.order_id;
    const mgr_id = params.mgr_id;
    useEffect(() => {
        axios.get(`${baseurl}/users/retailer/home/${mgr_id}/orders/${id}/invoice`)
        .then(res => {
            setInvoice(res.data);
            setTotalAmount(res.data.reduce((sum, currentOrder) => sum + (parseInt(currentOrder?.paid_amount,10) || 0), 0));
        }).catch(err => {
            console.log(err);
        });
    }, [id, mgr_id]);
    const numberWithCommas = (x) => {
        return x !== undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    };

    const handleClick = () => {
        axios.post(`${baseurl}/users/employee/delivery_mgr/${mgr_id}/retailer/invoice/confirm_delivery`, {order_id: id})
        .then((res) => {
            console.log(res.data);
            if(res.data==="Order delivery confirmed successfully"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('green');
                setBannerVisible(true);
                setBannerinfo('Order delivery confirmed successfully');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
            }else{
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('red');
                setBannerVisible(true);
                setBannerinfo('Order delivery confirmation failed');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
            }
        }).catch(err => {
            console.log(err);
        });
    }

  return(
    <>
        {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
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
            <td>{invoice[0]?.order_place_date.split(`T`)[0]}</td>
        </tr>
        <tr>
            <td style={{'paddingRight':'100px'}}><b>Retailer Store Name</b></td>
            <td>{invoice[0]?.store_name}</td>
        </tr>
        <tr>
            <td><b>Owner Name</b></td>
            <td>{invoice[0]?.owner_name}</td>
        </tr>
        <tr>
            <td><b>Branch City</b></td>
            <td>{invoice[0]?.city}</td>
        </tr>
        <tr>
            <td><b>Paid Amount</b></td>
            <td>{numberWithCommas(totalAmount)} bdt</td>
        </tr>
        <tr>
            <td><b>Issued by</b></td>
            <td>{invoice[0]?.warehouse_mgr_name}</td>
        </tr>
        <tr>
            <td><b>Issue Date</b></td>
            <td>{invoice[0]?.issue_date.split(`T`)[0]}</td>
        </tr>
        <tr>
            <td><b>Delivered by</b></td>
            <td>{invoice[0]?.delivery_mgr_name}</td>
        </tr>
        <tr>
            <td><b>Delivery Date</b></td>
            <td>{(new Date()).toISOString().split('T')[0]}</td>
        </tr>
    </tbody>
    </table>
    <table className=' invoice-table'>
    <thead>
        <tr>
        <th className='table-th'> Product ID</th>
        <th className='table-th'> Product Name</th>
        <th className='table-th'> Model</th>
        <th className='table-th'> Qty</th>
        <th className='table-th'> Paid Amount</th>
        </tr>
    </thead>    
    <tbody>
    {
        invoice.map((row) => {
            return(
                <tr key={row.product_id}>
                    <td className='table-td'>{row.product_id}</td>
                    <td className='table-td'>{row.name}</td>
                    <td className='table-td'>{row.model}</td>
                    <td className='table-td'>{row.qty}</td>
                    <td className='table-td'>{numberWithCommas(row.paid_amount)} bdt</td>
                </tr>            
            );
        }
    )}
    </tbody>
    </table>
    </div>
    <div className='btn-container'>
        <button type="submit" className='btn submit-button' id='sub_ware_req_btn' onClick={handleClick}>Confirm Delivery</button>
    </div>
    <div className='extra-box'></div>
    </>
  )
}

export default Invoice
