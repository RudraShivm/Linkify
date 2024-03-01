import React from 'react'
import PropTypes from 'prop-types';
function LoginForm({handleSubmit, mgr_id, setMgr_id, mgr_pass, setMgr_pass, remember, setRemember}) {
  return (
    <form onSubmit={handleSubmit} method="get" className="login-form">
        <input type="text" value={mgr_id} placeholder='id' onChange={(e) => setMgr_id(e.target.value)}/>
        <input type="password" value={mgr_pass} placeholder='password' onChange={(e) => setMgr_pass(e.target.value)}/>
        <label className='rempass'>
          <input  type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
          Remember Password
        </label>
        <button className="login-submit" type="submit">Login</button>
      </form>
  )
}
LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    mgr_id: PropTypes.string.isRequired,
    setMgr_id: PropTypes.func.isRequired,
    mgr_pass: PropTypes.string.isRequired,
    setMgr_pass: PropTypes.func.isRequired,
    remember: PropTypes.bool.isRequired,
    setRemember: PropTypes.func.isRequired
};

export default LoginForm
