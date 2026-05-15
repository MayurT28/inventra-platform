function ProductCard({
    product,
    handleDelete,
    handleEdit,
    handleStockAdjustment,
    role
}) {

    return (

        <div className="
        bg-white
        border border-gray-200
        rounded-lg
        p-5
        shadow-sm
        hover:shadow-md
        transition
    ">

            <div className="
            flex justify-between items-start
            mb-4
        ">

                <div>

                    <h3 className="
                    text-xl
                    font-semibold
                    text-gray-900
                ">
                        {product.name}
                    </h3>

                    <p className="
                    text-sm
                    text-gray-500
                    mt-1
                ">
                        {product.category}
                    </p>

                </div>

                {product.quantity <= 5 && (

                    <span className="
                    text-xs
                    font-medium
                    bg-red-100
                    text-red-700
                    px-2 py-1
                    rounded
                ">
                        Low Stock
                    </span>

                )}

            </div>

            <div className="space-y-2">

                <div className="
                flex justify-between
                text-sm
            ">

                    <span className="text-gray-500">
                        Quantity
                    </span>

                    <span className="
                    font-medium
                    text-gray-800
                ">
                        {product.quantity}
                    </span>

                </div>

                <div className="
                flex justify-between
                text-sm
            ">

                    <span className="text-gray-500">
                        Unit Price
                    </span>

                    <span className="
                    font-medium
                    text-gray-800
                ">
                        ₹{product.price}
                    </span>

                </div>

                <div className="
                flex justify-between
                text-sm
                pt-2
                border-t
            ">

                    <span className="
                    text-gray-700
                    font-medium
                ">
                        Stock Value
                    </span>

                    <span className="
                    font-semibold
                    text-gray-900
                ">
                        ₹{product.quantity * product.price}
                    </span>

                </div>

            </div>

            <div className="
    flex flex-wrap gap-2 mt-5
    pt-4 border-t
">

                {(role === "ADMIN" ||
                    role === "MANAGER") && (

                        <>
                            <button
                                onClick={() =>
                                    handleStockAdjustment(
                                        product.id,
                                        "IN"
                                    )
                                }
                                className="
                    px-3 py-2
                    text-sm
                    bg-gray-900
                    text-white
                    rounded-md
                    hover:bg-black
                    transition
                "
                            >
                                Stock In
                            </button>

                            <button
                                onClick={() =>
                                    handleStockAdjustment(
                                        product.id,
                                        "OUT"
                                    )
                                }
                                className="
                    px-3 py-2
                    text-sm
                    border
                    border-gray-300
                    rounded-md
                    hover:bg-gray-100
                    transition
                "
                            >
                                Stock Out
                            </button>

                            <button
                                onClick={() =>
                                    handleEdit(product)
                                }
                                className="
                    px-3 py-2
                    text-sm
                    border
                    border-gray-300
                    rounded-md
                    hover:bg-gray-100
                    transition
                "
                            >
                                Edit
                            </button>
                        </>

                    )}

                {role === "ADMIN" && (

                    <button
                        onClick={() =>
                            handleDelete(product.id)
                        }
                        className="
            px-3 py-2
            text-sm
            text-red-600
            border
            border-red-200
            rounded-md
            hover:bg-red-50
            transition
        "
                    >
                        Delete
                    </button>

                )}

            </div>

        </div>

    );
}

export default ProductCard;