import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function usePreventBackFromAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/lawyer-dashboard") {
      navigate("/lawyer-dashboard", { replace: true });
    }
    window.history.replaceState(null, "", "/lawyer-dashboard");
    window.history.pushState(null, "", "/lawyer-dashboard");

    const handlePopState = () => {
      window.history.pushState(null, "", "/lawyer-dashboard");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, location.pathname]);
};

export function usePreventBackFromUserDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard", { replace: true });
    }
    window.history.replaceState(null, "", "/dashboard");
    window.history.pushState(null, "", "/dashboard");

    const handlePopState = () => {
      window.history.pushState(null, "", "/dashboard");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, location.pathname]);
};
