import axios from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { notify } from "../utils/toast";

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

  // 🔴 FIX: prevent multiple submits
  let isSubmitting = false;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    try {
      const payload =
        type === "login"
          ? {
              email: data.email,
              password: data.password,
            }
          : {
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role,
            };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${
          type === "signUp" ? "signup" : "login"
        }`,
        payload
      );

      notify.success(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (type === "login") {
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      notify.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      isSubmitting = false;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-pink-400 to-indigo-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          {type === "signUp" ? "Sign Up" : "Login"}
        </h2>

        {type === "signUp" && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
            required
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
          required
        />

        {type === "signUp" && (
          <select
            name="role"
            onChange={handleChange}
            value={data.role}
            className="w-full p-3 border rounded-xl"
          >
            <option value="customer">Customer</option>
            <option value="farmer">Farmer</option>
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600"
        >
          {type === "signUp" ? "Create Account" : "Login"}
        </button>

        <p className="text-center text-sm">
          {type === "signUp" ? (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Login
              </Link>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <Link to="/signUp" className="text-blue-500">
                Sign Up
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;