import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Products from "./pages/Products";
import AdminProducts from "./adminpages/AdminProducts";
import AdminDashboard from "./adminpages/AdminDashboard";
import AdminAddProduct from "./adminpages/AdminAddProduct";
import AdminOrders from "./adminpages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import AdminInventory from "./adminpages/AdminInventory";
import AdminCategory from "./adminpages/AdminCategory";
import AdminShop from "./adminpages/AdminShop";
import VendorDashboard from "./Vendorpages/VendorDashboard";
import VendorAddProduct from "./Vendorpages/VendorAddProduct";
import VendorProducts from "./Vendorpages/VendorProducts";
import VendorOrders from "./Vendorpages/VendorOrders";
import VendorInventory from "./Vendorpages/VendorInventory";
import PublicShop from "./pages/PublicShop";
import MyOrders from "./pages/MyOrders";
import VendorShop from "./Vendorpages/VendorShop";
import AdminEditProduct from "./adminpages/AdminEditProduct";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        {/* Product details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* agar kahin /products/id aa raha ho */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/admin-products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin-add-product"
          element={<AdminAddProduct />}
        />

        <Route
          path="/admin-orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin-inventory"
          element={<AdminInventory />}
        />

        <Route
          path="/admin-shop"
          element={<AdminShop/>}
        />

        <Route
          path="/vendor/dashboard"
          element={<VendorDashboard/>}
        />

        <Route
          path="/vendor/add-product"
          element={<VendorAddProduct/>}
        />

        <Route
          path="/vendor/products"
          element={<VendorProducts/>}
        />

        <Route
          path="/vendor/orders"
          element={<VendorOrders/>}
        />

        <Route
          path="/vendor/inventory"
          element={<VendorInventory/>}
        />

        <Route
          path="/shop/:slug"
          element={<PublicShop/>}
        />

        <Route
          path="/orders"
          element={<MyOrders/>}
        />

        <Route
          path="/vendor/shop"
          element={<VendorShop/>}
        />

        <Route
          path="/admin-edit-product/:id"
          element={<AdminEditProduct/>}
        />

        <Route
          path="/admin-category"
          element={
            <AdminRoute>
              <AdminCategory />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;