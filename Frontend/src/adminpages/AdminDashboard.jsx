import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminDashboard() {
  const token = localStorage.getItem("access");

  const [data, setData] = useState({
    products: 0,
    orders: 0,
    users: 0,
    shops: 0,
    sales: 0,
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      console.log(
        "Dashboard Error:",
        error.response?.data
      );
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Welcome Admin 👑
        </h1>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Products
            </h2>

            <p className="text-3xl font-bold mt-3">
              {data.products}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Orders
            </h2>

            <p className="text-3xl font-bold mt-3">
              {data.orders}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Users
            </h2>

            <p className="text-3xl font-bold mt-3">
              {data.users}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Shops
            </h2>

            <p className="text-3xl font-bold mt-3">
              {data.shops}
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Sales
            </h2>

            <p className="text-3xl font-bold mt-3">
              ₹ {data.sales}
            </p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-5">
            Admin Controls
          </h2>

          <ul className="space-y-3">
            <li>
              ✅ Add / Update Products
            </li>

            <li>
              ✅ Manage Orders
            </li>

            <li>
              ✅ Manage Users
            </li>

            <li>
              ✅ Manage Categories
            </li>

            <li>
              ✅ Update Inventory
            </li>

            <li>
              ✅ Manage Shops
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;