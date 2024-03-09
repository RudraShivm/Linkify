import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import './Login.css';
import { baseurl } from '../baseurl';
function Login() {
  const navigate = useNavigate();
  const [mgr_id, setMgr_id] = useState(localStorage.getItem('mgr_id') || '');
  const [mgr_pass, setMgr_pass] = useState(localStorage.getItem('mgr_pass') || '');
  const [remember, setRemember] = useState(false);
  const url=`${baseurl}/users/employee/supply_mgr/${mgr_id}/password`;

  useEffect(() => {
    if (remember) {
      localStorage.setItem('mgr_id', mgr_id);
      localStorage.setItem('mgr_pass', mgr_pass);
    } else {
      localStorage.removeItem('mgr_id');
      localStorage.removeItem('mgr_pass');
    }
  }, [remember, mgr_id, mgr_pass]);

  function handleSubmit(event){
    event.preventDefault();
    axios.get(url)
    .then(res => {
      console.log((res));
      const data = res.data;
      let flag = 0;
      data.forEach((item) => {
        if (item.passwords === mgr_pass) {
          flag = 1;
        }
      });
      if(flag === 1){
        navigate(`/user/employee/supply_mgr/home/${mgr_id}`);
        navigate(`/user/employee/supply_mgr/home/${mgr_id}/factory_requests`);
      }else{
        alert("Wrong Password");
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <LoginForm handleSubmit={handleSubmit} mgr_id={mgr_id} setMgr_id={setMgr_id} mgr_pass={mgr_pass} setMgr_pass={setMgr_pass} remember={remember} setRemember={setRemember}/>
  );
}

export default Login;