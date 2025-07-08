import { useState } from "react";
import * as apiService from "../services/api.service";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const response = await apiService.loginUser(formData);
      console.log("User logged in successfully", response);
      // Here we will redirect the user to the dashboard or show a success message
    } catch (error) {
      console.error("Error logging in user", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Login Page</h2>;
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
