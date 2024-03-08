import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Cart.css';
import { baseurl } from '../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/garbage-bin" title="garbage bin icons">Garbage bin icons created by Dragon Icons - Flaticon</a> */}
function Cart() {
  let { retailer_id } = useParams();
  
  //When I come back to this page from payment gateway, it doesn't get retailer_id from useParams
  //So, I have to get it from localStorage
  if (!retailer_id) {
    retailer_id = localStorage.getItem('retailer_id');
  } else {
    localStorage.setItem('retailer_id', retailer_id);
  }
  
  const [cartInfo, setCartInfo] = useState([]);
  const url=`${baseurl}/users/retailer/home/${retailer_id}/getCart`;
  const url2 = `${baseurl}/users/retailer/home/${retailer_id}/setCart`;
  
  
  useEffect(()=>{axios.get(url)
  .then(res => {
    console.log(res.data);
    setCartInfo(res.data);
  })
  .catch(err => {
    console.log(err);
  });},[]);
  useEffect(() => {

    window.onpopstate = () => {
      axios.post(url2, {cartInfo}).catch(err => console.log(err));
    };
  }, [url, url2, retailer_id, cartInfo]);
  
  const handleQtyChange = (e, product_id) => {
    const newCartInfo = cartInfo.map(item => 
      item.product_id === product_id ? {...item, qty: Number(e.target.value)} : item
      );
      setCartInfo(newCartInfo)
      // axios.post(url2, {cartInfo}).catch(err => console.log(err));
      // .then(() => {
        //   console.log(cartInfo);
        // });
      }   
      
      const handleRemove = (product_id) => {
        const newCartInfo = cartInfo.filter(item => item.product_id !== product_id);
        setCartInfo(newCartInfo);
        // axios.post(url2, {cartInfo}).catch(err => console.log(err));
  }

  const checkout =async()=>{
    try{
      const res=await fetch(`${baseurl}/users/retailer/home/${retailer_id}/create-payment-session`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({cartInfo})
      });
      const data= await res.json();
      window.location=data.url; 
      return data.url;
    }catch(err){
      console.log(err);
    }
    return "";
  }

  const handlePlaceOrder = () => {
    if (cartInfo.length === 0) {
      alert('Your cart is empty😞');
    } else {
      // const url=checkout();
      // if(url===`${baseurl}/users/retailer/home/${retailer_id}/success`){
        console.log("sda");
        axios.post(`${baseurl}/users/retailer/home/${retailer_id}/placeOrder`, {cartInfo})
        .then(res => {
          console.log(res.data);
          if (res.data === 'Order placed successfully') {
            alert('Order placed successfully');
            setCartInfo([]);
          } else {
            alert('Order could not be placed');
          }
        })
        .catch(err => {
          console.log(err);
        });
      // }
    }
  }

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};


  return (
      <>
      <div className='title-container'>
      <div className='heading'>🛒 Your Cart</div>
      <div className='order-btn-container'>
        <button className='order-btn btn' onClick={handlePlaceOrder}>Place Order</button>
      </div>
      </div>
    <div className='cart-info-container'>
    {cartInfo.length === 0 ? (
  <div className='empty-cart'>Your cart is empty😞</div>
) : (
  cartInfo.map((cart) => (
    <div key={cart.product_id} className='cart-row-container'>
      <div className='cart-image-container'><img src={`/public/products/${cart.picture1}.png`}/></div>
      <div className='cart-name'>{cart.name}</div>
      <div className='cart-total-price'>
        <span><b>Total price: </b></span>
        {numberWithCommas(cart.unit_price * cart.qty)} BDT
      </div>
      <div className='cart-qty-container'>
        <input type="number" value={cart.qty} onChange={(e) => handleQtyChange(e, cart.product_id)} />
      </div>
      <button onClick={() => handleRemove(cart.product_id)} className='cart-btn'>
        <img src='/public/delete.png' className='cart-del-icon'/>
      </button>
    </div>
  ))
)}
    </div>
      </>
  )
}

export default Cart;