import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.results || res.data);
    } catch (error) {
      console.log("ORDER ERROR:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `/orders/${id}/`,
        { status: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status Updated");

      fetchOrders();
    } catch (error) {
      console.log("STATUS ERROR:", error.response?.data);

      alert("Failed To Update");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Manage Orders
        </h1>

        {loading ? (
          <h2>Loading Orders...</h2>
        ) : orders.length === 0 ? (
          <h2 className="text-xl">
            No Orders Found
          </h2>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-xl p-6"
              >
                <h2 className="text-2xl font-bold">
                  Order #{order.id}
                </h2>
                
                <p className="text-1xl">
                Shop: {order.shop_name}
                </p>

                <p className="mt-3">
                  Amount :
                  <span className="font-bold">
                    ₹{order.total_amount}
                  </span>
                </p>

                <p>
                  Date :
                  {new Date(order.order_date).toLocaleString()}
                </p>

                <p>
                  Mobile :
                  <span className="font-bold">
                    {order.phone || "Not Provided"}
                  </span>
                </p>

                <p>
                  Address :
                  <span className="font-bold">
                    {order.address || "Not Provided"}
                  </span>
                </p>

                <p className="mt-3">
                  Status :
                  <span className="font-bold ml-2">
                    {order.status}
                  </span>
                </p>

                <select
                  className="border p-2 mt-4 rounded"
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Processing">
                    Processing
                  </option>
                  <option value="Delivered">
                    Delivered
                  </option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default AdminOrders;