import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';

function Warehouse_requests() {
    const { mgr_id } = useParams();
const [reqdata, setReqdata] = useState([]);
const [tableType, setTableType] = useState('All');
const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
useEffect(() => {
    axios.get(`${baseurl}/users/employee/delivery_mgr/${mgr_id}/ware_invoice`)
    .then(res => {
        setReqdata(res.data);
    })
    .catch(err => {
        console.log(err);
    })
},[mgr_id]);

useEffect(() => {
  if(tableType === 'All'){
      setFilteredData(reqdata);
  }else if(tableType === 'Delivery-Pending'){
      setFilteredData(reqdata.filter((req) => req.status === 'delivery-pending'));
  } else if(tableType === 'Delivered'){
      setFilteredData(reqdata.filter((req) => req.status === 'delivered'));
  }
  }, [tableType, mgr_id, reqdata]);
  const handleClick = (warehouse_id,status) => {
      if(status=="delivery-pending"){
        navigate(`/user/employee/delivery_mgr/home/${mgr_id}/warehouse_requests/confirm_delivery`,{state:{selected:filteredData.filter((req) => req.warehouse_id === warehouse_id && req.status === 'delivery-pending')}});
      }else if(status=="delivered"){
        console.log('Delivered');
      }
  };
  const switchAll = () => {
      setTableType('All');
  }
  const switchDeliveredPending = () => {
      setTableType('Delivery-Pending');
  }
  const switchDelivered = () => {
      setTableType('Delivered');
  }
  const exportPDF = () => {
      console.log("Exported");
  }
return (
    <>
    <h1 className='heading'>Warehouse Requests List</h1>
    <div className='tab-container'>
      <button onClick={switchAll} id={`${tableType==="All" ? "All":""}`}>All</button>
      <button onClick={switchDeliveredPending} id={`${tableType==="Delivery-Pending" ? "Delivery-Pending":""}`}>Delivery Pending</button>
      <button onClick={switchDelivered} id={`${tableType==="Delivered" ? "Delivered":""}`}>Delivered</button>
      <button onClick={exportPDF}>Export PDF</button>
    </div>
    <span className='info2'><b>Manager ID ::</b> {mgr_id}</span>
    <div className='tab-container tab-container2'>
    </div>
    <div className={`table-container`}>
    <table id='Ware_req_table'>
        <thead>
        <tr>
            <th className='table-th'>Warehouse ID</th>
            <th className='table-th'>Req ID</th>
            <th className='table-th'>F-Stock ID</th>
            <th className='table-th'>W-Stock ID</th>
            <th className='table-th'>W-Stock</th>
            <th className='table-th'>Product ID</th>
            <th className='table-th'>Product Name</th>
            <th className='table-th'>Model</th>
            <th className='table-th'>Quantity</th>
            <th className='table-th'>Request Date</th>
            <th className='table-th'>Status</th>
        </tr>
        </thead>
        <tbody>   
        {
            filteredData.map((req,index) => {
                const isSameReqId = index > 0 && req.warehouse_id === filteredData[index - 1].warehouse_id;
                    
                return (
                    <tr key={req.id}>
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className='table-td'>{req.warehouse_id}</td>}
                            
                        <td className='table-td'>{req.id}</td>
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className='table-td'>{req.factory_stock_id}</td>}
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className='table-td'>{req.ware_stock_id}</td>}
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className={`table-td`}>{req.available_qty}</td>}
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length}  className='table-td'>
                            <Link to={`/user/employee/production_mgr/home/${mgr_id}/products/${req.product_id}`}>
                            {req.product_id}
                        </Link>
                        </td>}
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className='table-td'>{req.name}</td>}
                        {!isSameReqId && <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length}  className='table-td'>{req.model}</td>}
                        <td className='table-td'>{req.qty}</td>
                        <td className='table-td'>{req.request_date.split('T')[0]}</td>
                        {!isSameReqId && 
                        <td rowSpan={filteredData.filter(o => o.warehouse_id === req.warehouse_id).length} className='order-item-status wmgr-order-item-status table-td' >
                              <div className={` ${req.status}`} onClick={()=>{handleClick(req.warehouse_id,req.status)}}>
                                  {req.status}
                              </div>     
                        </td>
                    }
                    </tr>
                );
            }
        )}
        </tbody>
    </table>
    </div>
    <div className='extra-box'></div>
    </>
);
}

export default Warehouse_requests
