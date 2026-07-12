import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

function PublicShop() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);

  useEffect(() => {
    API.get(`/shop/${slug}/`)
      .then((res) => {
        setShop(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [slug]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {shop && (
        <>
          {/* Banner */}
          {shop.banner && (
            <img
              src={shop.banner}
              className="w-full h-80 object-cover"
            />
          )}

          <div className="p-10">
            {/* Shop Header */}
            <div className="bg-white p-8 rounded-xl shadow">
              {shop.logo && (
                <img
                  src={shop.logo}
                  className="w-32 h-32 rounded-full object-cover mb-5"
                />
              )}

              <h1 className="text-4xl font-bold">
                {shop.shop_name}
              </h1>

              <p className="mt-4 text-gray-600">
                {shop.description}
              </p>

              <p className="mt-3">
                📞 {shop.phone}
              </p>

              <p className="mt-3">
                Owner: {shop.owner}
              </p>

              <p className="mt-3">
                Address: {shop.address}
              </p>
            </div>

            {/* Products */}
            <h2 className="text-3xl font-bold mt-10 mb-6">
              Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shop.products && shop.products.length > 0 ? (
                shop.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))
              ) : (
                <p>
                  No Products Available
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PublicShop;