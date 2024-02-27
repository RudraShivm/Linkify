import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Orders.css';

{/* <a href="https://www.flaticon.com/free-icons/time-management" title="time management icons">Time management icons created by kmg design - Flaticon</a> */}
function Orders() {
  const { retailer_id } = useParams();
  const [orderID, setOrderID] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [productModel, setProductModel] = useState({});
  const [invoiceInfo, setInvoiceInfo] = useState({});
  useEffect(() => {
    axios.get(`http://localhost:3000/users/retailer/home/${retailer_id}/ordersID`)
    .then(res => {
      setOrderID(res.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, [retailer_id]);

  useEffect(() => {
    if (!orderID.length) return;

    const fetchOrderInfoAndProductNames = async () => {
      const newProductNames = {};
      const newProductModel = {};
      const newOrderInfo = [];
      const invoiceInfo = {};
      for (let i = 0; i < orderID.length; i++) {
        const res = await axios.get(`http://localhost:3000/users/retailer/home/${retailer_id}/orders/${orderID[i].id}`);
        newOrderInfo.push(res.data);
        const invoice = await axios.get(`http://localhost:3000/users/retailer/home/${retailer_id}/orders/${orderID[i].id}/invoice`);
        invoiceInfo[orderID[i].id]=invoice.data;

        for (const item of res.data) {
          const res = await axios.get(`http://localhost:3000/users/retailer/home/${retailer_id}/products/${item.product_id}`);
          newProductNames[item.id] = res.data[0].name;
          newProductModel[item.id] = res.data[0].model;
        }
      }

      setOrderInfo(newOrderInfo);
      setProductNames(newProductNames);
      setProductModel(newProductModel);
      setInvoiceInfo(invoiceInfo);
    };

    fetchOrderInfoAndProductNames();
  }, [retailer_id, orderID]);

  return (
    <>
      <div className='title-container'>
        <div className='heading'>📋 Your Orders</div>
      </div>
      <div className='cart-info-container'>
        {orderID.length === 0 ? (
          <div className='empty-cart'>You have no orders yet</div>
        ) : (
          orderID.map((item, index) => (
            <div key={index} className='cart-row-container' id='order-row-container'>
              <div><b><i>Order ID:</i></b> {item.id}</div>
              <div className='order-details'>
                {orderInfo[index] && orderInfo[index].map((item, index) => (
                  <div key={`${item.id}-${index}`} className='order-name-model-container'>
                    <div className='order-item-qty'>{item.qty} X</div>
                    <div className='order-item-name'>{productNames[item.id]} ({productModel[item.id]})</div>
                  </div>
                ))}
              </div>
              <div className='order-item-exp-delivery-date'>
                {orderInfo[index] &&
                <>
                <img src='/public/save-time.png' className=''/>
                {(`${orderInfo[index][0]?.exp_delivery_date}`).split('T')[0]}
                </>
                } 
              </div>
                <div className={`order-item-status `}>
                {orderInfo[index] && <div className={`${orderInfo[index][0].status}`}>
                {orderInfo[index][0].status}
                </div>}
                </div>
              <div className={`order-invoice-container ${invoiceInfo[item.id] && invoiceInfo[item.id].length ==0 ? "not-available" : "available"}`}>
                <div>invoice</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Orders;