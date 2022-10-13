import "./App.css";
import React, { useState } from "react";
import axios from "./config/axios";
import { saveToken } from "./config/token";

function App() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/login", {
        userName,
        passWord,
      });
      if (response) {
        saveToken(response.data);
      }
      console.log("finishing ...");
      console.log("response", response);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return loading ? (
    <div>...Loading </div>
  ) : (
    <div className="App">
      <div className="box">
        <h1>Dashboard</h1>

        <input
          type="text"
          name="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="email"
        />
        <input
          type="password"
          name="password"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
          className="email"
        />
        <a href="#">
          <div className="btn" onClick={handleLogin}>
            Sign In
          </div>
        </a>

        <a href="#">
          <div id="btn2">Sign Up</div>
        </a>
      </div>
    </div>
  );
}

export default App;
