import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Orders() {
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

      console.log(res.data);

      setOrders(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {loading ? (
          <h2>Loading...</h2>
        ) : orders.length === 0 ? (
          <h2>No Orders Found</h2>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-xl p-6 mb-8"
            >
              <h2 className="text-2xl font-bold">
                Order #{order.id}
              </h2>
              <p>
                Shop: {order.shop_name}
              </p>

              <p className="mt-2">
                Total:
                <span className="font-bold text-yellow-600 ml-2">
                  ₹{order.total_amount}
                </span>
              </p>

              <p>
                Status:
                <span className="ml-2 font-semibold">
                  {order.status}
                </span>
              </p>

              <div className="mt-5">
                <h3 className="text-xl font-bold mb-4">
                  Products
                </h3>

                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 items-center border-b py-3"
                  >
                    <img
                      src={item.product_image}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div>
                      <h4 className="font-bold">
                        {item.product_name}
                      </h4>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        Price: ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default Orders;