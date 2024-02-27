import { Link, Outlet, useParams } from 'react-router-dom';
import './Home.css';
const Home = () => {
    const { retailer_id } = useParams();
    const url1=`/user/retailer/home/${retailer_id}/products`
    const url2=`/user/retailer/home/${retailer_id}/orders`
    const url3=`/user/retailer/home/${retailer_id}/cart`
    const url4=`/user/retailer/home/${retailer_id}/success`
    return (
        <div className='retailer-body'>
        <div className='link-Container' id='retailer-link-container'>
            <Link to={url1} className='navlink'>Home</Link>
            <Link to={url2} className='navlink'>Orders</Link>
            <Link to={url3} className='navlink'>Cart</Link>
            <Link to="/" className='navlink logout-container'>
                <img className='logout' src='/logout.png'/>
            </Link>
        </div>
        <Outlet/>
        
        </div>
    );
};

export default Home;
