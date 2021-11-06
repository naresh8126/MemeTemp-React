import React from 'react'
import pic from './user.png'
import bgmage from './bg.jpg'
import {Link} from 'react-router-dom'
import { useAuth } from "../contexts/Auth";
function ProfileInfo(props) {
  const { userData } = useAuth();
  
  return (
    
    <div>
      <div style={{
        background:`url(${userData.banner || bgmage})`,
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center",
        backgroundSize:"cover"
      }} className="h-64 w-full bg-gray-900 flex items-center justify-center text-gray-100 relative">
        <div className="flex items-center justify-center flex-col">
          <img width="75px" height="75px" src={userData.photoURL || pic} alt=""  className="rounded-full  outline-none " />
          <h2 className="font-blod text-2xl bg-gray-900 m-2 p-2 rounded-md">@{userData.displayName}</h2>
        </div>
        <Link to="/profile/edit" className="absolute right-4 top-4 p-2 px-4 bg-blue-700 hover:bg-blue-800">Edit Profile</Link>
      </div>
    </div>
  )
}

export default ProfileInfo
