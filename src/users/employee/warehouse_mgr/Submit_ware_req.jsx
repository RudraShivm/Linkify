import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import './orders.css'
import './Submit_ware_req.css'
import { baseurl } from '../../../baseurl';
function Submit_ware_req() {
    const { mgr_id } = useParams();
    const [factory_info,setFactory_info]=useState([]);
    const [warehouse_stock,setWarehouse_stock]=useState([]);
    const [selected, setSelected] = useState([]);

    const url1=`${baseurl}/factory_info`;
    const url2=`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/warehouse_stock`;

    useEffect(() => {
        axios.get(url1)
        .then(res => {
            setFactory_info(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [url1]);

    useEffect(() => {
        axios.get(url2)
        .then(res => {
            setWarehouse_stock(res.data);
            setSelected(res.data.map(item => ({
                ware_stock_id: item.id,
                factory_id: factory_info.find(factory => factory.product_id === item.product_id)?.id,
                qty: 0
            })));

        })
        .catch(err => {
            console.log(err);
        })
    }, [url2, factory_info]);

    function handleFactoryChange(index, value) {
        const newSelected = [...selected];
        newSelected[index].factory_id = value;
        setSelected(newSelected);
    }

    function handleQtyChange(index, value) {
        const newSelected = [...selected];
        newSelected[index].qty = value;
        setSelected(newSelected);
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(selected);
        selected.forEach(item => {
            if (item.qty > 0) {
                const postobj = {
                    warehouse_id: warehouse_stock[0]?.warehouse_id,
                    factory_id: item.factory_id,
                    ware_stock_id: item.ware_stock_id,
                    qty: item.qty,    
                }
                axios.post(`${baseurl}/users/employee/warehouse_mgr/${mgr_id}/ware_req/submit`, postobj)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    }

    return (
        <div>
            <div className='heading'>
                Request Warehouse Stock
            </div>
            <form onSubmit={handleSubmit} >
                <div className='table-container'>
                <table id='sub_ware_req_table'>
                    <thead>
                        <tr>
                            <th className='etable-th'>Warehouse Stock ID</th>
                            <th className='etable-th'>Name</th>
                            <th className='etable-th'>Model</th>
                            <th className='etable-th'>Quantity</th>
                            <th className='etable-th'>Factory</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouse_stock.map((item, index) => (
                            <tr key={`${item.id}-${item.sub_id}`}>
                                <td className='etable-td'>{item.id}</td>
                                <td className='etable-td'>{item.name}</td>
                                <td className='etable-td'>{item.model}</td>
                                <td className='etable-td'>
                                    <input className='sub_ware_req_input' type="number" value={selected[index].qty} onChange={(e) => handleQtyChange(index, e.target.value)} min="0" />
                                </td>
                                <td className='etable-td'>
                                    <select className='sub_ware_req_select' value={selected[index].factory_id} onChange={(e) => handleFactoryChange(index, e.target.value)}>
                                        {factory_info.map(factory => (
                                               factory.product_id==item.product_id) &&(
                                                <option className='sub_ware_req_option' value={factory.id} key={factory.id}>{factory.city + " ↔️ Factory ID: " + factory.id}</option>
                                            
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button type="submit" className='btn submit-button' id='sub_ware_req_btn'>Submit</button>
                </div>
            </form>
            <div className='extra-box'></div>
        </div>
    )
}

export default Submit_ware_req;