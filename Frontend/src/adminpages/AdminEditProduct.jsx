import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import AdminNavbar from "../components/AdminNavbar";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const res = await API.get(`/products/${id}/`);

      setProduct(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("category", product.category);

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.patch(`/products/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Updated");

      navigate("/admin-products");
    } catch (error) {
      console.log(error.response?.data);

      alert("Update Failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          Edit Product
        </h1>

        <form
          onSubmit={updateProduct}
          className="bg-white p-6 rounded-xl shadow max-w-xl"
        >
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="border p-3 w-full mb-3"
            placeholder="Name"
          />

          <input
            name="price"
            value={product.price}
            onChange={handleChange}
            className="border p-3 w-full mb-3"
            placeholder="Price"
          />

          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="border p-3 w-full mb-3"
            placeholder="Description"
          />

          <input
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="border p-3 w-full mb-3"
            placeholder="Stock"
          />

          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            className="border p-3 w-full mb-3"
            placeholder="Category ID"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-3 w-full mb-3"
          />

          <button className="bg-black text-white px-8 py-3 rounded">
            Update Product
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminEditProduct;