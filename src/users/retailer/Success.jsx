import React from 'react'
import './Success.css'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
{/* <a href="https://www.flaticon.com/free-icons/success" title="success icons">Success icons created by Talha Dogar - Flaticon</a> */}
function Success() {
    const { retailer_id } = useParams();    
  return (
    <div className='success-container'>
      <img src='/public/success.png' className='success-icon'/>
      <div className='success-msg'>Payment Successful !!</div>
      <div className='success-redirect-btn-container'>
        <Link to={`/user/retailer/home/${retailer_id}/products/`}> 
        <button className='success-redirect-btn' onClick={()=>{}}>Go To Home</button>
        </Link>
      </div>
    </div>
  )
}

export default Success
