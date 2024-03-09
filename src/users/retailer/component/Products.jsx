import {React, useEffect, useState} from 'react'
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import TypingEffect from './TypingEffect';
import Lottie from 'lottie-react';
import animationData from './../../../../public/Animation - 1709300997815.json';
import './Products.css';
import { InfinitySpin } from 'react-loader-spinner';
import { baseurl } from '../../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/truck" title="truck icons">Truck icons created by Pixel perfect - Flaticon</a> */}
function Products() {
    const {retailer_id}=useParams();
    const [products, setProducts] = useState([]);
    const url=`${baseurl}/users/retailer/home/${retailer_id}/products`;
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};

        useEffect(() => {
            axios.get(url)
              .then(res => {
                setProducts(res.data);
                return res.data;
              })
              .then((data) => {
                const promises = data.map((product) => {
                  return axios.get(`${baseurl}/users/pic3/${product.id}`, { responseType: 'arraybuffer' })
                    .then(res => {
                      if (res.data !== "No image found") {
                        const blob = new Blob([res.data], { type: 'image/png' });
                        const imageUrl = URL.createObjectURL(blob);
                        setImages(prev => { return [...prev, imageUrl] });
                      }
                    })
                });
          
                return Promise.all(promises);
              })
              .then(() => {
                setIsLoading(false);
              })
              .catch(err => {
                console.log(err);
              })
          }, [url, products]);
    
    // <a href='https://pngtree.com/freepng/clock-icon-design_4273164.html'>png image from pngtree.com/</a>
    // https://guillaumekurkdjian.com/
    return (
    <>
        {isLoading ? (<div className='loading'>
        <InfinitySpin
  visible={true}
  width="200"
  color="#4fa94d"
  ariaLabel="infinity-spin-loading"
  />
        </div>):(
            <>
    <div className='welcome-section'>
        <div>
            {/* <div className='box'></div> */}
            <div className='home-heading'>Linkify</div>
            <div className='sub-heading'>
            <span className='brace'>&#10100;</span><TypingEffect/><span className='brace'>&#10101;</span>
            </div>
        </div>
        <div className='lottie'>
        <Lottie animationData={animationData}/>
        </div>
    </div>
    <div className='heading'>Products</div>
    <div className='product-list-container'>
      {products.map((product,index) => {
          return(
              <Link key={product.id} to={`/user/retailer/home/${retailer_id}/products/${product.id}`}>
            <div className='product-card'>
                <img src={images[index]} className='products-thumbnail'/>
                <div className='products-thumbnail-name'>{product.name}</div>
                <div className='products-thumbnail-add-container'>
                <img src='/delivery-truck.png' className='delivery-icon'/>
                <p className='products-thumbnail-unit_price'>{numberWithCommas(Number(product.unit_price))} BDT</p>
                <p className='products-thumbnail-min_del_time'>{product.minimum_delivery_time} days</p>
                </div>
            </div>
            </Link>
        );
    }
    )}
    </div>
    </>)}
    </>
  )
}

export default Products
