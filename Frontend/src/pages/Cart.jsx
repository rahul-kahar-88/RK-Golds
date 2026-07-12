import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await API.get("/cart-items/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      await API.patch(
        `/cart-items/${id}/`,
        {
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart-items/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchCartItems();
    } catch (error) {
      console.log(error);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay Loaded");
        resolve(true);
      };

      script.onerror = () => {
        console.log("Razorpay Failed");
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Razorpay Load Failed");
      return;
    }

    try {
      const res = await API.post(
        "/orders/create_payment/",
        {
          phone: phone,
          address: address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("RAZORPAY", res.data);

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "RK Gold",
        description: "Jewellery Purchase",
        order_id: res.data.id,

        handler: async function (response) {
          try {
            const verify = await API.post(
              "/orders/verify_payment/",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                phone: phone,
                address: address,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("VERIFY RESPONSE", verify.data);

            alert("Payment Successful");

            fetchCartItems();

            window.location.href = "/orders";
          } catch (error) {
            console.log("VERIFY ERROR", error.response?.data);

            console.log(
              "FULL VERIFY ERROR:",
              error.response?.data
            );

            alert(
              JSON.stringify(error.response?.data)
            );
          }
        },
      };

      const paymentObject =
        new window.Razorpay(options);

      paymentObject.open();
    } catch (error) {
      console.log(
        "PAYMENT ERROR",
        error.response?.data
      );

      alert("Payment Failed");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.product_price) *
        Number(item.quantity),
    0
  );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Cart
        </h1>

        {loading ? (
          <h2>Loading...</h2>
        ) : cartItems.length === 0 ? (
          <h2>Your Cart Is Empty</h2>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md p-5 rounded-xl flex gap-6 mb-5"
              >
                <img
                  src={item.product_image}
                  className="w-28 h-28 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="text-xl font-bold">
                    {item.product_name}
                  </h2>

                  <p className="text-yellow-600">
                    ₹{item.product_price}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                      className="bg-gray-200 px-3"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                      className="bg-gray-200 px-3"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                  className="bg-red-500 text-white px-4  rounded h-10 m-auto "
                >
                  Remove
                </button>
              </div>
            ))}

            <input
              type="text"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="border p-3 w-full mb-3"
            />

            <textarea
              placeholder="Delivery Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="border p-3 w-full mb-3"
            />

            <div className="mt-10">
              <h2 className="text-2xl font-bold">
                Total ₹{totalPrice}
              </h2>

              <button
                onClick={handlePayment}
                className="bg-black text-white px-8 py-3 mt-5 rounded"
              >
                Pay Now
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;
