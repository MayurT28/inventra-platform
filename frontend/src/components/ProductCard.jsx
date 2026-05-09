function ProductCard({ product, handleDelete, handleEdit }) {

    return (

        <div className="bg-white p-5 rounded-xl shadow-md">

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

            <div className="mt-4">

                <button
                    onClick={() => handleEdit(product)}
                    className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Delete
                </button>

            </div>

        </div>

    );
}

export default ProductCard;