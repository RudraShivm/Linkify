import React, { useEffect } from "react";
import { Link, Outlet, Routes,Route,useNavigate } from "react-router-dom";
import "./App.css";
import Emp_login from "./Emp_login";
import RetailerLogin from "./RetailerLogin";
import Lottie from "lottie-react";
import animationData from "./../../public/laptop.json";
import AdminLogin from "./AdminLogin";
function Main_login() {
  const [clickState, setClickState] = React.useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    // Reset the animation when the back button is clicked
    window.onpopstate = () => {
      setClickState(0);
    };

    // Reset the animation when the page is reloaded
    window.onload = () => {
      setClickState(0);
    };
  }, [clickState]);

  function clickStatefn(clickState){
    if(clickState===1){
      return "retailer-clicked";
    }
    else if(clickState===2){
      return "emp-clicked";
    }
    else{
      return "none-clicked";
    }
  }

  return (
    <div className="Main-login-container">
      <div className="lottie-main">
      <Lottie animationData={animationData}/>
      </div>
      <div className="heading-container">
        <Link to="/" onClick={()=>setClickState(0)}>
        <p className={`site-heading ${clickStatefn(clickState)}`}>Linkify</p>
        </Link>
      </div>
        <div className="Main-login" >
        <div className={`login-col1 ${clickStatefn(clickState)}`} >
        <Link to='user/retailer' onClick={()=>setClickState(1)}> Login as Retailer</Link>
        <Link to='user/employee' onClick={()=>setClickState(2)}> Login as Employee</Link>
        <Link to='/admin' onClick={()=>setClickState(2)}> Login as Admin</Link>
        </div>
        <Routes>
          <Route path="user/employee/*" element={<Emp_login callbackfn={setClickState}/>}></Route>
          <Route path="user/retailer/*" element={<RetailerLogin/>}></Route>
        </Routes>
      <Outlet />
        </div>
    </div>
  );
}

export default Main_login;