import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");
  };

  return (
    <nav className="bg-black text-white px-8 py-5 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-500">
        RK Gold Admin
      </h1>

      <div className="flex gap-6">
        <Link to="/admin-dashboard">
          Dashboard
        </Link>

        <Link to="/admin-products">
          Products
        </Link>

        <Link to="/admin-category">
          Categories
        </Link>

        <Link to="/admin-orders">
          Orders
        </Link>

        <Link to="/admin-users">
          Users
        </Link>

        <Link to="/admin-shop">
          Shops
        </Link>

        <Link to="/admin-inventory">
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

export default AdminNavbar;
