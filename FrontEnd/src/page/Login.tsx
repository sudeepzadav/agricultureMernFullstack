import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

type LoginProps = {
  type: "login" | "signUp";
};

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "customer" | "farmer";
};

const Login = ({ type }: LoginProps) => {
  const navigate = useNavigate();

  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  function handleForm(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${type}`,
        data
      );

      toast.success(res.data.message);

      if (type === "login") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }

      if (type === "signUp") {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div className="min-h-194 flex items-center justify-center bg-linear-to-tr from-pink-400 to-indigo-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center hover:underline">
          {type === "signUp" ? "Sign Up" : "Welcome Back"}
        </h2>

        <p className="text-sm text-gray-500 text-center">
          {type === "signUp"
            ? "Enter your credentials to Register"
            : "Log In"}
        </p>

        {/* Name (only for signup) */}
        {type === "signUp" && (
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your username"
              onChange={handleForm}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="abc@gmail.com"
            onChange={handleForm}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            onChange={handleForm}
            className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Role (only for signup) */}
        {type === "signUp" && (
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Role</label>

            <select
              name="role"
              onChange={handleForm}
              value={data.role}
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>
        )}

        {/* Remember + Forgot */}
        <div className="flex justify-between">
          <label className="text-sm text-blue-500 flex items-center gap-3 cursor-pointer">
            <input type="checkbox" />
            <span>Remember Password</span>
          </label>

          <Link to="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          {type === "signUp" ? "Create Account" : "Login Account"}
        </button>

        {/* Bottom Links */}
        {type === "signUp" ? (
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        ) : (
          <p className="text-center text-gray-500">
            Don’t have an account?{" "}
            <Link to="/signUp" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;