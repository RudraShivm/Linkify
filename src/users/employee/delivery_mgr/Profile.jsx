import React from 'react'
import { useParams } from 'react-router-dom'
import ProfileTemplate from './../warehouse_mgr/ProfileTemplate';
function Profile() {
    const { mgr_id } = useParams();
  return (
    <div>
      <ProfileTemplate mgr_id={mgr_id} designation="delivery_mgr"/>
    </div>
  )
}

export default Profile