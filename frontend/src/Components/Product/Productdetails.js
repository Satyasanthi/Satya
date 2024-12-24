import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Productdetails.css';
import SocialShare from './SocialShare';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
const Productdetails = (Nodata) => {
  const { id } = useParams();  // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details by ID from the backend
    const fetchProduct=async()=>{
        
        try {
            const response=await axios.get(`http://localhost:5000/product/${id}`);
            setProduct(response.data);
            Nodata();
        }catch (error) {
            console.error('Error fetching :', error);
           }
         };
        fetchProduct();});
  console.log(product);
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
  <div className='pdall'>
    {weror && <p style={{ color: 'red' }}>{weror}</p>}
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <div className='pdpart1'>
      <div className='pd'>
        <p><strong>Title:</strong></p>
        <p>{product.title}</p>
      </div>
      <div className='pd'>
      <img src={`http://localhost:5000${product.imageurl}`} alt={product.name} style={{ width: "200px", height: "200px" }} />
      <div className='pdn'>
              <button><FontAwesomeIcon onClick={() => handleAddTowish({product: product, customerEmail:uemail})} disabled={loading} icon={faHeart} size="1x" color="red" className="w" />Wishlist</button>
              <button onClick={() => handleAddToCart({product: product, customerEmail:uemail})} disabled={loading}>
                  {loading ? 'Adding...' : 'Add to Cart'}
              </button>
             <SocialShare productUrl={`http://localhost:3000/product/${product.id}`} /> 
      </div>
      </div>
      <div className='pd'>
        <p><strong>Description:</strong></p>
        <p> {product.descr}</p>
      </div>
      <div className='pd'>
        <p><strong>Product Description:</strong></p>
        <p> {product.large_description}</p>
      </div>
      <div className='pd'>
        <p><strong>Price:</strong></p>
        <p> ${product.cost}</p>
      </div>
      <div className='pd'>
        <p><strong>Sell count:</strong></p>
        <p> {product.scount}</p>
      </div>
      <div className='pd'>
        <p><strong>Avaliable:</strong></p>
        <p> {product.acount}</p>
      </div>
    </div>
    
    
    </div>
  );
};

export default Productdetails;
