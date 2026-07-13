import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

function Home() {
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");

useEffect(() => {
fetchProducts();
}, [searchTerm, selectedCategory]);

useEffect(() => {
fetchCategories();
}, []);

const fetchProducts = async () => {
try {
let url = `/products/?search=${searchTerm}`;


  if (selectedCategory) {
    url += `&category=${selectedCategory}`;
  }

  const response = await API.get(url);
  setProducts(response.data);
} catch (error) {
  console.log("Product Error:", error);
}


};

const fetchCategories = async () => {
try {
const response = await API.get("/categories/");
console.log("CATEGORY DATA:", response.data);
setCategories(response.data || response.data.results);
} catch (error) {
console.log("Category Error:", error);
}
};

return (
<> <Navbar
     searchTerm={searchTerm}
     setSearchTerm={setSearchTerm}
   />

  {/* Hero Section */}
  <section className="bg-gradient-to-r from-yellow-50 to-yellow-100 py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
            Premium Gold &
            <span className="text-yellow-600">
              {" "}Diamond Jewellery
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Discover timeless elegance with our exclusive collection
            of gold, diamond and luxury jewellery.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:scale-105 transition">
              Shop Now
            </button>

            <button className="border border-black px-8 py-3 rounded-lg hover:bg-black hover:text-white transition">
              Explore
            </button>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200"
            alt="Jewellery"
            className="rounded-2xl shadow-xl w-full h-[500px] object-cover"
          />
        </div>

      </div>
    </div>
  </section>

  {/* Categories */}
  <section className="max-w-7xl mx-auto py-16 px-6">
    <h2 className="text-3xl font-bold text-center mb-10">
      Shop By Category
    </h2>

    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">

      <div
        onClick={() => setSelectedCategory("")}
        className="cursor-pointer bg-yellow-500 text-white shadow-md rounded-xl p-6 text-center hover:scale-105 transition"
      >
        <h3 className="font-semibold">
          All
        </h3>
      </div>

      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className="cursor-pointer bg-white shadow-md rounded-xl text-center hover:shadow-xl hover:-translate-y-1 transition"
        >
          <h3 className=" ">
            {category.name}
          </h3>
        </div>
      ))}

    </div>
  </section>

  {/* Products Section */}
  <section className="max-w-7xl mx-auto py-16 px-6">

    <h2 className="text-3xl font-bold text-center mb-10">
      Latest Products
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No Products Found
        </p>
      )}

    </div>

  </section>

  <Footer />
</>


);
}

export default Home;
