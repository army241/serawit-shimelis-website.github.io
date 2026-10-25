// ----------------------------------------------------
// The Chess Sanctum - Core JavaScript Engine
// Author: Serawit Shimelis | 1700 Rapid, 1400 Blitz, 1300 Bullet & Chess Coach
// Color Scheme: White & Reddish (Synced with Portfolio)
// Features: Full 8x8 Board, Theme Toggle, Dynamic Background,
// Audio Synthesizer, Tactics Puzzle Engine, Openings Loader,
// Chess.com Public API inspector, and Coaching Consultation Form
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initDynamicBackground();
    initChessAudio();
    initChessBoard();
    initModeTabs();
    initPuzzleEngine();
    initThemeSwitcher();
    initChesscomInspector();
    initMobileNav();
});

// ----------------------------------------------------
// 1. Theme Toggle (Synced with Portfolio)
// ----------------------------------------------------
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Check saved preference
    const savedTheme = localStorage.getItem('chessTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️ Light mode';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        themeToggle.textContent = isLightMode ? '☀️ Light mode' : '🌙 Dark mode';
        localStorage.setItem('chessTheme', isLightMode ? 'light' : 'dark');
    });
}

// ----------------------------------------------------
// 2. Dynamic Floating Wallpaper Background (Synced with Portfolio)
// ----------------------------------------------------
function initDynamicBackground() {
    const bgContainer = document.getElementById('dynamicBg');
    if (!bgContainer) return;

    bgContainer.innerHTML = '';
    const boxCount = 22;
    for (let i = 0; i < boxCount; i++) {
        const box = document.createElement('div');
        box.classList.add('bg-box');

        const size = Math.floor(Math.random() * 70) + 25;
        const left = Math.floor(Math.random() * 96);
        const duration = Math.floor(Math.random() * 14) + 10;
        const delay = (Math.random() * 12).toFixed(2);

        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        box.style.left = `${left}%`;
        box.style.animationDuration = `${duration}s`;
        box.style.animationDelay = `${delay}s`;

        bgContainer.appendChild(box);
    }
}

// ----------------------------------------------------
// 3. Synthesized Web Audio Sound Effects (Zero External Files)
// ----------------------------------------------------
let audioCtx = null;
let soundEnabled = true;

function initChessAudio() {
    const toggleBtn = document.getElementById('soundToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            toggleBtn.innerHTML = soundEnabled
                ? '<i class="fa-solid fa-volume-high"></i>'
                : '<i class="fa-solid fa-volume-xmark"></i>';
            toggleBtn.style.color = soundEnabled ? 'var(--primary-color)' : 'var(--text-muted)';
        });
    }
}

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type = 'move') {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'move') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'capture') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'success') {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
            gain2.gain.setValueAtTime(0.25, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

            osc.start(now);
            osc.stop(now + 0.35);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.45);
        }
    } catch (e) {
        // AudioContext requires initial user interaction
    }
}

// ----------------------------------------------------
// 4. SVG Chess Piece Vectors (White & Reddish Accents)
// ----------------------------------------------------
const PIECE_SVGS = {
    // White Pieces (Pure Crisp Pearl White with Charcoal Outlines)
    'wK': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 16.5 3.5 22 0v-4s-3.5-3.5-11-3.5-11 3.5-11 3.5v4z"/><path d="M11.5 30c3.5-2 18.5-2 22 0m-22 3.5c3.5-2 18.5-2 22 0m-22 3.5c3.5-2 18.5-2 22 0"/></g></svg>`,
    'wQ': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-8.5-15-8.5 15-7-11 2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11 38.5c7.5-1 15.5-1 23 0" fill="none"/></g></svg>`,
    'wR': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-13.5h14L31 31.5H14zM11 14h23v-5H29v2h-3V9h-4v2h-3V9h-5v2h-3V9h-3v5z"/><path d="M12 35.5h21m-20-4h19m-18-13.5h17" fill="none"/></g></svg>`,
    'wB': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" fill="none"/></g></svg>`,
    'wN': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.36-1 2-1-3.5 1-5.5 2-8.5 1.074-3.22-.38-5.78 2-8.5 3.33-3.87 9.88-5.32 10-5"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-8a1 1 0 1 1-2 0 1 1 0 1 1 2 0z"/></g></svg>`,
    'wP': `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1f242d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h27c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></g></svg>`,

    // Black Pieces (Dark Charcoal Obsidian with Crimson Red Outlines)
    'bK': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 16.5 3.5 22 0v-4s-3.5-3.5-11-3.5-11 3.5-11 3.5v4z"/><path d="M11.5 30c3.5-2 18.5-2 22 0m-22 3.5c3.5-2 18.5-2 22 0m-22 3.5c3.5-2 18.5-2 22 0" fill="none"/></g></svg>`,
    'bQ': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm17 0a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-8.5-15-8.5 15-7-11 2 12z"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 21 1 27 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path d="M11 38.5c7.5-1 15.5-1 23 0" fill="none"/></g></svg>`,
    'bR': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-13.5h14L31 31.5H14zM11 14h23v-5H29v2h-3V9h-4v2h-3V9h-5v2h-3V9h-3v5z"/><path d="M12 35.5h21m-20-4h19m-18-13.5h17" fill="none"/></g></svg>`,
    'bB': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/><path d="M17.5 26h10M15 30h15m-7.5-14.5v5m-3-2.5h6" fill="none"/></g></svg>`,
    'bN': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0-.64 1.36-1 2-1-3.5 1-5.5 2-8.5 1.074-3.22-.38-5.78 2-8.5 3.33-3.87 9.88-5.32 10-5"/><path d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.5-8a1 1 0 1 1-2 0 1 1 0 1 1 2 0z"/></g></svg>`,
    'bP': `<svg viewBox="0 0 45 45"><g fill="#161b22" stroke="#b44b4b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h27c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></g></svg>`
};

// ----------------------------------------------------
// 5. Board State Management & Movement Logic
// ----------------------------------------------------
let boardState = [];
let currentTurn = 'w';
let selectedSquare = null;
let legalMoves = [];
let moveHistory = [];
let isFlipped = false;
let activePuzzle = null;
let puzzleStep = 0;

const INITIAL_BOARD = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

function initChessBoard() {
    resetBoard(INITIAL_BOARD);

    const flipBtn = document.getElementById('flipBoardBtn');
    if (flipBtn) {
        flipBtn.addEventListener('click', () => {
            isFlipped = !isFlipped;
            renderBoard();
        });
    }

    const resetBtn = document.getElementById('resetBoardBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            activePuzzle = null;
            resetBoard(INITIAL_BOARD);
            setFeedback('Board reset to standard initial position.');
            clearNotation();
        });
    }

    const undoBtn = document.getElementById('undoMoveBtn');
    if (undoBtn) {
        undoBtn.addEventListener('click', undoMove);
    }
}

function resetBoard(setup) {
    boardState = JSON.parse(JSON.stringify(setup));
    currentTurn = 'w';
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
    updateTurnIndicator();
}

function renderBoard() {
    const frame = document.getElementById('boardFrame');
    if (!frame) return;
    frame.innerHTML = '';

    const rowIndices = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const colIndices = isFlipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

    for (let r of rowIndices) {
        for (let c of colIndices) {
            const isLight = (r + c) % 2 === 0;
            const squareEl = document.createElement('div');
            squareEl.classList.add('square', isLight ? 'sq-light' : 'sq-dark');
            squareEl.dataset.row = r;
            squareEl.dataset.col = c;

            // Coordinate labels
            const fileChar = String.fromCharCode(97 + c);
            const rankChar = 8 - r;

            if (isFlipped ? r === 7 : r === 7) {
                const fileLabel = document.createElement('span');
                fileLabel.classList.add('sq-coord', 'coord-file');
                fileLabel.textContent = fileChar;
                squareEl.appendChild(fileLabel);
            }
            if (isFlipped ? c === 7 : c === 0) {
                const rankLabel = document.createElement('span');
                rankLabel.classList.add('sq-coord', 'coord-rank');
                rankLabel.textContent = rankChar;
                squareEl.appendChild(rankLabel);
            }

            // Piece
            const pieceCode = boardState[r][c];
            if (pieceCode) {
                const pieceEl = document.createElement('div');
                pieceEl.classList.add('piece');
                pieceEl.innerHTML = PIECE_SVGS[pieceCode] || '';
                pieceEl.dataset.piece = pieceCode;
                squareEl.appendChild(pieceEl);
            }

            // Click listener
            squareEl.addEventListener('click', () => handleSquareClick(r, c));

            // Selection & Move Hints
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                squareEl.classList.add('selected');
            }

            const isLegal = legalMoves.some(m => m.r === r && m.c === c);
            if (isLegal) {
                if (pieceCode) {
                    squareEl.classList.add('valid-capture');
                } else {
                    squareEl.classList.add('valid-move');
                }
            }

            frame.appendChild(squareEl);
        }
    }
}

function handleSquareClick(r, c) {
    const clickedPiece = boardState[r][c];

    // Case 1: Selecting a piece of current turn
    if (clickedPiece && clickedPiece[0] === currentTurn) {
        selectedSquare = { r, c };
        legalMoves = calculateLegalMoves(r, c, clickedPiece);
        renderBoard();
        return;
    }

    // Case 2: If a piece is already selected, check if clicked square is legal
    if (selectedSquare) {
        const move = legalMoves.find(m => m.r === r && m.c === c);
        if (move) {
            executeMove(selectedSquare.r, selectedSquare.c, r, c);
            selectedSquare = null;
            legalMoves = [];
            renderBoard();
            return;
        }
    }

    // Deselect if clicked elsewhere
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
}

function executeMove(fromR, fromC, toR, toC, isAutomated = false) {
    const piece = boardState[fromR][fromC];
    const target = boardState[toR][toC];

    // Sound effect
    if (target) {
        playSound('capture');
    } else {
        playSound('move');
    }

    // Save history for undo
    moveHistory.push({
        from: { r: fromR, c: fromC },
        to: { r: toR, c: toC },
        piece: piece,
        captured: target,
        boardBefore: JSON.parse(JSON.stringify(boardState)),
        turnBefore: currentTurn
    });

    // Update board
    boardState[toR][toC] = piece;
    boardState[fromR][fromC] = null;

    // Promotion simple auto-queen
    if (piece === 'wP' && toR === 0) boardState[toR][toC] = 'wQ';
    if (piece === 'bP' && toR === 7) boardState[toR][toC] = 'bQ';

    // Toggle turn
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
    updateTurnIndicator();

    // Log algebraic notation
    const notation = generateAlgebraicNotation(piece, fromR, fromC, toR, toC, !!target);
    appendNotation(notation);

    // If a tactics puzzle is active, evaluate move
    if (activePuzzle && !isAutomated) {
        handlePuzzleMove(fromR, fromC, toR, toC);
    }
}

function undoMove() {
    if (!moveHistory.length) return;
    const last = moveHistory.pop();
    boardState = last.boardBefore;
    currentTurn = last.turnBefore;
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
    updateTurnIndicator();
    removeLastNotation();
    setFeedback('Undid last move.');
}

function updateTurnIndicator() {
    const pill = document.getElementById('turnIndicator');
    if (!pill) return;
    if (currentTurn === 'w') {
        pill.className = 'turn-pill white-turn';
        pill.innerHTML = '<i class="fa-solid fa-circle" style="color: var(--primary-color);"></i> White to Move';
    } else {
        pill.className = 'turn-pill black-turn';
        pill.innerHTML = '<i class="fa-solid fa-circle" style="color: #ff5252;"></i> Black to Move';
    }
}

function setFeedback(msg, isSuccess = false) {
    const el = document.getElementById('moveFeedback');
    if (el) {
        el.textContent = msg;
        el.style.color = isSuccess ? '#ff5252' : 'var(--primary-color)';
    }
}

// ----------------------------------------------------
// 6. Legal Move Generator (Tactics & Free Play Friendly)
// ----------------------------------------------------
function calculateLegalMoves(r, c, piece) {
    const moves = [];
    const color = piece[0];
    const type = piece[1];

    function inBounds(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    function addMoveIfValid(row, col) {
        if (!inBounds(row, col)) return false;
        const dest = boardState[row][col];
        if (!dest) {
            moves.push({ r: row, c: col });
            return true;
        }
        if (dest[0] !== color) {
            moves.push({ r: row, c: col });
        }
        return false;
    }

    // Pawn
    if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;

        if (inBounds(r + dir, c) && !boardState[r + dir][c]) {
            moves.push({ r: r + dir, c });
            if (r === startRow && !boardState[r + dir * 2][c]) {
                moves.push({ r: r + dir * 2, c });
            }
        }
        for (let dc of [-1, 1]) {
            const tr = r + dir;
            const tc = c + dc;
            if (inBounds(tr, tc) && boardState[tr][tc] && boardState[tr][tc][0] !== color) {
                moves.push({ r: tr, c: tc });
            }
        }
    }

    // Knight
    if (type === 'N') {
        const offsets = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        offsets.forEach(([dr, dc]) => addMoveIfValid(r + dr, c + dc));
    }

    // Bishop & Queen diagonals
    if (type === 'B' || type === 'Q') {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        dirs.forEach(([dr, dc]) => {
            let step = 1;
            while (addMoveIfValid(r + dr * step, c + dc * step)) {
                step++;
            }
        });
    }

    // Rook & Queen straights
    if (type === 'R' || type === 'Q') {
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        dirs.forEach(([dr, dc]) => {
            let step = 1;
            while (addMoveIfValid(r + dr * step, c + dc * step)) {
                step++;
            }
        });
    }

    // King
    if (type === 'K') {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) {
                    addMoveIfValid(r + dr, c + dc);
                }
            }
        }
    }

    return moves;
}

// ----------------------------------------------------
// 7. Algebraic Notation & Notation Log
// ----------------------------------------------------
function coordsToSquare(r, c) {
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    return `${file}${rank}`;
}

function generateAlgebraicNotation(piece, fromR, fromC, toR, toC, isCapture) {
    const type = piece[1];
    const dest = coordsToSquare(toR, toC);
    if (type === 'P') {
        if (isCapture) {
            const startFile = String.fromCharCode(97 + fromC);
            return `${startFile}x${dest}`;
        }
        return dest;
    }
    const pieceLetter = type;
    const captureSymbol = isCapture ? 'x' : '';
    return `${pieceLetter}${captureSymbol}${dest}`;
}

function appendNotation(san) {
    const log = document.getElementById('notationLog');
    if (!log) return;

    const emptyMsg = log.querySelector('.notation-empty');
    if (emptyMsg) emptyMsg.remove();

    const movesCount = moveHistory.length;
    if (movesCount % 2 === 1) {
        const row = document.createElement('div');
        row.classList.add('notation-row');
        row.id = `moveRow-${Math.ceil(movesCount / 2)}`;
        row.innerHTML = `
            <span class="move-num">${Math.ceil(movesCount / 2)}.</span>
            <span class="move-white">${san}</span>
            <span class="move-black"></span>
        `;
        log.appendChild(row);
    } else {
        const row = document.getElementById(`moveRow-${movesCount / 2}`);
        if (row) {
            const blackSpan = row.querySelector('.move-black');
            if (blackSpan) blackSpan.textContent = san;
        }
    }
    log.scrollTop = log.scrollHeight;
}

function removeLastNotation() {
    const log = document.getElementById('notationLog');
    if (!log) return;
    const rows = log.querySelectorAll('.notation-row');
    if (!rows.length) return;

    const lastRow = rows[rows.length - 1];
    const blackSpan = lastRow.querySelector('.move-black');
    if (blackSpan && blackSpan.textContent) {
        blackSpan.textContent = '';
    } else {
        lastRow.remove();
    }
}

function clearNotation() {
    const log = document.getElementById('notationLog');
    if (log) {
        log.innerHTML = '<div class="notation-empty">No moves made yet. Make a move on the board to start notation recording!</div>';
    }
    moveHistory = [];
}

// ----------------------------------------------------
// 8. Interactive Tactics Puzzle Engine
// ----------------------------------------------------
const PUZZLES = {
    1: {
        id: 1,
        title: "The Queen's Deflection Decoy",
        difficulty: "1700 Rapid Level (Mate in 2)",
        turn: 'w',
        hint: "White has a lethal battery. Look for a queen sacrifice that forcibly drags the enemy king into checkmate!",
        setup: [
            ['bR', null, null, null, null, 'bR', 'bK', null],
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
            [null, null, 'bN', null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, 'wN', null, null],
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
            [null, null, null, null, 'wQ', 'wR', 'wK', null]
        ],
        moves: [
            { from: [7, 4], to: [0, 4], san: "Qe8+" },
            { response: { from: [0, 5], to: [0, 4], san: "Rxe8" } },
            { from: [7, 5], to: [0, 4], san: "Rxe8#" }
        ]
    },
    2: {
        id: 2,
        title: "The Royal Knight Smother",
        difficulty: "1400 Blitz Level (Smothered Mate)",
        turn: 'w',
        hint: "Black's king is tightly surrounded by its own defenders. A knight check will drop the hammer!",
        setup: [
            ['bR', null, null, null, null, 'bR', 'bK', null],
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, 'wN', null, null],
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
            ['wR', null, null, null, null, 'wR', 'wK', null]
        ],
        moves: [
            { from: [5, 5], to: [1, 5], san: "Nxf7#" }
        ]
    },
    3: {
        id: 3,
        title: "The Classical Greek Gift (Bxh7+)",
        difficulty: "1750 Peak Level (Master Sacrifice)",
        turn: 'w',
        hint: "Demolish Black's h7 pawn with your bishop to expose the king, then advance Ng5+ with lethal attack.",
        setup: [
            ['bR', null, 'bB', 'bQ', null, 'bR', 'bK', null],
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
            [null, null, 'bN', null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, 'wN', null, null, null, null, null],
            ['wP', 'wP', 'wP', 'wB', null, 'wP', 'wP', 'wP'],
            ['wR', null, 'wB', 'wQ', null, 'wR', 'wK', null]
        ],
        moves: [
            { from: [6, 3], to: [1, 7], san: "Bxh7+" },
            { response: { from: [0, 6], to: [1, 7], san: "Kxh7" } },
            { from: [5, 2], to: [3, 4], san: "Ng5+" }
        ]
    }
};

function initPuzzleEngine() {
    const puzzleBtns = document.querySelectorAll('.btn-load-puzzle');
    puzzleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const puzzleId = parseInt(btn.dataset.puzzle, 10);
            loadPuzzle(puzzleId);
        });
    });

    const cards = document.querySelectorAll('.puzzle-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const pId = parseInt(card.dataset.puzzle, 10);
            loadPuzzle(pId);
        });
    });
}

function loadPuzzle(id) {
    const puzzle = PUZZLES[id];
    if (!puzzle) return;

    activePuzzle = puzzle;
    puzzleStep = 0;

    document.querySelectorAll('.puzzle-card').forEach(c => {
        c.classList.toggle('active', parseInt(c.dataset.puzzle, 10) === id);
    });

    const hintTitle = document.getElementById('hintTitle');
    const hintText = document.getElementById('hintText');
    if (hintTitle) hintTitle.textContent = `${puzzle.title} (${puzzle.difficulty})`;
    if (hintText) hintText.textContent = puzzle.hint;

    clearNotation();
    resetBoard(puzzle.setup);
    setFeedback(`Loaded ${puzzle.title}. Your move!`);
}

function handlePuzzleMove(fromR, fromC, toR, toC) {
    if (!activePuzzle) return;

    const expectedMove = activePuzzle.moves[puzzleStep];
    if (!expectedMove) return;

    const isCorrect = expectedMove.from[0] === fromR &&
                      expectedMove.from[1] === fromC &&
                      expectedMove.to[0] === toR &&
                      expectedMove.to[1] === toC;

    if (isCorrect) {
        puzzleStep++;
        const nextStep = activePuzzle.moves[puzzleStep];
        if (nextStep && nextStep.response) {
            setFeedback("Brilliant move! Opponent defending...", true);
            setTimeout(() => {
                const resp = nextStep.response;
                executeMove(resp.from[0], resp.from[1], resp.to[0], resp.to[1], true);
                renderBoard();
                puzzleStep++;
                setFeedback("Your turn! Deliver the final blow.");
            }, 550);
        } else {
            playSound('success');
            setFeedback("🌟 Solved! Outstanding tactical calculation!", true);
        }
    } else {
        setFeedback("❌ Incorrect move. Look for a more forcing tactical continuation.");
    }
}

// ----------------------------------------------------
// 9. Repertoire Openings Loader
// ----------------------------------------------------
const REPERTOIRE_MOVES = {
    'sicilian': [
        { from: [6, 4], to: [4, 4] },
        { from: [1, 2], to: [3, 2] }
    ],
    'london': [
        { from: [6, 3], to: [4, 3] },
        { from: [1, 3], to: [3, 3] },
        { from: [7, 2], to: [4, 5] }
    ],
    'queens-gambit': [
        { from: [6, 3], to: [4, 3] },
        { from: [1, 3], to: [3, 3] },
        { from: [6, 2], to: [4, 2] }
    ],
    'ruy-lopez': [
        { from: [6, 4], to: [4, 4] },
        { from: [1, 4], to: [3, 4] },
        { from: [7, 6], to: [5, 5] },
        { from: [0, 1], to: [2, 2] },
        { from: [7, 5], to: [3, 1] }
    ]
};

function initModeTabs() {
    const tabs = document.querySelectorAll('.mode-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const mode = tab.dataset.mode;
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${mode}`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    const openingBtns = document.querySelectorAll('.btn-preview-opening, .quick-opening-item button');
    openingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('[data-opening]');
            if (!container) return;
            const openingKey = container.dataset.opening;
            playOpeningSequence(openingKey);
        });
    });
}

function playOpeningSequence(key) {
    const sequence = REPERTOIRE_MOVES[key];
    if (!sequence) return;

    activePuzzle = null;
    clearNotation();
    resetBoard(INITIAL_BOARD);
    setFeedback(`Loading ${key.replace('-', ' ').toUpperCase()} opening moves...`);

    sequence.forEach((m, idx) => {
        setTimeout(() => {
            executeMove(m.from[0], m.from[1], m.to[0], m.to[1], true);
            renderBoard();
            if (idx === sequence.length - 1) {
                setFeedback(`${key.replace('-', ' ').toUpperCase()} loaded on board. Explore variations!`, true);
            }
        }, (idx + 1) * 450);
    });

    const boardEl = document.getElementById('board-arena');
    if (boardEl) boardEl.scrollIntoView({ behavior: 'smooth' });
}

// ----------------------------------------------------
// 10. Board Theme Switcher
// ----------------------------------------------------
function initThemeSwitcher() {
    const select = document.getElementById('boardThemeSelect');
    const frame = document.getElementById('boardFrame');
    if (select && frame) {
        select.addEventListener('change', () => {
            frame.className = `board-frame ${select.value}`;
        });
    }
}

// ----------------------------------------------------
// 11. Live Chess.com REST API Inspector
// ----------------------------------------------------
function initChesscomInspector() {
    const lookupBtn = document.getElementById('lookupBtn');
    const input = document.getElementById('lookupUsername');
    const resultBox = document.getElementById('lookupResult');

    if (lookupBtn && input && resultBox) {
        lookupBtn.addEventListener('click', async () => {
            const username = input.value.trim().toLowerCase();
            if (!username) {
                resultBox.className = 'lookup-result';
                resultBox.innerHTML = '<span style="color: #ff5252;">Please enter a valid Chess.com username.</span>';
                return;
            }

            resultBox.classList.remove('hidden');
            resultBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Querying live Chess.com API for <strong>${escapeHtml(username)}</strong>...`;

            try {
                const [profileRes, statsRes] = await Promise.all([
                    fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username)}`),
                    fetch(`https://api.chess.com/pub/player/${encodeURIComponent(username)}/stats`)
                ]);

                if (!profileRes.ok) {
                    throw new Error("Player not found or profile is private.");
                }

                const profile = await profileRes.json();
                const stats = await statsRes.json();

                const rapid = stats.chess_rapid?.last?.rating || 'Unrated';
                const blitz = stats.chess_blitz?.last?.rating || 'Unrated';
                const bullet = stats.chess_bullet?.last?.rating || 'Unrated';
                const tactics = stats.tactics?.highest?.rating || 'N/A';
                const avatar = profile.avatar || 'photo_2025-12-22_19-34-16.jpg';

                resultBox.innerHTML = `
                    <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem;">
                        <img src="${avatar}" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--primary-color);" alt="${escapeHtml(profile.username)}">
                        <div>
                            <strong style="font-size: 1.6rem; color: var(--text-main);">${escapeHtml(profile.name || profile.username)}</strong>
                            <div style="color: var(--text-muted); font-size: 1.25rem;">Chess.com ID: @${escapeHtml(profile.username)} &bull; Status: ${escapeHtml(profile.status || 'Active')}</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center; margin-top: 1rem;">
                        <div style="background: rgba(180, 75, 75, 0.1); border: 1px solid var(--border-accent); padding: 0.8rem; border-radius: 8px;">
                            <span style="font-size: 1.1rem; color: var(--text-muted);">Rapid</span>
                            <div style="font-size: 1.8rem; font-weight: 700; color: #ff5252;">${rapid}</div>
                        </div>
                        <div style="background: rgba(180, 75, 75, 0.1); border: 1px solid var(--border-accent); padding: 0.8rem; border-radius: 8px;">
                            <span style="font-size: 1.1rem; color: var(--text-muted);">Blitz</span>
                            <div style="font-size: 1.8rem; font-weight: 700; color: #ff6b6b;">${blitz}</div>
                        </div>
                        <div style="background: rgba(180, 75, 75, 0.1); border: 1px solid var(--border-accent); padding: 0.8rem; border-radius: 8px;">
                            <span style="font-size: 1.1rem; color: var(--text-muted);">Bullet</span>
                            <div style="font-size: 1.8rem; font-weight: 700; color: #ff7878;">${bullet}</div>
                        </div>
                        <div style="background: rgba(180, 75, 75, 0.1); border: 1px solid var(--border-accent); padding: 0.8rem; border-radius: 8px;">
                            <span style="font-size: 1.1rem; color: var(--text-muted);">Best Tactics</span>
                            <div style="font-size: 1.8rem; font-weight: 700; color: #ff5252;">${tactics}</div>
                        </div>
                    </div>
                `;
            } catch (err) {
                resultBox.innerHTML = `
                    <div style="color: #ff6b6b;">
                        <i class="fa-solid fa-circle-info"></i> Could not fetch real-time data for <strong>${escapeHtml(username)}</strong>: ${escapeHtml(err.message)}.
                    </div>
                `;
            }
        });
    }
}

// ----------------------------------------------------
// 12. Coaching Inquiry Form
// ----------------------------------------------------
window.handleCoachingSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('coachStudentName').value;
    const email = document.getElementById('coachStudentEmail').value;
    const rating = document.getElementById('coachCurrentRating').value;
    const goal = document.getElementById('coachPrimaryGoal').value;
    const notes = document.getElementById('coachNotes').value;

    const toast = document.getElementById('coachingToast');

    const subject = encodeURIComponent(`Chess Coaching Inquiry: ${name} (${rating})`);
    const body = encodeURIComponent(
        `Hi Serawit,\n\nI would like to inquire about personalized chess coaching with you.\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Current Rating: ${rating}\n` +
        `• Primary Goal: ${goal}\n` +
        `• Notes / Chess.com ID: ${notes}\n\n` +
        `Looking forward to scheduling a diagnostic session!`
    );

    window.location.href = `mailto:serawitshimelis1998@gmail.com?subject=${subject}&body=${body}`;

    if (toast) {
        toast.className = 'coaching-toast success';
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> Thank you ${escapeHtml(name)}! Your coaching inquiry email is ready to send.`;
    }
};

// ----------------------------------------------------
// 13. Mobile Navigation Toggle
// ----------------------------------------------------
function initMobileNav() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('chessNav');
    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        nav.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-active');
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
