import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login3 = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState(""); 
  const navigate = useNavigate();
  const [passwordRequirements, setPasswordRequirements] = useState({
  minLength: false,
  hasUppercase: false,
  hasNumber: false,
  hasSpecialChar: false
});

  const handleLogin = async () => {
    if (!email || !password) {
  setError("Both email and password fields are required.");
  return;
}

// Email domain validation
const allowedDomains = ['@isam.com', '@isam-securities.com', '@sharp-peak.com', '@powerworkplace.com'];
const emailDomain = email.substring(email.lastIndexOf('@'));
if (!allowedDomains.includes(emailDomain)) {
  setError("You do not have access. Please use a company email address.");
  return;
}
  
    try {
      const tokenData = new URLSearchParams({
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        username: email,
        password: password,
        audience: "https://isam-optimus.us.auth0.com/api/v2/",
        client_id: "SN4b809bEIMwBwJqC3yXvo99rxwjGPi8",
        realm: "Username-Password-Authentication",
        scope: "openid profile email",
      });
  
      const response = await fetch("https://isam-optimus.us.auth0.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
        },
        body: tokenData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
  if (data.error === "invalid_grant") {
    throw new Error("Invalid credentials. Please check your email and password, or sign up if you don't have an account.");
  }
  throw new Error(data.error_description || "Login failed");
}
  
      const userResponse = await fetch("https://isam-optimus.us.auth0.com/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });
  
      const userData = await userResponse.json();
  
      // Extract username from metadata or fallback to email
      const storedUsername = userData.user_metadata?.username || userData.email.split("@")[0];
  
      //  Store user details in localStorage
      localStorage.setItem("user", JSON.stringify({
        username: storedUsername,  //  Store username
        email: userData.email,
      }));
      
  
      localStorage.setItem("access_token", data.access_token);
      
      console.log("User info saved:", storedUsername, userData.email); 
  
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    }
  };
  
const handleSignUp = async () => {
  if (!email || !password || !username) {
  setError("All fields are required.");
  return;
}

// Email domain validation
const allowedDomains = ['@isam.com', '@isam-securities.com', '@sharp-peak.com', '@powerworkplace.com'];
const emailDomain = email.substring(email.lastIndexOf('@'));
if (!allowedDomains.includes(emailDomain)) {
  setError("You do not have the right to access. Please use a company email address.");
  return;
}

// Email format validation (no uppercase)
if (email !== email.toLowerCase()) {
  setError("Email address must be in lowercase.");
  return;
}

// Password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^])[A-Za-z\d@$!%*?&^]{8,}$/;
if (!passwordRegex.test(password)) {
  setError("Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.");
  return;
}

  try {
    const signUpData = {
      client_id: "SN4b809bEIMwBwJqC3yXvo99rxwjGPi8",
      email: email,
      password: password,
      connection: "Username-Password-Authentication",
      user_metadata: { username: username }, // ✅ Store username in metadata
    };

    const response = await fetch("https://isam-optimus.us.auth0.com/dbconnections/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signUpData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "User already exists. Please log in.");
    }

    console.log("Sign-Up successful! Username stored:", username); // ✅ Debugging line
    
    // ✅ Instead of redirecting to dashboard, show success message and switch to login
    setSuccess("Sign-Up successful! Please log in.");
    setError(""); // Clear any errors
    setIsSignUp(false); // ✅ Toggle back to login mode

    // ✅ Reset form fields after successful signup
    setEmail("");
    setPassword("");
    setUsername("");

  } catch (error) {
    setError(error.message || "Sign-up failed. Please try again.");
  }
};

const checkPasswordRequirements = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  setPasswordRequirements(requirements);
  return Object.values(requirements).every(req => req);
};



  return (
    <div className="flex flex-col justify-center items-center h-screen bg-teal-900">
      {/* Logo */}
      <img
        src="/logo.png"
        alt="ISAM Logo"
        className="md:w-[540px] sm:w-[480px] w-[300px] xl:w-96 h-auto mx-auto mb-14"
      />
  
      {/* Login/Signup Box */}
      <div className="border border-gray-300 shadow-md bg-[#f3f2f2ee] p-8 rounded-xl text-center md:w-[500px] sm:w-[490px] w-[340px]">
        <p className="text-gray-700 text-lg font-semibold mb-6">
          {isSignUp ? "Sign Up" : "Login"}
        </p>
  
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
{success && <p className="text-teal-700 text-sm mb-4">{success}</p>}
  
        {/* Username Field (Only in Sign-Up Mode) */}
        {isSignUp && (
          <div className="mb-4 text-left">
            <label className="block mb-2 text-sm font-bold" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
  
        {/* Email Field */}
        <div className="mb-4 text-left">
          <label className="block mb-2 text-sm font-bold" htmlFor="email">
            Email Address
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            type="email"
            placeholder="name@address.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
  
        {/* Password Field */}
        <div className="mb-6 text-left">
          <label className="block mb-2 text-sm font-bold" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
      setPassword(e.target.value);
      checkPasswordRequirements(e.target.value); 
    }}
          />
          {/* PASSWORD VALIDATION UI */}
  {isSignUp && (
    <div className="mt-2 text-xs">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className={passwordRequirements.minLength ? 'text-gray-500' : 'text-red-500'}>
          • 8+ characters
        </span>
        <span className={passwordRequirements.hasUppercase ? 'text-gray-500' : 'text-red-500'}>
          • 1 Uppercase
        </span>
        <span className={passwordRequirements.hasNumber ? 'text-gray-500' : 'text-red-500'}>
          • Number
        </span>
        <span className={passwordRequirements.hasSpecialChar ? 'text-gray-500' : 'text-red-500'}>
          • 1 Special character
        </span>
      </div>
    </div>
  )}
</div>



  
        {/* Login/Sign-Up Button */}
        <button
          className="bg-teal-700 text-white font-bold py-2 w-full rounded-lg hover:bg-[#3b896c] transition duration-200"
          onClick={isSignUp ? handleSignUp : handleLogin}
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
  
        {/* Toggle Between Login & Sign Up */}
        <p className="text-sm text-gray-600 mt-4">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span
            className="text-blue-500 underline cursor-pointer hover:underline"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setSuccess(""); 
              setEmail("");
              setPassword("");
              setUsername(""); 
            }}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
  
};

export default Login3;