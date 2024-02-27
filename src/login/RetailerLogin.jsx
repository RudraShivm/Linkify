import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [retailer_id, setRetailer_id] = useState(localStorage.getItem('retailer_id') || '');
  const [retailer_pass, setRetailer_pass] = useState(localStorage.getItem('retailer_pass') || '');
  const [remember, setRemember] = useState(false);
  const url=`http://localhost:3000/users/retailer/${retailer_id}/password`;

  useEffect(() => {
    if (remember) {
      localStorage.setItem('retailer_id', retailer_id);
      localStorage.setItem('retailer_pass', retailer_pass);
    } else {
      localStorage.removeItem('retailer_id');
      localStorage.removeItem('retailer_pass');
    }
  }, [remember, retailer_id, retailer_pass]);

  function handleSubmit(event){
    event.preventDefault();
    axios.get(url)
    .then(res => {
      const data = res.data;
      let flag = 0;
      data.forEach((item) => {
        if (item.passwords === retailer_pass) {
          flag = 1;
        }
      });
      if(flag === 1){
        navigate(`/user/retailer/home/${retailer_id}`);
        navigate(`/user/retailer/home/${retailer_id}/products`);
      }else{
        alert("Wrong Password");
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      <form className='login-form' onSubmit={handleSubmit} method="get">
        <input type="text" value={retailer_id} onChange={(e) => setRetailer_id(e.target.value)}/>
        <input type="password" value={retailer_pass} onChange={(e) => setRetailer_pass(e.target.value)}/>
        <label className='rempass'>
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
          Remember Password
        </label>
        <button className='login-submit' type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;