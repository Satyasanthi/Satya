import { useSelector } from "react-redux";
import axios from "axios";
import './Order.css';
import { useEffect, useState } from "react";

function Order() {
    const uemail = useSelector((state) => state.email); 
    const first = useSelector((state) => state.firstName);
    const last = useSelector((state) => state.lastName); 
    const [products, setProducts] = useState([]);
    const [ratings, setRatings] = useState({}); // Store ratings for each product
    const [error, setError] = useState(null); // Error handling state
  useEffect(() => {
   const fetchItems = async () => {
    try {
      if (!uemail) {
         alert("Please login");
         return;
      }
      const response = await axios.get(`http://localhost:5000/order/${uemail}`);
      setProducts(response.data);
 // Pre-fill ratings state with the current ratings from fetched products
      const initialRatings = {};
      response.data.forEach(item => {
      initialRatings[item.image_id] = item.orating || 0;
     });
     setRatings(initialRatings);
     } catch (err) {
       console.error('Error fetching cart items:', err);
        setError("Failed to fetch orders. Please try again later.");
       }
       };
        fetchItems();
    }, [uemail]);
    const handleRatingClick = async (productId, orating, item) => {
       // Update ratings locally
       setRatings(prevRatings => ({ ...prevRatings, [productId]: orating }));
       const tr = (item.scount * item.rating + orating * item.quantity) / (item.scount + item.quantity);
      
       try {
       const response = await axios.post(`http://localhost:5000/order/rate`, { uemail, productId, orating, tr });
       console.log('Rating update response:', response);
      
       if (response.status === 200) {
        alert("updated succesffully");
       setError(null); // Clear any existing error message if the update is successful
       } else if(response.status===500){
        alert("alredy rated");
       }
       else {
          setError("Failed to save rating. Please try again.");
       }
     } catch (err) {
       console.error('Error saving rating:', err);
       setError("Failed to save rating. Please try again.");
      
       // Optionally revert the rating if saving fails
       setRatings(prevRatings => ({ ...prevRatings, [productId]: ratings[productId] }));
      }
      };
      
 return (
   <div className='cart'>
     <h1 className='carth2'>Welcome to {first} {last} Orders</h1>
      {error && <p className="error-message">{error}</p>}
      <div>
         {products.map(item => (
           <div key={item.image_id} className='cart-item'>
             <img src={`http://localhost:5000${item.image_url}`} alt={item.name} style={{ width: '200px', height: '200px' }} />
              <div className='cart-details'>
                 <strong>Title: {item.name}</strong>
                  <p>Price: ${item.price}</p>
                   <p>Quantity: {item.quantity}</p>
                    <p>Rating: {item.orating}</p>
                     <p>Total: {item.total}</p>
               </div>
               <div className="rating-section">
                 <p>Rating:</p>
                 <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        onClick={() => handleRatingClick(item.image_id, star,item)}
                                        className={`star ${star <= (ratings[item.image_id] || 0) ? 'active' : 'none'}`}>

                                        ⭐
                                    </span>
                                ))}
                            </div>
                    </div>
                  </div>
                ))}
          </div>
</div> );
}

export default Order;
