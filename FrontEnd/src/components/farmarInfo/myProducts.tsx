import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  location: string;
  description: string;
  category: string;
};

const myProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🔐 Role protection
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "farmer") {
      navigate("/");
    }
  }, [navigate]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/v1/product", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data?.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // FIXED useEffect (NO async inside)
  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!editing) return;

    try {
      const payload = {
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        location: editing.location,
        description: editing.description,
        category: editing.category,
      };

      const res = await axios.put(
        `http://localhost:4000/api/v1/product/${editing._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editing._id ? res.data.product : p))
      );

      setEditing(null);
      toast.success("Updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-green-600">
          Farmer Panel
        </h2>

        <ul className="space-y-4 text-gray-700">
          <li onClick={() => navigate("/farmerDashboard")} className="cursor-pointer">
            Dashboard
          </li>
          <li className="font-semibold text-green-600">Products</li>
          <li onClick={() => navigate("/farmer/orders")} className="cursor-pointer">
            Orders
          </li>
          <li onClick={() => navigate("/farmer/settings")} className="cursor-pointer">
            Settings
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-6">My Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-center">

              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">

                    <td className="p-3">{p.title}</td>
                    <td>Rs {p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.location}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => setEditing(p)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* EDIT MODAL */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">

            <div className="bg-white p-6 rounded-xl w-full max-w-md">

              <h2 className="text-xl font-semibold mb-4">
                Edit Product
              </h2>

              <input className="border p-2 w-full mb-2"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />

              <input className="border p-2 w-full mb-2"
                value={editing.price}
                onChange={(e) =>
                  setEditing({ ...editing, price: Number(e.target.value) })
                }
              />

              <input className="border p-2 w-full mb-2"
                value={editing.stock}
                onChange={(e) =>
                  setEditing({ ...editing, stock: Number(e.target.value) })
                }
              />

              <input className="border p-2 w-full mb-2"
                value={editing.location}
                onChange={(e) =>
                  setEditing({ ...editing, location: e.target.value })
                }
              />

              <input className="border p-2 w-full mb-2"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              />

              <textarea className="border p-2 w-full mb-2"
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-2 mt-3">

                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Save
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default myProducts
