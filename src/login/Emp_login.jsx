import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Link, useNavigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ProductionLogin from "./ProductionLogin.jsx";
import WarehouseLogin from "./WarehouseLogin.jsx";
import DeliveryLogin from "./DeliveryLogin.jsx";
import SupplyLogin from "./SupplyLogin.jsx";
function Emp_login({callbackfn}){
  const navigate = useNavigate();
  const[clickState,setClickState]=React.useState(0);
  function toggleClickState(){
    setClickState(clickState+1);
  }
  useEffect(() => {
    // Reset the animation when the back button is clicked
    window.onpopstate = () => {
      setClickState(false);
      callbackfn(0);
    };

    // Reset the animation when the page is reloaded
    window.onload = () => {
      setClickState(false);
      navigate('/user/retailer');
    };
  }, [callbackfn,navigate,clickState]);

  return (
    <div className="Emp-login">
      <div className={`login-col2 ${clickState==1 ? "active" : "inactive"}`}>
        <Link to='warehouse_mgr' onClick={toggleClickState}> Login as Warehouse Manager</Link>
        <Link to='production_mgr' onClick={toggleClickState}> Login as Production Manager</Link>
        <Link to='delivery_mgr' onClick={toggleClickState}> Login as Delivery Manager</Link>
        <Link to='supply_mgr' onClick={toggleClickState}> Login as Supply Manager</Link>
        </div>
        <div className="login-col3">
        <Routes>
          <Route path='warehouse_mgr' element={<WarehouseLogin/>}></Route>
          <Route path='production_mgr' element={<ProductionLogin/>}></Route>
          <Route path='delivery_mgr' element={<DeliveryLogin/>}></Route>
          <Route path='supply_mgr' element={<SupplyLogin/>}></Route>
        </Routes>
      </div>
    </div>
  );
}
Emp_login.propTypes = {
  callbackfn: PropTypes.func.isRequired,
};
export default Emp_login;