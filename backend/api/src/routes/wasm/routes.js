// backend/api/src/routes/wasm/routes.js
import express from 'express';

const router = express.Router();

function calculateEta({ distance, speed, trafficFactor = 0 }) {
  return distance / (Math.max(speed, 1e-6) * Math.max(1 - trafficFactor, 0.1));
}

router.post('/eta', async (req, res) => {
  const { distance, speed, trafficFactor } = req.body;

  // Validate inputs to prevent negative or zero-division anomalies
  if (distance <= 0 || speed <= 0 || (trafficFactor !== undefined && trafficFactor >= 1)) {
    return res.status(400).json({ 
      error: 'Invalid ETA inputs: distance and speed must be greater than 0, and trafficFactor must be less than 1.' 
    });
  }

  try {
    const eta = calculateEta({ distance, speed, trafficFactor });
    return res.status(200).json({ success: true, eta });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
