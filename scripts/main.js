/**
 * Chess Cheat Pro v2.1 - Premium Chess Analysis Extension
 * Features: Auto-detect player color, optimized polling, tournament-grade UI
 */

var hackRunning = false;
var globalDepth = 11;
var engine = null;
var getPlays = null;

// Design tokens - Premium Tournament Theme
const STYLES = `
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600;700&display=swap');

  /* CSS Variables */
  :root {
    --cc-bg-primary: rgba(18, 18, 24, 0.95);
    --cc-bg-secondary: rgba(30, 30, 40, 0.9);
    --cc-bg-glass: rgba(255, 255, 255, 0.03);
    --cc-accent: #d4a84b;
    --cc-accent-hover: #e6bc5f;
    --cc-accent-glow: rgba(212, 168, 75, 0.4);
    --cc-text-primary: #f0f0f5;
    --cc-text-secondary: #9a9aaa;
    --cc-text-muted: #666677;
    --cc-border: rgba(255, 255, 255, 0.08);
    --cc-success: #4ade80;
    --cc-danger: #f87171;
    --cc-eval-white: #e8e8e8;
    --cc-eval-black: #2a2a35;
  }

  /* Main Panel Container */
  .cc-panel {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 320px;
    background: var(--cc-bg-primary);
    border: 1px solid var(--cc-border);
    border-radius: 16px;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    z-index: 999999;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cc-panel:hover {
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.08) inset,
      0 0 40px rgba(212, 168, 75, 0.1);
  }

  /* Panel Header */
  .cc-header {
    background: linear-gradient(135deg, var(--cc-bg-secondary) 0%, var(--cc-bg-glass) 100%);
    padding: 12px 16px;
    border-bottom: 1px solid var(--cc-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: move;
    touch-action: none;
  }

  .cc-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .cc-logo-icon {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, var(--cc-accent) 0%, #b8942f 100%);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 2px 8px var(--cc-accent-glow);
  }

  .cc-logo-text {
    font-size: 14px;
    font-weight: 700;
    color: var(--cc-text-primary);
    letter-spacing: -0.3px;
    white-space: nowrap;
  }

  .cc-logo-text span {
    color: var(--cc-accent);
  }

  .cc-logo {
    flex-shrink: 0;
  }

  .cc-status-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 3px 8px;
    border-radius: 20px;
    background: var(--cc-bg-glass);
    border: 1px solid var(--cc-border);
    transition: all 0.3s ease;
  }

  .cc-status-badge .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--cc-text-muted);
    transition: all 0.3s ease;
  }

  .cc-status-badge.active {
    background: rgba(74, 222, 128, 0.15);
    border-color: rgba(74, 222, 128, 0.4);
  }

  .cc-status-badge.active .dot {
    background: var(--cc-success);
    box-shadow: 0 0 8px var(--cc-success);
    animation: pulse 2s infinite;
  }

  .cc-status-badge.active #cc-status-text {
    color: var(--cc-success);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.2); }
  }

  /* Player Color Indicator */
  .cc-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .cc-player-indicator {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 3px 6px;
    background: var(--cc-bg-glass);
    border: 1px solid var(--cc-border);
    border-radius: 5px;
    font-size: 10px;
  }

  .cc-player-indicator .cc-piece {
    font-size: 12px;
    line-height: 1;
  }

  .cc-player-indicator .cc-color-text {
    color: var(--cc-text-primary);
    font-weight: 600;
  }

  .cc-player-indicator.white {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .cc-player-indicator.white .cc-piece {
    color: #ffffff;
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }

  .cc-player-indicator.black {
    border-color: rgba(100, 100, 100, 0.3);
  }

  .cc-player-indicator.black .cc-piece {
    color: #1a1a1a;
    background: #333;
    border-radius: 2px;
    padding: 0 2px;
  }

  /* Panel Body */
  .cc-body {
    padding: 20px;
  }

  /* Toggle Button */
  .cc-toggle-wrapper {
    margin-bottom: 20px;
  }

  .cc-toggle {
    width: 100%;
    padding: 14px 24px;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }

  .cc-toggle::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  .cc-toggle:hover::before {
    left: 100%;
  }

  .cc-toggle.start {
    background: linear-gradient(135deg, var(--cc-accent) 0%, #b8942f 100%);
    color: #1a1a1a;
    box-shadow: 0 4px 15px var(--cc-accent-glow);
  }

  .cc-toggle.start:hover {
    background: linear-gradient(135deg, var(--cc-accent-hover) 0%, var(--cc-accent) 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px var(--cc-accent-glow);
  }

  .cc-toggle.start:active {
    transform: translateY(0);
  }

  .cc-toggle.stop {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
  }

  .cc-toggle.stop:hover {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    transform: translateY(-1px);
  }

  .cc-toggle:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Depth Control */
  .cc-depth-control {
    margin-bottom: 20px;
  }

  .cc-control-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .cc-control-label span {
    font-size: 12px;
    font-weight: 500;
    color: var(--cc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cc-depth-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--cc-accent);
    background: rgba(212, 168, 75, 0.1);
    padding: 2px 10px;
    border-radius: 6px;
  }

  .cc-slider-container {
    position: relative;
    height: 6px;
    background: var(--cc-bg-secondary);
    border-radius: 3px;
    overflow: visible;
  }

  .cc-slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cc-accent) 0%, var(--cc-accent-hover) 100%);
    border-radius: 3px;
    transition: width 0.1s ease;
  }

  .cc-slider {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    height: 24px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }

  .cc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--cc-accent);
    transition: all 0.2s ease;
  }

  .cc-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4), 0 0 0 3px var(--cc-accent);
  }

  .cc-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--cc-accent);
  }

  .cc-depth-hints {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    font-size: 10px;
    color: var(--cc-text-muted);
  }

  /* Best Move Display */
  .cc-move-display {
    background: var(--cc-bg-secondary);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid var(--cc-border);
    transition: all 0.3s ease;
  }

  .cc-move-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .cc-move-header svg {
    width: 16px;
    height: 16px;
    color: var(--cc-accent);
  }

  .cc-move-header span {
    font-size: 11px;
    font-weight: 600;
    color: var(--cc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cc-best-move {
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 600;
    color: var(--cc-text-primary);
    text-align: center;
    padding: 12px;
    background: var(--cc-bg-glass);
    border-radius: 8px;
    letter-spacing: 2px;
    min-height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .cc-best-move.calculating {
    color: var(--cc-text-muted);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
  }

  .cc-best-move.ready {
    color: var(--cc-accent);
    text-shadow: 0 0 20px var(--cc-accent-glow);
  }

  /* Eval Bar */
  .cc-eval-container {
    margin-top: 16px;
  }

  .cc-eval-bar {
    height: 22px;
    background: var(--cc-eval-black);
    border-radius: 11px;
    overflow: hidden;
    position: relative;
  }

  .cc-eval-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: linear-gradient(90deg, var(--cc-eval-white) 0%, #c0c0c0 100%);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 11px;
  }

  .cc-eval-value {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--cc-text-primary);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  /* Move Arrow Indicator */
  .cc-arrow-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding: 8px;
    background: rgba(212, 168, 75, 0.05);
    border-radius: 8px;
    border: 1px dashed rgba(212, 168, 75, 0.2);
  }

  .cc-arrow-indicator span {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: var(--cc-accent);
  }

  /* Footer */
  .cc-footer {
    padding: 12px 20px;
    background: var(--cc-bg-glass);
    border-top: 1px solid var(--cc-border);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .cc-footer span {
    font-size: 10px;
    color: var(--cc-text-muted);
  }

  .cc-footer span strong {
    color: var(--cc-accent);
    font-weight: 600;
  }

  /* Highlight Squares - Premium Animation */
  .cheat-highlight {
    position: absolute;
    border-radius: 4px;
    pointer-events: none;
    z-index: 100;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .cheat-highlight.from-square {
    background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.2) 70%, transparent 100%) !important;
    box-shadow: inset 0 0 0 3px #3b82f6, 0 0 15px rgba(59, 130, 246, 0.5) !important;
    animation: highlightPulse 2s infinite;
  }

  .cheat-highlight.to-square {
    background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(59, 130, 246, 0.2) 70%, transparent 100%) !important;
    box-shadow: inset 0 0 0 3px #3b82f6, 0 0 15px rgba(59, 130, 246, 0.5) !important;
    animation: highlightPulse 2s infinite 0.5s;
  }

  @keyframes highlightPulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  /* Move Arrow */
  .cc-move-arrow {
    position: absolute;
    pointer-events: none;
    z-index: 101;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cc-move-arrow path {
    fill: none;
    stroke: var(--cc-accent);
    stroke-width: 12;
    stroke-linecap: round;
    stroke-linejoin: round;
    filter: drop-shadow(0 0 6px var(--cc-accent-glow));
  }

  /* Responsive */
  @media (max-width: 768px) {
    .cc-panel {
      width: calc(100% - 40px);
      right: 20px;
      left: 20px;
      top: auto;
      bottom: 20px;
    }
  }
`;

// Create and inject styles
function injectStyles() {
  const styleEl = document.createElement('style');
  styleEl.id = 'cc-styles';
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);
}

// Generate FEN string from board
function getFenString() {
  let fen_string = "";
  let emptyCount = 0;

  // Try multiple selector patterns for chess.com
  const board = document.querySelector("wc-chess-board");
  if (!board) return "";

  for (let i = 8; i >= 1; i--) {
    for (let j = 1; j <= 8; j++) {
      // Try different square naming conventions
      const position = `${j}${i}`;
      const altPosition = `${String.fromCharCode(96 + j)}${i}`; // a1, b2, etc

      // Find piece at this position
      let piece = null;

      // Method 1: Direct piece class
      const pieceEl = board.querySelector(`.piece.square-${position}`);
      if (pieceEl) {
        const classes = Array.from(pieceEl.classList);
        piece = classes.find(c => c.length === 2 && 'wb'.includes(c[0]));
      }

      // Method 2: Alt position naming
      if (!piece) {
        const pieceElAlt = board.querySelector(`.piece.square-${altPosition}`);
        if (pieceElAlt) {
          const classes = Array.from(pieceElAlt.classList);
          piece = classes.find(c => c.length === 2 && 'wb'.includes(c[0]));
        }
      }

      // Method 3: Look for any piece with matching square in class
      if (!piece) {
        const allPieces = board.querySelectorAll('.piece');
        for (const p of allPieces) {
          if (p.classList.contains(`square-${position}`) || p.classList.contains(`square-${altPosition}`)) {
            const classes = Array.from(p.classList);
            piece = classes.find(c => c.length === 2 && 'wb'.includes(c[0]));
            break;
          }
        }
      }

      if (piece) {
        // Add empty count if any
        if (emptyCount > 0) {
          fen_string += emptyCount;
          emptyCount = 0;
        }
        // Add piece
        if (piece[0] === 'b') {
          fen_string += piece[1];
        } else {
          fen_string += piece[1].toUpperCase();
        }
      } else {
        emptyCount++;
      }

      // Add row separator
      if (j == 8 && i != 1) {
        if (emptyCount > 0) {
          fen_string += emptyCount;
          emptyCount = 0;
        }
        fen_string += "/";
      }
    }
  }

  // Final empty count for last row
  if (emptyCount > 0) {
    fen_string += emptyCount;
  }

  return fen_string;
}

// Create panel HTML
function createPanelHTML() {
  return `
    <div class="cc-header">
      <div class="cc-logo">
        <div class="cc-logo-icon">♞</div>
        <div class="cc-logo-text">Chess<span>Cheat</span> Pro</div>
      </div>
      <div class="cc-header-right">
        <div class="cc-player-indicator" id="cc-player-indicator" title="Your color">
          <span class="cc-piece">♔</span>
          <span class="cc-color-text">White</span>
        </div>
        <div class="cc-status-badge" id="cc-status">
          <span class="dot"></span>
          <span id="cc-status-text">Ready</span>
        </div>
      </div>
    </div>

    <div class="cc-body">
      <div class="cc-toggle-wrapper">
        <button class="cc-toggle start" id="cc-toggle-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          <span id="cc-toggle-text">Start Analysis</span>
        </button>
      </div>

      <div class="cc-depth-control">
        <div class="cc-control-label">
          <span>Analysis Depth</span>
          <div class="cc-depth-value" id="cc-depth-display">${globalDepth}</div>
        </div>
        <div class="cc-slider-container">
          <div class="cc-slider-fill" id="cc-slider-fill" style="width: ${(globalDepth / 40) * 100}%"></div>
          <input type="range" class="cc-slider" id="cc-depth-slider" min="1" max="40" value="${globalDepth}">
        </div>
        <div class="cc-depth-hints">
          <span>Fast</span>
          <span>Accurate</span>
        </div>
      </div>

      <div class="cc-move-display">
        <div class="cc-move-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          <span>Best Move</span>
        </div>
        <div class="cc-best-move calculating" id="cc-best-move">
          Waiting...
        </div>

        <div class="cc-eval-container">
          <div class="cc-eval-bar">
            <div class="cc-eval-fill" id="cc-eval-fill" style="width: 50%"></div>
            <span class="cc-eval-value" id="cc-eval-value">0.0</span>
          </div>
        </div>

        <div class="cc-arrow-indicator" id="cc-arrow-indicator" style="display: none;">
          <span id="cc-from-square">-</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <span id="cc-to-square">-</span>
        </div>
      </div>
    </div>

    <div class="cc-footer">
      <span>Powered by <strong>Stockfish ${globalDepth}</strong></span>
    </div>
  `;
}

// Update UI state
function updateUIState(isRunning) {
  const btn = document.getElementById('cc-toggle-btn');
  const status = document.getElementById('cc-status');
  const statusText = document.getElementById('cc-status-text');
  const bestMove = document.getElementById('cc-best-move');

  if (isRunning) {
    btn.classList.remove('start');
    btn.classList.add('stop');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
      <span id="cc-toggle-text">Stop Analysis</span>
    `;
    status.classList.add('active');
    statusText.textContent = 'Active';
    bestMove.classList.remove('ready');
    bestMove.classList.add('calculating');
    bestMove.textContent = 'Calculating...';
  } else {
    btn.classList.remove('stop');
    btn.classList.add('start');
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      <span id="cc-toggle-text">Start Analysis</span>
    `;
    status.classList.remove('active');
    statusText.textContent = 'Ready';
    bestMove.classList.remove('calculating', 'ready');
    bestMove.textContent = 'Waiting...';
  }
}

// Clear all highlights
function clearHighlights() {
  document.querySelectorAll(".cheat-highlight").forEach((element) => {
    element.remove();
  });
}

// Apply highlights with animation
// boardFlipped: true if viewing from black's perspective
function applyHighlights(from, to, boardFlipped = false) {
  clearHighlights();

  const chessboard = document.querySelector("wc-chess-board");
  if (!chessboard) return;

  // Convert coordinates based on board orientation
  // Stockfish returns coordinates in white's perspective (a1 = bottom-left)
  // If board is flipped, we need to invert

  let fromX = from[0];
  let fromY = from[1];
  let toX = to[0];
  let toY = to[1];

  if (boardFlipped) {
    fromX = 9 - fromX;
    fromY = 9 - fromY;
    toX = 9 - toX;
    toY = 9 - toY;
  }

  // Position calculation: top-left is (0,0), each square is 12.5%
  const fromLeft = (fromX - 1) * 12.5;
  const fromTop = (8 - fromY) * 12.5;
  const toLeft = (toX - 1) * 12.5;
  const toTop = (8 - toY) * 12.5;

  const fromHighlight = document.createElement("div");
  fromHighlight.className = "highlight cheat-highlight from-square";
  fromHighlight.style.cssText = `left: ${fromLeft}%; top: ${fromTop}%; width: 12.5%; height: 12.5%; opacity: 0;`;

  const toHighlight = document.createElement("div");
  toHighlight.className = "highlight cheat-highlight to-square";
  toHighlight.style.cssText = `left: ${toLeft}%; top: ${toTop}%; width: 12.5%; height: 12.5%; opacity: 0;`;

  chessboard.appendChild(fromHighlight);
  chessboard.appendChild(toHighlight);

  // Trigger animation
  requestAnimationFrame(() => {
    fromHighlight.style.opacity = '1';
    toHighlight.style.opacity = '1';
  });

  // Update arrow indicator
  const arrowIndicator = document.getElementById('cc-arrow-indicator');
  const fromSquare = document.getElementById('cc-from-square');
  const toSquare = document.getElementById('cc-to-square');

  if (arrowIndicator && fromSquare && toSquare) {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    fromSquare.textContent = files[from[0] - 1] + from[1];
    toSquare.textContent = files[to[0] - 1] + to[1];
    arrowIndicator.style.display = 'flex';
  }
}

// Update eval bar
function updateEvalBar(evalScore, sideToMove = 'w') {
  const evalFill = document.getElementById('cc-eval-fill');
  const evalValue = document.getElementById('cc-eval-value');

  if (evalFill && evalValue) {
    const whiteEvalScore = sideToMove === 'b' ? -evalScore : evalScore;
    // Convert eval to percentage (assuming +/- 10 is mate)
    const normalizedScore = Math.max(-10, Math.min(10, whiteEvalScore));
    const whitePercent = 50 + (normalizedScore / 10) * 50;

    evalFill.style.width = `${whitePercent}%`;

    if (whiteEvalScore > 0) {
      evalValue.textContent = `+${whiteEvalScore.toFixed(1)}`;
    } else {
      evalValue.textContent = whiteEvalScore.toFixed(1);
    }
  }
}

// Main analysis function
function startAnalysis() {
  const chessboard = document.querySelector("wc-chess-board");
  if (!chessboard) {
    alert('Chess board not found. Make sure you are on chess.com');
    return { status: false, error: 'Chess board not found' };
  }

  // Detect player color - multiple detection methods for reliability
  let isPlayerBlack = false;

  // Method 1: Check flipped class (common on chess.com)
  if (chessboard.classList.contains("flipped")) {
    isPlayerBlack = true;
  }

  // Method 2: Check data-color attribute
  const dataColor = chessboard.getAttribute('data-color');
  if (dataColor === 'black') {
    isPlayerBlack = true;
  } else if (dataColor === 'white') {
    isPlayerBlack = false;
  }

  // Method 3: Check orientation attribute
  const orientation = chessboard.getAttribute('orientation');
  if (orientation === 'black') {
    isPlayerBlack = true;
  } else if (orientation === 'white') {
    isPlayerBlack = false;
  }

  // Method 4: Check all classes for 'is-white' or 'is-black'
  const classList = Array.from(chessboard.classList);
  if (classList.some(c => c.includes('is-white'))) {
    isPlayerBlack = false;
  } else if (classList.some(c => c.includes('is-black'))) {
    isPlayerBlack = true;
  }

  let player_colour = isPlayerBlack ? "b" : "w";
  console.log('[ChessCheat] Detection - Classes:', classList.filter(c => !c.startsWith('square-')).join(', '));
  console.log('[ChessCheat] Detection - data-color:', dataColor, '| orientation:', orientation);
  console.log('[ChessCheat] Player color:', player_colour, '| isPlayerBlack:', isPlayerBlack);

  // Update UI player indicator
  const playerIndicator = document.getElementById('cc-player-indicator');
  const colorText = playerIndicator?.querySelector('.cc-color-text');
  const pieceIcon = playerIndicator?.querySelector('.cc-piece');

  if (playerIndicator && colorText && pieceIcon) {
    playerIndicator.classList.remove('white', 'black');
    if (isPlayerBlack) {
      playerIndicator.classList.add('black');
      pieceIcon.textContent = '♚';
      colorText.textContent = 'Black';
    } else {
      playerIndicator.classList.add('white');
      pieceIcon.textContent = '♔';
      colorText.textContent = 'White';
    }
  }

  // Detect side to move from chess.com UI
  function getSideToMove() {
    // Try to find the turn indicator on chess.com
    // Check for clock elements - active clock indicates whose turn
    const clockTop = document.querySelector('.clock-top, .clock.cw-top, [class*="clock-top"]');
    const clockBottom = document.querySelector('.clock-bottom, .clock.cw-bottom, [class*="clock-bottom"]');

    if (clockTop && clockBottom) {
      // If top clock has 'active' class or similar, white to move
      const topHasActive = clockTop.classList.contains('active') ||
                          clockTop.classList.contains('clock-running') ||
                          clockTop.getAttribute('data-turn') === 'white';

      const bottomHasActive = clockBottom.classList.contains('active') ||
                             clockBottom.classList.contains('clock-running') ||
                             clockBottom.getAttribute('data-turn') === 'black';

      if (topHasActive) return 'w';
      if (bottomHasActive) return 'b';
    }

    // Fallback: check for turn indicator text
    const turnText = document.querySelector('[class*="turn"], [data-turn]');
    if (turnText) {
      const turn = turnText.getAttribute('data-turn') || turnText.textContent;
      if (turn && turn.toLowerCase().includes('white')) return 'w';
      if (turn && turn.toLowerCase().includes('black')) return 'b';
    }

    // Default: assume white to move if can't detect
    return 'w';
  }

  const startingFenPart = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

  // Generate initial FEN. If black is playing and the board is already past
  // the starting position, the next move should be black's move.
  const initialFenPart = getFenString();
  let currentSideToMove = initialFenPart === startingFenPart ? 'w' : player_colour;
  let fen_string = initialFenPart + ' ' + currentSideToMove;
  console.log('[ChessCheat] FEN:', fen_string);
  console.log('[ChessCheat] Player color:', player_colour);

  // Initialize Stockfish engine
  if (engine) {
    engine.terminate();
  }

  engine = new Worker("/bundles/app/js/vendor/jschessengine/stockfish.asm.1abfa10c.js");

  engine.onmessage = function(event) {
    const data = event.data;

    if (data.startsWith('bestmove')) {
      const bestMove = data.split(' ')[1];
      const bestMoveDisplay = document.getElementById('cc-best-move');

      if (bestMoveDisplay) {
        const moveFormatted = formatMoveForDisplay(bestMove);
        bestMoveDisplay.textContent = moveFormatted;
        bestMoveDisplay.classList.remove('calculating');
        bestMoveDisplay.classList.add('ready');
        console.log('[ChessCheat] Best move:', bestMove);
      }

      // Apply highlights - pass isPlayerBlack to handle flipped board
      const char_map = { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5, "f": 6, "g": 7, "h": 8 };
      const from = [char_map[bestMove[0]], parseInt(bestMove[1])];
      const to = [char_map[bestMove[2]], parseInt(bestMove[3])];
      applyHighlights(from, to, isPlayerBlack);

      console.log('[ChessCheat] Highlight applied - from:', from, 'to:', to, '| Flipped:', isPlayerBlack);

    } else if (data.startsWith('info') && data.includes('score')) {
      const scoreMatch = data.match(/score cp (-?\d+)/);
      if (scoreMatch) {
        const cpScore = parseInt(scoreMatch[1]) / 100;
        updateEvalBar(cpScore, currentSideToMove);
      }
    }
  };

  function requestEngineAnalysis() {
    engine.postMessage(`position fen ${fen_string}`);
    engine.postMessage(`go depth ${globalDepth}`);
    console.log('[ChessCheat] Analyzing - Player:', player_colour, '| To move:', currentSideToMove);
  }

  requestEngineAnalysis();

  // Listen for moves - with FEN validation
  getPlays = setInterval(() => {
    const newFenPart = getFenString();
    const new_fen_string = newFenPart + ' ' + currentSideToMove;

    // Validate FEN has correct structure (should have 8 ranks with 8 squares each)
    const fenParts = newFenPart.split('/');
    const isValidFen = fenParts.length === 8 && fenParts.every(rank => {
      let count = 0;
      for (const c of rank) {
        if ('12345678'.includes(c)) count += parseInt(c);
        else if ('rnbqkpRNBQKP'.includes(c)) count += 1;
      }
      return count === 8;
    });

    if (!isValidFen) {
      return;
    }

    if (new_fen_string !== fen_string) {
      // A move was made - flip the side to move for the NEW position
      currentSideToMove = currentSideToMove === 'w' ? 'b' : 'w';
      fen_string = newFenPart + ' ' + currentSideToMove;

      console.log('[ChessCheat] Move detected - FEN:', fen_string, '| Side:', currentSideToMove);

      const bestMoveDisplay = document.getElementById('cc-best-move');
      if (bestMoveDisplay) {
        bestMoveDisplay.textContent = 'Analyzing...';
        bestMoveDisplay.classList.add('calculating');
        bestMoveDisplay.classList.remove('ready');
      }
      const arrowIndicator = document.getElementById('cc-arrow-indicator');
      if (arrowIndicator) arrowIndicator.style.display = 'none';

      // Clear old highlights
      clearHighlights();

      // Send new position to engine only when it is the player's turn
      requestEngineAnalysis();
    }
  }, 200); // Poll every 200ms for better responsiveness

  return { status: true };
}

// Format move for display (e.g., "e2e4" -> "e2 → e4")
function formatMoveForDisplay(move) {
  if (move.length >= 4) {
    return `${move.substring(0, 2)} → ${move.substring(2, 4)}`;
  }
  return move;
}

// Stop analysis
function stopAnalysis() {
  hackRunning = false;

  if (getPlays) {
    clearInterval(getPlays);
    getPlays = null;
  }
  if (engine) {
    engine.terminate();
    engine = null;
  }
  clearHighlights();
  console.log('[ChessCheat] Analysis stopped');
}

function setupPanelDrag(panel) {
  const header = panel.querySelector('.cc-header');
  if (!header) return;

  let drag = null;

  header.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const rect = panel.getBoundingClientRect();
    drag = {
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      transition: panel.style.transition
    };
    panel.style.transition = 'none';
    panel.style.left = `${rect.left}px`;
    panel.style.top = `${rect.top}px`;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    header.setPointerCapture?.(event.pointerId);
  });

  header.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const nextLeft = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, drag.startLeft + event.clientX - drag.startX));
    const nextTop = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, drag.startTop + event.clientY - drag.startY));
    panel.style.left = `${nextLeft}px`;
    panel.style.top = `${nextTop}px`;
  });

  const stopDrag = (event) => {
    if (!drag) return;
    panel.style.transition = drag.transition;
    drag = null;
    try {
      header.releasePointerCapture?.(event.pointerId);
    } catch {}
  };

  header.addEventListener('pointerup', stopDrag);
  header.addEventListener('pointercancel', stopDrag);
}

// Initialize the extension
function initialize() {
  // Inject styles
  injectStyles();

  // Create panel container
  const existingPanel = document.getElementById('cc-panel');
  if (existingPanel) {
    existingPanel.remove();
  }

  const panel = document.createElement('div');
  panel.id = 'cc-panel';
  panel.className = 'cc-panel';
  panel.innerHTML = createPanelHTML();

  // Find insertion point
  const mainBody = document.querySelector(".board-layout-main");
  if (mainBody) {
    mainBody.prepend(panel);
  } else {
    document.body.appendChild(panel);
  }
  setupPanelDrag(panel);

  // Setup event listeners
  const toggleBtn = document.getElementById('cc-toggle-btn');
  const depthSlider = document.getElementById('cc-depth-slider');
  const depthDisplay = document.getElementById('cc-depth-display');
  const sliderFill = document.getElementById('cc-slider-fill');

  toggleBtn.addEventListener('click', () => {
    if (hackRunning) {
      stopAnalysis();
      hackRunning = false;
      updateUIState(false);
    } else {
      toggleBtn.disabled = true;
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32">
            <animate attributeName="stroke-dashoffset" dur="1s" values="32;0" repeatCount="indefinite"/>
          </circle>
        </svg>
        <span>Starting...</span>
      `;

      setTimeout(() => {
        const result = startAnalysis();
        if (result.status) {
          hackRunning = true;
          updateUIState(true);
        } else {
          alert(result.error);
        }
        toggleBtn.disabled = false;
      }, 500);
    }
  });

  depthSlider.addEventListener('input', (e) => {
    globalDepth = parseInt(e.target.value);
    depthDisplay.textContent = globalDepth;
    sliderFill.style.width = `${(globalDepth / 40) * 100}%`;
  });

  // Add spin animation style
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin { animation: spin 1s linear infinite; }
  `;
  document.head.appendChild(spinStyle);
}

// Wait for page to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
