import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseurl } from '../../../baseurl';
function Raw_Stock() {
    const {mgr_id} = useParams();
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
        axios.get(`${baseurl}/users/employee/production_mgr/${mgr_id}/raw_stock`)
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
    <span className='info2'><b>Production Mgr ID ::</b> {mgr_id}</span>
    <span className='info2'><b>Factory ID ::</b> {materials[0]?.factory_id}</span>
    <div className='table-container'>

    <table className='table' id='orders-table'>
            <thead>
            <tr>
                <th className='table-th'>Raw Mat ID</th>
                <th className='table-th'>Name</th>
                <th className='table-th'>Unit Price</th>
                <th className='table-th'>Type</th>
                <th className='table-th'>Supplier</th>
                <th className='table-th'>Available Qty</th>
            </tr>
            </thead>
            <tbody>   
            {
                materials.map((material) => {
                        return (
                            <tr key={material.factory_stock_id} >
                                <td className='table-td'>{material.raw_mat_id}</td>
                                <td className='table-td'>{material.name}</td>
                                <td className='table-td'>{material.unit_price}</td>
                                <td className='table-td'>{material.type}</td>
                                <td className='table-td'>{material.company}</td>
                                <td className='table-td'>{material.available_qty}</td>
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
