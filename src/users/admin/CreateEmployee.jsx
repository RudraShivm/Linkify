import React, { useEffect, useRef, useState } from 'react';
import './CreateEmployee.css';
import axios from 'axios';
import { baseurl } from '../../baseurl';
function CreateEmployee() {
  const [employeeType, setEmployeeType] = useState('');
  const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const [image,setImage] = useState(null);
    const [delivery_type, setDeliveryType] = useState('');
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const response = await axios.get('http://localhost:3000/pic', { responseType: 'arraybuffer' });
    
    //       // Convert the binary data to a blob
    //       console.log(response.data);
    //       const blob = new Blob([response.data], { type: 'image/png' });
    //       console.log(blob);
    //       // Create an object URL from the blob
    //       const imageUrl = URL.createObjectURL(blob);
          
    //       // Set the image URL in the state
    //       setNewImage(imageUrl);
    //       console.log(imageUrl);
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   };
    
    //   fetchData(); // Call the async function
    // }, []);
    
const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    data.append('profile_picture', image);
    data.append('employeeType', employeeType);
    data.append('delivery_type', delivery_type);
    axios.post(`${baseurl}/users/admin/create_employee`, data)
    .then((res) => {
        if(res.data==="Employee created successfully"){
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setBannerColor('green');
            setBannerVisible(true);
            setBannerinfo('Employee created successfully');
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
        }else if(res.data==="Warehouse not found"){
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setBannerColor('red');
            setBannerVisible(true);
            setBannerinfo('Warehouse not found');
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
    <div className='form-container2'>
        {bannerVisible && ( <div style={{backgroundColor: bannerColor}} className='banner'>{bannerinfo}</div>)}
        
    <form className='admin-form' onSubmit={handleSubmit}>
        <div>

      <label>
        Employee Type:
      </label>
        <select value={employeeType} onChange={(e) => setEmployeeType(e.target.value)} required>
          <option value="">Select...</option>
          <option value="warehouse_manager">Warehouse Manager</option>
          <option value="production_manager">Production Manager</option>
          <option value="supply_manager">Supply Manager</option>
          <option value="delivery_manager">Delivery Manager</option>
        </select>
        </div>
        <div>

      <label>
        Name:
      </label>
        <input type="text" name="name" placeholder='name' required/>
        </div>
        <div>


      <label>
        Profile Picture:
      </label>
        <input type="file" accept=".png" name="profile_picture" id='admin-file-input' onChange={handleImageChange} required/>
        </div>
    <div>

      <label>
        NID:
      </label>
        <input type="text" name="nid" placeholder='XXX-XXX-XXXX' required/>
    </div>

    <div>

      <label>
        Mobile No:
      </label>
        <input type="text" name="mobile_no" placeholder='01XX-XXX-XXX' required/>
    </div>
    <div>

      <label>
        Password:
      </label>
        <input type="password" name="password" placeholder='password' required/>
    </div>
    <div>

      <label>
        Joining Date:
      </label>
        <input type="date" name="joining_date" required/>
    </div>
    <div>

      <label>
        Salary:
      </label>
        <input type="number" name="salary" required/>
      </div>
    <div>

      {employeeType === 'warehouse_manager' && (
          <>
          <label>
          Warehouse ID:
        </label>
          <input type="text" name="department_id" required/>
          </>
      )}
</div>
        <div>

      {(employeeType === 'production_manager' || employeeType === 'supply_manager') && (
          <>
          <label>
          Factory ID:
        </label>
          <input type="text" name="department_id" required/>
          </>
      )}
      </div>
      {employeeType === 'delivery_manager' && (
          <>
          <div>

          <label>
            Delivery Type:
          </label>
            <select value={delivery_type} name="delivery_type" onChange={(e)=>setDeliveryType(e.target.value)} required>
              <option value="">Select...</option>
              <option value="warehouse">Warehouse</option>
              <option value="factory">Factory</option>
            </select>
          </div>
        {delivery_type === 'warehouse' && (
          <div>
          <label>
            Warehouse ID:
          </label>
            <input type="text" name="department_id" required/>
          </div>
        )}
        {delivery_type === 'factory' && (
          <div>
          <label>
            Factory ID:
          </label>
            <input type="text" name="department_id" required/>
          </div>
        )}
        </>
      )}

      <input type="submit" value="Submit" />
    </form>
      </div>
  );
}

export default CreateEmployee;