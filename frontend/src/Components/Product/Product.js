import React,{useState} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Product.css';
import SocialShare from "./SocialShare";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import { FaStar,FaStarHalfAlt,FaRegStar } from 'react-icons/fa';
function Product(props) {
  const uemail = useSelector((state) => state.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weror,setWerror]=useState(null);
  
  const handleAddToCart = async ({ product, customerEmail }) => {
    setLoading(true);
    setError(null);
    if(customerEmail===null){
      setError("Please Login");
      setLoading(false);
    }else{
    try {
      const response = await axios.post('http://localhost:5000/cart', {
        customer_email: customerEmail,
        image_id: product.id,        // Product ID
        name: product.title,         // Product name
        descr: product.descr,        // Product description
        quantity: 1,                 // Product quantity
        price: product.cost,  
        scount:product.scount,
        acount:product.acount,       
        image_url: product.imageurl,
        rating:product.rating, // Image URL
      });

      // If the product is already in the cart, show an alert
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        // Product successfully added
        alert('Product added to cart successfully!');
        // console.log('Product added to cart:', response.data);
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
      setError("Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  }
   setTimeout(()=>{
    setError();
   },1000)
  };
  const handleAddTowish = async ({ product, customerEmail }) => {
    setWerror(null);
    if(customerEmail===null){
      setWerror("Please Login");
    }else{
    try {
      const response = await axios.post('http://localhost:5000/wishlist', {
        customer_email: customerEmail,
        image_id: product.id,        // Product ID
        name: product.title,         // Product name
        descr: product.descr,        // Product description
        quantity: 1,                 // Product quantity
        price: product.cost,
        scount:product.scount,
        acount:product.acount, 
        rating:product.rating,        // Product price
        image_url: product.imageurl, // Image URL
      });

      // If the product is already in the cart, show an alert
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        // Product successfully added
        alert('Product added to Wishlist successfully!');
        // console.log('Product added to cart:', response.data);
      }
    } catch (err) {
      console.error('Error adding product to Wishlist:', err);
      setWerror("Failed to add product to Wishlist");
    } 
    
  }
   setTimeout(()=>{
    setWerror();
   },1000)
  };
 
    return ( 
    <div className="pall" >
      {weror && <p style={{ color: 'red' }}>{weror}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="Ppart1">
          <div className="Ppart11">
            <div className="Ppart111">
            <Link to={`/product/${props.Id}`} onClick={props.Nodata} style={{color:"white", alignItems:"center"}}>
               <img src={props.imagurl} alt={props.originalName} style={{ width: "200px", height: "200px", border:"#964B00" ,bordersize:"2px" }}/>
               </Link>
                <div className="Ppart1112">
                   <div>
                    <FontAwesomeIcon onClick={() => handleAddTowish({product: props.pro, customerEmail:uemail})} disabled={loading} icon={faHeart} size="2x" color="red" className="w" />
                  </div> 
                    <SocialShare productUrl={`http://localhost:3000/product/${props.Id}`} /> 
                    {/* <SocialShare productUrl="http://localhost:3000/product/21" /> */} 
                </div>
              </div>
              <Link to={`/product/${props.Id}`} onClick={props.Nodata} style={{color:"white", alignItems:"center"}}>
                <div className="Ppart12">
                  <p>Name:{props.title}</p>
                  <p>Price:{props.cost}</p>
                  <p>Available count:{props.acount}</p>
                  <div className="Ppart121">
                    <div style={{display:"flex",gap:"2px"}}>
                      <span>Rating:</span>
                        {[...Array(5)].map((_, index) => {
                          const starValue = index + 1;
                          
                          // Determine which icon to use based on the decimal value of the rating
                          if (starValue <= Math.floor(props.rating)) {
                            return <FaStar key={index} size={15} color="gold" />;
                          } else if (starValue - props.rating < 0.75 && starValue - props.rating > 0.25) {
                            return <FaStarHalfAlt key={index} size={15} color="gold" />;
                          } else {
                            return <FaRegStar key={index} size={15} color="gray" />;
                          }
                        })}
                        <span>({props.scount})</span>
                    </div>
                  </div>
              </div> 
              </Link>
            </div>
          <div className="Ppart2" >
              <button onClick={() => handleAddToCart({product: props.pro, customerEmail:uemail})} disabled={loading} className="pb">
                  {loading ? 'Adding...' : 'Add to Cart'}
              </button>
          </div>
      </div>
    </div>
     );
}


export default Product;