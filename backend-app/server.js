// Import necessary libraries
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const productData = [
  {
    imgUrl:
      "https://guesseu.scene7.com/is/image/GuessEU/M63H24W7JF0-L302-ALTGHOST?wid=1500\u0026fmt=jpeg\u0026qlt=80\u0026op_sharpen=0\u0026op_usm=1.0,1.0,5,0\u0026iccEmbed=0",
    name: "CHECK PRINT SHIRT",
    price: 110.0,
  },
  {
    imgUrl:
      "https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700\u0026amp;fmt=jpeg\u0026amp;qlt=80\u0026amp;op_sharpen=0\u0026amp;op_usm=1.0,1.0,5,0\u0026amp;iccEmbed=0",
    name: "GLORIA HIGH LOGO SNEAKER",
    price: 91.0,
  },
  {
    imgUrl:
      "https://guesseu.scene7.com/is/image/GuessEU/HWVG6216060-TAN?wid=700\u0026amp;fmt=jpeg\u0026amp;qlt=80\u0026amp;op_sharpen=0\u0026amp;op_usm=1.0,1.0,5,0\u0026amp;iccEmbed=0",
    name: "CATE RIGID BAG",
    price: 94.5,
  },
  {
    imgUrl:
      "http://guesseu.scene7.com/is/image/GuessEU/WC0001FMSWC-G5?wid=520\u0026fmt=jpeg\u0026qlt=80\u0026op_sharpen=0\u0026op_usm=1.0,1.0,5,0\u0026iccEmbed=0",
    name: "GUESS CONNECT WATCH",
    price: 438.9,
  },
  {
    imgUrl:
      "https://guesseu.scene7.com/is/image/GuessEU/AW6308VIS03-SAP?wid=700\u0026amp;fmt=jpeg\u0026amp;qlt=80\u0026amp;op_sharpen=0\u0026amp;op_usm=1.0,1.0,5,0\u0026amp;iccEmbed=0",
    name: "'70s RETRO GLAM KEFIAH",
    price: 20.0,
  },
];

const userData = [
  {
    name: "Joe",
    username: "joe@connectedh.com",
    password: "joe@123",
    dob: new Date("1980-10-01"), // Updated format to a valid date
    mobile: "7763664463",
  },
  {
    name: "Richard",
    username: "richard@connectedh.com",
    password: "richard@123",
    dob: new Date("1986-03-25"), // Updated format to a valid date
    mobile: "7735463354",
  },
  {
    name: "Sean",
    username: "sean@connectedh.com",
    password: "sean@123",
    dob: new Date("1988-08-12"), // Updated format to a valid date
    mobile: "9876543554",
  },
  {
    name: "Mathew",
    username: "mathew@connectedh.com",
    password: "mathew@123",
    dob: new Date("1982-11-05"), // Updated format to a valid date
    mobile: "9987834223",
  },
];

// Set up Express
const app = express();
const port = 3001;

// Set up MongoDB connection
mongoose
  .connect(
    "mongodb+srv://ayushjoshi:ayush123@cluster0.djjkrvv.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Define user schema
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  mobile: Number,
  dob: Date,
  password: String,
});

const productSchema = new mongoose.Schema({
  imgUrl: String,
  name: String,
  price: Number,
});

const User = mongoose.model("users", userSchema);
const Product = mongoose.model("products", productSchema);

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "your_secret_key"
    );

    console.log("Generated Token:", token);

    res.status(200).json({ token, user: { username: user.username } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all products
app.get("/api/products", async (req, res) => {
  try {
    // Fetch products from the MongoDB database
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add all users
app.post("/api/addUsers", async (req, res) => {
  try {
    // Hash passwords before inserting users
    const usersWithHashedPasswords = userData.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, 10), // Hash the password
    }));

    // Use insertMany to add multiple users at once
    const addedUsers = await User.insertMany(usersWithHashedPasswords);

    res.status(201).json({
      success: true,
      message: "Users added successfully",
      users: addedUsers,
    });
  } catch (error) {
    console.error("Error adding users:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Add all products
app.post("/api/addProducts", async (req, res) => {
  try {
    // Use insertMany to add multiple products at once
    const addedProducts = await Product.insertMany(productData);

    res.status(201).json({
      success: true,
      message: "Products added successfully",
      products: addedProducts,
    });
  } catch (error) {
    console.error("Error adding products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
