import { useState,useEffect } from "react";
import './Home.css';
import axios from "axios";
import Product from '../Components/Product/Product';
import { useLocation } from 'react-router-dom';
function Home() {
    


    const [SelectedCategory,setSelectedCategory]=useState('all');
    const filterP=(category)=>{
        setSelectedCategory(category);
      };
      const [allproducts, setAllproducts] = useState([]);
  useEffect(() => {
    const fetchP = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/images`);
        setAllproducts(response.data);
       } catch (error) {
        console.error('Error fetching :', error);
       }
     };
    fetchP();});
    return ( 
        <div className="hall">
            <div style={{display:"flex", justifyContent:"center", alignitems: "center"}}>
                <img src='mainphoto.jpeg' alt='logo' width= "650px" height= "400px"/>
            </div>
            <section className="hpart1">  
                <button onClick={()=>filterP("all")} className='hbb'>All</button>        
                <button onClick={()=>filterP("sweets")} className='hbb'>Sweets</button> 
                <button onClick={()=>filterP("designs")} className='hbb'>Desgins</button>         
                <button onClick={()=>filterP("hot")} className='hbb'>Hot</button>         
                <button onClick={()=>filterP("flower")} className='hbb'>Flower</button>
                <button onClick={()=>filterP("cakes")} className='hbb'>Cakes</button>         
                <button onClick={()=>filterP("veg")} className='hbb'>Vegtables</button>  
            </section>
            <div className="hpart2">
                    {allproducts
                        .filter(product => (
                            (SelectedCategory === "all" || SelectedCategory === product.category)
                            // Ensure product.title is a string before calling toLowerCase
                            // (product.title && product.title.toLowerCase().includes(search.toLowerCase()))
                        ))
                        .map((product) => (
                            <Product
                                key={product.id}
                                Id={product.id}
                                imagurl={`http://localhost:5000${product.imageurl}`}
                                title={product.title}
                                cost={product.cost}
                                descr={product.descr}
                                ldescr={product.large_description}
                                originalName={product.title}
                                scount={product.scount}
                                acount={product.acount}
                                rating={product.rating}
                                pro={product}
                            />
                        ))}
                </div>
            </div>
     );
}

export default Home;