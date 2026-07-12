import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import API from "../services/api";

function AdminInventory() {
  const [inventory, setInventory] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInventory(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStock = async (id, stock) => {
    try {
      await API.patch(
        `/inventory/${id}/`,
        {
          available_stock: stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Stock Updated");

      fetchInventory();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Inventory Management
        </h1>

        <div className="space-y-5">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow p-6 rounded-xl"
            >
              <h2 className="text-2xl font-bold">
                {item.product_name}
              </h2>

              <p className="mt-3">
                Available Stock :
                <span className="font-bold">
                  {item.available_stock}
                </span>
              </p>

              <input
                type="number"
                className="border p-2 mt-4"
                defaultValue={item.available_stock}
                onBlur={(e) =>
                  updateStock(item.id, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminInventory;