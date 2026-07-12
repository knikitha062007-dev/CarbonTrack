import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        preferredUnit: "kg",
        goalVisibility: true,
      });

      alert("Registration Successful!");
      navigate("/login");

    } catch (err) {
        console.log(err);
        console.log(err.response);

        alert(
          JSON.stringify(err.response?.data || err.message)
        );
      }
  };

  return (
    <AuthLayout>

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>Start your sustainability journey</p>

        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button onClick={handleRegister}>
          Register
        </button>

      </div>

    </AuthLayout>
  );
}

export default Register;