import axios from 'axios';
import { React, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import AddToCart from './AddToCart';
import './Product.css';
import { baseurl } from '../../baseurl';
{/* <a href="https://www.flaticon.com/free-icons/right" title="right icons">Right icons created by inkubators - Flaticon</a> */}
{/* <a href="https://www.flaticon.com/free-icons/left" title="left icons">Left icons created by th studio - Flaticon</a> */}
function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product_id } = useParams();
  const { retailer_id } = useParams();
  const [data, setData] = useState([]);
  const [cartVisible, setCartVisible] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]);
  const toggleAddToCart = () => {
    if (cartVisible === -1) setCartVisible(1);
    else if (cartVisible === 1) setCartVisible(0);
    else setCartVisible(1);
  };

  const url = `${baseurl}/users/retailer/home/${retailer_id}/products/${product_id}`;
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    
    axios.get(url)
      .then(res => {
        setData(res.data);
        return res.data;
      })
      .then((data) => {
        axios.get(`${baseurl}/pic1/${data[0].id}`, { responseType: 'arraybuffer' })
          .then(res => {
            const blob = new Blob([res.data], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setImages(prev => { return [...prev, imageUrl] });
          })
          .then(() => {
            axios.get(`${baseurl}/pic2/${data[0].id}`, { responseType: 'arraybuffer' })
              .then(res => {
                const blob = new Blob([res.data], { type: 'image/png' });
                const imageUrl = URL.createObjectURL(blob);
                setImages(prev => { return [...prev, imageUrl] });
              })
          })
          .then(() => {
            axios.get(`${baseurl}/pic3/${data[0].id}`, { responseType: 'arraybuffer' })
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
    
  }, [url, navigate, retailer_id, product_id, location.pathname]);

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
  function visibleStatefn(cartVisible) {
    if (cartVisible === -1) return 'addToCart-notClicked';
    else if (cartVisible === 1) return 'active-addToCart';
    else return 'hidden-addToCart';
  }

  return (
    <>
      {bannerVisible && <div className="banner">{bannerinfo}</div>}
      <div className='addToCart-container'>
        <Routes>
          <Route path="addToCart" element={<AddToCart cartVisible={cartVisible} toggleAddToCart={toggleAddToCart} visibleStatefn={visibleStatefn} setBannerVisible={setBannerVisible} setBannerinfo={setBannerinfo} />} />
        </Routes>
        <Link to="addToCart">
          <button onClick={toggleAddToCart} className={`filter-btn addToCart-btn`}>
            <img src='/carts.png' />
          </button>
        </Link>
      </div>
      <div className='product-container'>
        <div className='product-image-container'>
        <button onClick={prevImage} className="prev"><img className='left' src='/public/left-chevron.png'/></button>
        <img src={images[currentImageIndex]} className={`product-details-image`} />
        <button onClick={nextImage} className="next"><img className='right' src='/public/right-chevron.png'/></button>
        </div>
        <div className='product-details-container'>
          <p id='product-details-title'>{data[0]?.name}</p>
          <p><b><span className='details-box details-box-model'>Model</span> :   </b> {data[0]?.model}</p>
          <p><b><span className='details-box details-box-series'>Series</span> :   </b> {data[0]?.series}</p>
          <p><b><span className='details-box details-box-price'>Unit Price</span> :   </b> {numberWithCommas(Number(data[0]?.unit_price))} BDT</p>
          <p><b><span className='details-box details-box-date'>Minimum Delivery Date</span> :   </b> {data[0]?.minimum_delivery_time} days</p>
          <AddToCart cartVisible={1} toggleAddToCart={toggleAddToCart} visibleStatefn={()=>'desc-add-to-cart active-addToCart'} setBannerVisible={setBannerVisible} setBannerinfo={setBannerinfo}/>
        </div>
      </div>
      <div className='product-desc-container'>
        <div className='product-desc-heading'>Product Description</div>
        <div className='product-desc'>
          {data[0]?.description}
      </div>
        </div>
        <div className='photo-container'>
          <img src={images[1]}/>
        </div>
    </>
  )
}

export default Product;