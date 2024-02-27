import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
{/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a> */}
function Profile() {
    const { mgr_id } = useParams();
    const [data,setData]=useState([]);
    const url=`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/profile`;
    
    useEffect(() => {
        axios.get(url)
        .then(res => {
            setData(res.data);
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [url]);
  return (
    <>
    <div className='profile-picture-container'>
    <div className='profile-picture'>
        <img className='pp' src="/public/profile.png"/>
    </div>
    </div>
    <div className='info-card'>
    {data.map((item) => {
        return (
            <table className='data' key={item.id}>
                <tbody>
                <tr>
                    <th className='profile-th'>ID</th>
                    <td className='profile-td'>{item.id}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Name</th>
                    <td className='profile-td'>{item.name}</td>
                </tr>
                <tr>
                    <th className='profile-th'>NID</th>
                    <td className='profile-td'>{item.nid}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Warehouse ID</th>
                    <td className='profile-td'>{item.warehouse_id}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Designation</th>
                    <td className='profile-td'>{item.designation}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Joining Date</th>
                    <td className='profile-td'>{item.joining_date}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Mobile</th>
                    <td className='profile-td'>{item.mobile_no}</td>
                </tr>
                </tbody>
            </table>
        );
    })}
</div>
                </>
  )
}

export default Profile

