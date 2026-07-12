import Earth from "./Earth";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">

      <Earth />

      <div className="auth-overlay">

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;