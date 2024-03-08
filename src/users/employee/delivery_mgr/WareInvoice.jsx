import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';

function WareInvoice() {
    let params = useParams();
    const location = useLocation();
    const [invoice, setInvoice] = useState(location.state.selected);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const mgr_id = params.mgr_id;
    const totalDemand = invoice.reduce((total, item) => total + item.qty, 0);
    

    const handleClick = () => {
        if(invoice.every((invoice) => invoice.available_qty >= invoice.qty)){
        axios.post(`${baseurl}/users/employee/delivery_mgr/${mgr_id}/ware_invoice/make_delivery`, {data: invoice})
            .then((res) => {
                if(res.data==="All Warehouse Deliveries Confirmed"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('green');
                    setBannerVisible(true);
                    setBannerinfo('Warehouse Deliveries Confirmed');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                }else if(res.data==="Some warehouse deliveries were not created successfully"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Some warehouse deliveries were not created successfully');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
                }else if(res.data==="Delivery already recorded for request(s)"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Delivery already recorded for request(s)');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
                }else{
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Error occured while making warehouse delivery');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
                }
            }).catch(err => {
                console.log(err);
            });
        }else{
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setBannerColor('red');
            setBannerVisible(true);
            setBannerinfo('Insufficient stock');
            timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
        }
    }
  return(
    <>
        {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
    <div className='heading'>Invoice📃</div>
    <div className='invoice-form-container'>
    <table style={{ border: 'none', backgroundColor: 'transparent' }}>
    <tbody>
        <tr>
            <td style={{'paddingRight':'100px'}}><b>Warehouse ID</b></td>
            <td>{invoice[0]?.warehouse_id}</td>
        </tr>
        <tr>
            <td><b>Branch City</b></td>
            <td>{invoice[0]?.city}</td>
        </tr>
        <tr>
            <td><b>Request Place Date</b></td>
            <td>{invoice[0]?.request_date.split(`T`)[0]}</td>
        </tr>
        <tr>
            <td><b>Delivered by</b></td>
            <td>{invoice[0]?.delivery_mgr_name}</td>
        </tr>
        <tr>
            <td><b>Delivery Date</b></td>
            <td>{(new Date()).toISOString().split(`T`)[0]}</td>
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
        <th className='table-th'> Issued By</th>
        <th className='table-th'> Issue Qty</th>
        <th className='table-th'> Issue Date</th>
        </tr>
    </thead>    
    <tbody>
    {
        invoice.map((invoice) => {
            return(
                <tr key={invoice.id}>
                    <td className='table-td'>{invoice.ware_stock_id}</td>
                    <td className='table-td'>{invoice.product_id}</td>
                    <td className='table-td'>{invoice.name}</td>
                    <td className='table-td'>{invoice.model}</td>
                    <td className='table-td'>{invoice.qty}</td>
                    <td className='table-td'>{invoice.mgr_name}</td>
                    <td className='table-td'>{invoice.issue_qty}</td>
                    <td className='table-td'>{invoice.issue_date.split('T')[0]}</td>
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

export default WareInvoice
