import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import './Login.css';
import React from 'react';
import {  useDispatch } from 'react-redux';
import axios from 'axios';
function Login() {
  const dispatch = useDispatch();

    const images = [
        'Images/Chekaralu.jpg',
        'Images/kakinada kaja.jpg',
        'Images/Lady.jpg',
        'Images/rose.jpg',
      ];
    const [currentIndex, setCurrentIndex] = useState(0);
      const [uemail,setUEmail]=useState("");
      const [upass,setUPass]=useState("");
      const [uerror,setUError]=useState("");
      
      useEffect(() => {
        const intervalId = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); 
    
        return () => clearInterval(intervalId);
      }, [images.length]);

    const handleClick=()=>{
        setUEmail('');
        setUPass(''); 
      }
      const change = async () => {
        if(uemail==="" || upass===""){
          setUError("Please enter the data");
          setTimeout(()=>{
            setUError("");
          },3000);
          return;
        }
        let message = '';

        if (upass.length < 8) {
        message = 'Password must be at least 8 characters long.';
        } else if (!/[A-Z]/.test(upass)) {
        message = 'Password must include an uppercase letter.';
        } else if (!/[a-z]/.test(upass)) {
        message = 'Password must include a lowercase letter.';
        } else if (!/\d/.test(upass)) {
        message = 'Password must include a number.';
        } else if (!/[@$!%*?&]/.test(upass)) {
        message = 'Password must include a special character.';
        }
        setUError(message);
        setTimeout(()=>{
          setUError("");
        },3000)
      if(message!=="")
          return;
        try {
          const profile = await axios.post("http://localhost:5000/login", {
            email: uemail,
            password: upass,
          });
          if(profile.data.success){
            alert("successfully Login to page");
            console.log(profile.data);
            dispatch({ type: 'SET_LOGGED_IN', payload: true });
            dispatch({ type: 'SET_EMAIL', payload: uemail });
            dispatch({ type: 'SET_FIRST_NAME', payload: profile.data.user.first_name });
            dispatch({ type: 'SET_LAST_NAME', payload: profile.data.user.last_name });
            dispatch({ type: 'SET_IMAGE_URL', payload: profile.data.user.imageurl });
            navigator("/");
            return;
           
          }else{
            setUError(profile.data.message);
            setTimeout(()=>{
                  setUError("");
                },3000);
            return;
          }

        }catch (error) {
          console.error(error);
          return null;
        }
        }
      return ( 
        <div className="lfull">
           <div className="lpart2">
                    <img src={images[currentIndex]} alt={"satya{images[currentIndex]}"}
                    style={{ width: '300px', height: '300px' }}/>
            </div>
            <div className="lpart1">
                <h3 className="lh2">Login To Your Account</h3>
                {uerror && <p style={{ color: 'red', textAlign:'center'}}>{uerror}</p>}
                 <div id="l2">
                    <label htmlFor="email">Email: </label>
                    <input type="email" name="email" onChange={(e) => setUEmail(e.target.value)} value={uemail} placeholder="Enter email" required/>
                </div>
                <div id="l2">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => setUPass(e.target.value)} value={upass} placeholder="Enter Password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" 
                            title="Must contain at least 8 characters, including at least one number, one uppercase and lowercase letter, and one special character" required/>
                    {/* <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small> */}
                    {/* <div class="error-message" id="password-error"></div> */}
                </div>
                <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small>
          
                <div id="l3">
                    <button type="reset" onClick={handleClick} className="lreset">Reset</button>
                     <button className="llogin" onClick={change}>submit</button>
                    <Link to="/Sign" style={{color:"white"}}><button className="lsign">Sign Up</button></Link>
                </div>
            </div>
        </div>
     );
}

export default Login;