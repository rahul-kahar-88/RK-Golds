import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminCategory() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const token = localStorage.getItem("access");

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
      console.log(error);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/categories/",
        {
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Category Added");

      setName("");

      fetchCategories();
    } catch (error) {
      console.log(error.response?.data);

      alert("Failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Manage Category
        </h1>

        <form
          onSubmit={addCategory}
          className="bg-white p-6 rounded-xl shadow max-w-xl mb-10"
        >
          <input
            className="border p-3 w-full mb-4"
            placeholder="Category Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <button className="bg-black text-white px-8 py-3 rounded">
            Add Category
          </button>
        </form>

        <h2 className="text-2xl font-bold mb-5">
          All Categories
        </h2>

        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-5 rounded shadow"
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminCategory;