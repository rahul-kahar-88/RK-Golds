import { useEffect, useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import API from "../services/api";

function VendorProducts() {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/vendor/products/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/vendor/products/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product Deleted");

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          My Products
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-xl p-5"
            >
              <img
                src={product.image}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="text-xl font-bold mt-3">
                {product.name}
              </h2>

              <p>
                ₹{product.price}
              </p>

              <p>
                Stock: {product.stock}
              </p>

              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default VendorProducts;