import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const WishlistItem=()=>{
  const uemail=useSelector((state)=>state.email);
  const [wishlistItems, setwishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const first = useSelector((state) => state.firstName);    
  const last= useSelector((state) => state.lastName);
  useEffect(() => {
    const fetchwishlistItems = async () => {
      try {
        if(uemail===null)
          alert("Please  login");
        const response = await axios.get(`http://localhost:5000/wishlist/${uemail}`);
        setwishlistItems(response.data); // Set cart items from the backend response
      } catch (err) {
        console.error('Error fetching Wishlist items:', err);
        setError('Failed to load Wishlist items.');
      } finally {
        setLoading(false);
      }
    };

    fetchwishlistItems();
  }, [uemail]);
  const handleRemove = async (itemId,uemail) => {
    const originalwishlistItems = [...wishlistItems];
    // Update the quantity in the local state optimistically
    const updatedwishlistItems = wishlistItems.filter(item => 
      item.image_id !== itemId
    );
    setwishlistItems(updatedwishlistItems);
    try {
      // Send DELETE request to remove the item from the cart on the server
      await axios.delete(`http://localhost:5000/wishlist/${uemail}/${itemId}`);
      
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item.');
      setwishlistItems(originalwishlistItems);
    }
  };
  if (loading) {
    return <p>Loading cart...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  const handleAddToCart = async (image_id,image_url,price,name,descr,uemail,rating) => {
    if(uemail===null){
      setError("Please Login");
    }else{
    try {
      const response = await axios.post('http://localhost:5000/cart', {
        customer_email: uemail,
        image_id: image_id,        // Product ID
        name: name,         // Product name
        descr: descr,        // Product description
        quantity: 1,                 // Product quantity
        price: price,         // Product price
        image_url: image_url, // Image URL
        rating:rating,
      });
      console.log(response);
      // If the product is already in the cart, show an alert
      if (!response.data.success) {
        alert(response.data.message);
      } else {
        // Product successfully added
        alert('Product added to wishlist successfully!');
        handleRemove(image_id,uemail);
      }
    } catch (err) {
      console.error('Error adding product to Wishlist:', err);
      setError("Failed to add product to Wishlist");
    } 
  }
   setTimeout(()=>{
    setError();
   },1000)
  };
  return(
    <div className='cart'>
      <h2 className='carth2'>{first} {last}'s Wishlist</h2>
      <div className='cart-items'>
        {wishlistItems.map(item => (
          <div key={item.image_id} className='cart-item'>
            <img src={`http://localhost:5000${item.image_url}`} alt={item.name} style={{ width: '200px', height: '200px' }} />
            <div className='cart-details'>
              <strong>Name: {item.name}</strong>
              <p>Price: ${item.price}</p>
              <p>Sold count: {item.scount}</p>
              <p>Aviable count: {item.acount}</p>
              <p>Rating: {item.rating}</p>
            </div>
                <button onClick={() => handleRemove(item.image_id,uemail)}>Remove</button>
                <button onClick={() => handleAddToCart(item.image_id,item.image_url,item.price,item.name,item.descr,uemail,item.rating)}>Add to cart</button>
          </div>
        ))}
      </div>
      <div className='last'>
      </div>
    </div>
  );
}

export default WishlistItem;
