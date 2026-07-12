import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addWishlist = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {
      await API.post(
        "/wishlists/",
        {
          product: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added To Wishlist ❤️");
    } catch (error) {
      console.log(
        "WISHLIST ERROR:",
        error.response?.data
      );

      alert("Already Added / Failed");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please Login First");
      return;
    }

    try {
      const cartResponse = await API.get(
        "/carts/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let cartId;

      if (cartResponse.data.length > 0) {
        cartId = cartResponse.data[0].id;
      } else {
        const newCart = await API.post(
          "/carts/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        cartId = newCart.data.id;
      }

      await API.post(
        "/cart-items/",
        {
          cart: cartId,
          product: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product Added To Cart");
    } catch (error) {
      console.log(
        "ADD CART ERROR:",
        error.response?.data
      );

      alert("Failed To Add Cart");
    }
  };

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!product) {
    return (
      <h2 className="text-center mt-10">
        Loading...
      </h2>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {product.name}
            </h1>

            <p className="mt-5 text-gray-600">
              {product.description}
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-6">
              ₹{product.price}
            </h2>

            <p className="mt-4">
              Stock:
              <b>{product.stock}</b>
            </p>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() =>
                  setQuantity(quantity - 1)
                }
                disabled={quantity === 1}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                -
              </button>

              <span className="font-bold text-xl">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                disabled={
                  quantity >= product.stock
                }
                className="bg-gray-200 px-4 py-2 rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-8 bg-black text-white px-10 py-3 rounded-lg"
            >
              {product.stock === 0
                ? "Out Of Stock"
                : "Add To Cart"}
            </button>

            <button
              onClick={addWishlist}
              className="mt-4 ml-3 border border-yellow-500 px-8 py-3 rounded-lg"
            >
              ❤️ Add Wishlist
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductDetails;