import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import Filter from './Filter';
import './Orders.css';

const Ware_req = () => {
    const { mgr_id } = useParams();
    const [reqdata, setReqdata] = useState([]);
    const [warehouse_stock_id, setWarehouse_stock_id] = useState(0);
    const [request_date, setRequest_date] = useState('1700-01-01');
    const [factory_id, setFactory_id] = useState(0);
    const [filterVisible, setFilterVisible] = useState(-1);
    const toggleFilter = () => {
        if(filterVisible === -1) setFilterVisible(1);
        else if(filterVisible === 1) setFilterVisible(0);
        else setFilterVisible(1);
    };
    const changeQueryData= (warehouse_stock_id, request_date, factory_id) => {
        setWarehouse_stock_id(warehouse_stock_id);
        setRequest_date(request_date);
        setFactory_id(factory_id);
    }

    function visibleStatefn(filterVisible){
        if(filterVisible === -1) return 'filter-notClicked';
        else if(filterVisible === 1) return 'visible-filter';
        else return 'hidden-filter';
    }
    
    useEffect(() => {
        let url=`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/ware_req?warehouse_stock_id=${warehouse_stock_id}&request_date=${request_date}&factory_id=${factory_id}`;
        axios.get(url)
        .then(res => {
            setReqdata(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    });

    const url5=`/user/employee/warehouse_mgr/home/${mgr_id}/ware_req/filter`;
    return (
        <>
        <h1 className='heading'>Warehouse Requests List</h1>
        <h3 className='info'>Manager ID :: {mgr_id}</h3>
        <Routes>
            <Route path="filter" element={<Filter changeQueryData={changeQueryData} visibleStatefn={visibleStatefn(filterVisible)}/>}/>
        </Routes>
        <Link to="filter">
        <button onClick={toggleFilter} className={`filter-btn ${visibleStatefn(filterVisible)}`}>
            <img src='/filter.png'/> 
        </button>
        </Link>
        <div className={`table-container ${visibleStatefn(filterVisible)}`}>
        <table id='Ware_req_table'>
            <thead>
            <tr>
                <th className='table-th'>Ware Req ID</th>
                <th className='table-th'>Warehouse Stock ID</th>
                <th className='table-th'>Product ID</th>
                <th className='table-th'>Model</th>
                <th className='table-th'>Quantity</th>
                <th className='table-th'>Request Date</th>
                <th className='table-th'>Production Manager ID</th>
                <th className='table-th'>Factory ID</th>
                <th className='table-th'>Factory Location</th>
                <th className='table-th'>Status</th>
            </tr>
            </thead>
            <tbody>   
            {
                reqdata.map((req) => {
                    return (
                        <tr key={req.id}>
                            <td className='table-td'>{req.id}</td>
                            <td className='table-td'>{req.ware_stock_id}</td>
                            <td className='table-td'>
                                <Link to={`/user/employee/warehouse_mgr/home/${mgr_id}/products/${req.product_id}`}>
                                {req.product_id}
                            </Link>
                            </td>
                            <td className='table-td'>{req.model}</td>
                            <td className='table-td'>{req.qty}</td>
                            <td className='table-td'>{req.request_date.split('T')[0]}</td>
                            <td className='table-td'>{req.production_mgr_id}</td>
                            <td className='table-td'>{req.factory_id}</td>
                            <td className='table-td'>{req.city}</td>
                            <td className='order-item-status wmgr-order-item-status table-td' >
                                <div className={` ${req.status}`} >
                                    {req.status}
                                </div>     
                          </td>
                        </tr>
                    );
                }
            )}
            </tbody>
        </table>
        </div>
        </>
    );
}


export default Ware_req;