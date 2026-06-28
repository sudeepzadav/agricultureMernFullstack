import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdLocationPin } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  location: string;
  images?: string;
   unit?: string;
}

const Hero = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/product");
        setProducts(res.data?.products || []);
      } catch (error) {
        console.log("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // CART
  const addToCart = (product: Product) => {
    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existing, product]));
    toast.success("Added to cart 🛒");
  };

  const buyNow = (product: Product) => {
    alert(`Buying ${product.title} for Rs ${product.price}`);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-4xl font-bold text-center mb-10 text-green-700">
        Fresh Organic Products 🌿
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !products.length ? (
        <p className="text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-44 bg-gray-100">
                {product.images ? (
                  <img
                    src={product.images}
                    alt={product.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="font-bold text-lg text-gray-800">
                  {product.title}
                </h2>

                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>

                {/* DETAILS */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>💰 Rs {product.price}</p>
                  <p>📦 Stock: {product.stock} {product.unit}</p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <MdLocationPin className="text-red-500" />
                    <span>{product.location}</span>
                  </p>

                  <p className="flex items-center gap-1 text-gray-600">
                    <BiSolidCategoryAlt className="text-green-600" />
                    <span>{product.category}</span>
                  </p>
                </div>

                {/* BUTTONS */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => buyNow(product)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
