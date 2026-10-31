import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.png";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api, getApiErrorMessage } from "../api/client";
import { getStoredAuthToken } from "../utils/authStorage";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();



  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setInlineError("");
    let email = e.target.email.value.trim();
    let password = e.target.password.value;

    if (email.length === 0 || password.length === 0) {
      setInlineError("Please fill all required fields");
      // toast.error("Please fill all inputs"); // unused
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|pk|org|net|edu|gov)$/i;
    const isBadGmail = /@gmai\.com|@gmial\.com|@gamil\.com/i.test(email);

    if (!emailRegex.test(email) || isBadGmail) {
      setInlineError("Please enter a valid email address");
      return;
    }

    const formData = {
      email,
      password,
    };
    setIsLoading(true);
    try {
      const response = await api.post("/login", formData);

      // Check rider application status
      if (response.data.riderStatus === 'PENDING') {
        setInlineError("Your Rider application is currently under review.");
        return;
      }
      if (response.data.riderStatus === 'REJECTED') {
        const reason = response.data.rejectionReason ? `\n\nReason: ${response.data.rejectionReason}` : "";
        setInlineError(`Your Rider application has been rejected.${reason}`);
        return;
      }
      if (response.data.riderStatus === 'SUSPENDED') {
        setInlineError("Your Rider account has been suspended.");
        return;
      }

      login(response.data.token);
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        window.location.href = "/admin/dashboard";
      } else if (response.data.role === 'rider') {
        window.location.href = "/rider/dashboard";
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
      setInlineError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (token !== "") {
      navigate("/home");
    }
  }, []);

  return (
    <div className="login-main login-page">
      <div className="login-card">
        <section className="login-form-pane">
          <Link to="/home" className="login-brand" aria-label="BookCycle home">
            <img src={Logo} alt="" />
            <span>BookCycle</span>
          </Link>

          <div className="login-center">
            <span className="login-eyebrow">WELCOME BACK</span>
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form onSubmit={handleLoginSubmit}>
              {inlineError && <div style={{ color: '#a83232', background: '#fff0eb', padding: '10px 12px', borderRadius: '10px', marginBottom: '15px', fontSize: '14px', textAlign: 'left', border: '1px solid #efc9bd', whiteSpace: 'pre-line' }}>{inlineError}</div>}
              <label className="login-field-label" htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" placeholder="you@example.com" name="email" autoComplete="email" />
              <label className="login-field-label" htmlFor="login-password">Password</label>
              <div className="pass-input-div">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  autoComplete="current-password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                ) : (
                  <FaEye
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                <Link to="/forgot-password" className="forgot-pass-link">Forgot password?</Link>
              </div>
              <div className="login-center-buttons">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                  {!isLoading && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </section>

        <aside className="login-visual">
          <img src="/images/community-benefits-background.png" alt="A leafy library space for readers" />
          <div className="login-visual-shade" />
          <Link to="/home" className="login-visual-close" aria-label="Back to BookCycle home">×</Link>
          <div className="login-visual-caption">
            <span>ISLAMABAD'S BOOK COMMUNITY</span>
            <h3>Good stories are better when shared.</h3>
            <p>Find your next read, meet local readers, and pass a favorite book along.</p>
          </div>
          <div className="login-visual-note">
            <span className="login-note-mark">↗</span>
            <div><strong>Read. Share. Repeat.</strong><small>One community, many stories</small></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Login;
