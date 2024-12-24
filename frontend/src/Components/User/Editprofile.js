import React, {  useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
function EditProfile() {
    const userEmail = useSelector((state) => state.email); // Fetch email from Redux state
    const [udob, setUdob] = useState('');
    const [upass, setUPass] = useState('');
    const [ucon, setUCon] = useState('');
    const [uph, setUph] = useState('');
    const [ug, setUg] = useState('');
    const [uc, setUc] = useState('');
    const [us, setUs] = useState('');
    const [ucity, setUcity] = useState('');
    const [up, setUp] = useState('');
    const [image, setImage] = useState(null); // State for image file
    const [user, setUser] = useState({});
    const handlePinCodeChange = async (e) => {
        const pinCode = e.target.value;
        setUp(pinCode); // Update pin_code state
    
        if (pinCode.length === 6) { // Assuming pin codes are 6 digits
          try {
            const response = await axios.get(`https://api.zippopotam.us/in/${pinCode}`);
            if (response.status === 200) {
              const data = response.data;
              setUc(data.country);
              setUs(data.places[0]['state']);
              setUcity(data.places[0]['place name']);
            } else {
              alert('Pin code not found.');
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            alert('Failed to fetch address. Please enter manually.');
          }
        }
      };
    
      const handleData = async () => {
        try {
          const formData = new FormData();
          formData.append('phno',uph);
          formData.append('pass',upass);
          formData.append('cpass',ucon);
          formData.append('dob', udob);
          formData.append('gender', ug);
          formData.append('country', uc);
          formData.append('state', us);
          formData.append('city', ucity);
          formData.append('pin_code', up);
          formData.append('email', userEmail);
          formData.append('image', image);
          if(upass!==ucon){
            alert("Please enter password and confirm to be same");
          }
          const response = await axios.put('http://localhost:5000/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
    
          if (response.data.success) {
            alert('Profile updated successfully!');
            setUser(response.data.user);
          } else {
            alert('Update failed.');
          }
        } catch (err) {
          console.error('Error updating profile', err);
          alert('There was an error updating your profile.');
        } 
      };
    return ( 
        <div>
            <div className="s1">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => setUPass(e.target.value)} value={upass} placeholder="Enter Password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" 
                            title="Must contain at least 8 characters, including at least one number, one uppercase and lowercase letter, and one special character" required/>
                    {/* <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small> */}
                    {/* <div class="error-message" id="password-error"></div> */}
                </div>
                <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small>
                <div className="s1">
                    <label for="cpass">Confirm Password: </label>
                    <input type="password" name="cpass" onChange={(e) => setUCon(e.target.value)} value={ucon} placeholder="Confirm Password" required/>
                </div>
            <div className="p1">
                <label for="phone">Phone number:</label>
                <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={(e) => setUph(e.target.value)} value={uph} placeholder="000-000-0000" required/>
            </div>
            <div className="p1">
                <label htmlFor="dob" className="lp">Date of Birth:</label>
                <input type="date" name="dob" className="ip" onChange={(e) => setUdob(e.target.value)} value={udob || user.dob || ''}/>
            </div>
            <div className="p1">
                    <label htmlFor="gender" className="lp">Gender:</label>
                    <label htmlFor="g_male" className="lp">Male</label>
                    <input type="radio" id="g_male" name="gender" onChange={() => setUg('Male')} value="Male" checked={ug === 'Male'} />
                    <label htmlFor="g_female" className="lp">Female</label>
                    <input type="radio" id="g_female" name="gender" onChange={() => setUg('Female')} value="Female" checked={ug === 'Female'} />
                    <label htmlFor="g_other" className="lp">Other</label>
                    <input type="radio" id="g_other" name="gender" onChange={() => setUg('Other')} value="Other" checked={ug === 'Other'} />   
            </div>
            {/* Profile Picture */}
            <div className="p1">
                <label htmlFor="img" className="lp">Picture:</label>
                <input type="file" name="img" className="ip" onChange={(e) => setImage(e.target.files[0])}/>
            </div>
            {/* Country */}
            <div className="p1">
                <label htmlFor="country" className="lp">Country:</label>
                <input type="text" name="country" className="ip" value={uc || ''} readOnly />
            </div>

            {/* State */}
            <div className="p1">
                <label htmlFor="state" className="lp">State:</label>
                <input type="text" name="state" className="ip" value={us || ''} readOnly />
            </div>

            {/* City */}
            <div className="p1">
                <label htmlFor="city" className="lp">City:</label>
                <input type="text" name="city" className="ip" value={ucity || ''} readOnly />
            </div>

            {/* Pin Code */}
            <div className="p1">
                <label htmlFor="pin" className="lp">Pin Code:</label>
                <input type="text" name="pin" className="ip" onChange={handlePinCodeChange} value={up || user.pin_code || ''}/>
            </div>

            <button onClick={handleData}>Update</button>
    
    </div>
     );
}

export default EditProfile;