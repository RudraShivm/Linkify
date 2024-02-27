import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [mgr_id, setMgr_id] = useState(localStorage.getItem('mgr_id') || '');
  const [mgr_pass, setMgr_pass] = useState(localStorage.getItem('mgr_pass') || '');
  const [remember, setRemember] = useState(false);
  const url=`https://linkify-swart.vercel.app/users/employee/warehouse_mgr/${mgr_id}/password`;

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
      const data = res.data;
      let flag = 0;
      data.forEach((item) => {
        if (item.passwords === mgr_pass) {
          flag = 1;
        }
      });
      if(flag === 1){
        navigate(`/user/employee/warehouse_mgr/home/${mgr_id}`);
        navigate(`/user/employee/warehouse_mgr/home/${mgr_id}/dashboard`);
      }else{
        alert("Wrong Password");
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
      <form onSubmit={handleSubmit} method="get" className="login-form">
        <input type="text" value={mgr_id} onChange={(e) => setMgr_id(e.target.value)}/>
        <input type="password" value={mgr_pass} onChange={(e) => setMgr_pass(e.target.value)}/>
        <label className='rempass'>
          <input  type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
          Remember Password
        </label>
        <button className="login-submit" type="submit">Login</button>
      </form>
  );
}

export default Login;