import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Cart = (isLoggedIn) => {
  const customerEmail = useSelector((state) => state.email);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const first = useSelector((state) => state.firstName);    
  const last= useSelector((state) => state.lastName);
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if(customerEmail===null)
          alert("Please  login");
        const response = await axios.get(`http://localhost:5000/cart/${customerEmail}`);
        setCartItems(response.data); // Set cart items from the backend response
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [customerEmail]);
  const handleRemove = async (itemId) => {
    const originalCartItems = [...cartItems];
    // Update the quantity in the local state optimistically
    const updatedCartItems = cartItems.filter(item => 
      item.image_id !== itemId
    );
    setCartItems(updatedCartItems);
    try {
      // Send DELETE request to remove the item from the cart on the server
      await axios.delete(`http://localhost:5000/cart/${customerEmail}/${itemId}`);
      
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item.');
      setCartItems(originalCartItems);
    }
  };
  const handleQuantityChange = async (productId, newQuantity) => {
    // Create a backup of the current cartItems in case we need to revert
    const originalCartItems = [...cartItems];
    // Update the quantity in the local state optimistically
    const updatedCartItems = cartItems.map(item => {
      if (item.image_id === productId) {
        return { ...item, quantity: newQuantity }; // Use a new object to avoid mutating state
      }
      return item;
    });
    setCartItems(updatedCartItems);
  
    try {
      // Make the API call to update quantity on the server
      const result = await axios.put(`http://localhost:5000/cart/${customerEmail}/${productId}`, {
        quantity: newQuantity,
      });
      console.log('API Response:', result.data);
  
    } catch (err) {
      console.error('Error updating quantity:', err.response ? err.response.data : err.message);
      setError('Failed to update quantity.');
      
      // Revert to the original cart items if the API request fails
      setCartItems(originalCartItems);
    }
  };
  const handleBuy = async () => {
    const prevCartItems = [...cartItems]; // Save a copy of the current cart items before clearing
    setCartItems([]);  // Optimistically clear the cart
    try {
      const result = await axios.delete(`http://localhost:5000/cart/${customerEmail}`);
      alert(result.data.message);  // Show success message from the server
      for(const item of prevCartItems){
        await axios.put(`http://localhost:5000/stock/${item.image_id}`,{quantity:item.quantity});
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item.');
      // Rollback to the previous cart state in case of an error
      setCartItems(prevCartItems); 
    }
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);


  return (
    <div className='cart'>
      <h2 className='carth2'>{first} {last}'s Cart</h2>
      <div className='cart-items'>
        {cartItems.map(item => (
          <div key={item.image_id} className='cart-item'>
            <img src={`http://localhost:5000${item.image_url}`} alt={item.name} style={{ width: '200px', height: '200px' }} />
            <div className='cart-details'>
              <strong>Name: {item.name}</strong>
              <p>Price: ${item.price}</p>
              <p>Available Count:{item.acount}</p>
              <p>Sold Count:{item.scount}</p>
              <p>Rating:{item.rating}</p>
            </div>
            <div className='quantity-control'>
                  <button onClick={() => handleQuantityChange(item.image_id, item.quantity + 1)}>
                    <FontAwesomeIcon icon={faPlus} />{/* Plus Icon */}
                  </button>
                 <p> { item.quantity }</p>
                 <button onClick={() => item.quantity > 1 && handleQuantityChange(item.image_id, item.quantity - 1)}
                   disabled={item.quantity <= 1}>
                   <FontAwesomeIcon icon={faMinus} /> {/* Minus Icon */}
                  </button>
            </div>
            
                <p>Total: ${item.quantity * item.price}</p>
                <button onClick={() => handleRemove(item.image_id)}>Remove</button>
            
          </div>
        ))}
      </div>
      <div className='last'>
      
      <button onClick={handleBuy}>Buy All Items</button>
      <p>Total All products Cost:    ${total}</p>
      </div>
    </div>
  );
}
  
export default Cart;
