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
          className="w-full h-40 md:h-52 object-cover"
        />

        <div className="p-3 md:p-4">
          <h2 className="font-bold text-sm md:text-lg line-clamp-2">
            {product.name}
          </h2>

          <p className="text-yellow-600 font-bold text-base md:text-xl mt-2">
            ₹{product.price}
          </p>

          
        </div>
      </motion.div>
    </Link>
  );
}

export default ProductCard;