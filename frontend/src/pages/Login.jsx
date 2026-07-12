import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {

    try {

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("email", response.data.email);

      navigate("/dashboard");

    } catch (err) {

      alert(err.response?.data?.message || "Login Failed");

    }

  };

  return (

    <AuthLayout>

      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>Login to CarbonTracker</p>

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

        <button onClick={handleLogin}>
          Login
        </button>

        <button
            onClick={() =>
                window.location.href =
                    "http://localhost:8080/oauth2/authorization/google"
            }
        >
            Continue with Google
        </button>

      </div>

    </AuthLayout>

  );

}

export default Login;