import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Stock.css'
function Stock({visible,setVisible}) {
  return (
    <div>
      <div className={`stock-menu ${visible?"visible":"not-visible"}`}>
        <Link to="product_stock" className='option-1' onClick={()=>{setVisible(false)}}>
        <div>Product Stock</div>
        </Link>
        <Link to="raw_stock" className='option-2' onClick={()=>{setVisible(false)}}>
        <div>Raw Stock</div>
        </Link>
      </div>
    </div>
  )
}

Stock.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func
}
export default Stock
