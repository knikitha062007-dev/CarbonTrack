import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError(t("auth.fillFields")); return; }
    setLoading(true); setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token",    res.data.token);
      localStorage.setItem("id",       res.data.id);
      localStorage.setItem("fullName", res.data.fullName);
      localStorage.setItem("email",    res.data.email);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
        <div className="ac-header">
          <h1 className="ac-title">{t("auth.welcomeBack")}</h1>
          <p className="ac-sub">{t("auth.signInSub")}</p>
        </div>
        {error && <motion.div className="ac-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
        <div className="ac-field">
          <label className="ac-label">{t("auth.emailLabel")}</label>
          <div className="ac-input-wrap">
            <FaEnvelope className="ac-icon" />
            <input name="email" type="email" placeholder={t("auth.emailPlaceholder")} value={form.email} onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="ac-input" />
          </div>
        </div>
        <div className="ac-field">
          <label className="ac-label">{t("auth.passwordLabel")}</label>
          <div className="ac-input-wrap">
            <FaLock className="ac-icon" />
            <input name="password" type={showPw ? "text" : "password"} placeholder={t("auth.passwordPlaceholder")} value={form.password} onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="ac-input" />
            <button type="button" className="ac-eye-btn" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
        </div>
        <button className="ac-submit-btn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="ac-spinner" /> : <><span>{t("auth.signIn")}</span><FaArrowRight className="ac-arrow" /></>}
        </button>
        <div className="ac-divider"><span>{t("auth.orContinueWith")}</span></div>
        <button className="ac-google-btn" onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}>
          <FaGoogle /><span>{t("auth.continueGoogle")}</span>
        </button>
        <p className="ac-switch">{t("auth.noAccount")} <Link to="/register" className="ac-switch-link">{t("auth.createFree")}</Link></p>
      </motion.div>
    </AuthLayout>
  );
}

export default Login;
