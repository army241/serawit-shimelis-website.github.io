require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'noistiwares';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'january22';
const DATA_FILE = path.join(__dirname, 'data', 'portfolio.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// PostgreSQL Setup
let pgPool = null;
if (process.env.DATABASE_URL) {
    console.log('🐘 PostgreSQL DATABASE_URL detected. Connecting to PostgreSQL...');
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    initPostgresTable();
} else {
    console.log('📁 No DATABASE_URL specified. Using local JSON storage (data/portfolio.json).');
}

async function initPostgresTable() {
    try {
        await pgPool.query(`
            CREATE TABLE IF NOT EXISTS portfolio_data (
                id VARCHAR(50) PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ PostgreSQL table portfolio_data verified.');

        // Seed initial row if empty
        const res = await pgPool.query('SELECT data FROM portfolio_data WHERE id = $1', ['main']);
        if (res.rows.length === 0) {
            const localData = readJsonFile();
            if (localData) {
                await pgPool.query('INSERT INTO portfolio_data (id, data) VALUES ($1, $2)', ['main', localData]);
                console.log('🌱 Seeded initial portfolio data into PostgreSQL.');
            }
        }
    } catch (err) {
        console.error('❌ Error initializing PostgreSQL table:', err.message);
    }
}

// Helper to read JSON file
function readJsonFile() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error reading portfolio.json:', err.message);
    }
    return null;
}

// Helper to write JSON file
function writeJsonFile(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing portfolio.json:', err.message);
    }
}

// Unified Read Data
async function readPortfolioData() {
    if (pgPool) {
        try {
            const res = await pgPool.query('SELECT data FROM portfolio_data WHERE id = $1', ['main']);
            if (res.rows.length > 0) {
                return res.rows[0].data;
            }
        } catch (err) {
            console.error('Error reading from PostgreSQL:', err.message);
        }
    }
    return readJsonFile();
}

// Unified Write Data
async function writePortfolioData(data) {
    if (pgPool) {
        try {
            await pgPool.query(`
                INSERT INTO portfolio_data (id, data, updated_at) 
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                ON CONFLICT (id) 
                DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
            `, ['main', data]);
            console.log('💾 Portfolio data saved to PostgreSQL.');
        } catch (err) {
            console.error('Error writing to PostgreSQL:', err.message);
        }
    }
    writeJsonFile(data);
}

// Simple in-memory token management
const validTokens = new Set();
function generateToken() {
    const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    validTokens.add(token);
    return token;
}

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'Authorization header missing' });
    const token = authHeader.replace('Bearer ', '').trim();
    if (!validTokens.has(token)) return res.status(403).json({ success: false, message: 'Invalid token' });
    next();
}

// Public API Endpoint
app.get('/api/portfolio', async (req, res) => {
    const data = await readPortfolioData();
    if (data) {
        return res.json({ success: true, data });
    } else {
        return res.status(500).json({ success: false, message: 'Failed to load portfolio data' });
    }
});

// CV Download / Preview Endpoint
app.get('/api/download-cv', (req, res) => {
    const cvPath = path.join(__dirname, 'Serawit_Shimelis_CV.pdf');
    if (fs.existsSync(cvPath)) {
        const isInline = req.query.view === 'inline';
        if (isInline) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="Serawit_Shimelis_CV.pdf"');
            return fs.createReadStream(cvPath).pipe(res);
        } else {
            return res.download(cvPath, 'Serawit_Shimelis_CV.pdf', (err) => {
                if (err && !res.headersSent) {
                    console.error('Error downloading CV:', err.message);
                    res.status(500).json({ success: false, message: 'Failed to download CV file' });
                }
            });
        }
    } else {
        res.status(404).json({ success: false, message: 'CV file not found on server' });
    }
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = generateToken();
        return res.json({ success: true, token, message: 'Login successful' });
    } else {
        return res.status(401).json({ success: false, message: 'Incorrect username or password' });
    }
});

// Update Endpoint
app.post('/api/portfolio', authenticate, async (req, res) => {
    const newData = req.body;
    if (!newData || typeof newData !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    try {
        await writePortfolioData(newData);
        return res.json({ success: true, message: 'Portfolio updated successfully', data: newData });
    } catch (err) {
        console.error('Failed to save portfolio data:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to save updates' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`🚀 Portfolio Backend running on http://localhost:${PORT}`);
    console.log(`🔑 Admin panel available at http://localhost:${PORT}/admin.html`);
    console.log(`================================================`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const ALT_PORT = Number(PORT) + 1;
        console.log(`\n⚠️ Port ${PORT} is already in use.`);
        console.log(`Attempting to start on fallback port ${ALT_PORT}...\n`);
        app.listen(ALT_PORT, () => {
            console.log(`================================================`);
            console.log(`🚀 Portfolio Backend running on http://localhost:${ALT_PORT}`);
            console.log(`🔑 Admin panel available at http://localhost:${ALT_PORT}/admin.html`);
            console.log(`================================================`);
        });
    } else {
        console.error('Server error:', err);
    }
});
