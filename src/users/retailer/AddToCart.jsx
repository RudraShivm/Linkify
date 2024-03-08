import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddToCart.css';
import { baseurl } from '../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/shopping-cart" title="shopping cart icons">Shopping cart icons created by Pixel perfect - Flaticon</a> */}
function AddToCart({cartVisible,toggleAddToCart, visibleStatefn,setBannerVisible,setBannerinfo}) {
    const navigate = useNavigate();
    const {retailer_id}=useParams();
    const [qty, setQty] = useState(0);
    const {product_id}=useParams();
    const [cart, setCart] = useState([]);
    const timeoutRef = useRef(null);
    function handleQtyChange (value) {
        setQty(value);
    }
    useEffect(() => {
        axios.get(`${baseurl}/users/retailer/home/${retailer_id}/products/${product_id}/queryCart`)
        .then(res => {
            setCart(res.data);
        })
        .catch(err => {
            console.log(err);
        })
        
        window.onpopstate = () => {
            toggleAddToCart();
            navigate(`/user/retailer/home/${retailer_id}/products`);
        };
        
      
    }, [retailer_id, product_id, cart, navigate, toggleAddToCart]);
    function handleSubmit(e){
        e.preventDefault();
        const postobj = {
            qty: qty,
        }
            if(cart.length>0){
                console.log('Product already in cart');
                axios.post(`${baseurl}/users/retailer/home/${retailer_id}/products/${product_id}/updateCart`, postobj)
                .then(() => {
                        console.log('Updated Cart Successfully!');
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }
                        setBannerVisible(true);
                        setBannerinfo('Updated Cart Successfully!');
                        timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                    })
                    .catch(err => {
                            console.log(err);
                        })
                    }else{
                console.log('Product already not in cart');
                axios.post(`${baseurl}/users/retailer/home/${retailer_id}/products/${product_id}/addToCart`, postobj)
                .then(() => {
                    console.log('Added To Cart Successfully!');
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    setBannerVisible(true);
                    setBannerinfo('Added To Cart Successfully!');
                    timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
                })
                .catch(err => {
                    console.log(err);
                })
            }   
    }
    return (
    <div className={`Add-to-Cart-container ${visibleStatefn(cartVisible)}`}>
        <form onSubmit={handleSubmit}>
       <input className='Add-to-Cart-input' type="number" value={qty} onChange={(e) => handleQtyChange(e.target.value)} min="1" />
        <div className='Add-to-Cart-btn-container'></div>
        <button className='Add-to-Cart-btn btn' type="submit">Add to Cart</button>
        </form>
    </div>
  )

}
AddToCart.propTypes = {
    visibleStatefn: PropTypes.func.isRequired,
    toggleAddToCart: PropTypes.func.isRequired,
    setBannerVisible: PropTypes.func.isRequired,
    setBannerinfo: PropTypes.func.isRequired,
    cartVisible: PropTypes.number.isRequired,
};

export default AddToCart
