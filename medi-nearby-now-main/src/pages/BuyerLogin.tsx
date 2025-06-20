import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://kamyakahub.in";

const BuyerLogin: React.FC = () => {
  const [form, setForm] = useState({
    // email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("buyerToken");
  //   if (token) {
  //     navigate("/");
  //   }
  // }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/buyer/login`, form);
        console.log(response.data,"response")
      if(response.status===200){
      localStorage.setItem("buyerToken", response.data.token);
      localStorage.setItem("buyer", JSON.stringify(response.data.buyer));
      navigate("/");
      window.location.reload()
      }
    
    } catch (err) {
      setError((err.response?.data?.error as string) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Buyer Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        /> */}
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="text-center mt-4">
        <span className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Sign up</a>
        </span>
      </div>
    </div>
  );
};

export default BuyerLogin;
