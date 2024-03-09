import React from 'react';
import { Link,Outlet } from 'react-router-dom';
import './Home.css';
function Home() {

  return (
    <div className='admin-container'>
      <Link to="/" className='navlink logout-container' id='admin-logout-btn'>
          <img className='logout' src='/logout.png'/>
      </Link>
      <div className='pseudo-side-panel'></div>
      <div className='side-panel'>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <Link to={`create_employee`}>Create Employee</Link>
          </li>
          <li>
            <Link to={`edit_employee`}>Edit Employee</Link>
          </li>
          <li>
            <Link to={`create_product`}>Update Product</Link>
          </li>
        </ul>
      </div>
      <Outlet/>
    </div>
  );
}

export default Home;