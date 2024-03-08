import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useParams,useNavigate } from 'react-router-dom';
import './Warehouse_Requests.css';
import InvoiceButton from './InvoiceButton';
import InvoiceForm from './InvoiceForm';
import ProcessButton from './ProcessButton';
function Warehouse_Requests() {
  const { mgr_id } = useParams();
  const [reqdata, setReqdata] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [tableType, setTableType] = useState('All');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
  const timeoutRef = useRef(null);
  const [filteredData, setFilteredData] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selected, setSelected] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
      axios.get(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/ware_req`)
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
    }else if(tableType === 'Pending'){
        setFilteredData(reqdata.filter((req) => req.status === 'pending'));
    }else if(tableType === 'Processing'){
        setFilteredData(reqdata.filter((req) => req.status === 'processing'));
    }else if(tableType === 'Delivery-Pending'){
        setFilteredData(reqdata.filter((req) => req.status === 'delivery-pending'));
    } else if(tableType === 'Delivered'){
        setFilteredData(reqdata.filter((req) => req.status === 'delivered'));
    }
    }, [tableType, mgr_id, reqdata]);

    const handleCheckboxChange = (req, isChecked) => {
        if (isChecked) {
          setSelected(prevSelected => [...prevSelected, req]);
        } else {
          setSelected(prevSelected => prevSelected.filter(item => item.id !== req.id));
        }
        if(isAllChecked){
          setIsAllChecked(false);
        }
      };
      const handleSelectClick = () => {
        setShowCheckboxes(!showCheckboxes);
      };
    const handleClick = (id,status) => {
        if(status=="pending"){
            axios.post(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/ware_req/${id}/process`)
            .then((res) => {
                setReqdata(res.data);
                setFilteredData(res.data);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerVisible(true);
                setBannerinfo('Request Added to Processing');
                setBannerColor('green');
                timeoutRef.current = setTimeout(() => {
                    setBannerVisible(false);
                }, 3000);
            })
            .catch(err => {
                console.log(err);
            })
        }else if(status=="processing"){
            navigate(`/user/employee/production_mgr/home/${mgr_id}/warehouse_requests/make_invoice`, {state: {selected: reqdata.filter((reqData) => reqData.id === id)}});
        }
    };
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
    const switchDeliveredPending = () => {
        setTableType('Delivery-Pending');
    }
    const switchDelivered = () => {
        setTableType('Delivered');
    }
    const selectAll = () => {
        setSelected(filteredData);
        setIsAllChecked(true);
      };
    
      const deselectAll = () => {
        setSelected([]);
        setIsAllChecked(false);
      };
    const exportPDF = () => {
        console.log("Exported");
    }
  return (
      <>
      
      {selected.length>0 && <InvoiceButton navigateTo={`/user/employee/production_mgr/home/${mgr_id}/warehouse_requests/make_invoice`} selected={selected}/>}
      {selected.length>0 && <ProcessButton handleClick2={handleClick} selected={selected} setBannerVisible={setBannerVisible} setBannerColor={setBannerColor} setBannerinfo={setBannerinfo} />}
      {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
      <h1 className='heading'>Warehouse Requests List</h1>
      <div className='tab-container'>
        <button onClick={switchAll} id={`${tableType==="All" ? "All":""}`}>All</button>
        <button onClick={switchPending} id={`${tableType==="Pending" ? "Pending":""}`}>Pending</button>
        <button onClick={switchProcessing} id={`${tableType==="Processing" ? "Processing":""}`}>Processing</button>
        <button onClick={switchDeliveredPending} id={`${tableType==="Delivery-Pending" ? "Delivery-Pending":""}`}>Delivery Pending</button>
        <button onClick={switchDelivered} id={`${tableType==="Delivered" ? "Delivered":""}`}>Delivered</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
      <span className='info2'><b>Manager ID ::</b> {mgr_id}</span>
      <span className='info2'><b>Factory ID ::</b> {reqdata[0]?.factory_id}</span>
      <span className='info2'><b>Available Stock ::</b> {reqdata[0]?.factory_available_qty}</span>
      <div className='tab-container' id='tab-container2'>
      <button onClick={handleSelectClick}>Select Several</button>
      {showCheckboxes && <button onClick={selectAll} className='select-btn'><img src='/public/select.png' className='select-img'/></button>}
      {showCheckboxes && <button onClick={deselectAll} className='select-btn'><img src='/public/cross.png' className='select-img'/></button>}
      </div>
      <div className={`table-container`}>
      <table id='Ware_req_table'>
          <thead>
          <tr>
                {showCheckboxes && <th className='table-th'>Check</th>}
              <th className='table-th'>Req ID</th>
              <th className='table-th'>Factory Stock ID</th>
              <th className='table-th'>Product ID</th>
              <th className='table-th'>Product Name</th>
              <th className='table-th'>Model</th>
              <th className='table-th'>Quantity</th>
              <th className='table-th'>Request Date</th>
              <th className='table-th'>Warehouse Stock ID</th>
              <th className='table-th'>Ware Stock</th>
              <th className='table-th'>Status</th>
          </tr>
          </thead>
          <tbody>   
          {
              filteredData.map((req) => {
                  return (
                      <tr key={req.id} className={`${req.qty>req.factory_available_qty?"red":""}`}>
                          <td className='table-td'>{req.id}</td>
                        {showCheckboxes && (
                            <td className='table-td'>
                                <input
                                type="checkbox"
                                checked={isAllChecked || selected.includes(req)}
                                onChange={(e) => handleCheckboxChange(req, e.target.checked)}
                                />
                            </td>
                        )}
                          <td className='table-td'>{req.factory_stock_id}</td>
                          <td className='table-td'>
                              <Link to={`/user/employee/production_mgr/home/${mgr_id}/products/${req.product_id}`}>
                              {req.product_id}
                          </Link>
                          </td>
                          <td className='table-td'>{req.name}</td>
                          <td className='table-td'>{req.model}</td>
                          <td className='table-td'>{req.qty}</td>
                          <td className='table-td'>{req.request_date.split('T')[0]}</td>
                          <td className='table-td'>{req.ware_stock_id}</td>
                          <td className={`table-td`}>{req.available_qty}</td>
                          <td className='order-item-status wmgr-order-item-status table-td' >
                                <div className={` ${req.status}`} onClick={()=>{handleClick(req.id,req.status)}}>
                                    {req.status}
                                </div>     
                          </td>
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

export default Warehouse_Requests
