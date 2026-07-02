import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../utils/store";
import { addToCart } from "../../utils/cartSlice";
import { MdLocationPin } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { CartContext } from "../context/CartContext"; // ⚠️ adjust path to match Navbar's import

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
  const dispatch = useDispatch();

  // user for auth/token
  const user = useSelector((state: RootState) => state.user.user);

  // live search term from Navbar
  const searchTerm = useSelector((state: RootState) => state.search.term);

  // ✅ used only to trigger a re-fetch so Navbar updates instantly
  const cartCtx = useContext(CartContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/product");

        const fetched = res.data?.products || [];

        // newest first (opposite order)
        setProducts([...fetched].reverse());

        if (fetched.length) {
          const highest = Math.max(...fetched.map((p: Product) => p.price));
          setMaxPrice(highest);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ADD TO CART (Redux + Backend, now also syncs CartContext for Navbar)
  const addToCartHandler = async (product: Product) => {
    try {
      if (!user) {
        toast.error("Please login first");
        return;
      }

      // 1. Redux update (unchanged — used elsewhere in your app)
      dispatch(addToCart(product));

      // 2. Backend save (MongoDB) — unchanged, working endpoint
      await axios.post(
        "http://localhost:4000/api/v1/cart/addtoCart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // 3. ✅ Tell CartContext to re-fetch so Navbar's badge updates immediately
      await cartCtx?.fetchCart();

      toast.success("Added to cart 🛒");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  const buyNow = (product: Product) => {
    alert(`Buying ${product.title} for Rs ${product.price}`);
  };

  // FILTER DATA
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const locations = [
    "All",
    ...Array.from(new Set(products.map((p) => p.location).filter(Boolean))),
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    const locationMatch =
      selectedLocation === "All" || product.location === selectedLocation;

    const priceMatch = maxPrice === 0 || product.price <= maxPrice;

    // ✅ live search filter — title only, case-insensitive
    const searchMatch =
      searchTerm.trim() === "" ||
      product.title.toLowerCase().includes(searchTerm.trim().toLowerCase());

    return categoryMatch && locationMatch && priceMatch && searchMatch;
  });

  const overallMaxPrice = products.length
    ? Math.max(...products.map((p) => p.price))
    : 1000;

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedLocation("All");
    setMaxPrice(overallMaxPrice);
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-10 text-green-700">
        Fresh Organic Products 🌿
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* SIDEBAR */}
        <aside className="md:w-64 w-full bg-white rounded-2xl shadow-md p-5 h-fit md:sticky md:top-6">
          <h2 className="text-lg font-bold mb-4">Filters</h2>

          {/* CATEGORY */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <BiSolidCategoryAlt />
              Category
            </h3>

            {categories.map((cat) => (
              <label key={cat} className="block text-sm">
                <input
                  type="radio"
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />{" "}
                {cat}
              </label>
            ))}
          </div>

          {/* LOCATION */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-1">
              <MdLocationPin />
              Location
            </h3>

            {locations.map((loc) => (
              <label key={loc} className="block text-sm">
                <input
                  type="radio"
                  checked={selectedLocation === loc}
                  onChange={() => setSelectedLocation(loc)}
                />{" "}
                {loc}
              </label>
            ))}
          </div>

          {/* PRICE */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Max Price</h3>

            <input
              type="range"
              min={0}
              max={overallMaxPrice || 1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />

            <p>Up to Rs {maxPrice}</p>
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 py-2 rounded"
          >
            Reset Filters
          </button>
        </aside>

        {/* PRODUCTS */}
        <div className="flex-1">
          {loading ? (
            <p>Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={product.images}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Only {product.stock} left
                      </span>
                    )}
                    {product.stock === 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Out of stock
                      </span>
                    )}
                  </div>

                  {/* BODY */}
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="font-bold text-lg text-gray-800 line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2 min-h-10">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xl font-extrabold text-green-700">
                        Rs {product.price}
                        {product.unit && (
                          <span className="text-xs font-normal text-gray-400">
                            {" "}
                            /{product.unit}
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <MdLocationPin className="text-green-600" />{" "}
                        {product.location}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => addToCartHandler(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => buyNow(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;