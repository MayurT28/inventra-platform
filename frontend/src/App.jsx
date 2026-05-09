import { useEffect, useState } from "react";
import API from "./services/api";

function App() {

  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  // Fetch Products
  const fetchProducts = () => {

    API.get("/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // Submit Product
  const handleSubmit = (e) => {

    e.preventDefault();

    // UPDATE PRODUCT
    if (editId) {

      API.put(`/api/products/${editId}`, formData)
        .then(() => {

          fetchProducts();

          setFormData({
            name: "",
            category: "",
            quantity: "",
            price: ""
          });

          setEditId(null);

        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });

    }

    // ADD PRODUCT
    else {

      API.post("/api/products", formData)
        .then(() => {

          fetchProducts();

          setFormData({
            name: "",
            category: "",
            quantity: "",
            price: ""
          });

        })
        .catch((error) => {
          console.error("Error adding product:", error);
        });

    }

  };

  // Delete Product
  const handleDelete = (id) => {

    API.delete(`/api/products/${id}`)
      .then(() => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });

  };

  // Edit Product
  const handleEdit = (product) => {

    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price
    });

    setEditId(product.id);

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Inventra Inventory Dashboard
        </h1>

        {/* Product Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-10">

          <h2 className="text-2xl font-semibold mb-4">
            Add Product
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>

          </form>

        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {products.map((product) => (

            <div
              key={product.id}
              className="bg-white p-5 rounded-xl shadow-md"
            >

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h3>

              <p className="text-gray-600">
                Category: {product.category}
              </p>

              <p className="text-gray-600">
                Quantity: {product.quantity}
              </p>

              <p className="text-green-600 font-semibold mt-2">
                ₹{product.price}
              </p>

              <button
                onClick={() => handleEdit(product)}
                className="mt-4 mr-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(product.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default App;