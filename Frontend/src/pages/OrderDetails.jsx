import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    })
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!order) {
    return (
      <h2 className="text-center mt-10">
        Loading...
      </h2>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-4xl font-bold">
          Order #{order.id}
        </h1>

        <p className="mt-3">
          Status: <b>{order.status}</b>
        </p>

        <p>
          Date: {order.order_date}
        </p>

        <h2 className="text-2xl font-bold mt-8">
          Items
        </h2>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-5 shadow p-5 mt-5 rounded"
          >
            <img
              src={item.product.image}
              className="w-24 h-24 object-cover"
            />

            <div>
              <h2 className="font-bold">
                {item.product.name}
              </h2>

              <p>
                Qty: {item.quantity}
              </p>

              <p>
                ₹{item.price}
              </p>
            </div>
          </div>
        ))}

        <h2 className="text-3xl font-bold mt-10">
          Total ₹{order.total_amount}
        </h2>
      </div>

      <Footer />
    </>
  );
}

export default OrderDetails;