function ProductForm({
    formData,
    handleChange,
    handleSubmit,
    editId
}) {

    return (

        <div className="bg-white p-6 rounded-xl shadow-md mb-10">

            <h2 className="text-2xl font-semibold mb-4">
                {editId ? "Edit Product" : "Add Product"}
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

    );
}

export default ProductForm;