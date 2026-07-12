function Footer() {
  return (
    <footer className="bg-black text-white mt-20">

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold mb-4">
            RK Gold
          </h2>

          <p className="text-gray-400">
            Premium Gold & Diamond Jewellery Collection.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Support
          </h3>

          <ul className="space-y-2 text-gray-400">
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Contact
          </h3>

          <p className="text-gray-400">
            support@rkgold.com
          </p>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-500">
        © 2026 RK Gold. All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;