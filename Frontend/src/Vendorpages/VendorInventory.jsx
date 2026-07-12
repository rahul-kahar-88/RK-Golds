import { useEffect, useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import API from "../services/api";

function VendorInventory() {
  const [inventory, setInventory] = useState([]);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/vendor/inventory/", {
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
      const res = await API.patch(
        `/vendor/inventory/${id}/`,
        {
          available_stock: Number(stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      alert("Stock Updated");

      fetchInventory();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Inventory
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">
                  Product
                </th>

                <th className="p-3">
                  Stock
                </th>

                <th className="p-3">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b"
                >
                  <td className="p-3 font-bold">
                    {item.product_name}
                  </td>

                  <td className="p-3">
                    <input
                      type="number"
                      defaultValue={item.available_stock}
                      id={`stock-${item.id}`}
                      className="border p-2 w-24"
                    />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        updateStock(
                          item.id,
                          document.getElementById(
                            `stock-${item.id}`
                          ).value
                        )
                      }
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VendorInventory;