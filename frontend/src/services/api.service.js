async function registerUser(formData) {
  try {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // This is for application-level errors sent by our backend (e.g., 409 Conflict)
      // Check if the server sent back a specific array of validation errors
      if (data.errors && data.errors.length > 0) {
        // Throw an error with the message from the *first* validation error
        throw new Error(data.errors[0].msg);
      }
      // Otherwise, use the generic message from the server or a fallback
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    // This will catch network errors (e.g., user is offline) OR the error we threw above.
    // We re-throw it so the component's catch block can handle it and update the UI.
    console.error("Registration error:", error);
    throw error;
  }
}

async function loginUser(formData) {
  try {
    const response = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0].msg);
      }
      throw new Error(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function logoutUser() {
  try {
    const response = await fetch("http://localhost:5001/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Logout failed");
    }
    // On success, we don't need to parse the body or return anything.
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

async function checkAuthStatus() {
  try {
    const response = await fetch("http://localhost:5001/api/auth/profile", {
      method: "GET",
    });

    const data = await response.json(); // user data

    if (!response.ok) {
      throw new Error(data.message || "Check auth status failed");
    }

    return data; 
  } catch (error) {
    console.error("Check auth status error:", error);
    throw error;
  }
}

export { registerUser, loginUser, logoutUser, checkAuthStatus };
