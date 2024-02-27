import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import './Home.css';
import NotificationComponent from './Notification';
{/* <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Uniconlabs - Flaticon</a> */}
const Home = () => {
    const { mgr_id } = useParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY || window.scrollTo || document.getElementsByTagName("html")[0].scrollTop;
      setIsScrolled(scrollPos > 0 ? true : false);
    };

    window.addEventListener("scroll", onScroll);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const url=`/user/employee/warehouse_mgr/home/${mgr_id}/dashboard`
  const url1=`/user/employee/warehouse_mgr/home/${mgr_id}/profile`
  const url2=`/user/employee/warehouse_mgr/home/${mgr_id}/orders`
  const url3=`/user/employee/warehouse_mgr/home/${mgr_id}/warehouse_stock`
  const url4=`/user/employee/warehouse_mgr/home/${mgr_id}/Invoice`
    const url5=`/user/employee/warehouse_mgr/home/${mgr_id}/ware_req/*`
    const url6=`/user/employee/warehouse_mgr/home/${mgr_id}/submit_ware_req`
    const toggleNotification = () => { 
      setShowNotification(!showNotification);
    };
    const resetNotification = () => {
      setShowNotification(false);
    }
    return (
        <div className='employee-body'>
        <div className={`link-Container ${isScrolled ? 'scrolled' : ''}`}>
            <Link to={url} onClick={resetNotification} className='navlink'>Dashboard</Link>
            <Link to={url1} onClick={resetNotification} className='navlink'>Profile</Link>
            <Link to={url2} onClick={resetNotification} className='navlink'>Orders</Link>
            <Link to={url3} onClick={resetNotification} className='navlink'>Warehouse Stock</Link>
            <Link to={url4} onClick={resetNotification} className='navlink'>Make Invoice</Link>
            <Link to={url5} onClick={resetNotification} className='navlink'>Warehouse Request</Link>
            <Link to={url6} onClick={resetNotification} className='navlink'>Submit Ware Request</Link>
            <Link to="#" onClick={toggleNotification} className='navlink noti-icon'>
              🔔
            </Link>
            <Link to="/" className='navlink logout-container'>
                <img className='logout' src='/logout.png'/>
            </Link>
        </div>
        <div className='notification-panel'>
        {showNotification && 
        <>
        <div className='overlay'></div>
        <NotificationComponent />
        </>
        } 
        </div>
        <Outlet/>
        
        </div>
    );
};

export default Home;
