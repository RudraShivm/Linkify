import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';

function Factory_Requests() {
  const {mgr_id} = useParams();
  const [Factory_Requests, setFactory_Requests] = useState([]);
  useEffect(() => {
    axios.get(`${baseurl}/users/employee/production_mgr/${mgr_id}/factory_requests`)
    .then(response => {
      setFactory_Requests(response.data);
    })
    .catch(error => {
      console.log(error);
    })
  });
  const handleClick = (id, status) => {
    if (status === 'completed') {
      axios.get(`${baseurl}/users/employee/production_mgr/${mgr_id}/factory_requests/${id}/invoice`, { responseType: 'blob' })
        .then((response) => {
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          // Open the URL on a new window
          window.open(fileURL);
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  }
  return (
    <>
      <h1 className='heading'>Factory Requests List</h1>
        <h3 className='info'><b>Production mgr ID ::</b> {mgr_id}</h3>
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
              Factory_Requests.map((req) => {
                return (
                  <tr key={req.id}>
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
    </>
  )
}

export default Factory_Requests
