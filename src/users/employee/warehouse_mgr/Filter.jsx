import PropTypes from 'prop-types';
import React from 'react';
import { useState } from 'react';
import './Filter.css';
const Filter = ({changeQueryData},{visibleStatefn}) => {
    const [warehouse_stock_id, setWarehouse_stock_id] = useState(0);
    const [request_date, setRequest_date] = useState('1700-01-01');
    const [factory_id, setFactory_id] = useState(0);
    return (
        <div className={`filter-container ${visibleStatefn}`}>
            <form className="filter-form">
                <label className="filter-label">
                    Warehouse Stock ID:
                    <input className="filter-input" type='number' value={warehouse_stock_id} onChange={(e)=>setWarehouse_stock_id(e.target.value)} placeholder='.' max={9999999999} />
                </label>
                <label className="filter-label">
                    Request Date:
                    <input className="filter-input" type='date' value={request_date} onChange={(e)=>setRequest_date(e.target.value)} />
                </label>
                <label className="filter-label">
                    Factory ID:
                    <input className="filter-input" type='number' value={factory_id} onChange={(e)=>setFactory_id(e.target.value)} placeholder='.' max={9999999999} />
                </label>
                <button className="btn filter-button" type='submit' onClick={(e)=>{e.preventDefault();changeQueryData(warehouse_stock_id, request_date, factory_id)}}>Submit</button>
            </form>
        </div>
    )
}

Filter.propTypes = {
    changeQueryData: PropTypes.func.isRequired,
};

export default Filter;