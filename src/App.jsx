import React, { useState } from "react";
import LoginFarcaster from "./LoginFarcaster";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="p-6">
      {!user ? (
        <LoginFarcaster onLogin={setUser} />
      ) : (
        <div>
          <h1>Selamat datang {user.username}</h1>
          <p>FID: {user.fid}</p>
          <button
            onClick={() =>
              fetch("/api/game/play", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fid: user.fid,
                  username: user.username,
                }),
              }).then((r) => r.json().then(console.log))
            }
          >
            Main Sekarang
          </button>
        </div>
      )}
    </div>
  );
}