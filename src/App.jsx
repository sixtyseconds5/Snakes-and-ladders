import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import LoginFarcaster from "./LoginFarcaster";

const BOARD_SIZE = 5; // 5x5 grid
const SNAKES = { 22: 12, 18: 8 }; // turun
const LADDERS = { 3: 11, 6: 17 }; // naik

export default function App() {
  const [position, setPosition] = useState(1);
  const [dice, setDice] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let newPos = position + roll;
    if (newPos > BOARD_SIZE * BOARD_SIZE) newPos = BOARD_SIZE * BOARD_SIZE;
    if (SNAKES[newPos]) newPos = SNAKES[newPos];
    if (LADDERS[newPos]) newPos = LADDERS[newPos];
    setDice(roll);
    setPosition(newPos);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (!user) {
    return (
      <div style={{padding:'2rem', fontFamily:'sans-serif', textAlign:'center', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <LoginFarcaster onLogin={handleLogin} />
      </div>
    );
  }

  const cells = [];
  for (let i = BOARD_SIZE * BOARD_SIZE; i >= 1; i--) {
    cells.push(i);
  }

  return (
    <div style={{padding:'1rem', fontFamily:'sans-serif', textAlign:'center'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
        <h1>Crypto Snakes & Ladders</h1>
        <div style={{fontSize:'0.9rem', color:'#666'}}>
          Welcome, {user.username || user.displayName}!
        </div>
      </div>
      <button onClick={rollDice} style={{padding:'0.5rem 1rem', background:'#6b46c1', color:'white', border:'none', borderRadius:'8px', marginBottom:'0.5rem'}}>
        Lempar Dadu
      </button>
      {dice && <p>🎲 Hasil: {dice}</p>}
      <div style={{display:'grid', gridTemplateColumns:`repeat(${BOARD_SIZE}, 50px)`, gap:'2px', justifyContent:'center'}}>
        {cells.map((cell) => (
          <div key={cell} style={{
              width:'50px', height:'50px', display:'flex', alignItems:'center', justifyContent:'center',
              border:'1px solid #ccc',
              backgroundColor: position===cell ? '#facc15' : '#f3f4f6'
            }}>
            {position===cell ? '🪙' : cell}
          </div>
        ))}
      </div>
      <p style={{marginTop:'0.5rem', fontSize:'0.8rem'}}>🪙 Pion kamu; ular: turun ⬇️; tangga: naik ⬆️</p>
    </div>
  );
}