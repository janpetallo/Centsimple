async function registerUser(formData) {
  try {
    const response = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      credentials: "include", // include cookies including the JWT cookie
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
      credentials: "include", // include cookies including the JWT cookie
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
      credentials: "include", // include cookies including the JWT cookie
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
      credentials: "include", // include cookies including the JWT cookie
    });

    // First, check if the response was NOT successful
    if (!response.ok) {
      // If we get a 401, it just means the user isn't logged in.
      // This is not a real "error" we need to throw. We can just return null.
      if (response.status === 401) {
        return null;
      }
      // For other errors (like 500), we can throw an error.
      throw new Error("Authentication check failed");
    }

    // Only parse the JSON when successful
    const data = await response.json(); // user data
    return data;
  } catch (error) {
    console.error("Check auth status error:", error);
    throw error;
  }
}

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5001/api/categories", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch categories");
    }

    return data;
  } catch (error) {
    console.error("Get categories error:", error);
    throw error;
  }
}

async function getTransactions(page = 1, limit = 10) {
  try {
    const response = await fetch(
      `http://localhost:5001/api/transactions?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }

    return data; // this includes pagination metadata
  } catch (error) {
    console.error("Get transactions error:", error);
    throw error;
  }
}

async function createTransaction(transactionData) {
  try {
    const response = await fetch(
      "http://localhost:5001/api/transactions/create",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // This is for application-level errors sent by our backend
      // Check if the server sent back a specific array of validation errors
      if (data.errors && data.errors.length > 0) {
        // Throw an error with the message from the *first* validation error
        throw new Error(data.errors[0].msg);
      }
      // Otherwise, use the generic message from the server or a fallback
      throw new Error(data.message || "Transaction creation failed");
    }

    return data;
  } catch (error) {
    console.error("Create transaction error:", error);
    throw error;
  }
}

export {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthStatus,
  getCategories,
  getTransactions,
  createTransaction,
};
