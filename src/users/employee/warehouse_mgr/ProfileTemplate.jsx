import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { baseurl } from '../../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/user" title="user icons">User icons created by Freepik - Flaticon</a> */}
function ProfileTemplate({mgr_id,designation}) {
    const [data,setData]=useState([]);
    const url=`${baseurl}/users/employee/${designation}/${mgr_id}/profile`;
    const [image,setImage]=useState([]);
    useEffect(() => {
        axios.get(url)
        .then(res => {
            setData(res.data);
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
        axios.get(`${baseurl}/users/profile/pic/${designation}/${mgr_id}`, { responseType: 'arraybuffer' })
        .then(res => {
            if(res.data!== "No image found"){
            const blob = new Blob([res.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setImage(prev=>{return [...prev,imageUrl]});
            }
        })
        .catch(err => {
            console.log(err);
        })
    }, [url,designation,mgr_id]);
  return (
    <>
    <div className='profile-picture-container'>
    <div className='profile-picture'>
        <img className='pp' src={image[0]}/>
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
                {
                    item.warehouse_id &&
                    <tr>
                    <th className='profile-th'>Warehouse ID</th>
                    <td className='profile-td'>{item.warehouse_id}</td>
                    </tr>
                }
                
                <tr>
                    <th className='profile-th'>Designation</th>
                    <td className='profile-td'>{item.designation}</td>
                </tr>
                <tr>
                    <th className='profile-th'>Joining Date</th>
                    <td className='profile-td'>{item.joining_date.split('T')[0]}</td>
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
ProfileTemplate.propTypes = {
    mgr_id: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired
}

export default ProfileTemplate


