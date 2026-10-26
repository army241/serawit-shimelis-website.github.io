// ----------------------------------------------------
// The Chess Sanctum - Core JavaScript Engine (Enhanced FIDE Rules)
// Author: Serawit Shimelis | 1700 Rapid, 1400 Blitz & African Chess Academy Coach Candidate
// Features: Full Legal Move Engine, Strict Check & Checkmate Detection,
// Stalemate Detection, Castling, En Passant, Pawn Promotion with UI Picker,
// Audio Synthesizer, Tactics Puzzles, Openings Loader,
// Chess.com Public API Inspector, Beginner Book Signup & Coaching Booking
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initDynamicBackground();
    initChessAudio();
    initChessBoard();
    initChessClock();
    initFocusMode();
    initModeTabs();
    initPuzzleEngine();
    initThemeSwitcher();
    initChesscomInspector();
    initMobileNav();
    initBookSignup();
});


// ----------------------------------------------------
// 1. Theme Toggle (Synced with Portfolio)
// ----------------------------------------------------
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    function renderTheme(isLight) {
        themeToggle.innerHTML = isLight
            ? '<i class="fa-solid fa-sun"></i> <span>Light mode</span>'
            : '<i class="fa-solid fa-moon"></i> <span>Dark mode</span>';
    }

    const savedTheme = localStorage.getItem('chessTheme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        renderTheme(true);
    } else {
        renderTheme(false);
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        renderTheme(isLightMode);
        localStorage.setItem('chessTheme', isLightMode ? 'light' : 'dark');
    });
}

// ----------------------------------------------------
// 2. Dynamic Floating Wallpaper Background
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
// 3. Synthesized Web Audio Sound Effects
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
        } else if (type === 'check') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.setValueAtTime(880, now + 0.08); // A5
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'success') {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5
            gain2.gain.setValueAtTime(0.28, now + 0.12);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

            osc.start(now);
            osc.stop(now + 0.4);
            osc2.start(now + 0.12);
            osc2.stop(now + 0.5);
        }
    } catch (e) {
        // AudioContext requires initial user interaction
    }
}

// ----------------------------------------------------
// 4. SVG Chess Piece Vectors
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
// 5. Complete FIDE Legal Chess Engine & State
// ----------------------------------------------------
let boardState = [];
let currentTurn = 'w';
let selectedSquare = null;
let legalMoves = [];
let moveHistory = [];
let isFlipped = false;
let activePuzzle = null;
let puzzleStep = 0;

let castlingRights = {
    w: { k: true, q: true },
    b: { k: true, q: true }
};
let enPassantTarget = null; // { r, c }
let inCheckSquare = null;   // { r, c } of King currently in check
let checkmatedSquare = null;// { r, c } of King in checkmate
let isGameOver = false;
let pendingPromotion = null;

// Clock & Focus Mode State
let hasStartedPlay = false;
let isFocusMode = false;
let whiteTimeSeconds = 600;
let blackTimeSeconds = 600;
let activeClock = null; // 'w' | 'b' | null
let clockTimerInterval = null;
let timeControlMinutes = 10;
let isClockRunning = false;

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

    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            hideGameOverModal();
            activePuzzle = null;
            resetBoard(INITIAL_BOARD);
            setFeedback('New game started. White to move.');
            clearNotation();
        });
    }

    const dismissGameOverBtn = document.getElementById('dismissGameOverBtn');
    if (dismissGameOverBtn) {
        dismissGameOverBtn.addEventListener('click', hideGameOverModal);
    }
}

function resetBoard(setup, customTurn = 'w', customCastling = null, customEP = null) {
    boardState = JSON.parse(JSON.stringify(setup));
    currentTurn = customTurn;
    selectedSquare = null;
    legalMoves = [];
    isGameOver = false;
    pendingPromotion = null;
    inCheckSquare = null;
    checkmatedSquare = null;
    hasStartedPlay = false;

    if (typeof resetClock === 'function') {
        resetClock();
    }

    castlingRights = customCastling
        ? JSON.parse(JSON.stringify(customCastling))
        : { w: { k: true, q: true }, b: { k: true, q: true } };

    enPassantTarget = customEP ? { ...customEP } : null;

    hideGameOverModal();
    hidePromotionPicker();
    evaluateGameState();
    renderBoard();
    updateTurnIndicator();
}


function inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}

// ----------------------------------------------------
// Attack & Check Detection
// ----------------------------------------------------
function isSquareAttacked(targetR, targetC, attackerColor, board) {
    // 1. Knight attacks
    const knightOffsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
        const nr = targetR + dr;
        const nc = targetC + dc;
        if (inBounds(nr, nc)) {
            const p = board[nr][nc];
            if (p === attackerColor + 'N') return true;
        }
    }

    // 2. Pawn attacks
    // White pawns move up (-1), so they attack target downwards (+1)
    // Black pawns move down (+1), so they attack target upwards (-1)
    const pawnRowOffset = attackerColor === 'w' ? 1 : -1;
    for (const dc of [-1, 1]) {
        const pr = targetR + pawnRowOffset;
        const pc = targetC + dc;
        if (inBounds(pr, pc)) {
            const p = board[pr][pc];
            if (p === attackerColor + 'P') return true;
        }
    }

    // 3. King attacks (adjacent squares)
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) {
                const kr = targetR + dr;
                const kc = targetC + dc;
                if (inBounds(kr, kc)) {
                    const p = board[kr][kc];
                    if (p === attackerColor + 'K') return true;
                }
            }
        }
    }

    // 4. Straight attacks (Rooks & Queens)
    const straights = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straights) {
        let step = 1;
        while (inBounds(targetR + dr * step, targetC + dc * step)) {
            const p = board[targetR + dr * step][targetC + dc * step];
            if (p) {
                if (p === attackerColor + 'R' || p === attackerColor + 'Q') return true;
                break;
            }
            step++;
        }
    }

    // 5. Diagonal attacks (Bishops & Queens)
    const diagonals = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagonals) {
        let step = 1;
        while (inBounds(targetR + dr * step, targetC + dc * step)) {
            const p = board[targetR + dr * step][targetC + dc * step];
            if (p) {
                if (p === attackerColor + 'B' || p === attackerColor + 'Q') return true;
                break;
            }
            step++;
        }
    }

    return false;
}

function findKing(color, board) {
    const kingCode = color + 'K';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === kingCode) return { r, c };
        }
    }
    return null;
}

function isKingInCheck(color, board) {
    const kingPos = findKing(color, board);
    if (!kingPos) return false;
    const opponent = color === 'w' ? 'b' : 'w';
    return isSquareAttacked(kingPos.r, kingPos.c, opponent, board);
}

// ----------------------------------------------------
// Move Generation (FIDE Compliant)
// ----------------------------------------------------
function generatePseudoLegalMoves(r, c, piece, board, castling, epTarget) {
    const moves = [];
    const color = piece[0];
    const type = piece[1];

    function addMove(toR, toC, meta = {}) {
        if (!inBounds(toR, toC)) return false;
        const target = board[toR][toC];
        if (!target) {
            moves.push({ from: { r, c }, to: { r: toR, c: toC }, piece, ...meta });
            return true;
        }
        if (target[0] !== color) {
            moves.push({ from: { r, c }, to: { r: toR, c: toC }, piece, isCapture: true, ...meta });
        }
        return false;
    }

    // --- PAWNS ---
    if (type === 'P') {
        const dir = color === 'w' ? -1 : 1;
        const startRank = color === 'w' ? 6 : 1;
        const promoRank = color === 'w' ? 0 : 7;

        // One step forward
        const f1R = r + dir;
        if (inBounds(f1R, c) && !board[f1R][c]) {
            const isPromo = f1R === promoRank;
            moves.push({ from: { r, c }, to: { r: f1R, c }, piece, isPromotion: isPromo });

            // Two steps forward from start rank
            const f2R = r + dir * 2;
            if (r === startRank && inBounds(f2R, c) && !board[f2R][c]) {
                moves.push({ from: { r, c }, to: { r: f2R, c }, piece, isPawnDoubleStep: true });
            }
        }

        // Diagonal captures
        for (const dc of [-1, 1]) {
            const diagR = r + dir;
            const diagC = c + dc;
            if (inBounds(diagR, diagC)) {
                const target = board[diagR][diagC];
                if (target && target[0] !== color) {
                    const isPromo = diagR === promoRank;
                    moves.push({ from: { r, c }, to: { r: diagR, c: diagC }, piece, isCapture: true, isPromotion: isPromo });
                }
                // En Passant capture
                if (epTarget && epTarget.r === diagR && epTarget.c === diagC) {
                    moves.push({ from: { r, c }, to: { r: diagR, c: diagC }, piece, isCapture: true, isEnPassant: true });
                }
            }
        }
    }

    // --- KNIGHTS ---
    if (type === 'N') {
        const knightJumps = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightJumps.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    // --- BISHOPS & QUEENS (Diagonals) ---
    if (type === 'B' || type === 'Q') {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (const [dr, dc] of dirs) {
            let step = 1;
            while (addMove(r + dr * step, c + dc * step)) {
                step++;
            }
        }
    }

    // --- ROOKS & QUEENS (Straights) ---
    if (type === 'R' || type === 'Q') {
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [dr, dc] of dirs) {
            let step = 1;
            while (addMove(r + dr * step, c + dc * step)) {
                step++;
            }
        }
    }

    // --- KING ---
    if (type === 'K') {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr !== 0 || dc !== 0) {
                    addMove(r + dr, c + dc);
                }
            }
        }

        // Castling Moves
        const opponent = color === 'w' ? 'b' : 'w';
        const kingHomeR = color === 'w' ? 7 : 0;
        const inCheckNow = isSquareAttacked(r, c, opponent, board);

        if (r === kingHomeR && c === 4 && !inCheckNow && castling[color]) {
            // Kingside Castling (e1 -> g1 / e8 -> g8)
            if (castling[color].k && board[kingHomeR][7] === color + 'R') {
                const emptyF = !board[kingHomeR][5];
                const emptyG = !board[kingHomeR][6];
                if (emptyF && emptyG) {
                    const passAttacked = isSquareAttacked(kingHomeR, 5, opponent, board);
                    const destAttacked = isSquareAttacked(kingHomeR, 6, opponent, board);
                    if (!passAttacked && !destAttacked) {
                        moves.push({
                            from: { r, c },
                            to: { r: kingHomeR, c: 6 },
                            piece,
                            isCastleKingside: true,
                            isKingsideCastle: true
                        });
                    }
                }
            }

            // Queenside Castling (e1 -> c1 / e8 -> c8)
            if (castling[color].q && board[kingHomeR][0] === color + 'R') {
                const emptyD = !board[kingHomeR][3];
                const emptyC = !board[kingHomeR][2];
                const emptyB = !board[kingHomeR][1];
                if (emptyD && emptyC && emptyB) {
                    const passAttacked = isSquareAttacked(kingHomeR, 3, opponent, board);
                    const destAttacked = isSquareAttacked(kingHomeR, 2, opponent, board);
                    if (!passAttacked && !destAttacked) {
                        moves.push({
                            from: { r, c },
                            to: { r: kingHomeR, c: 2 },
                            piece,
                            isCastleQueenside: true,
                            isQueensideCastle: true
                        });
                    }
                }
            }
        }
    }

    return moves;
}

// Filter moves that leave the king in check
function getLegalMovesForSquare(r, c, board, castling, epTarget) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];

    const pseudoMoves = generatePseudoLegalMoves(r, c, piece, board, castling, epTarget);
    const legal = [];

    for (const move of pseudoMoves) {
        // Clone board to simulate move
        const simBoard = JSON.parse(JSON.stringify(board));
        const { from, to } = move;

        // Perform move on clone
        simBoard[to.r][to.c] = simBoard[from.r][from.c];
        simBoard[from.r][from.c] = null;

        // Handle En Passant capture removal on simulated board
        if (move.isEnPassant) {
            simBoard[from.r][to.c] = null;
        }

        // Handle Castling Rook move on simulated board
        if (move.isCastleKingside || move.isKingsideCastle) {
            simBoard[from.r][5] = simBoard[from.r][7];
            simBoard[from.r][7] = null;
        } else if (move.isCastleQueenside || move.isQueensideCastle) {
            simBoard[from.r][3] = simBoard[from.r][0];
            simBoard[from.r][0] = null;
        }

        // Did this move leave own king in check?
        if (!isKingInCheck(color, simBoard)) {
            legal.push(move);
        }
    }

    return legal;
}

function getAllLegalMoves(color, board, castling, epTarget) {
    const all = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && board[r][c][0] === color) {
                const moves = getLegalMovesForSquare(r, c, board, castling, epTarget);
                all.push(...moves);
            }
        }
    }
    return all;
}

// ----------------------------------------------------
// Game State Evaluation: Check, Checkmate, Stalemate
// ----------------------------------------------------
function evaluateGameState() {
    const inCheck = isKingInCheck(currentTurn, boardState);
    const kingPos = findKing(currentTurn, boardState);
    const allLegalMoves = getAllLegalMoves(currentTurn, boardState, castlingRights, enPassantTarget);

    inCheckSquare = inCheck ? kingPos : null;

    if (allLegalMoves.length === 0) {
        isGameOver = true;
        if (typeof pauseClock === 'function') pauseClock();
        if (inCheck) {
            checkmatedSquare = kingPos;
            const winner = currentTurn === 'w' ? 'Black' : 'White';
            showGameOverModal('Checkmate!', `${winner} wins by checkmate!`, 'trophy');
            playSound('success');
            setFeedback(`🏆 CHECKMATE! ${winner} wins by checkmate!`, true);
        } else {
            checkmatedSquare = null;
            showGameOverModal('Stalemate!', 'Game drawn by stalemate. No legal moves remaining.', 'handshake');
            setFeedback('🤝 DRAW BY STALEMATE! Neither player can make a legal move.');
        }
    } else {
        checkmatedSquare = null;
        if (inCheck) {
            const side = currentTurn === 'w' ? 'White' : 'Black';
            setFeedback(`⚠️ CHECK! ${side}'s King is under attack!`);
            playSound('check');
        }
    }
}

// ----------------------------------------------------
// Smooth Drag & Drop Engine (60fps Hardware-Accelerated)
// ----------------------------------------------------
let ignoreNextSquareClick = false;

function updateSquareHighlights() {
    const frame = document.getElementById('boardFrame');
    if (!frame) return;

    const squares = frame.querySelectorAll('.square');
    squares.forEach(sq => {
        const r = parseInt(sq.dataset.row, 10);
        const c = parseInt(sq.dataset.col, 10);

        sq.classList.remove('selected', 'valid-move', 'valid-capture', 'drag-hover');

        if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
            sq.classList.add('selected');
        }

        const isLegal = legalMoves.find(m => m.to.r === r && m.to.c === c);
        if (isLegal) {
            const hasPiece = boardState[r][c] || isLegal.isEnPassant;
            if (hasPiece) {
                sq.classList.add('valid-capture');
            } else {
                sq.classList.add('valid-move');
            }
        }
    });
}

function attachPieceDrag(pieceEl, fromR, fromC, pieceCode) {
    pieceEl.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        if (isGameOver || pendingPromotion) return;

        // Only allow dragging the active turn's pieces
        if (pieceCode[0] !== currentTurn) return;

        const currentLegalMoves = getLegalMovesForSquare(fromR, fromC, boardState, castlingRights, enPassantTarget);

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = pieceEl.getBoundingClientRect();
        const grabOffsetX = startX - rect.left;
        const grabOffsetY = startY - rect.top;
        const originX = rect.left;
        const originY = rect.top;
        const pieceW = rect.width;
        const pieceH = rect.height;

        let isDragging = false;
        let dragAvatar = null;
        let currentHoverSquare = null;

        const onPointerMove = (moveEvt) => {
            const dist = Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY);

            if (!isDragging && dist > 4) {
                isDragging = true;
                ignoreNextSquareClick = true;

                selectedSquare = { r: fromR, c: fromC };
                legalMoves = currentLegalMoves;
                updateSquareHighlights();

                dragAvatar = document.createElement('div');
                dragAvatar.className = 'drag-piece-avatar';
                dragAvatar.style.width = `${pieceW}px`;
                dragAvatar.style.height = `${pieceH}px`;
                dragAvatar.innerHTML = `<img src="images/pieces/${pieceCode.toLowerCase()}.png" alt="${pieceCode}" draggable="false">`;
                document.body.appendChild(dragAvatar);

                pieceEl.classList.add('dragging-origin');
                document.body.style.cursor = 'grabbing';
            }

            if (isDragging && dragAvatar) {
                const posX = moveEvt.clientX - grabOffsetX;
                const posY = moveEvt.clientY - grabOffsetY;
                dragAvatar.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;

                const elemUnder = document.elementFromPoint(moveEvt.clientX, moveEvt.clientY);
                const targetSq = elemUnder ? elemUnder.closest('.square') : null;

                if (targetSq !== currentHoverSquare) {
                    if (currentHoverSquare) {
                        currentHoverSquare.classList.remove('drag-hover');
                    }
                    if (targetSq) {
                        const targetR = parseInt(targetSq.dataset.row, 10);
                        const targetC = parseInt(targetSq.dataset.col, 10);
                        const isLegal = currentLegalMoves.some(m => m.to.r === targetR && m.to.c === targetC);
                        if (isLegal) {
                            targetSq.classList.add('drag-hover');
                        }
                    }
                    currentHoverSquare = targetSq;
                }
            }
        };

        const onPointerUp = (upEvt) => {
            pieceEl.removeEventListener('pointermove', onPointerMove);
            pieceEl.removeEventListener('pointerup', onPointerUp);
            pieceEl.removeEventListener('pointercancel', onPointerUp);
            try {
                pieceEl.releasePointerCapture(e.pointerId);
            } catch (err) {}

            document.body.style.cursor = '';

            if (currentHoverSquare) {
                currentHoverSquare.classList.remove('drag-hover');
                currentHoverSquare = null;
            }

            if (isDragging) {
                const elemUnder = document.elementFromPoint(upEvt.clientX, upEvt.clientY);
                const targetSq = elemUnder ? elemUnder.closest('.square') : null;

                let validMove = null;
                if (targetSq) {
                    const toR = parseInt(targetSq.dataset.row, 10);
                    const toC = parseInt(targetSq.dataset.col, 10);
                    validMove = currentLegalMoves.find(m => m.to.r === toR && m.to.c === toC);
                }

                if (validMove) {
                    if (dragAvatar && dragAvatar.parentNode) {
                        dragAvatar.parentNode.removeChild(dragAvatar);
                        dragAvatar = null;
                    }
                    pieceEl.classList.remove('dragging-origin');

                    if (validMove.isPromotion) {
                        showPromotionPicker(fromR, fromC, validMove.to.r, validMove.to.c, currentTurn);
                    } else {
                        executeMove(fromR, fromC, validMove.to.r, validMove.to.c);
                        selectedSquare = null;
                        legalMoves = [];
                        renderBoard();
                    }
                } else {
                    // Smooth snap back animation if dropped on invalid square
                    if (dragAvatar) {
                        dragAvatar.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.18s ease';
                        dragAvatar.style.transform = `translate3d(${originX}px, ${originY}px, 0)`;
                        setTimeout(() => {
                            if (dragAvatar && dragAvatar.parentNode) {
                                dragAvatar.parentNode.removeChild(dragAvatar);
                                dragAvatar = null;
                            }
                            pieceEl.classList.remove('dragging-origin');
                            selectedSquare = { r: fromR, c: fromC };
                            legalMoves = currentLegalMoves;
                            updateSquareHighlights();
                        }, 180);
                    } else {
                        pieceEl.classList.remove('dragging-origin');
                    }
                }

                setTimeout(() => {
                    ignoreNextSquareClick = false;
                }, 80);
            }
        };

        pieceEl.addEventListener('pointermove', onPointerMove);
        pieceEl.addEventListener('pointerup', onPointerUp);
        pieceEl.addEventListener('pointercancel', onPointerUp);
        try {
            pieceEl.setPointerCapture(e.pointerId);
        } catch (err) {}
    });
}

// ----------------------------------------------------
// Board Rendering
// ----------------------------------------------------
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

            // Coordinate labels (matching the user's reference board)
            const fileChar = String.fromCharCode(97 + c);
            const rankChar = 8 - r;

            if (r === (isFlipped ? 0 : 7)) {
                const fileLabel = document.createElement('span');
                fileLabel.classList.add('sq-coord', 'coord-file');
                fileLabel.textContent = fileChar;
                squareEl.appendChild(fileLabel);
            }
            if (c === (isFlipped ? 7 : 0)) {
                const rankLabel = document.createElement('span');
                rankLabel.classList.add('sq-coord', 'coord-rank');
                rankLabel.textContent = rankChar;
                squareEl.appendChild(rankLabel);
            }

            // Piece Element (High-Res Neo vectors from downloaded images/pieces/)
            const pieceCode = boardState[r][c];
            if (pieceCode) {
                const pieceEl = document.createElement('div');
                pieceEl.classList.add('piece');
                pieceEl.innerHTML = `<img src="images/pieces/${pieceCode.toLowerCase()}.png" alt="${pieceCode}" class="piece-img" draggable="false">`;
                pieceEl.dataset.piece = pieceCode;
                pieceEl.dataset.row = r;
                pieceEl.dataset.col = c;
                attachPieceDrag(pieceEl, r, c, pieceCode);
                squareEl.appendChild(pieceEl);
            }

            // Square Click Handler (for standard click-to-move)
            squareEl.addEventListener('click', () => handleSquareClick(r, c));

            // Selection Highlight
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                squareEl.classList.add('selected');
            }

            // Check & Checkmate Highlighting
            if (inCheckSquare && inCheckSquare.r === r && inCheckSquare.c === c) {
                squareEl.classList.add('in-check');
            }
            if (checkmatedSquare && checkmatedSquare.r === r && checkmatedSquare.c === c) {
                squareEl.classList.add('checkmate');
            }

            // Valid Legal Move Hints
            const isLegalMove = legalMoves.find(m => m.to.r === r && m.to.c === c);
            if (isLegalMove) {
                if (pieceCode || isLegalMove.isEnPassant) {
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
    if (ignoreNextSquareClick) {
        ignoreNextSquareClick = false;
        return;
    }
    if (isGameOver) return;
    if (pendingPromotion) return; // Wait for promotion selection

    const clickedPiece = boardState[r][c];

    // Case 1: Selecting a piece of the current player
    if (clickedPiece && clickedPiece[0] === currentTurn) {
        selectedSquare = { r, c };
        legalMoves = getLegalMovesForSquare(r, c, boardState, castlingRights, enPassantTarget);
        renderBoard();
        return;
    }

    // Case 2: Attempting to move previously selected piece to clicked square
    if (selectedSquare) {
        const move = legalMoves.find(m => m.to.r === r && m.to.c === c);
        if (move) {
            if (move.isPromotion) {
                showPromotionPicker(selectedSquare.r, selectedSquare.c, r, c, currentTurn);
                return;
            }
            executeMove(selectedSquare.r, selectedSquare.c, r, c);
            selectedSquare = null;
            legalMoves = [];
            renderBoard();
            return;
        }
    }

    // Clicked elsewhere - deselect
    selectedSquare = null;
    legalMoves = [];
    renderBoard();
}

// ----------------------------------------------------
// Move Execution
// ----------------------------------------------------
function executeMove(fromR, fromC, toR, toC, isAutomated = false, chosenPromoPiece = null) {
    const piece = boardState[fromR][fromC];
    if (!piece) return;

    const color = piece[0];
    const type = piece[1];
    const target = boardState[toR][toC];

    const isDoublePawn = type === 'P' && Math.abs(fromR - toR) === 2;
    const isEnPassantCapture = type === 'P' && enPassantTarget && enPassantTarget.r === toR && enPassantTarget.c === toC;
    const isKingsideCastle = type === 'K' && toC - fromC === 2;
    const isQueensideCastle = type === 'K' && fromC - toC === 2;
    const isPromo = type === 'P' && (toR === 0 || toR === 7);

    // Save state snapshot for full Undo support
    moveHistory.push({
        from: { r: fromR, c: fromC },
        to: { r: toR, c: toC },
        piece: piece,
        captured: target,
        boardBefore: JSON.parse(JSON.stringify(boardState)),
        turnBefore: currentTurn,
        castlingBefore: JSON.parse(JSON.stringify(castlingRights)),
        enPassantBefore: enPassantTarget ? { ...enPassantTarget } : null,
        isGameOverBefore: isGameOver,
        inCheckSquareBefore: inCheckSquare ? { ...inCheckSquare } : null,
        checkmatedSquareBefore: checkmatedSquare ? { ...checkmatedSquare } : null
    });

    // Sound effect
    if (target || isEnPassantCapture) {
        playSound('capture');
    } else {
        playSound('move');
    }

    // 1. Move the primary piece
    boardState[toR][toC] = piece;
    boardState[fromR][fromC] = null;

    // 2. Handle En Passant pawn removal
    if (isEnPassantCapture) {
        boardState[fromR][toC] = null;
    }

    // 3. Handle Castling Rook movements
    if (isKingsideCastle) {
        boardState[fromR][5] = boardState[fromR][7];
        boardState[fromR][7] = null;
    } else if (isQueensideCastle) {
        boardState[fromR][3] = boardState[fromR][0];
        boardState[fromR][0] = null;
    }

    // 4. Handle Pawn Promotion
    let promoSuffix = '';
    if (isPromo) {
        const promoType = chosenPromoPiece ? chosenPromoPiece.toUpperCase() : 'Q';
        boardState[toR][toC] = color + promoType;
        promoSuffix = `=${promoType}`;
    }

    // 5. Update Castling Rights
    if (piece === 'wK') {
        castlingRights.w.k = false;
        castlingRights.w.q = false;
    } else if (piece === 'bK') {
        castlingRights.b.k = false;
        castlingRights.b.q = false;
    } else if (piece === 'wR') {
        if (fromR === 7 && fromC === 0) castlingRights.w.q = false;
        if (fromR === 7 && fromC === 7) castlingRights.w.k = false;
    } else if (piece === 'bR') {
        if (fromR === 0 && fromC === 0) castlingRights.b.q = false;
        if (fromR === 0 && fromC === 7) castlingRights.b.k = false;
    }

    // If opponent rook is captured in corner
    if (target === 'wR') {
        if (toR === 7 && toC === 0) castlingRights.w.q = false;
        if (toR === 7 && toC === 7) castlingRights.w.k = false;
    } else if (target === 'bR') {
        if (toR === 0 && toC === 0) castlingRights.b.q = false;
        if (toR === 0 && toC === 7) castlingRights.b.k = false;
    }

    // 6. Update En Passant Target
    if (isDoublePawn) {
        enPassantTarget = { r: (fromR + toR) / 2, c: fromC };
    } else {
        enPassantTarget = null;
    }

    // 7. Toggle Turn
    currentTurn = currentTurn === 'w' ? 'b' : 'w';

    // 8. Evaluate Game State after move
    evaluateGameState();

    // 9. Generate Standard Algebraic Notation (SAN)
    const notation = generateAlgebraicNotation(
        piece,
        fromR,
        fromC,
        toR,
        toC,
        !!target || isEnPassantCapture,
        isKingsideCastle,
        isQueensideCastle,
        promoSuffix
    );
    appendNotation(notation);

    updateTurnIndicator();

    // 10. Clock update & Focus mode auto-expand on first move
    if (!isAutomated && !activePuzzle) {
        if (typeof onMoveClockUpdate === 'function') {
            onMoveClockUpdate();
        }
        if (!hasStartedPlay && !isFocusMode) {
            hasStartedPlay = true;
            if (typeof enterFocusMode === 'function') {
                enterFocusMode();
            }
        }
    }

    // 11. Puzzle Evaluation
    if (activePuzzle && !isAutomated) {
        handlePuzzleMove(fromR, fromC, toR, toC);
    }
}

// ----------------------------------------------------
// Pawn Promotion UI Picker
// ----------------------------------------------------
function showPromotionPicker(fromR, fromC, toR, toC, color, isAutomated = false) {
    if (isAutomated) {
        executeMove(fromR, fromC, toR, toC, true, 'Q');
        return;
    }

    pendingPromotion = { fromR, fromC, toR, toC };
    const modal = document.getElementById('promotionModal');
    const choices = document.getElementById('promotionChoices');
    if (!modal || !choices) {
        executeMove(fromR, fromC, toR, toC, false, 'Q');
        return;
    }

    choices.innerHTML = '';
    const pieceTypes = ['Q', 'R', 'B', 'N'];
    pieceTypes.forEach(pType => {
        const btn = document.createElement('button');
        btn.classList.add('promotion-choice-btn');
        const pCode = (color + pType).toLowerCase();
        btn.innerHTML = `<img src="images/pieces/${pCode}.png" alt="${color + pType}" class="promo-choice-img">`;
        btn.title = `Promote to ${pType === 'Q' ? 'Queen' : pType === 'R' ? 'Rook' : pType === 'B' ? 'Bishop' : 'Knight'}`;
        btn.addEventListener('click', () => {
            hidePromotionPicker();
            executeMove(fromR, fromC, toR, toC, false, pType);
            selectedSquare = null;
            legalMoves = [];
            pendingPromotion = null;
            renderBoard();
        });
        choices.appendChild(btn);
    });


    modal.classList.remove('hidden');
}

function hidePromotionPicker() {
    const modal = document.getElementById('promotionModal');
    if (modal) modal.classList.add('hidden');
    pendingPromotion = null;
}

function showGameOverModal(title, desc, iconName) {
    const modal = document.getElementById('gameOverModal');
    const titleEl = document.getElementById('gameOverTitle');
    const descEl = document.getElementById('gameOverDesc');
    const iconEl = document.getElementById('gameOverIcon');

    if (modal && titleEl && descEl && iconEl) {
        titleEl.textContent = title;
        descEl.textContent = desc;
        iconEl.innerHTML = `<i class="fa-solid fa-${iconName}"></i>`;
        modal.classList.remove('hidden');
    }
}

function hideGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    if (modal) modal.classList.add('hidden');
}

function undoMove() {
    if (!moveHistory.length) return;
    const last = moveHistory.pop();

    boardState = last.boardBefore;
    currentTurn = last.turnBefore;
    castlingRights = last.castlingBefore;
    enPassantTarget = last.enPassantBefore;
    isGameOver = last.isGameOverBefore;
    inCheckSquare = last.inCheckSquareBefore;
    checkmatedSquare = last.checkmatedSquareBefore;

    selectedSquare = null;
    legalMoves = [];
    pendingPromotion = null;

    hideGameOverModal();
    hidePromotionPicker();
    renderBoard();
    updateTurnIndicator();
    removeLastNotation();
    setFeedback('Undid last move.');
}

function updateTurnIndicator() {
    const pill = document.getElementById('turnIndicator');
    if (!pill) return;

    if (isGameOver) {
        if (checkmatedSquare) {
            const winner = currentTurn === 'w' ? 'Black' : 'White';
            pill.className = 'turn-pill check-turn';
            pill.innerHTML = `<i class="fa-solid fa-trophy" style="color: #ffd700;"></i> Checkmate: ${winner} Wins!`;
        } else {
            pill.className = 'turn-pill draw-turn';
            pill.innerHTML = `<i class="fa-solid fa-handshake"></i> Game Over: Draw (Stalemate)`;
        }
        return;
    }

    if (inCheckSquare) {
        pill.className = 'turn-pill check-turn';
        const side = currentTurn === 'w' ? 'White' : 'Black';
        pill.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color: #ff3333;"></i> ${side} in Check!`;
        return;
    }

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
        el.style.color = isSuccess ? '#ff5252' : 'var(--text-main)';
    }
}

// ----------------------------------------------------
// 6. Algebraic Notation Generator
// ----------------------------------------------------
function coordsToSquare(r, c) {
    const file = String.fromCharCode(97 + c);
    const rank = 8 - r;
    return `${file}${rank}`;
}

function generateAlgebraicNotation(piece, fromR, fromC, toR, toC, isCapture, isKingsideCastle, isQueensideCastle, promoSuffix) {
    if (isKingsideCastle) {
        return checkmatedSquare ? 'O-O#' : inCheckSquare ? 'O-O+' : 'O-O';
    }
    if (isQueensideCastle) {
        return checkmatedSquare ? 'O-O-O#' : inCheckSquare ? 'O-O-O+' : 'O-O-O';
    }

    const type = piece[1];
    const dest = coordsToSquare(toR, toC);
    let san = '';

    if (type === 'P') {
        if (isCapture) {
            const startFile = String.fromCharCode(97 + fromC);
            san = `${startFile}x${dest}`;
        } else {
            san = dest;
        }
    } else {
        const pieceLetter = type;
        const captureSymbol = isCapture ? 'x' : '';
        san = `${pieceLetter}${captureSymbol}${dest}`;
    }

    san += promoSuffix;

    if (checkmatedSquare) {
        san += '#';
    } else if (inCheckSquare) {
        san += '+';
    }

    return san;
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
// 7. Tactical Puzzles Engine (Authentic & 100% Legal)
// ----------------------------------------------------
const PUZZLES = {
    1: {
        id: 1,
        title: "The Queen's Deflection Decoy",
        difficulty: "1700 Rapid Level (Mate in 2)",
        turn: 'w',
        hint: "White has a lethal e-file battery. Look for a queen sacrifice that forcibly drags the enemy king into checkmate!",
        setup: [
            ['bR', null, null, null, 'bR', null, 'bK', null], // row 0: a8=bR, e8=bR, g8=bK
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'], // row 1: a7,b7,c7, f7,g7,h7
            [null, null, 'bN', null, null, null, null, null], // row 2: c6=bN
            [null, null, null, null, null, null, null, null], // row 3
            [null, null, null, null, null, null, null, null], // row 4
            [null, null, null, null, 'wQ', 'wN', null, null], // row 5: e3=wQ, f3=wN
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'], // row 6: a2,b2,c2, f2,g2,h2
            [null, null, null, null, 'wR', null, 'wK', null]  // row 7: e1=wR, g1=wK
        ],
        castling: { w: { k: false, q: false }, b: { k: false, q: false } },
        moves: [
            { from: [5, 4], to: [0, 4], san: "Qxe8+" },
            { response: { from: [0, 0], to: [0, 4], san: "Rxe8" } },
            { from: [7, 4], to: [0, 4], san: "Rxe8#" }
        ]
    },
    2: {
        id: 2,
        title: "The Royal Knight Smother",
        difficulty: "1400 Blitz Level (Smothered Mate in 1)",
        turn: 'w',
        hint: "Black's king is claustrophobically trapped on h8 by its own pieces. A knight leap delivers an unstoppable smothered mate!",
        setup: [
            ['bR', null, null, null, null, null, 'bR', 'bK'], // row 0: a8=bR, g8=bR, h8=bK
            ['bP', 'bP', 'bP', null, null, null, 'bP', 'bP'], // row 1: a7,b7,c7, g7,h7
            [null, null, null, null, null, null, null, null], // row 2
            [null, null, null, null, 'wN', null, null, null], // row 3: e5=wN ([3,4])
            [null, null, 'wQ', null, null, null, null, null], // row 4: c4=wQ ([4,2])
            [null, null, null, null, null, null, null, null], // row 5
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'], // row 6
            ['wR', null, null, null, null, 'wR', 'wK', null]  // row 7
        ],
        castling: { w: { k: false, q: false }, b: { k: false, q: false } },
        moves: [
            { from: [3, 4], to: [1, 5], san: "Nf7#" }
        ]
    },
    3: {
        id: 3,
        title: "The Classical Greek Gift (Bxh7+)",
        difficulty: "1750 Peak Level (Master Sacrifice)",
        turn: 'w',
        hint: "Demolish Black's h7 pawn with your bishop to expose the king, then advance Ng5+ with lethal attack.",
        setup: [
            ['bR', null, null, 'bQ', null, 'bR', 'bK', null], // row 0: a8=bR, d8=bQ, f8=bR, g8=bK
            ['bP', 'bP', 'bP', null, 'bB', 'bP', 'bP', 'bP'], // row 1: a7,b7,c7, e7=bB, f7,g7, h7=bP
            [null, null, null, 'bN', null, null, null, null], // row 2: d6=bN
            [null, null, null, null, null, null, null, null], // row 3
            [null, null, null, null, null, null, null, null], // row 4
            [null, null, null, 'wB', null, 'wN', null, null], // row 5: d3=wB, f3=wN
            ['wP', 'wP', 'wP', null, 'wP', 'wP', 'wP', 'wP'], // row 6: a2,b2,c2, e2,f2,g2,h2
            ['wR', null, 'wB', 'wQ', null, 'wR', 'wK', null]  // row 7
        ],
        castling: { w: { k: false, q: false }, b: { k: false, q: false } },
        moves: [
            { from: [5, 3], to: [1, 7], san: "Bxh7+" },
            { response: { from: [0, 6], to: [1, 7], san: "Kxh7" } },
            { from: [5, 5], to: [3, 6], san: "Ng5+" }
        ]
    }
};

function initPuzzleEngine() {
    const puzzleBtns = document.querySelectorAll('.btn-load-puzzle');
    puzzleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
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
    resetBoard(puzzle.setup, puzzle.turn, puzzle.castling || null, null);
    setFeedback(`Loaded ${puzzle.title}. Your move!`);

    const boardEl = document.getElementById('board-arena');
    if (boardEl) boardEl.scrollIntoView({ behavior: 'smooth' });
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
            setFeedback("Brilliant move! Opponent responding...", true);
            setTimeout(() => {
                const resp = nextStep.response;
                executeMove(resp.from[0], resp.from[1], resp.to[0], resp.to[1], true);
                renderBoard();
                puzzleStep++;
                setFeedback("Your turn! Deliver the final blow.", true);
            }, 600);
        } else {
            playSound('success');
            setFeedback("🌟 Solved! Outstanding tactical acuity!", true);
        }
    } else {
        setFeedback("❌ Not quite. Look for a more forcing tactical continuation.");
    }
}

// ----------------------------------------------------
// 8. Repertoire Openings Loader (5 User-Requested Openings)
// ----------------------------------------------------
const REPERTOIRE_MOVES = {
    // 1. Scotch Game for White
    'scotch': [
        { from: [6, 4], to: [4, 4] }, // 1. e4
        { from: [1, 4], to: [3, 4] }, // 1... e5
        { from: [7, 6], to: [5, 5] }, // 2. Nf3
        { from: [0, 1], to: [2, 2] }, // 2... Nc6
        { from: [6, 3], to: [4, 3] }  // 3. d4 (The Scotch Strike!)
    ],
    // 2. Catalan Opening for White
    'catalan': [
        { from: [6, 3], to: [4, 3] }, // 1. d4
        { from: [0, 6], to: [2, 5] }, // 1... Nf6
        { from: [6, 2], to: [4, 2] }, // 2. c4
        { from: [1, 4], to: [2, 4] }, // 2... e6
        { from: [6, 6], to: [5, 6] }, // 3. g3
        { from: [1, 3], to: [3, 3] }, // 3... d5
        { from: [7, 5], to: [6, 6] }  // 4. Bg2 (The Long Diagonal Bishop!)
    ],
    // 3. Queen's Gambit for White
    'queens-gambit': [
        { from: [6, 3], to: [4, 3] }, // 1. d4
        { from: [1, 3], to: [3, 3] }, // 1... d5
        { from: [6, 2], to: [4, 2] }  // 2. c4
    ],
    // 4. Sicilian Defense for Black
    'sicilian': [
        { from: [6, 4], to: [4, 4] }, // 1. e4
        { from: [1, 2], to: [3, 2] }, // 1... c5
        { from: [7, 6], to: [5, 5] }, // 2. Nf3
        { from: [1, 3], to: [2, 3] }, // 2... d6
        { from: [6, 3], to: [4, 3] }, // 3. d4
        { from: [3, 2], to: [4, 3] }, // 3... cxd4
        { from: [5, 5], to: [4, 3] }  // 4. Nxd4
    ],
    // 5. Modern Defense for Black
    'modern-defense': [
        { from: [6, 4], to: [4, 4] }, // 1. e4
        { from: [1, 6], to: [2, 6] }, // 1... g6
        { from: [6, 3], to: [4, 3] }, // 2. d4
        { from: [0, 5], to: [1, 6] }, // 2... Bg7
        { from: [7, 1], to: [5, 2] }, // 3. Nc3
        { from: [1, 3], to: [2, 3] }  // 3... d6
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
    setFeedback(`Loading ${key.replace('-', ' ').toUpperCase()} opening variation...`);

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
// 9. Chess Clock Engine
// ----------------------------------------------------
function initChessClock() {
    const select = document.getElementById('timeControlSelect');
    if (select) {
        select.addEventListener('change', () => {
            timeControlMinutes = parseInt(select.value, 10);
            resetClock();
        });
    }

    const toggleBtn = document.getElementById('clockToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleClock);
    }

    const resetBtn = document.getElementById('clockResetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetClock);
    }

    updateClockDisplays();
}

function updateClockDisplays() {
    const wDisp = document.getElementById('whiteClockDisplay');
    const bDisp = document.getElementById('blackClockDisplay');
    const wBadge = document.getElementById('whiteClock');
    const bBadge = document.getElementById('blackClock');

    if (timeControlMinutes === 0) {
        if (wDisp) wDisp.textContent = '∞';
        if (bDisp) bDisp.textContent = '∞';
        if (wBadge) wBadge.className = 'chess-clock white-clock';
        if (bBadge) bBadge.className = 'chess-clock black-clock';
        return;
    }

    if (wDisp) wDisp.textContent = formatClockTime(whiteTimeSeconds);
    if (bDisp) bDisp.textContent = formatClockTime(blackTimeSeconds);

    if (wBadge) {
        wBadge.className = 'chess-clock white-clock' +
            (activeClock === 'w' && isClockRunning ? ' active-clock' : '') +
            (whiteTimeSeconds <= 30 && whiteTimeSeconds > 0 ? ' low-time' : '');
    }
    if (bBadge) {
        bBadge.className = 'chess-clock black-clock' +
            (activeClock === 'b' && isClockRunning ? ' active-clock' : '') +
            (blackTimeSeconds <= 30 && blackTimeSeconds > 0 ? ' low-time' : '');
    }
}

function formatClockTime(totalSeconds) {
    if (totalSeconds <= 0) return '00:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startClock(turn = currentTurn) {
    if (timeControlMinutes === 0 || isGameOver) return;
    if (isClockRunning) return;

    activeClock = turn;
    isClockRunning = true;
    updateClockToggleText();

    clockTimerInterval = setInterval(() => {
        if (activeClock === 'w') {
            whiteTimeSeconds--;
            if (whiteTimeSeconds <= 0) {
                whiteTimeSeconds = 0;
                handleTimeOut('w');
            }
        } else if (activeClock === 'b') {
            blackTimeSeconds--;
            if (blackTimeSeconds <= 0) {
                blackTimeSeconds = 0;
                handleTimeOut('b');
            }
        }
        updateClockDisplays();
    }, 1000);

    updateClockDisplays();
}

function pauseClock() {
    isClockRunning = false;
    if (clockTimerInterval) {
        clearInterval(clockTimerInterval);
        clockTimerInterval = null;
    }
    updateClockToggleText();
    updateClockDisplays();
}

function toggleClock() {
    if (timeControlMinutes === 0) return;
    if (isClockRunning) {
        pauseClock();
    } else {
        startClock(currentTurn);
    }
}

function resetClock() {
    pauseClock();
    const seconds = timeControlMinutes * 60;
    whiteTimeSeconds = seconds;
    blackTimeSeconds = seconds;
    activeClock = null;
    updateClockDisplays();
}

function onMoveClockUpdate() {
    if (timeControlMinutes === 0) return;

    if (isGameOver) {
        pauseClock();
        return;
    }

    if (!isClockRunning) {
        startClock(currentTurn);
    } else {
        activeClock = currentTurn;
        updateClockDisplays();
    }
}

function handleTimeOut(flaggedColor) {
    pauseClock();
    isGameOver = true;
    playSound('check');

    const winner = flaggedColor === 'w' ? 'Black' : 'White';
    const loser = flaggedColor === 'w' ? 'White' : 'Black';

    showGameOverModal(
        'Time Out!',
        `${loser} ran out of time. ${winner} wins by timeout flag!`,
        'stopwatch'
    );
    setFeedback(`Time Out! ${winner} wins on time.`);
}

function updateClockToggleText() {
    const txt = document.getElementById('clockToggleText');
    const btn = document.getElementById('clockToggleBtn');
    if (txt && btn) {
        txt.textContent = isClockRunning ? 'Pause' : 'Start';
        const icon = btn.querySelector('i');
        if (icon) icon.className = isClockRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
}

// ----------------------------------------------------
// 10. Focus Mode (Large Distraction-Free Board)
// ----------------------------------------------------
function initFocusMode() {
    const focusBtn = document.getElementById('focusModeBtn');
    if (focusBtn) {
        focusBtn.addEventListener('click', toggleFocusMode);
    }

    // Escape key exits focus mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFocusMode) {
            exitFocusMode();
        }
    });
}

function toggleFocusMode() {
    if (isFocusMode) {
        exitFocusMode();
    } else {
        enterFocusMode();
    }
}

function enterFocusMode() {
    isFocusMode = true;
    const boardCol = document.getElementById('boardColumn');
    const focusBtn = document.getElementById('focusModeBtn');

    if (boardCol) boardCol.classList.add('focus-mode-active');
    document.body.classList.add('chess-focus-active');

    if (focusBtn) {
        focusBtn.classList.add('focus-on');
        focusBtn.innerHTML = '<i class="fa-solid fa-compress"></i> Exit Focus';
    }

    renderBoard();
}

function exitFocusMode() {
    isFocusMode = false;
    const boardCol = document.getElementById('boardColumn');
    const focusBtn = document.getElementById('focusModeBtn');

    if (boardCol) boardCol.classList.remove('focus-mode-active');
    document.body.classList.remove('chess-focus-active');

    if (focusBtn) {
        focusBtn.classList.remove('focus-on');
        focusBtn.innerHTML = '<i class="fa-solid fa-expand"></i> Focus Mode';
    }

    renderBoard();
}


// ----------------------------------------------------
// 9. Board Theme Switcher
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
// 10. Live Chess.com Public API Inspector
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
// 11. Beginner Chess Book Signup Form Handler
// ----------------------------------------------------
function initBookSignup() {
    window.handleBookSignup = function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('bookReaderEmail');
        const feedback = document.getElementById('bookSignupFeedback');
        if (!emailInput || !feedback) return;

        const email = emailInput.value.trim();
        if (!email || !email.includes('@')) {
            feedback.className = 'book-signup-feedback error';
            feedback.textContent = 'Please enter a valid email address.';
            feedback.classList.remove('hidden');
            return;
        }

        // Save to local storage
        try {
            const list = JSON.parse(localStorage.getItem('chess_book_subscribers') || '[]');
            if (!list.includes(email)) {
                list.push(email);
                localStorage.setItem('chess_book_subscribers', JSON.stringify(list));
            }
        } catch (err) {
            // Ignore localStorage issues
        }

        feedback.className = 'book-signup-feedback success';
        feedback.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span><strong>Success!</strong> You are on the priority early-reader list for <em>From Pawn to Tactician</em>. You will receive Chapter 1 free excerpt upon release!</span>
        `;
        feedback.classList.remove('hidden');
        emailInput.value = '';
    };
}

// ----------------------------------------------------
// 12. Coaching Inquiry Form
// ----------------------------------------------------
window._cachedCoachingInquiry = '';

window.handleCoachingSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('coachStudentName').value.trim();
    const email = document.getElementById('coachStudentEmail').value.trim();
    const rating = document.getElementById('coachCurrentRating').value.trim();
    const goal = document.getElementById('coachPrimaryGoal').value.trim();
    const notes = document.getElementById('coachNotes').value.trim();

    const toast = document.getElementById('coachingToast');

    const subject = encodeURIComponent(`Chess Coaching Inquiry: ${name} (Rating: ${rating})`);
    const inquiryText = 
        `Hi Serawit,\n\nI would like to inquire about 1-on-1 personalized chess coaching with you.\n\n` +
        `• Student Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Current Rating: ${rating}\n` +
        `• Target Rating / Goal: ${goal}\n` +
        `• Chess.com / Lichess Username & Notes: ${notes || 'N/A'}\n\n` +
        `Looking forward to scheduling a diagnostic session!`;
    const body = encodeURIComponent(inquiryText);

    window._cachedCoachingInquiry = inquiryText;

    const mailtoUrl = `mailto:serawitshimelis1998@gmail.com?subject=${subject}&body=${body}`;
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=serawitshimelis1998@gmail.com&su=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    if (toast) {
        toast.className = 'coaching-toast success';
        toast.innerHTML = `
            <div class="toast-card-inner">
                <p><i class="fa-solid fa-circle-check"></i> <strong>Thank you ${escapeHtml(name)}!</strong> Your coaching application has been addressed to <strong>serawitshimelis1998@gmail.com</strong>.</p>
                <p class="toast-subtext">If your email client didn't open automatically, send directly using:</p>
                <div class="toast-actions">
                    <a href="${mailtoUrl}" class="toast-btn"><i class="fa-solid fa-envelope"></i> Open Mail App</a>
                    <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" class="toast-btn"><i class="fa-brands fa-google"></i> Open in Gmail</a>
                    <button type="button" class="toast-btn toast-btn-outline" onclick="copyInquiryDetails()"><i class="fa-solid fa-copy"></i> Copy Details</button>
                </div>
            </div>
        `;
    }
};

window.copyInquiryDetails = function() {
    const text = window._cachedCoachingInquiry;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Coaching inquiry details copied to clipboard! You can paste them into an email to serawitshimelis1998@gmail.com.');
        }).catch(() => {
            prompt('Copy your inquiry details below:', text);
        });
    } else {
        prompt('Copy your inquiry details below:', text);
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

// Window blur cleanup for drag states
if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('blur', () => {
        const existingAvatar = document.querySelector('.drag-piece-avatar');
        if (existingAvatar && existingAvatar.parentNode) {
            existingAvatar.parentNode.removeChild(existingAvatar);
        }
        document.querySelectorAll('.piece.dragging-origin').forEach(el => el.classList.remove('dragging-origin'));
        document.querySelectorAll('.square.drag-hover').forEach(el => el.classList.remove('drag-hover'));
        document.body.style.cursor = '';
    });
}
