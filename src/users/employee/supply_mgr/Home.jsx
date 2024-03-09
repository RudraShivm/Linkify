import { Link, Outlet, useParams } from 'react-router-dom';
const Home = () => {
    const { mgr_id } = useParams();
    
    return (
        <div className='employee-body'>
        <div className='link-Container' >
            <Link to={`/user/employee/supply_mgr/home/${mgr_id}/factory_requests`} className='navlink'>Factory Requests</Link>
            <Link to={`/user/employee/supply_mgr/home/${mgr_id}/profile`} className='navlink'>
                <img src='/profile.png' className='hero-bar-profile-icon'/>
            </Link>
            <Link to="/" className='navlink logout-container'>
                <img className='logout' src='/logout.png'/>
            </Link>
        </div>
        <Outlet/>
        
        </div>
    );
};

export default Home;
