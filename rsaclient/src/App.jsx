import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Bar from "./components/Bar";
import StartPage from "./components/StartPage";
import React, { useState } from "react";
import io from "socket.io-client";
import Message from "./components/Message";

function App() {
  const [Username, setUsername] = useState(localStorage.getItem("Username"));
  let socket = null;
  let connected = false;
  socket = io("http://localhost:5000");
  socket.on("connect", () => {
    socket.emit("user", localStorage.getItem("Username"), socket.id, connected);
    console.log(socket.id);
  });
  return (
    <BrowserRouter>
      <Bar user={Username} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <StartPage usern={Username} setUser={setUsername} socket={socket} />
          }
        />
        <Route exact path="/app" element={<Message socket={socket} />} />
        <Route path="*" element={<h2>Error 404</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
