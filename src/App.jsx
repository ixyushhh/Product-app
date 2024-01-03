import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  useEffect(() => {
    // Check if the user is already logged in
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const selectProducts = JSON.parse(
      sessionStorage.getItem("selectedProducts")
    );

    // Fetch and display products
    fetchProducts();
    setSelectedProducts(selectProducts);
  }, [isLoggedIn]);

  // Function to handle user login
  const handleLogin = async () => {
    try {
      // Send a request to your backend for authentication
      const response = await axios.post(
        "http://localhost:3001/api/login",
        {
          username, // Assuming you changed the field to email in the backend
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      // Assuming your backend returns a token upon successful login
      const { token, user } = response.data;

      // Store user information in session storage
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      // Update state to reflect the user is logged in
      setLoggedIn(true);

      // Fetch and display products
      fetchProducts();
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  // Function to fetch and display products
  const fetchProducts = async () => {
    try {
      // Fetch products from your backend
      const response = await axios.get("http://localhost:3001/api/products", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      // Update state with the fetched products
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  // Function to handle product selection
  const handleProductSelect = (productId) => {
    // Find the selected product from the list
    const selectedProduct = products.find(
      (product) => product._id === productId
    );

    // Update state to store selected products in session
    setSelectedProducts([...selectedProducts, selectedProduct]);
    sessionStorage.setItem(
      "selectedProducts",
      JSON.stringify(selectedProducts)
    );
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear session storage and reset state

    setLoggedIn(false);
    setProducts([]);
    setSelectedProducts([]);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
            <h1 style={{ marginLeft: '10px' }}>
              Welcome, {JSON.parse(sessionStorage.getItem("user")).username}!
            </h1>
            <button onClick={handleLogout} className="px-8 py-4 bg-slate-500 m-2 text-white ">Logout</button>
          </div>

          <h2 className="font-semibold m-4">Select Products</h2>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table style={{ width: '100%', backgroundColor: '#f4f4f9' }}>
              <thead>
                <tr style={{ height: '10vh', backgroundColor: '#ced4da' }}>
                  <th>ID</th>
                  <th width='30%'>Image</th>
                  <th width='30%'>Name</th>
                  <th width='20%'>Price</th>
                  <th width='20%'>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td className="flex justify-center">
                      <img src={product.imgUrl} width={200} height={200} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <button onClick={() => handleProductSelect(product._id)} style={{ padding: '12px 26px' }}>
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination
            <div>
              {Array.from(
                { length: Math.ceil(products.length / productsPerPage) },
                (_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
            </div> */}

          {/* Display selected products */}
          <h2 style={{ margin: '50px', display: "flex", justifyContent: 'center', fontWeigh:'bold', fontSize:"25px" }} >Selected Products</h2>
          <ul>
            <div
              className="m-auto my-6 w-screen max-w-sm rounded-lg border border-gray-200 p-4 pt-4 shadow-sm sm:p-6 lg:p-8"
              aria-modal="true"
              role="dialog"
              tabIndex={-1}
            >
              <div className="mt-6 space-y-6">
              <ul className="space-y-4">
                {selectedProducts.map((selectedProduct) => (
                  // <li key={selectedProduct._id} style={{listStyle:'none', display:'flex', alignItems:'center', justifyContent:'end'}}>
                  //   {selectedProduct.name}{" "}
                  //   <img src={selectedProduct.imgUrl} width={100} height={100} />
                  // </li>

                  
                    <li key={selectedProduct._id} className="flex items-center gap-4">
                      <img
                        src={selectedProduct.imgUrl}
                        alt={selectedProduct.name}
                        className="h-16 w-16 rounded object-contain"
                      />
                      <div>
                        <h3 className="text-sm text-gray-900">{selectedProduct.name}</h3>
                        <p className="text-gray-600">{selectedProduct.price}</p>
                      </div>
                    </li>
                   ))}
                   </ul>


                    <div className="space-y-4 text-center">
                      <button
                        type="button"
                        className="w-full rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        View Cart (3)
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        Checkout
                      </button>
                      <a
                        href="#"
                        className="inline-block text-sm text-gray-600 transition hover:text-gray-700 hover:underline hover:underline-offset-4"
                      >
                        Continue shopping &rarr;
                      </a>
                    </div>

               
              </div>
            </div>
          </ul>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
