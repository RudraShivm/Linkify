import PropTypes from 'prop-types'
import React from 'react'
import './InvoiceForm.css'
{/* <a href="https://www.flaticon.com/free-icons/close" title="close icons">Close icons created by Fathema Khanom - Flaticon</a> */}
function InvoiceForm({handleFileChange, handleUpload,selected,setInvoiceFormVisible}) {

  return (
    <div className='form-container'>
      <div className='nested-box1'>
        <img src='/public/close.png' className='invoice-form-back-img' onClick={()=>setInvoiceFormVisible(prev=>!prev)}/>
      <table style={{ border: 'none', backgroundColor: 'transparent' }} className='invoice-form-table'>
    <tbody>
        <tr>
            <td style={{'paddingRight':'100px'}}><b>Request ID</b></td>
            <td>{selected[0]?.id}</td>
        </tr>
        <tr>
            <td><b>Raw Material Name</b></td>
            <td>{selected[0]?.raw_name}</td>
        </tr>
        <tr>
            <td><b>Company</b></td>
            <td>{selected[0]?.company}</td>
        </tr>
    </tbody>
    </table>
        <label htmlFor="file-upload" className="custom-file-upload">
          Select Invoice File
        </label>
       <input id="file-upload" type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} id='invoice-form-btn' >Upload</button>
      </div>
    </div>
  )
}
InvoiceForm.propTypes = {
  handleFileChange: PropTypes.func,
  handleUpload: PropTypes.func,
  selected: PropTypes.array,
  setInvoiceFormVisible: PropTypes.func
}

export default InvoiceForm
