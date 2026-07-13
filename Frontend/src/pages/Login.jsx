import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/api/token/", {
        username,
        password,
      });

      const accessToken = response.data.access;

      localStorage.setItem("access", accessToken);
      localStorage.setItem("refresh", response.data.refresh);

      const user = await API.get("/user-info/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.setItem(
        "isAdmin",
        user.data.is_staff
      );

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 1500,
        showConfirmButton: false,
      });

      // ADMIN

      if (user.data.is_staff === true) {
        navigate("/admin-dashboard");
      }

      // CHECK VENDOR

      else {
        try {
          const vendor = await API.get(
            "/vendor/dashboard/",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // agar shop mili

          if (vendor.data.shop_name) {
            navigate("/vendor/dashboard");
          } else {
            navigate("/");
          }
        } catch (error) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(
        error.response?.data
      );

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid username or password",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white shadow-lg p-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 mb-4 rounded"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded"
        >
          Login
        </button>
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-600 font-semibold hover:underline"  >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;