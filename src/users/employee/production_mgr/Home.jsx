import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useParams,useNavigate, Routes, Route } from 'react-router-dom';
import NotificationComponent from './Notification';
import Stock from './Stock';
import InvoiceForm from './InvoiceForm';
{/* <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Uniconlabs - Flaticon</a> */}
const Home = () => {
    const { mgr_id } = useParams();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const toggleVisibility = () => { 
      setVisible(!visible);
    }
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

  const navigateProductStock = () => {
    navigate(`/user/employee/production_mgr/home/${mgr_id}/product_stock`)
  }

  const url=`/user/employee/production_mgr/home/${mgr_id}/dashboard`
  const url1=`/user/employee/production_mgr/home/${mgr_id}/product_stock`
  const url3=`/user/employee/production_mgr/home/${mgr_id}/report_production`
  const url4=`/user/employee/production_mgr/home/${mgr_id}/warehouse_requests`
    const url5=`/user/employee/production_mgr/home/${mgr_id}/factory_requests`
    const url6=`/user/employee/production_mgr/home/${mgr_id}/submit_factory_requests`
    const toggleNotification = () => { 
      setShowNotification(!showNotification);
    };
    const resetNotification = () => {
      setShowNotification(false);
    }
    return (
        <div className='employee-body'>
        <div className={`link-Container ${isScrolled ? 'scrolled' : ''}`}>
            <Link to={url} onClick={()=>{resetNotification();setVisible(false)}} className='navlink'>Dashboard</Link>
            <Link to="#" onClick={()=>{resetNotification();toggleVisibility()}} className='navlink'>Stock</Link>
            <Link to={url3} onClick={()=>{resetNotification();setVisible(false)}} className='navlink'>Report Production</Link>
            <Link to={url4} onClick={()=>{resetNotification();setVisible(false)}} className='navlink'>Warehouse Requests</Link>
            <Link to={url5} onClick={()=>{resetNotification();setVisible(false)}} className='navlink'>Factory Requests</Link> 
            <Link to={url6} onClick={()=>{resetNotification();setVisible(false)}} className='navlink'>Submit Request</Link> 
            <Link to="#" onClick={()=>{toggleNotification();setVisible(false)}} className='navlink noti-icon'>
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
        <Stock visible={visible} setVisible={setVisible} navigateProductStock={navigateProductStock}/>
        <Outlet/>
        
        </div>
    );
};

export default Home;
