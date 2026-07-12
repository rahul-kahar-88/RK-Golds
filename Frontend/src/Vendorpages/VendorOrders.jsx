import { useEffect, useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import API from "../services/api";

function VendorOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    API.get("/vendor/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setOrders(res.data.results || res.data);
    });
  };

  const updateStatus = async (id, status) => {
    await API.patch(
      `/vendor/orders/${id}/`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Updated");

    fetchOrders();
  };

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          My Shop Orders
        </h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow mb-5"
          >
            <h2 className="text-2xl font-bold">
              Order #{order.id}
            </h2>

            <p>
              Amount: ₹{order.total_amount}
            </p>

            <p>
              Status: {order.status}
            </p>

            <select
              className="border p-2 mt-3"
              value={order.status}
              onChange={(e) =>
                updateStatus(
                  order.id,
                  e.target.value
                )
              }
            >
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            <h3 className="font-bold mt-4">
              Products
            </h3>

            {order.items.map((item) => (
              <p key={item.id}>
                {item.product_name} x {item.quantity}
              </p>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default VendorOrders;