import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { baseurl } from '../../baseurl';
import './UpdateEmployeeForm.css';
function UpdateProduct({selected,setProductFormVisible}) {
    const [bannerVisible, setBannerVisible] = useState(false);
    const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
    const timeoutRef = useRef(null);
    const [image1,setImage1] = useState(null);
    const [image2,setImage2] = useState(null);
    const [image3,setImage3] = useState(null);
    const [change1, setChange1] = useState(false);
    const [change2, setChange2] = useState(false);
    const [change3, setChange3] = useState(false);
    const numberWithCommas = (x) => {
        return x !== undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '';
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        if(!change1){
            const blob = new Blob([selected.picture_1], { type: 'image/png' });
            data.append('picture_1', blob, 'filename.png');
        }else{
            data.append('profile_1', image1);
        }
        if(!change2){
            const blob = new Blob([selected.picture_2], { type: 'image/png' });
            data.append('picture_2', blob, 'filename.png');
        }else{
            data.append('profile_2', image2);
        }
        
        if(!change3){
            const blob = new Blob([selected.picture_3], { type: 'image/png' });
            data.append('picture_3', blob, 'filename.png');
        }else{
            data.append('profile_3', image3);
        }
        
        data.append('id', selected.id);
        axios.post(`${baseurl}/users/admin/update_product`, data, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((res) => {
            if(res.data==="Product updated successfully"){
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                setBannerColor('green');
                setBannerVisible(true);
                setBannerinfo('Product updated successfully');
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
            setChange1(true);
            setChange2(true);
            setChange3(true);
        });
    };  
    const handleImageChange1 = (e) => {
        const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    setImage1(event.target.result);
  };

  reader.readAsDataURL(file);
      };
      const handleImageChange2 = (e) => {
        const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    setImage2(event.target.result);
  }

  reader.readAsDataURL(file);
      }
      const handleImageChange3 = (e) => {
        const file = e.target.files[0];
  const reader = new FileReader();
        
  reader.onload = (event) => {
    setImage3(event.target.result);
  }

  reader.readAsDataURL(file);
}
  return (
    
    <div className='form-container2 form-container3' id='update-employee-form'>
        {bannerVisible && <div className='banner' style={{backgroundColor:bannerColor}}>{bannerinfo}</div>}
      <form className='admin-form' onSubmit={handleSubmit} encType='multipart/form-data'>
        <img src='/public/close.png' className='invoice-form-back-img' onClick={()=>setProductFormVisible(prev=>!prev)} />
        
        <div>
      <label>
        Name:
      </label>
        <input type="text" name="name" placeholder={selected.name}  defaultValue={selected.name}/>
        </div>
        <div>

      <label>
        Model:
      </label>
        <input type="text" name="model" placeholder={selected.model}  defaultValue={selected.model}/>
        </div>
        <div>

      <label>
        Series:
      </label>
        <input type="text" name="series" placeholder={selected.series}  defaultValue={selected.series}/>
        </div>
        <div>

      <label>
        Description:
      </label>
        <input type="text" name="description" placeholder={selected.description}  defaultValue={selected.description}/>
        </div>
        
    <div>

      <label>
        Unit Price:
      </label>
        <input type="number" name="unit_price" placeholder={numberWithCommas(selected.unit_price)} defaultValue={selected.unit_price}/>
      </div>
    <div>

      <label>
        Minimum Delivery Time:
      </label>
        <input type="number" name="minimum_delivery_time" placeholder={numberWithCommas(selected.minimum_delivery_time)} defaultValue={selected.minimum_delivery_time}/>
      </div>

        <div>

      <label>
        Picture 1:
      </label>
        <input type="file" accept=".png" name="picture_1" id='admin-file-input'  onChange={handleImageChange1}/>
        </div>
        <div>

      <label>
        Picture 2:
      </label>
        <input type="file" accept=".png" name="picture_2" id='admin-file-input'  onChange={handleImageChange2}/>
        </div>
        <div>

      <label>
        Picture 3:
      </label>
        <input type="file" accept=".png" name="picture_3" id='admin-file-input'  onChange={handleImageChange3}/>
        </div>
    
      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}
UpdateProduct.propTypes = {
    selected: PropTypes.object.isRequired,
    setProductFormVisible: PropTypes.func.isRequired
};

export default UpdateProduct
