import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import {  faShoppingCart,faHeart,faBagShopping,faUserCircle, faSearch} from '@fortawesome/free-solid-svg-icons';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector,useDispatch} from 'react-redux';
import './Navabar.css';
import Home from './Home';
function Navabar() {
    const dispatch = useDispatch();
    const {  isLoggedIn,imageUrl } = useSelector((state) => state);
    const [SelectedCategory,setSelectedCategory]=useState("all");
    const [search,setSearch]=useState("");
    const navigate = useNavigate();
    const handleSearch=()=>{
      navigate(`/?search=${encodeURIComponent(search)}&category=${encodeURIComponent(SelectedCategory)}`);
    }
    const [selectedWidth, setSelectedWidth] = useState(20);
    const [searchWidth, setSearchWidth] = useState('calc(100% -50px)');
  
    const filterP = (e) => {
      const selectedText = e.target.options[e.target.selectedIndex].text;
      const textLength = selectedText.length;

      setSelectedCategory(e.target.value);
      // Adjust widths based on text length
      if (textLength < 5) {
        setSelectedWidth(50);
        setSearchWidth('calc(100% - 50px)');
      } else if (textLength < 10) {
        setSelectedWidth(100);
        setSearchWidth('calc(100% - 100px)');
      } else {
        setSelectedWidth(150);
        setSearchWidth('calc(100% - 150px)');
      }
    };
  
  const filterPs=(searcht)=>{
    // setSelectedCategory("all");
    setSearch(searcht);
  }
    const onLogout=()=>{
        dispatch({ type: 'SET_LOGGED_IN', payload: false });
        dispatch({ type: 'SET_EMAIL', payload: null });
        dispatch({ type: 'SET_FIRST_NAME', payload: null });
        dispatch({ type: 'SET_LAST_NAME', payload: null });
        <Home />
    }
    return ( 
      <div>
        <div className='nall'>
            <Link to="/"><button className='nabout'>About</button></Link>
            <div className='nsearch'>
                <select className='noption' value={SelectedCategory} style={{ width: `${selectedWidth}px` }}
                    onChange={filterP}>
                        <option value="all">All</option>
                        <option value="sweets">Sweets</option>
                        <option value="designs">Designs</option>
                        <option value="hot">Hot Snacks</option>
                        <option value="flower">Flowers</option>
                        <option value="cakes">Cakes</option>
                        <option value="veg">Vegetables</option>
                </select>
                <input  type="text"  placeholder="Search" className='ns' value={search} style={{ width: searchWidth }}
                    onChange={(e) => filterPs(e.target.value)}/>
                <FontAwesomeIcon icon={faSearch} onClick={handleSearch}/>
            </div>
            <h3 className='ntitle'>Work Smart</h3>
            
            {isLoggedIn===true?(
                <Link to="/addproduct"><button className='nsold'>Sell product</button></Link>
                ):(
                  <button className='nsold'>Sell product</button>
                )
              }
              {isLoggedIn===true?(
                <Link to="/cart"><FontAwesomeIcon icon={faShoppingCart} color="black" size="2x" className='hc'/></Link>
              ):(<FontAwesomeIcon icon={faShoppingCart} size="2x" color="black" className='hc'/>)
              }
              
                {isLoggedIn===true ? (
                  <div className='npart2'>
                    <Link to="/profile">{imageUrl!=='' ?(<img src={`http://localhost:5000${imageUrl}`} alt='Hello' className='hp'/>):(<FontAwesomeIcon icon={faUserCircle} size="2x" className='hp'/>)}</Link>
                    <Link to="/wish"> <FontAwesomeIcon icon={faHeart} color="red" size="2x" className='hw'  /></Link>
                    <Link to="/order"><FontAwesomeIcon icon={faBagShopping} color="darkgreen" size="2x" className='ho'/></Link>
                    <Link to="/" style={{color:"white"}} ><button onClick={onLogout} className='nlogout'>Logout</button></Link>
                  </div>
                    ) : (
                  <div className='npart2'>
                    <Link to="/Login" style={{color:"white"}}><button className='nlogin'>Login</button></Link>
                    <Link to="/Sign" style={{color:"white"}}><button className='nsign' >Sign Up</button></Link>
                  </div>
                  )}
        </div>
      </div>
     );
}
export default Navabar;