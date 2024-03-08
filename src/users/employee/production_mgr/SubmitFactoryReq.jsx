import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';

function SubmitFactoryReq() {
    const {mgr_id} = useParams();
    const [raw_stock, setRaw_stock] = useState([]);
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
      const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const [updatedData, setUpdatedData] = useState([]);
    useEffect(() => {
        axios.get(`${baseurl}/users/employee/production_mgr/${mgr_id}/raw_stock`)
        .then(response => {
            setRaw_stock(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }, [mgr_id]);
    const handleUpdate =()=>{
        axios.post(`${baseurl}/users/employee/production_mgr/${mgr_id}/submit_factory_req`, {data:updatedData?updatedData:[]})
        .then(response => {
            console.log(response.data);
            if(response.data==="Factory request created successfully"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setBannerVisible(true);
                  setBannerinfo('Production log(s) created successfully');
                  setBannerColor('green');
                  timeoutRef.current = setTimeout(() => {
                    setBannerVisible(false);
                  }, 2000);
                    
            }else if(response.data==="Some factory request(s) were not created successfully"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setBannerVisible(true);
                  setBannerinfo('Some factory request(s) were not created successfully');
                  setBannerColor('red');
                  timeoutRef.current = setTimeout(() => {
                    setBannerVisible(false);
                  }, 3000);
                    
            }else{
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setBannerVisible(true);
                  setBannerinfo('Error creating factory request(s)');
                  setBannerColor('red');
                  timeoutRef.current = setTimeout(() => {
                    setBannerVisible(false);
                  }, 3000);
                    
            }
        })
        .catch(error => {
            console.log(error);
        })

    }
    const handleInputChange = (stock_id,qty) => {
        if(updatedData.find((item) => item.stock_id === stock_id)==undefined){
            setUpdatedData([...updatedData,{stock_id:stock_id,qty:qty}]);
        }else{
            setUpdatedData(updatedData.map((item) => {
                if(item.stock_id === stock_id){
                    return {stock_id:stock_id,qty:qty};
                }else{
                    return item;
                }
            }));
        }
    };
  return (
    <>
    {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
    
    <h1 className='heading'>Submit Request</h1>
        <h3 className='info'>Production mgr ID :: {mgr_id}</h3>
        
        <div className={`table-container`}>
        <table id='Ware_req_table'>
            <thead>
            <tr>
                <th className='table-th'>Factory Stock ID</th>
                <th className='table-th'>Raw Material ID</th>
                <th className='table-th'>Company</th>
                <th className='table-th'>Name</th>
                <th className='table-th'>Type</th>
                <th className='table-th'>Available Qty</th>
                <th className='table-th'>Required Qty</th>
            </tr>
            </thead>
            <tbody>   
            {
                raw_stock.map((stock) => {
                    return (
                        <tr key={stock.id}>
                            <td className='table-td'>{stock.id}</td>
                            <td className='table-td'>{stock.raw_id}</td>
                            <td className='table-td'>{stock.company}</td>
                            <td className='table-td'>{stock.name}</td>
                            <td className='table-td'>{stock.type}</td>
                            <td className='table-td'>{stock.available_qty}</td>
                            <td className='table-td'>
                            <input
                                type="number"
                                min="0"
                                onChange={(e) => handleInputChange(stock.id,e.target.value)}
                                className='input-number'
                                />
                            </td>
                            
                        </tr>
                    );
                }
            )}
            </tbody>
        </table>
            </div>
            <div className='btn-container fixed-btn'>
        <button type="submit" className='btn submit-button' id='sub_ware_req_btn' onClick={handleUpdate}>Submit Request</button>
        </div> 
        <div className='extra-box2'></div>
    </>
  )
}

export default SubmitFactoryReq
