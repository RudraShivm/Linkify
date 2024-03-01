import React from 'react'
import { useParams } from 'react-router-dom'
import ProfileTemplate from './ProfileTemplate';
function Profile() {
    const { mgr_id } = useParams();
  return (
    <div>
      <ProfileTemplate mgr_id={mgr_id} designation="warehouse_mgr"/>
    </div>
  )
}

export default Profile
