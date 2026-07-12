import { useEffect, useState } from "react";
import VendorNavbar from "../components/VendorNavbar";
import API from "../services/api";

function VendorShop() {
  const token = localStorage.getItem("access");

  const [shop, setShop] = useState(null);

  const [shopName, setShopName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    API.get("/vendor/shop/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setShop(res.data);

      setShopName(res.data.shop_name);
      setDescription(res.data.description || "");
      setPhone(res.data.phone || "");
    });
  }, []);

  const updateShop = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("shop_name", shopName);
    formData.append("description", description);
    formData.append("phone", phone);

    if (logo) {
      formData.append("logo", logo);
    }

    if (banner) {
      formData.append("banner", banner);
    }

    try {
      await API.patch("/vendor/shop/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Shop Updated");

      window.location.reload();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      <VendorNavbar />

      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Shop Settings
        </h1>

        <form
          onSubmit={updateShop}
          className="bg-white p-8 rounded-xl shadow max-w-xl"
        >
          <input
            className="border p-3 w-full mb-4"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Shop Name"
          />

          <textarea
            className="border p-3 w-full mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shop Description"
          />

          <input
            className="border p-3 w-full mb-4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />

          <label>
            Logo
          </label>

          <input
            type="file"
            className="border p-3 w-full mb-4"
            onChange={(e) => setLogo(e.target.files[0])}
          />

          <label>
            Banner
          </label>

          <input
            type="file"
            className="border p-3 w-full mb-4"
            onChange={(e) => setBanner(e.target.files[0])}
          />

          <button
            className="bg-black text-white px-8 py-3 rounded"
          >
            Update Shop
          </button>
        </form>
      </div>
    </>
  );
}

export default VendorShop;