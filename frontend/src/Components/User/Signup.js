import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import './Signup.css';
import axios from 'axios';
import Login from "./Login";
function Signup() {
    
    const [uf, setUF] = useState("");
    const [ulast, setULast] = useState("");
    const [uemail, setUEmail] = useState("");
    const [upass, setUPass] = useState("");
    const [ucon, setUCon] = useState("");
    const [uphn, setUPhn] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [
        'Images/Chekaralu.jpg',
        'Images/kakinada kaja.jpg',
        'Images/Lady.jpg',
        'Images/rose.jpg',
    ];
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    const onSubmit = async() => {
        setErrorMsg("");  // Reset the error message before validation
        setSuccessMsg(""); // Reset the success message before validation
        if(uf==="" || ulast==="" || uemail==="" || upass==="" || ucon===""|| uphn===""){
            setErrorMsg("Please enter the data");
            setTimeout(()=>{
                setErrorMsg("");
              },3000)
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
        setErrorMsg(message);
        setTimeout(()=>{
            setErrorMsg("");
          },3000)
        if(message!=="")
            return;
        // Check if passwords match
        if (ucon !== upass) {
            setErrorMsg("Passwords do not match.");
            setTimeout(()=>{
                setErrorMsg("");
              },3000)
            return;
        }
        
        try {
            const response = await axios.post('http://localhost:5000/sign', {
                firstName: uf,
                lastName: ulast,
                email: uemail,
                password: upass,
                phno: uphn,
                imageurl:''
            });
            console.log(response);
            if (response.status === 201) {
                setSuccessMsg('User registered successfully!');
                setTimeout(()=>{
                    setSuccessMsg("");
                  },3000);
                <Login />
            } else if(response.status === 400) {
                setErrorMsg('Failed to register user: ' + response.data.msg);
                return;
            }
        } catch (err) {
            setErrorMsg('Error: ' + (err.response?.data?.msg || 'Server error'));
        }
    };
    // Reset form values
    const handleClick = () => {
        setUF("");
        setULast("");
        setUEmail("");
        setUPass("");
        setUCon("");
        setUPhn("");
        setErrorMsg("");
        setSuccessMsg("");
    };
    return (
        <div className="sall">
            <div className="spart2">
                <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} style={{ width: '300px', height: '300px' }}/>
            </div>
            <div className="spart1">
                <h3 id="sh3">Create Account</h3>

                {/* Show error message if exists */}
                {errorMsg && <p style={{ color: 'red', textAlign:'center'}}>{errorMsg}</p>}

                {/* Show success message if exists */}
                {successMsg && <p style={{ color: 'green' ,textAlign:'center'}}>{successMsg}</p>}

                <div id="s1">
                    <label for="fname">First Name: </label>
                    <input type="text" name="fname" onChange={(e) => setUF(e.target.value)} value={uf} placeholder="Enter First Name" required/>
                </div>
                <div id="s1">
                    <label htmlFor="lname">Last Name: </label>
                    <input type="text" name="lname" onChange={(e) => setULast(e.target.value)} value={ulast} placeholder="Enter Last Name" required/>
                </div>
                <div id="s1">
                    <label htmlFor="email">Email: </label>
                    
                    <input type="email" name="email" onChange={(e) => setUEmail(e.target.value)} value={uemail} placeholder="Enter email" required/>
                    
                </div>
                <div id="s1">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => setUPass(e.target.value)} value={upass} placeholder="Enter Password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" 
                            title="Must contain at least 8 characters, including at least one number, one uppercase and lowercase letter, and one special character" required/>
                    {/* <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small> */}
                    {/* <div class="error-message" id="password-error"></div> */}
                </div>
                <small>Must be at least 8 characters, contain a number, uppercase and lowercase letters, and a special character.</small>
                <div id="s1">
                    <label for="cpass">Confirm Password: </label>
                    <input type="password" name="cpass" onChange={(e) => setUCon(e.target.value)} value={ucon} placeholder="Confirm Password" required/>
                </div>
                <div id="s1">
                    <label for="phone">Phone number:</label>
                    <input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={(e) => setUPhn(e.target.value)} value={uphn} placeholder="000-000-0000" required/>
                </div>
                <div id="s2">
                    <button type="reset" onClick={handleClick} className="sreset">Reset</button>
                    <button className="ssubmit" onClick={onSubmit} >Submit</button>
                    <Link to="/login" style={{ color: "white" }}><button className="slogin">Login</button></Link>
                </div>
            </div>
           
        </div>
    );
}

export default Signup;