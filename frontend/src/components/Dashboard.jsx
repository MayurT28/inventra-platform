import { useEffect, useState } from "react";
import API from "../services/api";

import ProductForm from "./ProductForm";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterCategory, setFilterCategory] = useState("ALL");
  const [analytics, setAnalytics] = useState(null);
  const [transactionSearch, setTransactionSearch] = useState("");

  const [transactionFilter, setTransactionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sales, setSales] = useState([]);

  const productsPerPage = 6;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [editId, setEditId] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
  });

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");

        return;
      }

      const response = await axios.get("http://localhost:8080/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Analytics Response:", response.data);

      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Analytics error:", error.response || error);
    }
  };

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

  const fetchSales = () => {
    API.get("/api/sales")

      .then((response) => {
        setSales(response.data.data);
      })

      .catch((error) => {
        console.error("Error fetching sales:", error);
      });
  };

  const fetchTransactions = () => {
    API.get("/api/transactions")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
    fetchTransactions();
    fetchSales();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  // Handle Form Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Edit Product
  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
    });

    setEditId(product.id);
  };

  const handleStockAdjustment = (productId, type) => {
    const quantity = prompt(`Enter quantity for ${type}`);

    if (!quantity) return;
    if (isNaN(quantity) || Number(quantity) <= 0) {
      alert("Enter valid quantity");

      return;
    }

    const product = products.find((p) => p.id === productId);

    if (type === "OUT" && Number(quantity) > product.quantity) {
      alert("Not enough stock");

      return;
    }

    API.put(`/api/products/${productId}/adjust-stock`, {
      quantity: Number(quantity),
      type: type,
    })
      .then(() => {
        fetchProducts();

        fetchTransactions();
      })
      .catch((error) => {
        console.error("Stock adjustment error:", error);
      });
  };

  // Delete Product
  const handleDelete = (id) => {
    API.delete(`/api/products/${id}`)
      .then(() => {
        fetchProducts();
        fetchTransactions();
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
          fetchTransactions();

          setFormData({
            name: "",
            category: "",
            quantity: "",
            price: "",
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
            price: "",
          });
        })
        .catch((error) => {
          console.error("Error adding product:", error);
        });
    }
  };

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    // Redirect to login
    navigate("/login");
  };

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.quantity <= 5,
  ).length;

  const totalInventoryValue = products.reduce(
    (total, product) => total + product.quantity * product.price,
    0,
  );

  const filteredProducts = [...products]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === "ALL" ? true : product.category === filterCategory;

      return matchesSearch && matchesCategory;
    });

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const categories = [
    "ALL",
    ...new Set(products.map((product) => product.category)),
  ];

  const categoryChartData = Object.entries(
    products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;

      return acc;
    }, {}),
  ).map(([name, value]) => ({
    name,
    value,
  }));

  const visibleCategories = categoryChartData.slice(0, 5);

  const topCategory = categoryChartData.reduce(
    (max, current) => (current.value > max.value ? current : max),
    categoryChartData[0] || {
      name: "-",
      value: 0,
    },
  );

  const revenueTrendData = Object.values(
    sales.reduce((acc, sale) => {
      const day = new Date(sale.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (!acc[day]) {
        acc[day] = {
          day,
          revenue: 0,
        };
      }

      acc[day].revenue += sale.totalAmount;

      return acc;
    }, {}),
  );

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = (transaction.product?.name || "")
      .toLowerCase()
      .includes(transactionSearch.toLowerCase());

    const matchesType =
      transactionFilter === "ALL"
        ? true
        : transaction.type === transactionFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Inventra Inventory Dashboard
            </h1>

            <div className="mt-3 inline-flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>

              <span className="text-gray-700">Logged in as</span>

              <span className="font-semibold text-gray-900 ml-2">
                {username}
              </span>

              <span className="mx-2 text-gray-400">•</span>

              <span className="font-semibold text-blue-700">{role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {role === "ADMIN" && (
              <button
                onClick={() => navigate("/register")}
                className="
        px-6
        py-4
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-blue-700
        text-white
        text-base
        font-semibold
        shadow-sm
        hover:shadow-md
        hover:scale-[1.02]
        transition-all
        duration-200
      "
              >
                Add Staff
              </button>
            )}

            <button
              onClick={handleLogout}
              className="
                px-12
                py-4
                rounded-xl
                bg-gradient-to-r
                from-red-500
                to-red-600
                text-white
                text-lg
                font-semibold
                shadow-sm
                hover:shadow-md
                hover:scale-[1.02]
                transition-all
                duration-200
              "
              >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div
            className="
      flex
      items-start
      justify-between
    "
          >
            <div>
              <div
                className="
          flex
          items-center
          gap-2
          mb-2
        "
              >
                <div
                  className="
            w-2
            h-2
            rounded-full
            bg-gray-900
          "
                />

                <p
                  className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-gray-400
          "
                >
                  Analytics
                </p>
              </div>

              <h2
                className="
          text-3xl
          font-bold
          text-gray-900
          leading-tight
        "
              >
                Business Analytics
              </h2>

              <p
                className="
          text-sm
          text-gray-500
          mt-2
        "
              >
                Revenue, inventory and operational insights
              </p>
              <div
                className="
    mt-5
    h-px
    w-300
    bg-gradient-to-r
    from-gray-900
    via-gray-300
    to-transparent
  "
              />
            </div>
          </div>
        </div>

        <div
          className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-4
    gap-4
    mb-5
"
        >
          <div
            className="
        bg-white
        border
        border-gray-200
        rounded-xl
        p-5
        shadow-sm
    "
          >
            <p
              className="
            text-sm
            text-gray-500
        "
            >
              Total Products
            </p>

            <h2
              className="
            text-3xl
            font-bold
            mt-2
            text-gray-900
        "
            >
              {analytics?.totalProducts || 0}
            </h2>
          </div>

          <div
            className="
        bg-white
        border
        border-red-100
        rounded-xl
        p-5
        shadow-sm
    "
          >
            <p
              className="
            text-sm
            text-gray-500
        "
            >
              Low Stock Items
            </p>

            <h2
              className="
            text-3xl
            font-bold
            mt-2
            text-red-600
        "
            >
              {analytics?.lowStockProducts || 0}
            </h2>
          </div>

          <div
            className="
        bg-white
        border
        border-green-100
        rounded-xl
        p-5
        shadow-sm
    "
          >
            <p
              className="
            text-sm
            text-gray-500
        "
            >
              Total Revenue
            </p>

            <h2
              className="
            text-3xl
            font-bold
            mt-2
            text-green-600
        "
            >
              ₹{analytics?.totalRevenue || 0}
            </h2>
          </div>

          <div
            className="
        bg-white
        border
        border-blue-100
        rounded-xl
        p-5
        shadow-sm
    "
          >
            <p
              className="
            text-sm
            text-gray-500
        "
            >
              Total Sales
            </p>

            <h2
              className="
            text-3xl
            font-bold
            mt-2
            text-blue-600
        "
            >
              {analytics?.totalSales || 0}
            </h2>
          </div>
        </div>

        <div
          className="
    grid
    grid-cols-1
    xl:grid-cols-3
    gap-5
    mb-5
  "
        >
          <div className="xl:col-span-2">
            <div
              className="
        bg-white
        border
        border-gray-200
        rounded-xl
        p-5
        shadow-sm
        h-full
      "
            >
              <div
                className="
          flex
          justify-between
          items-center
          mb-5
        "
              >
                <h2
                  className="
            text-xl
            font-semibold
            text-gray-900
          "
                >
                  Revenue Trend
                </h2>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 260,
                }}
              >
                <ResponsiveContainer>
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />

                    <XAxis dataKey="day" />

                    <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />

                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#5d8cf0"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        strokeWidth: 2,
                        fill: "#112142",
                      }}
                      activeDot={{
                        r: 7,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div
            className="
    bg-white
    border
    border-gray-200
    rounded-xl
    p-5
    shadow-sm
  "
          >
            <div
              className="
      flex
      justify-between
      items-center
      mb-5
    "
            >
              <h2
                className="
        text-lg
        font-semibold
        text-gray-900
      "
              >
                Category Distribution
              </h2>
            </div>

            <div
              style={{
                width: "100%",
                height: 260,
              }}
            >
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={3}
                    label={false}
                    labelLine={false}
                  >
                    {categoryChartData.map((entry, index) => {
                      const colors = [
                        "#111827",
                        "#1F2937",
                        "#374151",
                        "#4B5563",
                        "#6B7280",
                        "#9CA3AF",
                      ];

                      return (
                        <Cell
                          key={index}
                          fill={colors[index % colors.length]}
                        />
                      );
                    })}
                  </Pie>

                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} Products`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              className="
                -mt-6
                flex
                flex-wrap
                justify-center
                gap-x-5
                gap-y-2
                px-2
              "
            >
              {categoryChartData.slice(0, 4).map((category, index) => (
                <div
                  key={index}
                  className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-600
          min-w-0
        "
                >
                  <div
                    className="
            w-3
            h-3
            rounded-full
            bg-gray-700
            flex-shrink-0
          "
                  />

                  <span className="whitespace-nowrap">{category.name}</span>
                </div>
              ))}

              {categoryChartData.length > 4 && (
                <div
                  className="
        text-sm
        text-gray-500
        font-medium
      "
                >
                  +{categoryChartData.length - 4} Others
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="
    grid
    grid-cols-1
    md:grid-cols-3
    gap-4
    mb-5
  "
        >
          <div
            className="
      bg-white
      border
      border-gray-200
      rounded-xl
      p-5
      shadow-sm
    "
          >
            <p
              className="
        text-sm
        text-gray-500
      "
            >
              Top Category
            </p>

            <h2
              className="
        text-2xl
        font-bold
        mt-2
        text-gray-900
      "
            >
              {topCategory.name}
            </h2>

            <p
              className="
        text-sm
        text-gray-500
        mt-2
      "
            >
              {topCategory.value} products
            </p>
          </div>

          <div
            className="
      bg-white
      border
      border-gray-200
      rounded-xl
      p-5
      shadow-sm
    "
          >
            <p
              className="
        text-sm
        text-gray-500
      "
            >
              Inventory Value
            </p>

            <h2
              className="
        text-2xl
        font-bold
        mt-2
        text-gray-900
      "
            >
              ₹{totalInventoryValue}
            </h2>

            <p
              className="
        text-sm
        text-gray-500
        mt-2
      "
            >
              Current stock worth
            </p>
          </div>

          <div
            className="
      bg-white
      border
      border-gray-200
      rounded-xl
      p-5
      shadow-sm
    "
          >
            <p
              className="
        text-sm
        text-gray-500
      "
            >
              Recent Activity
            </p>

            <h2
              className="
        text-2xl
        font-bold
        mt-2
        text-gray-900
      "
            >
              {transactions.length}
            </h2>

            <p
              className="
        text-sm
        text-gray-500
        mt-2
      "
            >
              Inventory operations
            </p>
          </div>
        </div>

        <div className="mb-5">
          <div
            className="
      flex
      items-start
      justify-between
    "
          >
            <div>
              <div
                className="
          flex
          items-center
          gap-2
          mb-2
        "
              >
                <div
                  className="
            w-2
            h-2
            rounded-full
            bg-gray-900
          "
                />

                <p
                  className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-gray-400
          "
                >
                  Inventory
                </p>
              </div>

              <h2
                className="
          text-3xl
          font-bold
          text-gray-900
          leading-tight
        "
              >
                Inventory Managament
              </h2>

              <p
                className="
          text-sm
          text-gray-500
          mt-2
        "
              >
                inventory Operations
              </p>
              <div
                className="
    mt-5
    h-px
    w-300
    bg-gradient-to-r
    from-gray-900
    via-gray-300
    to-transparent
  "
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-3 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300
                px-3 py-2
                rounded-md
                bg-white
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-gray-200 flex-1"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {(role === "ADMIN" || role === "MANAGER") && (
          <ProductForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editId={editId}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              role={role}
              handleStockAdjustment={handleStockAdjustment}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="mb-5 mt-10">
          <div
            className="
      flex
      items-center
      justify-between
    "
          >
            <div>
              <div
                className="
          flex
          items-center
          gap-2
          mb-2
        "
              >
                <div
                  className="
            w-2
            h-2
            rounded-full
            bg-gray-900
          "
                />

                <p
                  className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-gray-400
          "
                >
                  Activity
                </p>
              </div>

              <h2
                className="
          text-3xl
          font-bold
          text-gray-900
        "
              >
                Inventory Activity
              </h2>

              <p
                className="
          text-sm
          text-gray-500
          mt-2
        "
              >
                Recent stock and operational transactions
              </p>
              <div
                className="
    mt-5
    h-px
    w-300
    bg-gradient-to-r
    from-gray-900
    via-gray-300
    to-transparent
  "
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search activity..."
            value={transactionSearch}
            onChange={(e) => setTransactionSearch(e.target.value)}
            className="border p-3 rounded-lg flex-1"
          />

          <select
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="ALL">All Actions</option>

            <option value="IN">IN</option>

            <option value="OUT">OUT</option>

            <option value="UPDATE">UPDATE</option>

            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Product</th>

                <th className="text-left p-4">Action</th>

                <th className="text-left p-4">Quantity</th>

                <th className="text-left p-4">By</th>

                <th className="text-left p-4">Time</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="p-4">
                    {transaction.product?.name ||
                      transaction.productNameSnapshot}
                  </td>

                  <td className="p-4">
                    <span
                      className={`
            px-3 py-1 rounded-full text-white text-sm font-semibold
            ${
              transaction.type === "IN"
                ? "bg-green-500"
                : transaction.type === "OUT"
                  ? "bg-red-700"
                  : transaction.type === "UPDATE"
                    ? "bg-yellow-500"
                    : "bg-red-500"
            }
        `}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td className="p-4">{transaction.quantity}</td>

                  <td className="p-4">{transaction.performedBy}</td>

                  <td className="p-4 text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
