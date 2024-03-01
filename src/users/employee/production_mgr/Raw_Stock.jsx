import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
function Raw_Stock() {
    const {mgr_id} = useParams();
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/raw_stock`)
        .then(response => {
            setMaterials(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }
    , [mgr_id]);

  return (
    <>
    <div className='heading'>
      Raw Materials Stock
    </div>
    <p className='info2'>Production Mgr ID :: {mgr_id}</p>
    <div className='table-container'>

    <table className='table' id='orders-table'>
            <thead>
            <tr>
                <th className='table-th'>Raw Mat ID</th>
                <th className='table-th'>Name</th>
                <th className='table-th'>Type</th>
                <th className='table-th'>Product Name</th>
                <th className='table-th'>Model</th>
                <th className='table-th'>Available Qty</th>
            </tr>
            </thead>
            <tbody>   
            {
                materials.map((material) => {
                        return (
                            <tr key={material.factory_stock_id} >
                                <td className='table-td'>{material.raw_mat_id}</td>
                                <td className='table-td'>{material.product_id}</td>
                                <td className='table-td'>{material.name}</td>
                                <td className='table-td'>{material.model}</td>
                                <td className='table-td'>{material.available_qty}</td>
                                <td className='table-td'>{material.city}</td>
                            </tr>
                        );
                    }
                )}
            </tbody>
        </table>
        </div>
    </>
  )
}

export default Raw_Stock
