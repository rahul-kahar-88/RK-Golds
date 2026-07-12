import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function Wishlist() {
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get(
        "/wishlists/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const removeWishlist = async (id) => {
    try {
      await API.delete(
        `/wishlists/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">
          My Wishlist ❤️
        </h1>

        {items.length === 0 ? (
          <h2>No Wishlist Items</h2>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-5 bg-white shadow p-5 rounded mb-5"
            >
              <img
                src={item.product_image}
                className="w-28 h-28 object-cover"
              />

              <div className="flex-1">
                <h2 className="# ">
                  {item.product_name}
                </h2>

                <p className="text-yellow-600">
                  ₹{item.product_price}
                </p>
              </div>

              <button
                onClick={() =>
                  removeWishlist(item.id)
                }
                className="bg-red-500 text-white px-5 py-2 rounded"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
}

export default Wishlist;