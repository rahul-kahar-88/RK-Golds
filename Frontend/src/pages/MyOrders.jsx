import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get("/orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setOrders(res.data.results || res.data);
    });
  }, []);

  return (
    <>
      <Navbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-xl shadow mb-5"
          >
            <h2 className="text-xl font-bold">
              Order #{order.id}
            </h2>

            <p>
              Shop: {order.shop_name}
            </p>

            <p>
              Amount: ₹{order.total_amount}
            </p>

            <p>
              Status: {order.status}
            </p>

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

export default MyOrders;