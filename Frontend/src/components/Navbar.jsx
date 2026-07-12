import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Navbar({
  searchTerm = "",
  setSearchTerm = () => {},
}) {
  const token = localStorage.getItem("access");

  console.log("TOKEN:", token);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <>
      <header className="bg-gray-100 shadow-md">

        {/* Top Section */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 px-4 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center font-bold text-xl">
              RK
            </div>

            <h1 className="text-2xl font-bold">
              RK Gold
            </h1>
          </div>

          {/* Search */}
          <div className="flex items-center border rounded-full overflow-hidden bg-white w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search Jewellery..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 w-full lg:w-80 outline-none"
          />

            <button className="px-4">
              <FaSearch />
            </button>
          </div>

          {/* Auth Buttons */}

        <div className="flex flex-wrap justify-center gap-2">
          {token ? (
            <>
              <Link to="/cart">
                <button className="bg-yellow-500 text-white px-3 py-2 rounded text-sm">
                  🛒 Cart
                </button>
              </Link>

              <Link to="/orders">
                <button className="bg-blue-500 text-white px-3 py-2 rounded text-sm">
                  Orders
                </button>
              </Link>
              <Link to="/wishlist">
                <button className="bg-pink-500 text-white px-3 py-2 rounded text-sm">
                  ❤️ Wishlist
                </button>
              </Link>
              <Link to="/profile">
                <button className="bg-green-500 text-white px-3 py-2 rounded text-sm">
                  Profile
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-black text-white px-3 py-2 rounded text-sm">
                  Login
                </button>
              </Link>

              <Link to="/register">
                <button className="bg-yellow-500 text-white px-3 py-2 rounded text-sm">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        </div>

        {/* Categories */}
        <nav className="border-t">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 py-3 px-4 font-medium text-sm">
            <span>All Jewellery</span>
            <button
              onClick={()=>
              window.location.href="/products?category=1"
              }
              >
              Gold
            </button>
            <button
              onClick={()=>
              window.location.href="/products?category=2"
              }
              >
              Diamond
            </button>
            <button
              onClick={()=>
              window.location.href="/products?category=3"
              }
              >
              Earrings
            </button>
            <button
              onClick={()=>
              window.location.href="/products?category=4"
              }
              >
              Rings
            </button>
            <button
              onClick={()=>
              window.location.href="/products?category=5"
              }
              >
              Gemstone
            </button>
            <button>
              More
            </button>
          </div>
        </nav>

      </header>
    </>
  );
}

export default Navbar;