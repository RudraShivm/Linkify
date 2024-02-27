import {React, useEffect, useState} from 'react'
import axios from 'axios';
import { Link,useParams } from 'react-router-dom';
import TypingEffect from './TypingEffect';
import './Products.css';
{/* <a href="https://www.flaticon.com/free-icons/truck" title="truck icons">Truck icons created by Pixel perfect - Flaticon</a> */}
function Products() {
    const {retailer_id}=useParams();
    const [products, setProducts] = useState([]);
    const url=`http://localhost:3000/users/retailer/home/${retailer_id}/products`;
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};

    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);
    useEffect(() => {
        axios.get(url)
        .then(res => {
            setProducts(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [url]);
    // <a href='https://pngtree.com/freepng/clock-icon-design_4273164.html'>png image from pngtree.com/</a>
    // https://guillaumekurkdjian.com/
    return (
    <>
    <div className='welcome-section'>
        <div>
            {/* <div className='box'></div> */}
            <div className='home-heading'>Linkify</div>
            <div className='sub-heading'>
            <span className='brace'>&#10100;</span><TypingEffect/><span className='brace'>&#10101;</span>
            </div>
        </div>
        <div className='home-img'>
            <img src='/public/industry.gif'/>
        </div>
    </div>
    <div className='heading'>Products</div>
    <div className='product-list-container'>
      {products.map((product) => {
          return(
              <Link key={product.id} to={`/user/retailer/home/${retailer_id}/products/${product.id}`}>
            <div className='product-card'>
                <img src={`/public/products//${product.picture3}.png`} className='products-thumbnail'/>
                <div className='products-thumbnail-name'>{product.name}</div>
                <div className='products-thumbnail-add-container'>
                <img src='/public/delivery-truck.png' className='delivery-icon'/>
                <p className='products-thumbnail-unit_price'>{numberWithCommas(Number(product.unit_price))} BDT</p>
                <p className='products-thumbnail-min_del_time'>{product.minimum_delivery_time} days</p>
                </div>
            </div>
            </Link>
        );
    }
    )}
    </div>
    </>
  )
}

export default Products
