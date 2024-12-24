const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 const multer = require('multer');
const pool = require('./db');
const cors = require('cors');
const path = require("path");
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

//Register
app.post('/sign', async (req, res) => {
    const { firstName, lastName, email, password, phno,imageurl} = req.body;

    try {
        const userExist = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert customer data
        const query = `
            INSERT INTO public.customer (first_name, last_name, email, password, encrypted_password,phone,imageurl)
            VALUES ($1, $2, $3, $4, $5, $6,$7)
            RETURNING email;
        `;
        const values = [firstName, lastName, email, password, hashedPassword, phno,imageurl];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'Customer registered successfully', email: result.rows[0].email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering customer', error: error.message });
    }
});
// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if user exists
      const user = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
  
      // Check if the user was found
      if (user.rows.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }
      // Check if password matches
      const storedPassword = user.rows[0].password;
      if (storedPassword !== password) {
        return res.json({ success: false, message: "Invalid password" });
      }
  
      // Successful login
      res.json({ user: user.rows[0], success: true, message: "Login successful" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

//get profile
app.post('/profile',async(req,res)=>{
  const { email} = req.body;
   try {
     // Check if user exists
     const user = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);
 
     // Check if the user was found
     if (user.rows.length === 0) {
       return res.status(404).json({ success: false, message: "User not found" });
     }
     res.json({ user: user.rows[0], success: true, message: "profile successful" });
   } catch (err) {
     console.error("Login error:", err);
     res.status(500).json({ success: false, message: "Server error" });
   }
 });
//update profile
const stor = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'photos/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const photo = multer({ storage: stor });

// Serve static files (uploaded images) from "photos" directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Update customer profile route
app.put('/photo', photo.single('image'), async (req, res) => {
  const { email } = req.body; // Email used as a unique identifier
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
 
  try {
    // Retrieve current profile data
    const currentProfile = await pool.query('SELECT * FROM customer WHERE email = $1', [email]);

    if (currentProfile.rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const existingData = currentProfile.rows[0];
    
    // Extract image file metadata if a new file was uploaded
    const { filename, originalname, mimetype, size } = req.file || {};
    const imageurl = req.file ? `/photos/${filename}` : existingData.imageurl;

    // Merge provided fields with existing data
    const updatedData = {
      dob: req.body.dob || existingData.dob,
      gender: req.body.gender || existingData.gender,
      country: req.body.country || existingData.country,
      state: req.body.state || existingData.state,
      city: req.body.city || existingData.city,
      pin_code: req.body.pin_code || existingData.pin_code,
      filename: filename || existingData.filename,
      imageurl: imageurl,
      originalname: originalname || existingData.originalname,
      mimetype: mimetype || existingData.mimetype,
      size: size || existingData.size,
      phno:req.body.phno||existingData.phone,
      password:req.body.pass||existingData.password,
    };

    // Construct the update query
    const query = `
      UPDATE customer 
      SET dob = $1, gender = $2, country = $3, state = $4, city = $5, pin_code = $6,
          filename = $7, imageurl = $8, originalname = $9, mimetype = $10, size = $11, updated_at = NOW(),phone=$12 
      WHERE email = $13
      RETURNING *`;

    const values = [
      updatedData.dob, updatedData.gender, updatedData.country, updatedData.state,
      updatedData.city, updatedData.pin_code, updatedData.filename, updatedData.imageurl,
      updatedData.originalname, updatedData.mimetype, updatedData.size, updateData.phno, email
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      user: result.rows[0],
      message: 'Profile updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Multer setup to store uploaded files in the "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
   cb(null, uniqueSuffix + "-" + file.originalname); },
  });
  
const upload = multer({ storage: storage });
  
  // Serve static files (uploaded images) from "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  
  // API route to upload image and save metadata to PostgreSQL
app.post("/upload", upload.single("image"), async (req, res) => {
          try {
          if (!req.file) {
          return res.status(400).send("No file uploaded.");
          }
  
          // File metadata
          const { filename, originalname, mimetype, size } = req.file;
          const { title,email, category, descr, cost, acount,ldescr,rating } = req.body;
          const imageUrl = `/uploads/${filename}`;
  
          // Insert image metadata into PostgreSQL
          const query = `
          INSERT INTO images (filename, imageUrl, originalName, mimetype, size, title,email, category, descr, cost, acount,large_description,rating)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13) RETURNING *`;
          const values = [filename, imageUrl, originalname, mimetype, size,title, email, category, descr, cost, acount,ldescr,rating ];
  
          const result = await pool.query(query, values);
          res.json({ result: result.rows[0] });
          } catch (err) {
          console.error("Error saving image metadata to PostgreSQL:", err);
          res.status(500).send("Error saving image metadata.");
          }
          });
//each product item by id

app.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);  // Return product details
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error });
  }
});
// API route to get all images
app.get("/images", async (req, res) => {
  try {
  const query = "SELECT * FROM images";
  const result = await pool.query(query);
  res.json(result.rows);
    } catch (err) {
     console.error("Error retrieving images:", err);
     res.status(500).send("Error retrieving images.");
    }
    }
);

// get  products Added by user
app.get('/sell/:email',async(req,res)=>{
  const { email } = req.params;
  try {
    const query = `
      SELECT * FROM public.images
      WHERE email = $1;
    `;
    const result = await pool.query(query, [email]);

    res.status(200).json(result.rows); // Return all cart items for this customer
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});
//remove products
app.delete('/sell/:email/:productid',async(req,res)=>{
  const {email,productid}=req.params;
  try{
    const query='Delete from images where email=$1 and id=$2;';
    const result=await pool.query(query,[email,productid]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Item successfully deleted from product' });
      
    } else {
    res.status(404).json({ error: 'Item not found in the product' });
    
    }
   } catch (error) {
    console.error('Error deleting cart item:', error);
   res.status(500).json({ error: 'Failed to delete cart item' });
   }
});

// Edit the Product information
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { acount, descr, cost,large_description } = req.body;

  try {
    // Build dynamic SQL query based on provided fields
    const fields = [];
    const values = [];
    let counter = 1;
    if (acount !== undefined) {
      fields.push(`acount = $${counter++}`);
      values.push(acount);
    }
    if (descr !== undefined) {
      fields.push(`descr = $${counter++}`);
      values.push(descr);
    }
    if (large_description !== undefined) {
      fields.push(`large_description = $${counter++}`);
      values.push(large_description);
    }
    if (cost !== undefined) {
      fields.push(`cost = $${counter++}`);
      values.push(cost);
    }
    if (fields.length === 0) {
      return res.status(400).send('No fields to update');
    }
    // Add id to the values array for the WHERE clause
    values.push(id);
    const query = `
      UPDATE images
      SET ${fields.join(', ')}
      WHERE id = $${counter}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});

//update product information when customer buy the goods
app.put('/stock/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  // Ensure that the quantity is a valid number
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ message: 'Invalid quantity provided' });
  }

  try {
    // Fetch current stock (scount) and available count (acount)
    const query = 'SELECT scount, acount FROM images WHERE id = $1;';
    const result = await pool.query(query, [id]);

    // If the product is not found, return a 404 error
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update stock counts
    const currScount = result.rows[0].scount + quantity;
    const currAcount = result.rows[0].acount - quantity;

    // Ensure stock counts do not go negative
    if (currAcount < 0) {
      return res.status(400).json({ message: 'Not enough items in stock' });
    }

    // Update the stock in the database
    const updateQuery = 'UPDATE images SET scount = $1, acount = $2 WHERE id = $3;';
    await pool.query(updateQuery, [currScount, currAcount, id]);

    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});

app.post('/cart', async (req, res) => {
  const { customer_email, image_id, name, descr, quantity, price,acount,scount, image_url,rating } = req.body;
  
  try {
    // Check if the customer already has a cart
    const cartQuery = `
      SELECT cart FROM public.customer
      WHERE email = $1;
    `;
    const cartResult = await pool.query(cartQuery, [customer_email]);

    let customerCart = [];
    if (cartResult.rows.length > 0) {
      customerCart = cartResult.rows[0].cart;
    }

    // Check if the product already exists in the customer's cart
    const productExists = customerCart.some(product => product.image_id === image_id);

    // If the product exists in the cart, return an error message
    if (productExists) {
      return res.json({ message: 'Product already added to cart ', success: false });
    }

    // Add the new product to the cart
    const newProduct = {
      image_id,
      name,
      descr,
      quantity,
      price,
      acount,
      scount,
      image_url,
      rating,
      added_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    customerCart.push(newProduct);

    // Update the cart in the database
    const updateCartQuery = `
      UPDATE public.customer
      SET cart = $2
      WHERE email = $1;
    `;
    const result = await pool.query(updateCartQuery, [customer_email, JSON.stringify(customerCart)]);
    
    // Respond with the added cart item
    res.status(201).json({ data: newProduct, success: true });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart', success: false });
  }
}
);

// Get cart items for a specific customer
app.get('/cart/:customer_email', async (req, res) => {
  const { customer_email } = req.params;
  try {
    const query = `
      SELECT cart FROM public.customer
      WHERE email = $1;
    `;
    const result = await pool.query(query, [customer_email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(result.rows[0].cart); // Return the cart items for this customer
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});
//update the incemrement values
app.put('/cart/:email/:productId', async (req, res) => {
  const { email, productId } = req.params;
  const { quantity } = req.body;

  try {
    // Retrieve the current cart
    const cartQuery = `SELECT cart FROM public.customer WHERE email = $1;`;
    const cartResult = await pool.query(cartQuery, [email]);
    let cart = cartResult.rows[0].cart || [];

    // Parse cart if it's a JSON string
    if (typeof cart === "string") {
      cart = JSON.parse(cart);
    }

    // Ensure productId is an integer for comparison
    const productIdInt = parseInt(productId);
    // Find and update the product by `image_id`
    let productFound = false;
    cart = cart.map((item) => {
      if (item.image_id === productIdInt) {  // Compare `image_id` with `productIdInt`
        productFound = true;
        return {
          ...item,
          quantity: parseInt(quantity),
          updated_at: new Date().toISOString(),
        };
      }
      return item;
    });

    // If the product was not found, return a 404 error
    if (!productFound) {
      res.status(404).json({ error: 'Product not found in cart' });
      return;
    }

    // Update the cart in the database
    const updateCartQuery = `UPDATE public.customer SET cart = $2::jsonb WHERE email = $1 RETURNING cart;`;
    const updateResult = await pool.query(updateCartQuery, [email, JSON.stringify(cart)]);

    res.status(200).json({ message: 'Quantity updated successfully', updatedCart: updateResult.rows[0].cart });

  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});
//remove each item
app.delete('/cart/:email/:itemId', async (req, res) => {
  const { email, itemId } = req.params;
  try {
    // Retrieve the current cart
    const cartQuery = `
      SELECT cart FROM public.customer
      WHERE email = $1;
    `;
    const cartResult = await pool.query(cartQuery, [email]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let customerCart = cartResult.rows[0].cart || [];

    // Filter out the item with the specified itemId
    const updatedCart = customerCart.filter(product => product.image_id !== parseInt(itemId, 10));

    // Check if the item was found and removed
    if (updatedCart.length === customerCart.length) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Update the cart in the database
    const updateCartQuery = `
      UPDATE public.customer
      SET cart = $2
      WHERE email = $1
      RETURNING cart;
    `;
    const updateResult = await pool.query(updateCartQuery, [email, JSON.stringify(updatedCart)]);

    res.status(200).json({ message: 'Item successfully deleted', updatedCart: updateResult.rows[0].cart });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});
//buy all items and add to order list
app.delete('/cart/:email', async (req, res) => {
  const { email } = req.params;
  try {
    // Retrieve the current cart and myorder for the given email
    const query = `SELECT cart, myorder FROM customer WHERE email = $1;`;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get the current cart and myorder (order) items
    let customerCart = result.rows[0].cart || [];
    let customerOrder = result.rows[0].myorder || [];

    // Merge cart items with the existing order (myorder)
    customerOrder = [...customerOrder];
    customerCart.forEach(element => {
      element["feedback"]=false;
      element["orating"]=0,
      element["total"]=element.price*element.quantity;
      customerOrder.push(element);
    });
    // Update the myorder with the new merged order (cart + existing myorder)
    const updateOrderQuery = `
      UPDATE public.customer
      SET myorder = $2
      WHERE email = $1
      RETURNING myorder;
    `;
    const orderUpdateResult = await pool.query(updateOrderQuery, [email, JSON.stringify(customerOrder)]);

    // After merging cart items with the order, clear the cart
    const clearCartQuery = `
      UPDATE public.customer
      SET cart = '[]'::jsonb
      WHERE email = $1
      RETURNING cart;
    `;
    const cartClearResult = await pool.query(clearCartQuery, [email]);
    // Respond with success
    if (cartClearResult.rowCount > 0) {
      res.status(200).json({ message: 'Cart items successfully added to order and cart cleared', success: true });
    } else {
      console.log('Failed to clear cart');
      res.status(404).json({ error: 'Failed to clear cart' });
    }
  } catch (error) {
    console.error('Error adding cart items to order:', error);
    res.status(500).json({ error: 'Failed to add cart items to order' });
  }
});


//get order

app.get('/order/:email', async (req, res) => {
 const { email } = req.params;
 try {
  const query = `SELECT myorder FROM customer WHERE email = $1;`;
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) {
     return res.status(404).json({ message: 'Customer not found' });
   }
    res.status(200).json(result.rows[0].myorder); // Return the cart items for this customer
   } catch (error) {
     console.error('Error fetching cart items:', error);
     res.status(500).json({ error: 'Failed to fetch cart items' });
   }
});

app.post('/order/rate', async (req, res) => {
    const { uemail, productId, orating, tr } = req.body;
  
    if (!uemail || !productId || orating == null) {
       return res.status(400).json({ error: 'User email, product ID, and rating are required' });
    }
  try { // Update product rating
     await pool.query(
       'UPDATE images SET rating = $1 WHERE id = $2',
        [tr, productId]
      );
       // Retrieve the current order for the user
        const orderQuery = 'SELECT myorder FROM customer WHERE email = $1;';
         const orderResult = await pool.query(orderQuery, [uemail]);
         let cart = orderResult.rows[0].myorder || [];
         // Parse cart if it's a JSON string
          if (typeof cart === "string") {
             cart = JSON.parse(cart);
           }
            // Ensure productId is an integer for comparison
             const productIdInt = parseInt(productId);
             let productFound = false;
             let precart=cart;
              cart = cart.map((item) => {
                if (item.image_id === productIdInt && item.orating===0) {
                   productFound = true;
                    return {
                       ...item,
                        orating: orating,
                        updated_at: new Date().toISOString(),
                       };
                   }
                else if(item.image_id === productIdInt){
                  productFound = true;
                }
                return item
              });
                 // If the product was not found, return a 404 error
                  if (!productFound) {
                    return res.status(404).json({ error: 'Product not found in cart' });
                  }
                   // Update the cart in the database
                   if(precart===cart){
                    return res.status(500).json({message:'already rated'});
                   }
                    const updateCartQuery = `UPDATE customer SET myorder = $2::jsonb WHERE email = $1 RETURNING myorder;`;
                   const updateResult = await pool.query(updateCartQuery, [uemail, JSON.stringify(cart)]);
                   res.status(200).json({ message: 'Rating updated successfully', updatedCart: updateResult.rows[0].myorder });
                  } catch (error) {
                     console.error('Error updating rating:', error);
                      res.status(500).json({ error: 'Failed to update rating' });
                  }
            });
  

//wishlist
app.post('/wishlist', async (req, res) => {
  const { customer_email, image_id, name, descr, quantity, price, scount,acount,image_url,rating } = req.body;
  
  try {
    // Check if the customer already has a cart
    const WQuery = `
      SELECT wishlist FROM public.customer
      WHERE email = $1;
    `;
    const WResult = await pool.query(WQuery, [customer_email]);

    let customerWish = [];
    if (WResult.rows.length > 0) {
      customerWish = WResult.rows[0].wishlist;
    }

    // Check if the product already exists in the customer's cart
    const productExists = customerWish.some(product => product.image_id === image_id);

    // If the product exists in the cart, return an error message
    if (productExists) {
      return res.json({ message: 'Product already added to wish due ', success: false });
    }

    // Add the new product to the cart
    const newProduct = {
      image_id,
      name,
      descr,
      quantity,
      price,
      scount,
      acount,
      image_url,
      rating,
      added_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    customerWish.push(newProduct);

    // Update the cart in the database
    const updateQuery = `
      UPDATE public.customer
      SET wishlist = $2
      WHERE email = $1;
    `;
    const result = await pool.query(updateQuery, [customer_email, JSON.stringify(customerWish)]);

    // Respond with the added cart item
    res.json({ data: newProduct, success: true });
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.json({ error: 'Failed to add product to Wishlist', success: false });
  }
}
);
app.delete('/wishlist/:email/:productId', async (req, res) => {
  const { email, productId } = req.params;
  try {
    // Retrieve the current cart
    const wishQuery = `
      SELECT wishlist FROM public.customer
      WHERE email = $1;
    `;
    const cartResult = await pool.query(wishQuery, [email]);

    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let customerWish = cartResult.rows[0].wishlist || [];

    // Filter out the item with the specified itemId
    const updatedCart = customerWish.filter(product => product.image_id !== parseInt(productId, 10));

    // Check if the item was found and removed
    if (updatedCart.length === customerWish.length) {
      return res.status(404).json({ error: 'Item not found in the cart' });
    }

    // Update the cart in the database
    const updateCartQuery = `
      UPDATE public.customer
      SET wishlist = $2
      WHERE email = $1
      RETURNING cart;
    `;
    const updateResult = await pool.query(updateCartQuery, [email, JSON.stringify(updatedCart)]);
    
    res.status(200).json({ message: 'Item successfully deleted', updatedCart: updateResult.rows[0].wishlist });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});


app.get('/wishlist/:email', async (req, res) => {
const { email } = req.params;
try {
  const wishlistQuery = `SELECT wishlist FROM public.customer WHERE email = $1;`;
  const result = await pool.query(wishlistQuery, [email]);
  if(result.rows.length===0){
    return res.status(404).json({ message: 'Customer not found' });
  }
  res.status(200).json(result.rows[0].wishlist);
} catch (error) {
  console.error('Error retrieving wishlist:', error);
  res.status(500).json({ error: 'Failed to retrieve wishlist' });
}
});
// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
    console.log("Database connected");
   });