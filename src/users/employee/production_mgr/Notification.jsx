import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './Notification.css';
const NotificationComponent= ()=> {
    const {mgr_id}=useParams();
    const [stock,setStock]=useState([]);
    const [pendingDemand, setPendingDemand] = useState([]);
    const [log,setLog]=useState([]);
    const url=`http://localhost:3000/users/employee/production_mgr/${mgr_id}/missing_logs`;
    
    useEffect(()=>{
        axios.get(url)
        .then(res=>{
            setLog(res.data);
        })
        .catch(err=>{
            console.log(err)
        })
    },[url,mgr_id]);
    function toLocalISOString(date) {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset*60*1000));
        return date;
      }
    return (
      <div className='notification-container'>
            <div className='heading' id='notif'>🔔Notification</div>
            <div className='notification'>
                <div className='notification-details'>
                    <div>{log.length>0?`You have missing logs for ${log.length} days. Check the following logs : `:``}</div>
                    <ul type='square'>
                    {log.map((item,index)=>{
                        item.date=toLocalISOString(new Date(item.date)).toISOString().split('T')[0];
                        return(
                            <li key={index} className='log-not-div'>
                                <b>{item.date} :::</b>  log is missing.
                            </li>
                        )
                    })}
                    </ul>
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
