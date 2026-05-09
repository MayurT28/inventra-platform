import { useEffect, useState } from "react";
import API from "../services/api";

import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";

function Dashboard() {

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
                setProducts(response.data.data);
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

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
                    Inventra Inventory Dashboard
                </h1>

                <ProductForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    editId={editId}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {products.map((product) => (

                        <ProductCard
                            key={product.id}
                            product={product}
                            handleDelete={handleDelete}
                            handleEdit={handleEdit}
                        />

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;