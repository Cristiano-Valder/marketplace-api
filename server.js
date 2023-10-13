const Category = require('./model/categories.model');
const Product = require('./model/products.model');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());

// Define routes for products

app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  
  try {
    // Check if the category already exists
    const categoryName = req.body.category;
    const existingCategory = await Category.findOne({ name: categoryName });
    
    if (!existingCategory) {
      // Category doesn't exist, create a new one
      const newCategory = new Category({ name: categoryName });
      await newCategory.save();
    }
    
    // Save the product
    const product = await newProduct.save();
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Define routes for categories
app.post('/api/categories', (req, res) => {
  const newCategory = new Category(req.body);
  newCategory.save()
    .then(category => {
      res.json(category);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Database connection
mongoose.connect('mongodb+srv://cristianovalder:aMkIFWEsm4OByAMW@cluster0.uit0m2x.mongodb.net/Marketplace', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("DB connected...");
});

connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/api/products', (req, res) => {
  Product.find()
    .then(products => {
      res.json(products);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});



app.get('/', (req, res) => {
    res.json({ message: "Welcome to Scat-Bro Guitar Shop" });
  });
  

app.put('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const updatedData = req.body;

  Product.findByIdAndUpdate(productId, updatedData, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(updatedProduct);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Find products by name
app.get('/api/products/search', (req, res) => {
  const name = req.query.name;
  console.log(name); // Add this line for debugging
  Product.find({ name: { $regex: new RegExp(name, 'i') } })
    .then(products => {
      res.json(products);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});  

app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.delete('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  Product.findByIdAndRemove(productId)
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(deletedProduct);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Delete all products
app.delete('/api/products', (req, res) => {
    Product.deleteMany({})
      .then(() => {
        res.json({ message: 'All products deleted' });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  
  
   

app.get('/api/categories', (req, res) => {
  Category.find()
    .then(categories => {
      res.json(categories);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(8081, () => {
  console.log("Server is running on 8081....");
});
