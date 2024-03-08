import React from 'react'
import PropTypes from 'prop-types'
import './ProcessButton.css'
function ProcessButton({handleClick2,selected}) {
    const handleClick = () => {
        if(selected.every((reqData) => reqData.status === 'pending')){
            selected.map((reqData)=> handleClick2(reqData.id,'pending'));
        }else{
            if(confirm('Some requests are already processed. Do you want to process the remaining?')){
                selected.map((reqData)=> {
                    if(reqData.status === 'pending'){
                        handleClick2(reqData.id,'pending');
                    }
                });
            }
        }
    }
  return (
    <div>
      <button id='process-button' onClick={handleClick}>Process</button>
    </div>
  )
}
ProcessButton.propTypes = {
    handleClick2: PropTypes.func,
    selected: PropTypes.array
}

export default ProcessButton
