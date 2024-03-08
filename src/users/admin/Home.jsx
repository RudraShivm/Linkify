import React from 'react';
import { Link,Outlet } from 'react-router-dom';
import './Home.css';
function Home() {

  return (
    <div className='admin-container'>
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
            <Link to={`statistics`}>Statistics</Link>
          </li>
          <li>
            <Link to={`create_product`}>Create Product</Link>
          </li>
        </ul>
      </div>
      <Outlet/>
    </div>
  );
}

export default Home;