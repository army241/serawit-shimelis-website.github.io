-- PostgreSQL Schema for Portfolio Database

CREATE TABLE IF NOT EXISTS portfolio_data (
    id VARCHAR(50) PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on id for fast lookup
CREATE INDEX IF NOT EXISTS idx_portfolio_id ON portfolio_data(id);
