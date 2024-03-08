import axios from 'axios';
import React, { useEffect, useState,useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './InvoiceForm.css';
function InvoiceForm() {
    let params = useParams();
    const location = useLocation();
    const [reqData, setReqData] = useState([...location.state.selected].map((data) => ({...data, issue_qty: data.qty || 0})));
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const id = params.order_id;
    const mgr_id = params.mgr_id;
    const totalDemand = reqData.reduce((total, item) => total + item.qty, 0);
    const numberWithCommas = (x) => {
        return x !== undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    };

    const handleClick = () => {
        if(reqData.every((reqData) => reqData.available_qty >= reqData.qty)){
        axios.post(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/createInvoice`, {data: reqData})
            .then((res) => {
                if(res.data==="All invoices created successfully"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('green');
                    setBannerVisible(true);
                    setBannerinfo('Invoice created successfully');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                }else if(res.data==="Insufficient stock"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Insufficient stock');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
                }else if( res.data==="Invoice already created"){
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Invoice already created');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
                }else{
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerColor('red');
                    setBannerVisible(true);
                    setBannerinfo('Invoice creation failed');
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
    const handleIssueQtyChange = (productId, newIssueQty) => {
        setReqData(reqData.map((data) =>
          data.product_id === productId && newIssueQty<=data.qty ? {...data, issue_qty: newIssueQty} : data
        ));
      };

  return(
    <>
        {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
    <div className='heading'>Invoice📃</div>
    <div className='invoice-form-container'>
    <table style={{ border: 'none', backgroundColor: 'transparent' }}>
    <tbody>
        <tr>
            <td style={{'paddingRight':'100px'}}><b>Warehouse ID</b></td>
            <td>{reqData[0]?.warehouse_id}</td>
        </tr>
        <tr>
            <td><b>Branch City</b></td>
            <td>{reqData[0]?.city}</td>
        </tr>
        <tr>
            <td><b>Request Place Date</b></td>
            <td>{reqData[0]?.request_date.split(`T`)[0]}</td>
        </tr>
        <tr>
            <td><b>Issued By</b></td>
            <td>{reqData[0]?.mgr_name}</td>
        </tr>
        <tr>
            <td><b>Issue Date</b></td>
            <td>{new Date().toJSON().slice(0, 10)}</td>
        </tr>
        <tr>
            <td>
            <div className='purple'>
                <b>Demand Quantity</b>
            </div>
            </td>
            <td>{totalDemand}</td>
        </tr>
        <tr>
            <td>
            <div className='purple'>
                <b>Available Quantity</b>
            </div>
            </td>
            <td>{reqData[0].factory_available_qty}</td>
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
        <th className='table-th'> Issue Qty</th>
        </tr>
    </thead>    
    <tbody>
    {
        reqData.map((reqData) => {
            return(
                <tr key={reqData.product_id}>
                    <td className='table-td'>{reqData.ware_stock_id}</td>
                    <td className='table-td'>{reqData.product_id}</td>
                    <td className='table-td'>{reqData.name}</td>
                    <td className='table-td'>{reqData.model}</td>
                    <td className='table-td'>{reqData.qty}</td>
                    <td className='etable-td'>
                        <input className='sub_ware_req_input' type="number" value={reqData.issue_qty}  min="0" onChange={(e) => handleIssueQtyChange(reqData.product_id, e.target.value)}/>
                    </td>
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
