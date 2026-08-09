import AuthLayout from "../components/AuthLayout";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm]       = useState({ fullName: "", email: "", password: "" });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const pwStr = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColors = ["", "#ef4444", "#f59e0b", "#10b981"];

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.password) { setError(t("auth.fillFields")); return; }
    if (form.password.length < 6) { setError(t("auth.passwordMin")); return; }
    setLoading(true); setError("");
    try {
      await api.post("/auth/register", { fullName: form.fullName, email: form.email, password: form.password, preferredUnit: "kg", goalVisibility: true });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setError(JSON.stringify(err.response?.data || err.message));
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout>
      <motion.div className="auth-card" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
        {success ? (
          <motion.div className="ac-success-state" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <FaCheckCircle className="ac-success-icon" />
            <h2>{t("auth.accountCreated")}</h2>
            <p>{t("auth.redirecting")}</p>
          </motion.div>
        ) : (
          <>
            <div className="ac-header">
              <h1 className="ac-title">{t("auth.createAccount")}</h1>
              <p className="ac-sub">{t("auth.joinFree")}</p>
            </div>
            {error && <motion.div className="ac-error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>{error}</motion.div>}
            <div className="ac-field">
              <label className="ac-label">{t("auth.fullNameLabel")}</label>
              <div className="ac-input-wrap">
                <FaUser className="ac-icon" />
                <input name="fullName" type="text" placeholder={t("auth.fullNamePlaceholder")} value={form.fullName} onChange={handleChange} className="ac-input" />
              </div>
            </div>
            <div className="ac-field">
              <label className="ac-label">{t("auth.emailLabel")}</label>
              <div className="ac-input-wrap">
                <FaEnvelope className="ac-icon" />
                <input name="email" type="email" placeholder={t("auth.emailPlaceholder")} value={form.email} onChange={handleChange} className="ac-input" />
              </div>
            </div>
            <div className="ac-field">
              <label className="ac-label">{t("auth.passwordLabel")}</label>
              <div className="ac-input-wrap">
                <FaLock className="ac-icon" />
                <input name="password" type={showPw ? "text" : "password"} placeholder={t("auth.passwordMinPlaceholder")} value={form.password} onChange={handleChange} onKeyDown={(e) => e.key === "Enter" && handleRegister()} className="ac-input" />
                <button type="button" className="ac-eye-btn" onClick={() => setShowPw(!showPw)}>{showPw ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
              {form.password.length > 0 && (
                <div className="ac-pw-strength">
                  <div className="ac-pw-bars">{[1,2,3].map((n) => <div key={n} className="ac-pw-bar" style={{ background: pwStr >= n ? pwColors[pwStr] : "rgba(255,255,255,0.08)" }} />)}</div>
                  <span className="ac-pw-label" style={{ color: pwColors[pwStr] }}>{["",(t("auth.pwWeak")),(t("auth.pwGood")),(t("auth.pwStrong"))][pwStr]}</span>
                </div>
              )}
            </div>
            <button className="ac-submit-btn" onClick={handleRegister} disabled={loading}>
              {loading ? <span className="ac-spinner" /> : <><span>{t("auth.createAccountBtn")}</span><FaArrowRight className="ac-arrow" /></>}
            </button>
            <p className="ac-switch">{t("auth.alreadyAccount")} <Link to="/login" className="ac-switch-link">{t("auth.signInLink")}</Link></p>
          </>
        )}
      </motion.div>
    </AuthLayout>
  );
}

export default Register;
