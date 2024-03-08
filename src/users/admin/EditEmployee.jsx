import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import "./EditEmployee.css";
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
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/users/admin/ware_mgr`)
    .then(res => {
        setWare_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    axios.get(`http://localhost:3000/users/admin/production_mgr`)
    .then(res => {
        setProduction_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    axios.get(`http://localhost:3000/users/admin/delivery_mgr`)
    .then(res => {
        setDelivery_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
    axios.get(`http://localhost:3000/users/admin/supply_mgr`)
    .then(res => {
        setSupply_mgr(res.data);
    })
    .catch(err => {
        console.log(err);
    })
},[]);
const handleEdit = (item) => {
  setEditData(item);
};

const handleInputChange = (event) => {
  setEditData({
    ...editData,
    [event.target.name]: event.target.value
  });
};
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
              <button onClick={() => handleEdit(item)}>Edit</button>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
);

return (
  <div className='right-panel'>
  <div className='table-container2'>
    {tableType === 'Warehouse' && (
      <>
        <h2 className='heading'>Warehouse Managers</h2>
        {renderTable(ware_mgr)}
      </>
    )}
    {tableType === 'Production' && (
      <>
        <h2 className='heading'>Production Managers</h2>
        {renderTable(production_mgr)}
      </>
    )}
    {tableType === 'Delivery' && (
      <>
        <h2 className='heading'>Delivery Managers</h2>
        {renderTable(delivery_mgr)}
      </>
    )}
    {tableType === 'Supply' && (
      <>
        <h2 className='heading'>Supply Managers</h2>
        {renderTable(supply_mgr)}
      </>
    )}
<div className='extra-box2'></div>
  </div>
  {editData && (
        <form>
          <label>
            Name:
            <input type="text" name="name" value={editData.name} onChange={handleInputChange} />
          </label>
          {/* Add more input fields for other properties... */}
          <button type="submit">Save Changes</button>
        </form>
      )}
    </div>
);
}

export default EditEmployee
