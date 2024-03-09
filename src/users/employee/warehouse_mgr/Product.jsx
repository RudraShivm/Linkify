import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Product.css';
import { baseurl } from '../../../baseurl';

function Product() {
    const  navigate  = useNavigate();
    const {product_id}=useParams();
    const {mgr_id}=useParams();
    const[data,setData]=useState([]);
  const [images, setImages] = useState([]);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const url=`${baseurl}/users/employee/products/${product_id}`;
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");};
    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(url)
        .then(res => { 
            setData(res.data);
            return res.data;
        })
        .then((data)=>{
          axios.get(`${baseurl}/users/pic1/${data[0].id}`, { responseType: 'arraybuffer' })
          .then(res => {
            const blob = new Blob([res.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setImages(prev => { return [...prev, imageUrl] });
          })
          .then(() => {
            axios.get(`${baseurl}/users/pic2/${data[0].id}`, { responseType: 'arraybuffer' })
              .then(res => {
                const blob = new Blob([res.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setImages(prev => { return [...prev, imageUrl] });
              })
          })
          .then(() => {
            axios.get(`${baseurl}/users/pic3/${data[0].id}`, { responseType: 'arraybuffer' })
              .then(res => {
                const blob = new Blob([res.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setImages(prev => { return [...prev, imageUrl] });
              })
          })
      })
        .catch(err => {
            console.log(err);
        })
    }, [url, navigate, mgr_id, product_id]);

    const nextImage = () => {
      document.querySelector('.product-details-image').classList.add('hidden');
      setTimeout(() => {
        setCurrentImageIndex((currentImageIndex + 1) % 3);
        document.querySelector('.product-details-image').classList.remove('hidden');
      }, 500);
    };
    
    const prevImage = () => {
      document.querySelector('.product-details-image').classList.add('hidden');
      setTimeout(() => {
        setCurrentImageIndex((currentImageIndex + 2) % 3);
        document.querySelector('.product-details-image').classList.remove('hidden');
      }, 300);
    };
    return (
      <>
    <div className='product-container'>
        <div className='product-image-container'>
        <button onClick={prevImage} className="prev"><img className='left' src='/left-chevron.png'/></button>
        <img src={images[currentImageIndex]} className={`product-details-image`} />
        <button onClick={nextImage} className="next"><img className='right' src='/right-chevron.png'/></button>
        </div>
      <div className='product-details-container'>
        <p id='product-details-title'>{data[0]?.name}</p>
        <p><b>Model :</b> {data[0]?.model}</p>
        <p><b>Series :</b> {data[0]?.series}</p>
        <p><b>Unit Price :</b> {numberWithCommas(Number(data[0]?.unit_price))} BDT</p>
        <p><b>Minimum Delivery Date :</b> {data[0]?.minimum_delivery_time} days</p>
      </div>
    </div>
    <div className='product-desc-container'>
      <div className='product-desc-heading'>Product Description</div>
      <div className='product-desc'>
        {data[0]?.description}
        </div>
    </div>
    <div className='photo-container'>
    <img src={images[1]} className='product-details-image'/>
    </div>
      </>
  )
}

export default Product
