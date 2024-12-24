import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';
import { Link } from 'react-router-dom';

const Profile = () => {
  const userEmail = useSelector((state) => state.email); // Fetch email from Redux state
  const [user, setUser] = useState({});
 

  useEffect(() => {
    // Fetch user profile data on component mount
    const fetchProfile = async () => {
      try {
        const response = await axios.post('http://localhost:5000/profile', { email: userEmail });
        setUser(response.data.user);
      } catch (error) {
        alert('Failed to load profile.');
        console.error(error);
      }
    };
    fetchProfile();
  }, [userEmail]);


  return (
    <div className="ppart">
      <h1>Welcome, {user.first_name}</h1>
      <p>Name: {user.first_name} {user.last_name}</p>
      <p>Email: {userEmail}</p>
      <p>Phone number: {user.phone}</p>
      {user.dob && <p>{user.dob}</p>}
      {user.imageurl && <img src={`http://localhost:5000${user.imageurl}`} alt={user.first_name} style={{ width: '200px', height: '200px' }} />}
      {user.gender && <p>{user.gender}</p>}
      {user.country && <p>{user.country}</p>}
      {user.state && <p>{user.state}</p>}
      {user.city && <p>{user.city}</p>}
      {user.pin_code && <p>{user.pin_code}</p>}
      <Link to="/profile/Edit"><button>Edit Profile</button></Link>
    </div>
  );
};

export default Profile;
