// Configuration for API endpoint (Local vs Hosted Online)
// When you deploy your backend to Render or Vercel, replace the URL below with your live backend domain.
const LIVE_BACKEND_URL = 'https://your-backend-name.onrender.com/api';

window.PORTFOLIO_API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : LIVE_BACKEND_URL;
