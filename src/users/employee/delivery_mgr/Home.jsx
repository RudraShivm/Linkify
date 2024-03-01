import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
{/* <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Uniconlabs - Flaticon</a> */}
const Home = () => {
    const { mgr_id } = useParams();
    const [isScrolled, setIsScrolled] = useState(false);
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
  const url=`/user/employee/delivery_mgr/home/${mgr_id}/dashboard`
  const url1=`/user/employee/delivery_mgr/home/${mgr_id}/profile`
  const url2=`/user/employee/delivery_mgr/home/${mgr_id}/orders`

    return (
        <div className='employee-body'>
        <div className={`link-Container ${isScrolled ? 'scrolled' : ''}`}>
            <Link to={url} className='navlink'>Dashboard</Link>
            <Link to={url2} className='navlink'>Orders</Link>
            <Link to={url1} className='navlink'>Profile</Link>
            <Link to="/" className='navlink logout-container'>
                <img className='logout' src='/logout.png'/>
            </Link>
        </div>
        <Outlet/>
        
        </div>
    );
};

export default Home;
