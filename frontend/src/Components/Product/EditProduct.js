import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Addproduct from './AddProduct';
const EditProduct = () => {
    const { id } = useParams();

    // State for the product details
    const [price, setPrice] = useState(null);
    const [description, setDescription] = useState('');
    const [ldescription, setLDescription] = useState('');
    const [acount, setAcount] = useState(null);
    const [loading, setLoading] = useState(true);

    // Variables to hold the original values fetched from the API
    const [initialPrice, setInitialPrice] = useState(null);
    const [initialDescription, setInitialDescription] = useState('');
    const [initialLDescription, setInitialLDescription] = useState('');
    const [initialAcount, setInitialAcount] = useState(null);
    

    // Fetch product data when the component mounts
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/product/${id}`);

                // Set both current and initial state with product data
                setPrice(response.data.cost);
                setDescription(response.data.descr);
                setLDescription(response.data.large_description);
                setAcount(response.data.acount);
                // Store initial values to compare later
                setInitialPrice(response.data.cost);
                setInitialDescription(response.data.descr);
                setInitialAcount(response.data.acount);
                setInitialLDescription(response.data.large_description);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProductData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Initialize an empty object to hold only the updated fields
        const updatedFields = {};

        // Only add fields that have changed
        if (price !== initialPrice) updatedFields.cost = price;
        if (description !== initialDescription) updatedFields.descr = description;
        if (ldescription !== initialLDescription) updatedFields.large_description = ldescription;
        if (acount !== initialAcount) updatedFields.acount = acount;
        

        // Check if there's anything to update
        if (Object.keys(updatedFields).length === 0) {
            console.log("No fields were changed.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/products/${id}`, updatedFields);
            if (response.status >= 200 && response.status < 300) {
                alert("Product Updated");
                <Addproduct />
                console.log('Product updated:', response.data);
            } else {
                console.error('Error updating product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while fetching
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <br />
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <br />
            <label>
                Large Description:
                <input type="text" value={ldescription} onChange={(e) => setLDescription(e.target.value)} />
            </label>
            <br />
            <label>
                Available Count:
                <input type="number" value={acount} onChange={(e) => setAcount(e.target.value)} />
            </label>
            <br />
            <button type="submit">Update Product</button>
        </form>
    );
};

export default EditProduct;
