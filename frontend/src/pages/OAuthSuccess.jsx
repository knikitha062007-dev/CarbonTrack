import { useEffect } from "react";

export default function OAuthSuccess() {

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {

      localStorage.setItem("token", token);
      localStorage.setItem("fullName", name);
      localStorage.setItem("email", email);

      window.location.href = "/dashboard";

    } else {

      window.location.href = "/login";

    }

  }, []);

  return <h2>Signing in...</h2>;
}