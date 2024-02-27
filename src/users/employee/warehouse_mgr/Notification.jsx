import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const NotificationComponent= ()=> {
    const {mgr_id}=useParams();
    const [stock,setStock]=useState([]);
    const [pendingDemand, setPendingDemand] = useState([]);
    const url=`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/warehouse_stock`;
    
    useEffect(()=>{
        axios.get(url)
        .then(res=>{
            setStock(res.data);
        })
        .catch(err=>{
            console.log(err)
        })

        axios.get(`http://localhost:3000/users/employee/warehouse_mgr/${mgr_id}/pending_demand`)
        .then(res => {
            setPendingDemand(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
    },[url,mgr_id]);
    return (
      <div className='notification-container'>
            <div className='heading' id='notif'>🔔Notification</div>
            <div className='notification'>
                <div className='notification-details'>
                    {stock.map((item,index)=>{
                        if(item.available_qty==0){
                            return(
                                <div key={index}>
                                <img src='/public/alert.png' id='warning'/>
                                Stock : {item.id} ({item.name} : {item.model}) ran out of stock !
                            </div>    
                            )
                        }else if(item.available_qty<20){
                            return(
                                <div key={index}>
                                <img src='/public/warning.png' id='warning'/>
                                Stock : {item.id} ({item.name} : {item.model}) is running low on stock ! ( less than 20 )
                            </div>    
                            )
                        }else if(pendingDemand.find(product=>product.warehouse_stock_id===item.id)?.demand_qty>item.available_qty){
                            return(
                                <div key={index}>
                                <img src='/public/alert.png' id='warning'/>
                                Stock : {item.id} ({item.name} : {item.model}) has pending demands more than available stocks!
                            </div>    
                            )
                        }
                    })
                    }
                </div>
              <div/>  
        </div>
    </div>
  )
}

export default NotificationComponent
