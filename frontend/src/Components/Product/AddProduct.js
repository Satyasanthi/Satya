import { useState ,useEffect} from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Link} from "react-router-dom";
import './Addproduct.css';
function Addproduct() {
    const uemail = useSelector((state) => state.email);
    const [ucat,setUcat]=useState("");
    const [udesc,setUdesc]=useState("");
    const [uldesc,setULdesc]=useState("");
    const [ucost,setUcost]=useState("");
    const [uacount,setUacount]=useState("");
    
    const [utitle,setUtitle]=useState("");
    const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [errorMsg,setErrorMsg]=useState("");
  const first = useSelector((state) => state.firstName);    
    const last= useSelector((state) => state.lastName);
//   Handle file input change
const handleReset=()=>{
    setUtitle("");
    setUacount("");
    setUcat("");
    setUdesc("");
    setImageUrl("");
    setUcost("");
}
  const handleFileChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (!selectedImage) {
     alert("Please select an image.");
     setErrorMsg("Please selecte an images");
     setTimeout(()=>{
        setErrorMsg("");
      },3000)
     return;
    }
    const formData = new FormData();
    formData.append("image", selectedImage);
     formData.append("email", uemail);  // Add email to form data
     formData.append("title", utitle);  // Add title
     formData.append("category", ucat); // Add category
     formData.append("descr", udesc);   // Add description
     formData.append("cost", ucost);    // Add cost
     formData.append("acount", uacount); // Add available count
     formData.append("ldescr", uldesc);   // Add Large description
     formData.append("rating",2);
     try {
     const response = await axios.post("http://localhost:5000/upload", formData, {
     headers: {
     "Content-Type": "multipart/form-data",
    },
     });
     console.log("alert succesfully added");
    
     setUploadMessage("Image uploaded successfully!");
     setTimeout(()=>{
        setUploadMessage("");
      },3000)
     setImageUrl(`http://localhost:5000${response.data.imageurl}`);
    
    } catch (error) {
     setErrorMsg("Image upload failed.");
     setTimeout(()=>{
        setErrorMsg("");
      },3000)
    console.error("Error uploading image:", error);
     }
 };
 const [allproducts, setAllproducts] = useState([]);
 useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/sell/${uemail}`);
      setAllproducts(response.data);
      console.log(response);
     } catch (error) {
      console.error('Error fetching :', error);
     }
   };
  fetchProduct();});
  const handleRemove = async (itemId) => {
    try {
      // Send DELETE request to remove the item from the cart on the server
      await axios.delete(`http://localhost:5000/sell/${uemail}/${itemId}`);
      
      // Update cart items state by filtering out the removed item
      setAllproducts(allproducts.filter(item => item.id !== itemId));
    } catch (err) {
     console.log('Error removing item:', err);  
    }
  };
 
  const categories = [
    { label: "Sweets", value: "sweets" },
    { label: "Designs", value: "designs" },
    { label: "Hot", value: "hot" },
    { label: "Flower", value: "flower" },
    { label: "Cakes", value: "cakes" },
    { label: "Vegetables", value: "veg" },
  ];
    return ( 
        <div className="A">
            <h3 className="ah3">Welcome to {first} {last}</h3>
            <div className="aall">
                <div className="apart1">
                {uploadMessage?<p style={{color:"green"}}>{uploadMessage}</p>:<p></p>}
                {errorMsg?<p style={{color:"red"}}>{errorMsg}</p>:<p></p>}
                <form onSubmit={handleSubmit}>
                    <div id="a1">
                        <label for="title">Product Name : </label>
                        <input type="text" name="title" onChange={(e) => setUtitle(e.target.value)} value={utitle}placeholder="Enter Name"  required/>
                    </div>
                    <div id="a1">
                        <label for="image">Upload Image</label>
                        <input type="file" name="image" onChange={handleFileChange} />
                    </div>
                    <div id="a1">
                        <label for="ca" className="category-label">Category : </label>
                        <div className="radio-group">
                            {categories.map((category) => (
                            <div className="radio-item" key={category.value}>
                                <label htmlFor={category.value}>{category.label}</label>
                                <input type="radio" name="ca" className="radio-input"value={category.value} onChange={(e) => setUcat(e.target.value)}
                                checked={ucat === category.value} required/>
                            </div>
                            ))}
                        </div>    
                    </div>
                    <div id="a1">
                        <label for="descr">Description : </label>
                        <input type="text" name="descr" onChange={(e) => setUdesc(e.target.value)} value={udesc}placeholder="Enter Description"  required/>
                    </div>
                    <div id="a1">
                        <label for="uldescr">Large Description : </label>
                        <input type="text" name="uldescr" onChange={(e) => setULdesc(e.target.value)} value={uldesc}placeholder="Enter Large Description"  required/>
                    </div>
                    <div id="a1">
                        <label for="cost">Cost : </label>
                        <input type="number" name="cost" onChange={(e) => setUcost(e.target.value)} value={ucost}placeholder="Enter Cost"  required/>
                    </div>
                    <div id="a1">
                        <label for="acount">Available count : </label>
                        <input type="number" name="acount" onChange={(e) => setUacount(e.target.value)} value={uacount}placeholder="Available count"  required/>
                    </div>
                    <button type="onSubmit" className="Add-button" >Add Product</button>
                    <button className="Reset" onClick={handleReset} >Reset</button>
                </form>
                </div>
                <div className="productlist">
                {allproducts.map(item => (
                    <div key={item.id} className='apart2' >
                        <img src={`http://localhost:5000${item.imageurl}`} alt={item.title} style={{ width: '200px' ,height:'200px'}} />
                        <div className='apart3'>
                            <div className="aa">
                                <label>Product Name:</label>
                                <p>{item.title}</p>
                            </div>
                            <div className="aa">
                                <label>Price: </label>
                                <p>${item.cost}</p>
                            </div>
                            <div className="aa">
                                <label>Available Count:</label>
                                <p>{item.acount}</p>
                            </div>
                            <div className="aa">
                                <label>Sold count:</label>
                                <p>{item.scount}</p>
                            </div>
                        </div>
                        <div className="apart4">
                            <button onClick={()=>handleRemove(item.id)} className="remove">Remove</button>
                            <Link to={`/edit/${item.id}`} ><button>Edit</button></Link>
                         </div>

                    </div>
                ))}
                </div>
           </div>
        </div>
     );
}

export default Addproduct;