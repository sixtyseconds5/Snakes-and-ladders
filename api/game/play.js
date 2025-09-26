export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        return await handleGamePlay(req, res);
      case 'GET':
        return await getGameState(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGamePlay(req, res) {
  const { action, playerId, currentPosition, diceRoll } = req.body;

  // Game constants
  const BOARD_SIZE = 5;
  const SNAKES = { 22: 12, 18: 8 };
  const LADDERS = { 3: 11, 6: 17 };

  if (action === 'roll') {
    // Generate dice roll if not provided
    const roll = diceRoll || Math.floor(Math.random() * 6) + 1;
    
    // Calculate new position
    let newPosition = currentPosition + roll;
    
    // Check if player goes beyond the board
    if (newPosition > BOARD_SIZE * BOARD_SIZE) {
      newPosition = BOARD_SIZE * BOARD_SIZE;
    }
    
    // Check for snakes
    if (SNAKES[newPosition]) {
      newPosition = SNAKES[newPosition];
    }
    
    // Check for ladders
    if (LADDERS[newPosition]) {
      newPosition = LADDERS[newPosition];
    }
    
    // Check for win condition
    const hasWon = newPosition === BOARD_SIZE * BOARD_SIZE;
    
    return res.status(200).json({
      success: true,
      data: {
        playerId,
        diceRoll: roll,
        oldPosition: currentPosition,
        newPosition,
        hasWon,
        specialMove: SNAKES[newPosition - roll] ? 'snake' : LADDERS[newPosition - roll] ? 'ladder' : null
      }
    });
  }

  if (action === 'reset') {
    return res.status(200).json({
      success: true,
      data: {
        playerId,
        position: 1,
        hasWon: false
      }
    });
  }

  return res.status(400).json({ error: 'Invalid action' });
}

async function getGameState(req, res) {
  const { playerId } = req.query;

  // In a real implementation, you would fetch from a database
  // For now, return a default state
  return res.status(200).json({
    success: true,
    data: {
      playerId: playerId || 'anonymous',
      position: 1,
      hasWon: false,
      gameStats: {
        totalGames: 0,
        wins: 0,
        bestScore: null
      }
    }
  });
}