import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import "./EditEmployee.css";
import { baseurl } from '../../baseurl';
import UpdateEmployeeForm from './UpdateEmployeeForm';
function EditEmployee() {
  const [tableType, setTableType] = useState('Warehouse');
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
  const timeoutRef = useRef(null);
  const [ware_mgr, setWare_mgr] = useState([]);
  const [production_mgr, setProduction_mgr] = useState([]);
  const [delivery_mgr, setDelivery_mgr] = useState([]);
  const [supply_mgr, setSupply_mgr] = useState([]);
  const [selected, setSelected] = useState([]);
  const [employeeFormVisible, setEmployeeFormVisible] = useState(false);

  useEffect(() => {
    axios.get(`${baseurl}/users/admin/ware_mgr`)
    .then(res => {
        setWare_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    axios.get(`${baseurl}/users/admin/production_mgr`)
    .then(res => {
        setProduction_mgr(res.data);
    })
    .catch(err => { 
        console.log(err);
    })
    axios.get(`${baseurl}/users/admin/delivery_mgr`)
    .then(res => {
        setDelivery_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    axios.get(`${baseurl}/users/admin/supply_mgr`)
    .then(res => {
        setSupply_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
},[]);
const handleEdit = (item) => {
  setEmployeeFormVisible(prev=>!prev);
  setSelected(item);
}

const renderTable = (data) => (
  <table id='admin_table'>
    <thead>
      <tr>
        <th className='table-th'>ID</th>
        <th className='table-th'>Name</th>
        <th className='table-th'>NID</th>
        <th className='table-th'>Mobile No</th>
        <th className='table-th'>Password</th>
        <th className='table-th'>Joining Date</th>
        <th className='table-th'>Salary</th>
        <th className='table-th'></th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td className='table-td'>{item.id}</td>
          <td className='table-td'>{item.name}</td>
          <td className='table-td'>{item.nid}</td>
          <td className='table-td'>{item.mobile_no}</td>
          <td className='table-td'>{item.passwords}</td>
          <td className='table-td'>{item.joining_date.split('T')[0]}</td>
          <td className='table-td'>{item.salary}</td>
          <td className='table-td'>
              <button onClick={()=>handleEdit(item)} className='admin-btn'>Edit</button>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
);
const switchWarehouse = () => {
  setTableType('Warehouse');
}
const switchProduction = () => {
  setTableType('Production');
}
const switchDelivery = () => {
  setTableType('Delivery');
}
const switchSupply = () => {
  setTableType('Supply');
}
const renderTab=()=>{
  return(
    <div className='tab-container'>
        <button onClick={switchWarehouse} id={`${tableType==="Pending" ? "Pending":""}`}>Warehouse</button>
        <button onClick={switchProduction} id={`${tableType==="Processing" ? "Processing":""}`}>Production</button>
        <button onClick={switchDelivery} id={`${tableType==="Delivery-Pending" ? "Delivery-Pending":""}`}>Delivery</button>
        <button onClick={switchSupply} id={`${tableType==="Delivered" ? "Delivered":""}`}>Supply</button>
      </div>
  )
}
return (
  <div className='right-panel'>
  <div className='table-container2'>
  
    {tableType === 'Warehouse' && (
      <>
        <h2 className='heading'>Warehouse Managers</h2>
        {renderTab()}
        {renderTable(ware_mgr)}
      </>
    )}
    {tableType === 'Production' && (
      <>
        <h2 className='heading'>Production Managers</h2>
      {renderTab()}
        {renderTable(production_mgr)}
      </>
    )}
    {tableType === 'Delivery' && (
      <>
        <h2 className='heading'>Delivery Managers</h2>
      {renderTab()}
        {renderTable(delivery_mgr)}
      </>
    )}
    {tableType === 'Supply' && (
      <>
        <h2 className='heading'>Supply Managers</h2>
      {renderTab()}
        {renderTable(supply_mgr)}
      </>
    )}
<div className='extra-box2'></div>
  </div>
  {employeeFormVisible &&
  <UpdateEmployeeForm selected={selected} setEmployeeFormVisible={setEmployeeFormVisible}/>}
    </div>
);
}

export default EditEmployee
