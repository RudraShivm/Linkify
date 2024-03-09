import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './UpdateEmployeeForm.css'
import axios from 'axios';
import { baseurl } from '../../baseurl';
function UpdateEmployeeForm({selected,setEmployeeFormVisible}) {
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const [image,setImage] = useState(null);
    const [change, setChange] = useState(false);
    const numberWithCommas = (x) => {
        return x !== undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        if(!change){
            const blob = new Blob([selected.profile_picture], { type: 'image/png' });
            data.append('profile_picture', blob, 'filename.png');
        }else{
            data.append('profile_picture', image);
        }
        data.append('id', selected.id);
        axios.post(`${baseurl}/users/admin/update_employee`, data, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((res) => {
            if(res.data==="Employee updated successfully"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('green');
                setBannerVisible(true);
                setBannerinfo('Employee updated successfully');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
            }else if(res.data==="Mobile number is not valid"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('red');
                setBannerVisible(true);
                setBannerinfo('Mobile number is not valid');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
            }else if(res.data==="NID is not valid"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('red');
                setBannerVisible(true);
                setBannerinfo('NID is not valid');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
            }else if(res.data==="Password length should be between 8 to 20"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('red');
                setBannerVisible(true);
                setBannerinfo('Password length should be between 8 to 20');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400); 
            }else{
              console.log(res.data);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('red');
                setBannerVisible(true);
                setBannerinfo('Error occured while creating employee');
                timeoutRef.current = setTimeout(() => setBannerVisible(false), 2400);
            }
        }).catch(err => {
            console.log(err);
            setChange(true);
        });
    };  
    const handleImageChange = (e) => {
        const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    setImage(event.target.result);
  };

  reader.readAsDataURL(file);
      };
  return (
    
    <div className='form-container2 form-container3' id='update-employee-form'>
        {bannerVisible && <div className='banner' style={{backgroundColor:bannerColor}}>{bannerinfo}</div>}
      <form className='admin-form' onSubmit={handleSubmit} encType='multipart/form-data'>
        <img src='/close.png' className='invoice-form-back-img' onClick={()=>setEmployeeFormVisible(prev=>!prev)} />
        
        <div>

      <label>
        Name:
      </label>
        <input type="text" name="name" placeholder={selected.name}  defaultValue={selected.name}/>
        </div>
        <div>


      <label>
        Profile Picture:
      </label>
        <input type="file" accept=".png" name="profile_picture" id='admin-file-input'  onChange={handleImageChange}/>
        </div>
    <div>

      <label>
        NID:
      </label>
        <input type="text" name="nid"  placeholder={selected.nid} defaultValue={selected.nid} />
    </div>

    <div>

      <label>
        Mobile No:
      </label>
        <input type="text" name="mobile_no" placeholder={selected.mobile_no}  defaultValue={selected.mobile_no}/>
    </div>
    <div>

      <label>
        Password:
      </label>
        <input type="password" name="password" placeholder={selected.passwords} defaultValue={selected.passwords}/>
    </div>
    <div>

      <label>
        Joining Date:
      </label>
        <input type="date" name="joining_date" defaultValue={new Date(selected.joining_date).toISOString().split('T')[0]}/>
    </div>
    <div>

      <label>
        Salary:
      </label>
        <input type="number" name="salary" placeholder={numberWithCommas(selected.salary)} defaultValue={selected.salary}/>
      </div>

      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}
UpdateEmployeeForm.propTypes = {
    selected: PropTypes.object.isRequired,
    setEmployeeFormVisible: PropTypes.func.isRequired
}

export default UpdateEmployeeForm
