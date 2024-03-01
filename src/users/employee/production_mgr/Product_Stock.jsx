import axios from 'axios';
import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
function Product_Stock() {
    const {mgr_id} = useParams();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        axios.get(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/product_stock`)
        .then(response => {
            setProducts(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }
    , [mgr_id]);

  return (
    <>
    <div className='heading'>
      Product Stock
    </div>
    <p className='info2'>Production Mgr ID :: {mgr_id}</p>
    <div className='table-container'>

    <table className='table' id='orders-table'>
            <thead>
            <tr>
                <th className='table-th'>Factory Stock ID</th>
                <th className='table-th'>Product ID</th>
                <th className='table-th'>Product Name</th>
                <th className='table-th'>Model</th>
                <th className='table-th'>Available Qty</th>
                <th className='table-th'>City</th>
            </tr>
            </thead>
            <tbody>   
            {
                products.map((product) => {
                        return (
                            <tr key={product.factory_stock_id}>
                                <td className='table-td'>{product.factory_stock_id}</td>
                                <td className='table-td'>{product.product_id}</td>
                                <td className='table-td'>{product.name}</td>
                                <td className='table-td'>{product.model}</td>
                                <td className='table-td'>{product.available_qty}</td>
                                <td className='table-td'>{product.city}</td>
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

export default Product_Stock
