import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { baseurl } from '../../baseurl';
import UpdateProduct from './UpdateProduct';

function CreateProduct() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [productFormVisible, setProductFormVisible] = useState(false);
  useEffect(() => {
    axios.get(`${baseurl}/users/admin/products`)
    .then(res => {
        setProducts(res.data);
    })
    .catch(err => {
        console.log(err);
    })
} ,[]);
const handleEdit = (item) => {
  setProductFormVisible(prev=>!prev);
  setSelected(item);
}

  return (
    <div className='right-panel'>
      <div className='table-container2'>
      <h1 className='heading'>Products</h1>
      <table id='admin_table'>
    <thead>
      <tr>
        <th className='table-th'>ID</th>
        <th className='table-th'>Name</th>
        <th className='table-th'>Model</th>
        <th className='table-th'>Series</th>
        <th className='table-th'>Description</th>
        <th className='table-th'>Unit Price</th>
        <th className='table-th'>Min.Delivery Time</th>
        <th className='table-th'></th>
      </tr>
    </thead>
    <tbody>
      {products.map((item) => (
        <tr key={item.id}>
          <td className='table-td'>{item.id}</td>
          <td className='table-td'>{item.name}</td>
          <td className='table-td'>{item.model}</td>
          <td className='table-td'>{item.series}</td>
          <td className='table-td'>{item.description.substring(0,15)+"..."}</td>
          <td className='table-td'>{item.unit_price}</td>
          <td className='table-td'>{item.minimum_delivery_time}</td>
          <td className='table-td'>
              <button onClick={()=>handleEdit(item)} className='admin-btn'>Edit</button>
            </td>
        </tr>
      ))}
    </tbody>
  </table>
      </div>
      <div className='extra-box2'></div>
      {productFormVisible &&
      <UpdateProduct selected={selected} setProductFormVisible={setProductFormVisible}/>}
    </div>
  );
}

export default CreateProduct
