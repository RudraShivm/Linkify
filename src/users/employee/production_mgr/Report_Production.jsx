import axios from 'axios';
import React, { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Report_Production.css';
function Report_Production() {
  const {mgr_id} = useParams();
  const [data, setData] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerinfo, setBannerinfo] = useState('');
    const [bannerColor, setBannerColor] = useState('green');
  const timeoutRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/report_log`)
    .then(response => {
      setData(response.data.map(item => ({...item, date: toLocalISOString(new Date(item.date))})));
      const startDate = new Date('2024-02-29');
      let endDate = new Date();
      endDate.setDate(endDate.getDate()-1);
      const tempDates = [];
      for (let d = endDate; d >= new Date(startDate); d.setDate(d.getDate() - 1)) {
        let date=new Date(d.getTime());
        date=toLocalISOString(date);
        console.log("date"+date);
        tempDates.push(date);
      }
      setAllDates(tempDates);
    })
    .catch(error => {
      console.log(error);
    })
  }, [mgr_id]);

  const handleInputChange = (date, value) => {
    setInputValues({...inputValues, [date]: value || 0});
  };

  const handleUpdate = () => {
    if(confirm('Are you sure you want to submit the production log?')){
      console.log("data"+JSON.stringify(data));
      const updatedData = allDates.map(date => {
        const report = data.find(item => (item.date).toISOString().split('T')[0] === toLocalISOString(date).toISOString().split('T')[0]);
        
        if(report==undefined && inputValues[toLocalISOString(date)]){
          return {
            date: toLocalISOString(date).toISOString().split('T')[0],
          qty: inputValues[toLocalISOString(date)],
        };
      }
    }).filter(item => item!==undefined);
    axios.post(`http://localhost:3000/users/employee/production_mgr/${mgr_id}/report_log`, {data:updatedData?updatedData:[]})
    .then(response => {
      if(response.data==="All production logs created successfully"){
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setBannerVisible(true);
        setBannerinfo('Production log(s) created successfully');
        setBannerColor('green');
        timeoutRef.current = setTimeout(() => {
          setBannerVisible(false);
        }, 2000);
        timeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 800);
      }else if(response.data==="Some production logs were already created. Try again!"){
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setBannerVisible(true);
        setBannerinfo('Some production log(s) were already created. Try again!');
        setBannerColor('red');
        timeoutRef.current = setTimeout(() => {
          setBannerVisible(false);
        }, 3000);
        timeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 800);
      }else if(response.data==="Insufficient raw material for some log(s). Try again!"){
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setBannerVisible(true);
        setBannerinfo('Insufficient raw material for some log(s). Try again!');
        setBannerColor('red');
        timeoutRef.current = setTimeout(() => {
          setBannerVisible(false);
        }, 3000);
        timeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 800);
      }else{
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setBannerVisible(true);
        setBannerinfo('Error creating production log(s)');
        setBannerColor('red');
        timeoutRef.current = setTimeout(() => {
          setBannerVisible(false);
        }, 3000);
        timeoutRef.current = setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  };
  function toLocalISOString(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset*60*1000));
    return date;
  }
  return (
    <>
    {bannerVisible && <div className={`banner ${bannerColor}`}>{bannerinfo}</div>}
    <div className='heading'>
      Production Report Log
    </div>
    <span className='info2'><b>Production Mgr ID ::</b> {mgr_id}</span>
    <div className='table-container'>
    <table className='table' id='report-table'>
            <thead>
            <tr>
                <th className='table-th'>Date</th>
                <th className='table-th'>Quantity</th>
            </tr>
            </thead>
            <tbody>   
            {
      allDates.map((date) => {
        const report = data.find(item => new Date(item.date).toDateString() === date.toDateString());
        console.log(date+"->"+report);
        return (
          <tr key={date}>
            <td className={`table-td ${report?"":"red"}`}>
              {toLocalISOString(date).toISOString().split('T')[0]}
            </td>
            <td className='table-td'>
              {report ? report.qty : (
                <input
                  type="number"
                  min="0"
                  value={inputValues[toLocalISOString(date)] || ''}
                  onChange={(e) => handleInputChange(toLocalISOString(date), e.target.value)}
                  className='input-number'
                />
              )}
            </td>
          </tr>
        );
      })
    }
            </tbody>
        </table>
        </div>
        <div className='btn-container fixed-btn'>
        <button type="submit" className='btn submit-button' id='sub_ware_req_btn' onClick={handleUpdate}>Submit Invoice</button>
        </div>
        <div className='extra-box2'></div>
    </>
  )
}

export default Report_Production
