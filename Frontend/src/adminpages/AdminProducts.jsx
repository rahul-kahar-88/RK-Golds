import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/");

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}/`, {
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
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Manage Products
        </h1>

        <button
          onClick={() => navigate("/admin-add-product")}
          className="bg-green-600 text-white px-6 py-3 rounded mb-8"
        >
          + Add Product
        </button>

        <div className="grid md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-xl p-5"
            >
              <img
                src={product.image}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="text-xl font-bold mt-4">
                {product.name}
              </h2>

              <p>
                ₹ {product.price}
              </p>

              <p>
                Stock : {product.stock}
              </p>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() =>
                    navigate(`/admin-edit-product/${product.id}`)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminProducts;