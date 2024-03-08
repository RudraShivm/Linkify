import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Product.css';
import { baseurl } from '../../../baseurl';

function Product() {
    const  navigate  = useNavigate();
    const {product_id}=useParams();
    const {mgr_id}=useParams();
    const[data,setData]=useState([]);

    const url=`${baseurl}/users/employee/products/${product_id}`;
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(url)
        .then(res => { 
            setData(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [url, navigate, mgr_id, product_id]);


    return (
      <>
    <div className='product-container'>
        <div className='product-image-container'>
      <img src={`/public/products/${data[0]?.picture1}.png`} className='product-details-image'/>
        </div>
      <div className='product-details-container'>
        <p id='product-details-title'>{data[0]?.name}</p>
        <p><b>Model :</b> {data[0]?.model}</p>
        <p><b>Series :</b> {data[0]?.series}</p>
        <p><b>Unit Price :</b> {numberWithCommas(Number(data[0]?.unit_price))} BDT</p>
        <p><b>Minimum Delivery Date :</b> {data[0]?.minimum_delivery_time} days</p>
      </div>
    </div>
    <div className='product-desc-container'>
      <div className='product-desc-heading'>Product Description</div>
      <div className='product-desc'>
        {data[0]?.description}
        </div>
    </div>
    <div className='photo-container'>
    <img src={`/public/products/${data[0]?.picture2}.png`} className='product-details-image'/>
    </div>
      </>
  )
}

export default Product
