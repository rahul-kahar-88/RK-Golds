import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminAddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  const token = localStorage.getItem("access");

  // GET CATEGORIES
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories(res.data);
    } catch (error) {
      console.log(
        "CATEGORY ERROR:",
        error.response?.data
      );
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("image", image);

    try {
      await API.post("/products/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product Added Successfully");

      window.location.href = "/admin-products";
    } catch (error) {
      console.log(
        "ADD PRODUCT ERROR:",
        error.response?.data
      );

      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Add Product
        </h1>

        <form
          onSubmit={addProduct}
          className="bg-white p-8 rounded-xl shadow max-w-xl"
        >
          <input
            className="border p-3 w-full mb-4"
            placeholder="Product Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 w-full mb-4"
            placeholder="Price"
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            className="border p-3 w-full mb-4"
            placeholder="Description"
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <select
            className="border p-3 w-full mb-4"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              Select Category
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <input
            className="border p-3 w-full mb-4"
            placeholder="Stock"
            onChange={(e) => setStock(e.target.value)}
          />

          <input
            type="file"
            className="border p-3 w-full mb-4"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

          <button className="bg-black text-white px-8 py-3 rounded">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminAddProduct;