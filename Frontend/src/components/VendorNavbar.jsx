import { Link, useNavigate } from "react-router-dom";

function VendorNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-500">
        Vendor Panel
      </h1>

      <div className="flex gap-6">
        <Link to="/vendor/dashboard">
          Dashboard
        </Link>

        <Link to="/vendor/shop">
            Shop Settings
        </Link>

        <Link to="/vendor/products">
          Products
        </Link>

        <Link to="/vendor/add-product">
          Add Product
        </Link>

        <Link to="/vendor/orders">
          Orders
        </Link>
        <Link to="/vendor/inventory">
          Inventory
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default VendorNavbar;