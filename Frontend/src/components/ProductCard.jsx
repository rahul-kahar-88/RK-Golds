import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover"
        />

        <div className="p-4">
          <h2 className="font-bold text-lg">
            {product.name}
          </h2>

          <p className="text-gray-500">
            {product.description}
          </p>

          <p className="text-yellow-600 font-bold text-xl">
            ₹{product.price}
          </p>

          <button className="w-full mt-4 bg-black text-white py-2 rounded-lg">
            View Product
          </button>
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;