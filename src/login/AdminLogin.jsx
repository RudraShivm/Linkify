import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import {baseurl} from '../baseurl';
function AdminLogin() {
    const [admin_id, setAdmin_id] = React.useState('');
    const [secret, setSecret] = React.useState([]);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
      event.preventDefault();
      axios.get(`${baseurl}/users/admin/${admin_id}/password`)
      .then(response => {
        if(response.data.length === 0){
          alert('Invalid admin_id');
        }else{
            navigate(`/admin/${admin_id}/home`);
        }
      })
    }
  return (
    <div className='admin-page-container'>
      <form className='login-form' onSubmit={handleSubmit} method="get">
        <input type="text" value={admin_id} placeholder='admin_id' onChange={(e) => setAdmin_id(e.target.value)}/>
        <input type="password" value={secret} placeholder='secret' onChange={(e) => setSecret(e.target.value)}/>
        <button className='login-submit' type="submit">Login</button>
      </form>
    </div>
  )
}

export default AdminLogin
