import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Product = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  location: string;
  description?: string;
};

const MyProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/product", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data?.products || []);
    } catch {
      toast.error("Failed to load products");
    }
  };

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
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // UPDATE
  const handleUpdate = async () => {
    if (!editing) return;

    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/product/${editing._id}`,
        editing,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editing._id ? res.data.product : p))
      );

      setEditing(null);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b text-left">
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td>{p.title}</td>
              <td>Rs {p.price}</td>
              <td>{p.stock}</td>
              <td>{p.location}</td>

              <td className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-100">

            <h2 className="text-xl mb-3">Edit Product</h2>

            <input
              className="border p-2 w-full mb-2"
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editing.stock}
              onChange={(e) =>
                setEditing({ ...editing, stock: Number(e.target.value) })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              value={editing.location}
              onChange={(e) =>
                setEditing({ ...editing, location: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyProducts;