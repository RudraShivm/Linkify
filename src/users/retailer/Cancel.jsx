import React from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Cancel() {
    const { retailer_id } = useParams();    
    return (
      <div className='success-container'>
        <img src='/payment.png' className='success-icon'/>
        <div className='success-msg'>Payment Failed 😥!!</div>
        <div className='success-redirect-btn-container'>
          <Link to={`/user/retailer/home/${retailer_id}/cart/`}>
          <button className='success-redirect-btn'>Go To Cart</button>
          </Link>
        </div>
      </div>
    )
}

export default Cancel
