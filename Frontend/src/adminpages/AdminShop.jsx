import { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminShop() {
  const [data, setData] = useState({
    username: "",
    password: "",
    shop_name: "",
    address: "",
  });

  const token = localStorage.getItem("access");

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const createShop = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/shops/create_shop/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Shop Created");
    } catch (error) {
      console.log(
        "SHOP ERROR:",
        error.response?.data
      );

      alert(
        JSON.stringify(error.response?.data)
      );
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">
          Add New Shop
        </h1>

        <form
          onSubmit={createShop}
          className="bg-white shadow p-6 max-w-xl"
        >
          <input
            name="shop_name"
            placeholder="Shop Name"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="username"
            placeholder="Owner Username"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <input
            name="password"
            placeholder="Password"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            className="border p-3 w-full mb-3"
            onChange={handleChange}
          />

          <button
            className="bg-black text-white px-8 py-3"
          >
            Create Shop
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminShop;