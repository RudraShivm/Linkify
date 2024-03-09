import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from './InvoiceForm';
import { baseurl } from '../../../baseurl';
function FactoryRequests() {
  const {mgr_id} = useParams();
  const [file, setFile] = useState(null);
  const [tableType, setTableType] = useState('All');
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [Factory_Requests, setFactory_Requests] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
  const timeoutRef = useRef(null);
    const navigate = useNavigate();
    const [reqID, setReqID] = useState(0);
    const [invoiceFormVisible, setInvoiceFormVisible] = useState(false);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          setInvoiceFormVisible(prevVisible => !prevVisible);
        }
      };
    
      window.addEventListener('keydown', handleKeyDown);
    
      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);
    useEffect(() => {
      axios.get(`${baseurl}/users/employee/supply_mgr/${mgr_id}/factory_requests`)
      .then(response => {
        setFactory_Requests(response.data);
      })
      .catch(error => {
        console.log(error);
      })
    }, [mgr_id]);
    
    useEffect(() => {
      if(tableType === 'All'){
          setFilteredData(Factory_Requests);
      }else if(tableType === 'Pending'){
          setFilteredData(Factory_Requests.filter((req) => req.status === 'pending'));
      }else if(tableType === 'Processing'){
          setFilteredData(Factory_Requests.filter((req) => req.status === 'processing'));
      }else if(tableType === 'Completed'){
          setFilteredData(Factory_Requests.filter((req) => req.status === 'completed'));
      }
      }, [tableType, mgr_id,Factory_Requests]);
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
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', file);

    axios.post(`${baseurl}/users/employee/supply_mgr/${mgr_id}/factory_req/${reqID}/submit_invoice`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((res) => {
        if(res.data==="Invoice submitted successfully"){
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
          }
          setBannerColor('green');
          setBannerVisible(true);
          setBannerinfo('Invoice submitted successfully');
          timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
      } else {
          if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
          }
          setBannerColor('red');
          setBannerVisible(true);
          setBannerinfo('Error occured while submitting invoice');
          timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
      }}).catch(err => {
        console.log(err);
      });

  };
  const handleSelectClick = () => {
    setShowCheckboxes(!showCheckboxes);
  };
  const handleClick = (id,status) => {
    if(status=="pending"){
        axios.post(`${baseurl}/users/employee/supply_mgr/${mgr_id}/factory_req/${id}/process`)
        .then((res) => {
            setFactory_Requests(res.data);
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
        setInvoiceFormVisible(true);
        setReqID(id);
    }else if(status=="completed"){
      axios.get(`${baseurl}/users/employee/supply_mgr/${mgr_id}/factory_requests/${id}/invoice`, { responseType: 'blob' })
        .then((response) => {
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  }

  const switchAll = () => {
    setTableType('All');
}
const switchPending = () => {
    setTableType('Pending');
}
const switchProcessing = () => {
    setTableType('Processing');
}
const switchDelivered = () => {
    setTableType('Completed');
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
      { invoiceFormVisible &&
        <>
        <InvoiceForm handleFileChange={handleFileChange} handleUpload={handleUpload} selected={Factory_Requests.filter((req)=>req.id===reqID)} setInvoiceFormVisible={setInvoiceFormVisible}/>
        </>
    }
        {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
      <h1 className='heading'>Factory Requests List</h1>
        <div className='tab-container'>
        <button onClick={switchAll} id={`${tableType==="All" ? "All":""}`}>All</button>
        <button onClick={switchPending} id={`${tableType==="Pending" ? "Pending":""}`}>Pending</button>
        <button onClick={switchProcessing} id={`${tableType==="Processing" ? "Processing":""}`}>Processing</button>
        <button onClick={switchDelivered} id={`${tableType==="Completed" ? "Completed":""}`}>Completed</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
        <h3 className='info'><b>Supply mgr ID ::</b> {mgr_id}</h3>
      <div className='tab-container ' id='tab-container2'>
      <button onClick={handleSelectClick}>Select Several</button>
      {showCheckboxes && <button onClick={selectAll} className='select-btn'><img src='/select.png' className='select-img'/></button>}
      {showCheckboxes && <button onClick={deselectAll} className='select-btn'><img src='/cross.png' className='select-img'/></button>}
      </div>
        <div className='table-container'>

        <table id='Ware_req_table'>
            <thead>
            <tr>
                <th className='table-th'>Factory Req ID</th>
                <th className='table-th'>F_Raw Stock ID</th>
                <th className='table-th'>Name</th>
                <th className='table-th'>Type</th>
                <th className='table-th'>Company</th>
                <th className='table-th'>Request Date</th>
                <th className='table-th'>Status</th>
            </tr>
            </thead>
            <tbody>   
            {
              filteredData.map((req) => {
                return (
                  <tr key={req.id}>
                            {showCheckboxes && (
                            <td className='table-td'>
                                <input
                                type="checkbox"
                                checked={isAllChecked || selected.includes(req)}
                                onChange={(e) => handleCheckboxChange(req, e.target.checked)}
                                />
                            </td>
                            )}
                            <td className='table-td'>{req.id}</td>
                            <td className='table-td'>{req.factory_raw_stock_id}</td>
                            <td className='table-td'>{req.raw_name}</td>
                            <td className='table-td'>{req.type}</td>
                            <td className='table-td'>{req.company}</td>
                            <td className='table-td'>{req.req_date.split('T')[0]}</td>
                            <td  className='order-item-status wmgr-order-item-status table-td'>
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
  )
}

export default FactoryRequests
