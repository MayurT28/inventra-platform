import { useEffect, useState } from "react";
import axios from "axios";

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [latestSale, setLatestSale] = useState(null);
  const [showAllSales, setShowAllSales] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId, type) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          if (type === "INCREASE") {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          if (type === "DECREASE") {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const completeSale = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const saleItems = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        "http://localhost:8080/api/sales",
        {
          items: saleItems,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCart([]);
      setLatestSale(response.data.data);
      setShowInvoice(true);
      setLoading(false);

      fetchProducts();
      fetchSales();
    } catch (error) {
      console.error("Sale failed:", error);
      setLoading(false);
      alert("Sale failed");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" ? true : product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "ALL",
    ...new Set(filteredProducts.map((product) => product.category)),
  ];

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/api/sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSales(response.data.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div
      className="
            min-h-screen
            bg-gray-50
            p-6
        "
    >
      <div
        className="
                max-w-7xl
                mx-auto
            "
      >
        <h1
          className="
                    text-3xl
                    font-semibold
                    text-gray-900
                    mb-6
                "
        >
          Sales
        </h1>

        <div
          className="
    bg-white
    border border-gray-200
    rounded-lg
    p-4
    shadow-sm
    mb-6
"
        >
          <div
            className="
        flex
        flex-col
        md:flex-row
        gap-4
    "
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                flex-1
                border border-gray-300
                px-3 py-2
                rounded-md
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-gray-200
            "
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="
                border border-gray-300
                px-3 py-2
                rounded-md
                text-sm
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-gray-200
            "
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
          "
        >
          <div
            className="
                lg:col-span-2
            "
          >
            <div
              className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
          "
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="
                        bg-white
                        border
                        border-gray-200
                        rounded-lg
                        p-4
                        shadow-sm
                    "
                >
                  <h2
                    className="
                        text-lg
                        font-semibold
                        text-gray-900
                    "
                  >
                    {product.name}
                  </h2>

                  <p
                    className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                  >
                    {product.category}
                  </p>

                  <div
                    className="
                        mt-4
                        space-y-1
                    "
                  >
                    <p
                      className="
                            text-sm
                            text-gray-700
                        "
                    >
                      Stock: {product.quantity}
                    </p>

                    <p
                      className="
                            text-sm
                            font-medium
                            text-gray-900
                        "
                    >
                      ₹{product.price}
                    </p>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="
                            mt-4
                            w-full
                            bg-gray-900
                            text-white
                            py-2
                            rounded-md
                            text-sm
                            hover:bg-black
                            transition
                        "
                  >
                    Add To Bill
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div
            className="
                bg-white
                border border-gray-200
                rounded-lg
                p-5
                shadow-sm
                h-fit
                sticky top-6
            "
          >
            <h2
              className="
                  text-xl
                  font-semibold
                  text-gray-900
                  mb-4
              "
            >
              Current Bill
            </h2>

            {cart.length === 0 ? (
              <p
                className="
                text-sm
                text-gray-500
            "
              >
                No items added
              </p>
            ) : (
              <div
                className="
                space-y-3
            "
              >
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="
                            flex
                            justify-between
                            items-center
                            border-b
                            pb-2
                        "
                  >
                    <div>
                      <p
                        className="
                                font-medium
                                text-gray-900
                            "
                      >
                        {item.name}
                      </p>

                      <div
                        className="
                            flex
                            items-center
                            gap-2
                            mt-2
                        "
                      >
                        <button
                          onClick={() => updateQuantity(item.id, "DECREASE")}
                          className="
                                w-7 h-7
                                border
                                border-gray-300
                                rounded
                                text-sm
                                hover:bg-gray-100
                            "
                        >
                          -
                        </button>

                        <span
                          className="
                                text-sm
                                font-medium
                            "
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, "INCREASE")}
                          className="
                            w-7 h-7
                            border
                            border-gray-300
                            rounded
                            text-sm
                            hover:bg-gray-100
                        "
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p
                      className="
                            font-semibold
                            text-gray-900
                        "
                    >
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
                <div
                  className="
                        mt-6
                        pt-5
                    "
                >
                  <div
                    className="
                        flex
                        justify-between
                        items-center
                        mb-4
                        "
                  >
                    <p
                      className="
                            text-lg
                            font-semibold
                            text-gray-700
                        "
                    >
                      Total
                    </p>

                    <p
                      className="
                            text-3xl
                            font-bold
                            text-gray-900
                        "
                    >
                      ₹
                      {cart.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      )}
                    </p>
                  </div>

                  <button
                    onClick={completeSale}
                    disabled={cart.length === 0 || loading}
                    className="
                        w-full
                        bg-gray-900
                        text-white
                        py-3
                        rounded-md
                        font-medium
                        hover:bg-black
                        transition
                        disabled:bg-gray-400
                        disabled:cursor-not-allowed
                    "
                  >
                    {loading ? "Processing..." : "Complete Sale"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="
    mt-8
    bg-white
    border border-gray-200
    rounded-lg
    shadow-sm
"
        >
          <div
            className="
        px-5 py-4
        border-b
    "
          >
            <h2
              className="
            text-xl
            font-semibold
            text-gray-900
        "
            >
              Recent Sales
            </h2>
          </div>

          <div className="divide-y">
            {sales.slice(0, showAllSales ? sales.length : 5).map((sale) => (
              <div
                key={sale.id}
                className="
                    px-5 py-4
                    flex
                    justify-between
                    items-center
                "
              >
                <div>
                  <p
                    className="
                        font-medium
                        text-gray-900
                    "
                  >
                    Sale #{sale.id}
                  </p>

                  <p
                    className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                  >
                    {sale.soldBy}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="
                        text-lg
                        font-semibold
                        text-gray-900
                    "
                  >
                    ₹{sale.totalAmount}
                  </p>

                  <p
                    className="
                        text-sm
                        text-gray-500
                    "
                  >
                    {new Date(sale.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {sales.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllSales(!showAllSales)}
                className="
                px-4
                py-2
                rounded-lg
                border
                border-gray-300
                text-sm
                font-medium
                text-gray-700
                hover:bg-gray-100
                transition
              "
              >
                {showAllSales ? "Show Less" : "View More"}
              </button>
            </div>
          )}
        </div>
      </div>
      {showInvoice && latestSale && (
        <div
          className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
        p-4
    "
        >
          <div
            id="invoice-print"
            className="
            bg-white
            rounded-xl
            w-full
            max-w-lg
            shadow-2xl
            overflow-hidden
        "
          >
            <div
              className="
                px-6 py-5
                border-b
                flex
                justify-between
                items-center
            "
            >
              <div>
                <h2
                  className="
                        text-2xl
                        font-semibold
                        text-gray-900
                    "
                >
                  Invoice
                </h2>

                <p
                  className="
                        text-sm
                        text-gray-500
                        mt-1
                    "
                >
                  Sale completed successfully
                </p>
              </div>

              <button
                onClick={() => setShowInvoice(false)}
                className="
                        text-gray-400
                        hover:text-gray-700
                        text-xl
                    "
              >
                ×
              </button>
            </div>

            <div
              className="
                p-6
            "
            >
              <div
                className="
                    flex
                    justify-between
                    mb-6
                "
              >
                <div>
                  <p
                    className="
                            text-sm
                            text-gray-500
                        "
                  >
                    Sale ID
                  </p>

                  <p
                    className="
                            font-semibold
                            text-gray-900
                        "
                  >
                    #{latestSale.id}
                  </p>
                </div>

                <div
                  className="
                        text-right
                    "
                >
                  <p
                    className="
                            text-sm
                            text-gray-500
                        "
                  >
                    Sold By
                  </p>

                  <p
                    className="
                            font-semibold
                            text-gray-900
                        "
                  >
                    {latestSale.soldBy}
                  </p>
                </div>
              </div>

              <div
                className="
                    border rounded-lg
                    divide-y
                "
              >
                {latestSale.items.map((item) => (
                  <div
                    key={item.id}
                    className="
                                p-4
                                flex
                                justify-between
                                items-center
                            "
                  >
                    <div>
                      <p
                        className="
                                    font-medium
                                    text-gray-900
                                "
                      >
                        {item.productName}
                      </p>

                      <p
                        className="
                                    text-sm
                                    text-gray-500
                                    mt-1
                                "
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p
                      className="
                                font-semibold
                                text-gray-900
                            "
                    >
                      ₹{item.subtotal}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="
                    mt-6
                    flex
                    justify-between
                    items-center
                "
              >
                <p
                  className="
                        text-lg
                        font-semibold
                        text-gray-700
                    "
                >
                  Total
                </p>

                <p
                  className="
                        text-3xl
                        font-bold
                        text-gray-900
                    "
                >
                  ₹{latestSale.totalAmount}
                </p>
              </div>
              <div
                className="
    mt-6
    flex
    gap-3
"
              >
                <button
                  onClick={() => {
                    const printContents =
                      document.getElementById("invoice-print").innerHTML;

                    const printWindow = window.open(
                      "",
                      "",
                      "width=400,height=700",
                    );

                    printWindow.document.write(`

                        <html>

                        <head>

                        <title>
                        Receipt
                        </title>

                        <style>

                        body {

                            font-family:
                                Arial,
                                sans-serif;

                            padding: 20px;

                            width: 320px;

                            margin: auto;

                            color: #111;
                        }

                        .receipt-header {

                            text-align: center;

                            margin-bottom: 20px;
                        }

                        .receipt-header h1 {

                            margin: 0;

                            font-size: 24px;
                        }

                        .receipt-header p {

                            margin: 4px 0;

                            font-size: 13px;

                            color: #555;
                        }

                        .meta {

                            margin-bottom: 16px;

                            font-size: 14px;
                        }

                        .meta-row {

                            display: flex;

                            justify-content:
                                space-between;

                            margin-bottom: 6px;
                        }

                        table {

                            width: 100%;

                            border-collapse:
                                collapse;

                            margin-top: 10px;
                        }

                        th {

                            text-align: left;

                            border-bottom:
                                1px dashed #999;

                            padding-bottom: 8px;

                            font-size: 13px;
                        }

                        td {

                            padding: 10px 0;

                            border-bottom:
                                1px dashed #ddd;

                            font-size: 14px;
                        }

                        td:last-child,
                        th:last-child {

                            text-align: right;
                        }

                        .total {

                            margin-top: 20px;

                            display: flex;

                            justify-content:
                                space-between;

                            font-size: 22px;

                            font-weight: bold;
                        }

                        .footer {

                            margin-top: 25px;

                            text-align: center;

                            font-size: 12px;

                            color: #666;
                        }

                        </style>

                        </head>

                        <body>

                        <div class="receipt-header">

                            <h1>
                                Inventra Store
                            </h1>

                            <p>
                                Sales Receipt
                            </p>

                        </div>

                        <div class="meta">

                            <div class="meta-row">

                                <span>
                                    Sale ID
                                </span>

                                <span>
                                    #${latestSale.id}
                                </span>

                            </div>

                            <div class="meta-row">

                                <span>
                                    Staff
                                </span>

                                <span>
                                    ${latestSale.soldBy}
                                </span>

                            </div>

                            <div class="meta-row">

                                <span>
                                    Date
                                </span>

                                <span>
                                    ${new Date(latestSale.createdAt).toLocaleString()}
                                </span>

                            </div>

                        </div>

                        <table>

                        <thead>

                        <tr>

                        <th>
                        Item
                        </th>

                        <th>
                        Qty
                        </th>

                        <th>
                        Price
                        </th>

                        </tr>

                        </thead>

                        <tbody>

                        ${latestSale.items
                          .map(
                            (item) => `

                        <tr>

                        <td>
                        ${item.productName}
                        </td>

                        <td>
                        ${item.quantity}
                        </td>

                        <td>
                        ₹${item.subtotal}
                        </td>

                        </tr>

                        `,
                          )
                          .join("")}

                        </tbody>

                        </table>

                        <div class="total">

                        <span>
                        Total
                        </span>

                        <span>
                        ₹${latestSale.totalAmount}
                        </span>

                        </div>

                        <div class="footer">

                        Thank you for shopping

                        </div>

                        </body>

                        </html>

                        `);

                    printWindow.document.close();

                    printWindow.focus();

                    printWindow.print();

                    printWindow.close();
                  }}
                  className="
            flex-1
            bg-gray-900
            text-white
            py-3
            rounded-md
            font-medium
            hover:bg-black
            transition
        "
                >
                  Print Receipt
                </button>

                <button
                  onClick={() => setShowInvoice(false)}
                  className="
            flex-1
            border
            border-gray-300
            py-3
            rounded-md
            font-medium
            hover:bg-gray-100
            transition
        "
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesPage;
