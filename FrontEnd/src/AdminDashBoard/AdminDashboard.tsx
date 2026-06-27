import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "farmer" | "admin";
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with real API calls
        // const usersRes = await axios.get<User[]>("/api/admin/users");
        // const productsRes = await axios.get<Product[]>("/api/products");

        const dummyUsers: User[] = [
          { id: 1, name: "John", email: "john@gmail.com", role: "customer" },
          { id: 2, name: "Asha", email: "asha@gmail.com", role: "farmer" },
          { id: 3, name: "Admin", email: "admin@gmail.com", role: "admin" },
        ];

        const dummyProducts: Product[] = [
          { id: 1, name: "Tomato", price: 200, stock: 10 },
          { id: 2, name: "Potato", price: 100, stock: 20 },
        ];

        setUsers(dummyUsers);
        setProducts(dummyProducts);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStock = products.reduce(
    (acc: number, p: Product) => acc + p.stock,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-md p-5 hidden md:block">
        <h2 className="text-xl font-bold mb-6 text-red-600">
          Admin Panel
        </h2>

        <ul className="space-y-4 text-gray-700">
          <li className="font-semibold text-red-600">Dashboard</li>
          <li className="hover:text-red-600 cursor-pointer">Users</li>
          <li className="hover:text-red-600 cursor-pointer">Products</li>
          <li className="hover:text-red-600 cursor-pointer">Reports</li>
          <li className="hover:text-red-600 cursor-pointer">Settings</li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-5 md:p-8">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Admin Dashboard
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-gray-500">Total Stock</h3>
            <p className="text-2xl font-bold">{totalStock}</p>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto mb-8">
          <h2 className="text-xl font-semibold mb-4">Users</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full min-w-125">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user: User) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td>{user.email}</td>
                    <td className="capitalize">{user.role}</td>
                    <td className="space-x-2">
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">All Products</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full min-w-125">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product: Product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.stock}</td>
                    <td className="space-x-2">
                      <button className="text-blue-500 hover:underline">
                        Edit
                      </button>
                      <button className="text-red-500 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;