import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  location: string;
  description?: string;
};

const FarmerDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);

  // form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const getToken = () => localStorage.getItem("token");

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/v1/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data?.products || []);
    } catch (error: any) {
      console.log("Error fetching products:", error.response?.data);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= ADD PRODUCT =================
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", String(Number(price)));
      formData.append("stock", String(Number(stock)));
      formData.append("category", category.trim());
      formData.append("location", location.trim());

      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        "http://localhost:4000/api/v1/product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product added successfully ✅");

      fetchProducts();

      // reset form
      setTitle("");
      setPrice("");
      setStock("");
      setCategory("");
      setLocation("");
      setDescription("");
      setImage(null);
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-white shadow-md p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-green-600">
          Farmer Panel
        </h2>

        <ul className="space-y-4 text-gray-700">

          <li
            onClick={() => navigate("/farmer/myProducts")}
            className="hover:text-green-600 cursor-pointer"
          >
            Products
          </li>

          <li className="hover:text-green-600 cursor-pointer">
            Orders
          </li>

          <li className="hover:text-green-600 cursor-pointer">
            Settings
          </li>

        </ul>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-5 md:p-8">

        <h1 className="text-3xl font-bold mb-6">
          Farmer Dashboard 🌾
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-white p-5 rounded-xl shadow">
            <h3>Total Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3>Total Stock</h3>
            <p className="text-2xl font-bold">{totalStock}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3>Revenue</h3>
            <p className="text-2xl font-bold">Rs 0</p>
          </div>

        </div>

        {/* ================= ADD PRODUCT ================= */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Add Product
          </h2>

          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product Name"
              className="border p-2 rounded"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="border p-2 rounded"
            />

            <input
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              type="number"
              placeholder="Stock"
              className="border p-2 rounded"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="border p-2 rounded"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="border p-2 rounded"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="border p-2 rounded"
            />

            {image && (
              <div className="md:col-span-2">
                <img
                  src={URL.createObjectURL(image)}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
            )}

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product Description"
              className="border p-2 rounded md:col-span-2"
            />

            <button
              type="submit"
              className="bg-green-600 text-white p-2 rounded md:col-span-2"
            >
              Add Product
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default FarmerDashboard;