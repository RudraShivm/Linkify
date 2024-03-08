import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import './InvoiceButton.css'
function InvoiceButton({navigateTo,selected}) {
    const navigate = useNavigate();
    const handleClick = () => {
      if(selected.every((reqData) => reqData.status === 'processing')){
        const id=selected[0]?.ware_stock_id.substr(1,3);
        if(selected.every((reqData) => reqData.ware_stock_id.substr(1,3) === id)){
          navigate(navigateTo, {state: {selected: selected}});
        }else{
          alert('Please select requests from the same warehouse');
          return;
        }
      }else{
        if(confirm('Some requests are not in processing state. Do you want to continue?')){
          selected=selected.filter((reqData) => reqData.status === 'processing');
          if(selected.length===0){
            alert('No requests in processing state');
            return;
          }
          navigate(navigateTo, {state: {selected: selected}});
        }
      }
    }
  return (
    <div>
      <button id='invoice-button' onClick={handleClick}>Make Invoice</button>
    </div>
  )
}
InvoiceButton.propTypes = {
    navigateTo: PropTypes.string,
    selected: PropTypes.array
}

export default InvoiceButton
