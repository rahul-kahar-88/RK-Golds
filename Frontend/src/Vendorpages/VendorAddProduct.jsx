import { useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import API from "../services/api";

function VendorAddProduct() {
  const token = localStorage.getItem("access");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  const [image, setImage] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(product).forEach((key) => {
      formData.append(key, product[key]);
    });

    formData.append("image", image);

    try {
      await API.post("/vendor/products/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Added");
    } catch (error) {
      console.log(error.response?.data);

      alert("Failed");
    }
  };

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          Add Product
        </h1>

        <form
          onSubmit={addProduct}
          className="bg-white p-6 rounded-xl shadow max-w-xl"
        >
          <input
            name="name"
            placeholder="Product Name"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category ID"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            type="file"
            className="border p-3 w-full mb-3"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button className="bg-black text-white px-8 py-3 rounded">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}

export default VendorAddProduct;