import { useEffect, useState } from "react";
import API from "../services/api";
import VendorNavbar from "../components/VendorNavbar";

function VendorDashboard() {
  const [shop, setShop] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    API.get("/vendor/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setShop(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold">
          Vendor Dashboard
        </h1>

        {shop && (
          <div className="bg-white p-6 mt-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-yellow-600">
              {shop.shop_name}
            </h2>

            <p className="mt-3">
              Owner :
              <span className="font-bold">
                {" "}
                {shop.owner}
              </span>
            </p>

            <p className="mt-2">
              Address :
              <span className="font-bold">
                {" "}
                {shop.address}
              </span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Products
            </h2>

            <p className="text-gray-500">
              Manage your products
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Orders
            </h2>

            <p className="text-gray-500">
              Check customer orders
            </p>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <h2 className="text-xl font-bold">
              Inventory
            </h2>

            <p className="text-gray-500">
              Manage stock
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;