
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navabar from './Components/Navabar';
import Home from './Components/Home';
import Login from './Components/User/Login';
import Signup from './Components/User/Signup';
import WishlistItem from './Components/User/wishlist';
import Profile from './Components/User/Profile';
import EditProfile from './Components/User/Editprofile';
import Addproduct from './Components/Product/AddProduct';
import EditProduct from './Components/Product/EditProduct';
import Productdetails from './Components/Product/Productdetails';
import Cart from './Components/User/Cart'
import Order from './Components/User/Order';
function App() {
  return (
    <Router>
      <Navabar/>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/Sign" element={<Signup />}/>
      <Route path="/wish" element={<WishlistItem />}/>
      <Route path="/profile" element={<Profile />}/>
      <Route path="/profile/Edit" element={<EditProfile />}/>
      <Route path="/addproduct" element={<Addproduct />}/>
      <Route path="/edit/:id" element={<EditProduct />}/>
      <Route path="/product/:id" element={<Productdetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
