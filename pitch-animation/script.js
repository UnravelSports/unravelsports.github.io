// ============================================
// PITCH DIMENSIONS (in meters)
// ============================================
const PITCH_LENGTH = 105.0;
const PITCH_WIDTH = 68.0;
const HALF_LENGTH = 52.5;
const HALF_WIDTH = 34.0;

const PENALTY_AREA_LENGTH = 16.5;
const PENALTY_AREA_WIDTH = 40.32;
const GOAL_AREA_LENGTH = 5.5;
const GOAL_AREA_WIDTH = 18.32;

const PENALTY_SPOT_DISTANCE = 11.0;
const CENTER_CIRCLE_RADIUS = 9.15;
const PENALTY_ARC_RADIUS = 9.15;
const CORNER_ARC_RADIUS = 1.0;

const GOAL_WIDTH = 7.32;
const GOAL_DEPTH = 2.0;

// ============================================
// COLORS
// ============================================
const COLOR_PITCH_MARKING = '#F4F4F4';
const COLOR_HOME_TEAM = '#0E6EDB';  // Blue team (attacking)
const COLOR_AWAY_TEAM = '#656159';  // Grey team
const COLOR_BALL = '#9A9083';

// Glow colors (same as fill but for shadow)
const GLOW_PITCH = 'rgba(244, 244, 244, 0.8)';
const GLOW_HOME = 'rgba(14, 110, 219, 0.8)';
const GLOW_AWAY = 'rgba(101, 97, 89, 0.8)';
const GLOW_BALL = 'rgba(154, 144, 131, 0.8)';

// ============================================
// ANIMATION SETTINGS
// ============================================
const SOURCE_FPS = 10;
const PLAYER_RADIUS = 1.0; // meters
const BALL_RADIUS = 0.5; // meters (bigger ball)

// ============================================
// SCALE: pixels per meter
// ============================================
const SCALE = 10; // 10 pixels per meter

// Canvas dimensions based on pitch + margin for goals
const CANVAS_WIDTH = (PITCH_LENGTH + 2 * GOAL_DEPTH + 4) * SCALE;
const CANVAS_HEIGHT = (PITCH_WIDTH + 4) * SCALE;

// ============================================
// CANVAS & STATE
// ============================================
const canvas = document.getElementById('pitch-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size (fixed, based on pitch dimensions)
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let matchData = null;
let frameIndex = 0;
let lastFrameTime = 0;
// Click detection disabled for now
// let selectedPlayerId = null;
// let playerScreenPositions = [];

// ============================================
// COORDINATE TRANSFORMATION (simple 2D, no perspective)
// ============================================

// Convert pitch coordinates (centered at 0,0) to canvas coordinates
function toCanvas(pitchX, pitchY) {
  // Pitch center is at canvas center
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;

  // pitchX: -52.5 to 52.5 (left to right)
  // pitchY: -34 to 34 (bottom to top in pitch coords, but we want top of canvas = far side)
  // So we flip Y: positive pitchY should go toward top of canvas
  const canvasX = centerX + pitchX * SCALE;
  const canvasY = centerY - pitchY * SCALE; // Flip Y so positive Y goes up

  return { x: canvasX, y: canvasY };
}

// Convert canvas coordinates back to pitch coordinates
function fromCanvas(canvasX, canvasY) {
  const centerX = CANVAS_WIDTH / 2;
  const centerY = CANVAS_HEIGHT / 2;
  const pitchX = (canvasX - centerX) / SCALE;
  const pitchY = (centerY - canvasY) / SCALE;
  return { x: pitchX, y: pitchY };
}

// ============================================
// CLICK HANDLING (disabled for now)
// ============================================

// Click detection disabled due to CSS 3D transform complexity
// canvas.addEventListener('click', handleCanvasClick);

// ============================================
// GLOW HELPER
// ============================================

function setGlow(color, blur = 10) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function clearGlow() {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// ============================================
// DRAWING FUNCTIONS (simple 2D)
// ============================================

function drawLine(x1, y1, x2, y2) {
  const p1 = toCanvas(x1, y1);
  const p2 = toCanvas(x2, y2);
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawArc(centerX, centerY, radius, startAngle, endAngle) {
  const center = toCanvas(centerX, centerY);
  const scaledRadius = radius * SCALE;
  ctx.beginPath();
  // Note: canvas arc goes clockwise, and we flipped Y, so angles need adjustment
  ctx.arc(center.x, center.y, scaledRadius, -startAngle, -endAngle, true);
  ctx.stroke();
}

function drawCircle(centerX, centerY, radius) {
  const center = toCanvas(centerX, centerY);
  const scaledRadius = radius * SCALE;
  ctx.beginPath();
  ctx.arc(center.x, center.y, scaledRadius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawRect(x1, y1, x2, y2) {
  drawLine(x1, y1, x2, y1);
  drawLine(x2, y1, x2, y2);
  drawLine(x2, y2, x1, y2);
  drawLine(x1, y2, x1, y1);
}

function drawFilledCircle(centerX, centerY, radius) {
  const center = toCanvas(centerX, centerY);
  const scaledRadius = radius * SCALE;
  ctx.beginPath();
  ctx.arc(center.x, center.y, scaledRadius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPitch() {
  // Set glow for pitch markings
  setGlow(GLOW_PITCH, 15);
  ctx.strokeStyle = COLOR_PITCH_MARKING;
  ctx.fillStyle = COLOR_PITCH_MARKING;
  ctx.lineWidth = 2;

  // Outer boundary
  drawRect(-HALF_LENGTH, -HALF_WIDTH, HALF_LENGTH, HALF_WIDTH);

  // Center line
  drawLine(0, -HALF_WIDTH, 0, HALF_WIDTH);

  // Center circle
  drawCircle(0, 0, CENTER_CIRCLE_RADIUS);

  // Center spot
  drawFilledCircle(0, 0, 0.3);

  // Left penalty area
  drawRect(-HALF_LENGTH, -PENALTY_AREA_WIDTH / 2, -HALF_LENGTH + PENALTY_AREA_LENGTH, PENALTY_AREA_WIDTH / 2);

  // Left goal area
  drawRect(-HALF_LENGTH, -GOAL_AREA_WIDTH / 2, -HALF_LENGTH + GOAL_AREA_LENGTH, GOAL_AREA_WIDTH / 2);

  // Left penalty spot
  drawFilledCircle(-HALF_LENGTH + PENALTY_SPOT_DISTANCE, 0, 0.3);

  // Left penalty arc
  const arcIntersectY = Math.sqrt(PENALTY_ARC_RADIUS * PENALTY_ARC_RADIUS -
    (PENALTY_AREA_LENGTH - PENALTY_SPOT_DISTANCE) * (PENALTY_AREA_LENGTH - PENALTY_SPOT_DISTANCE));
  const arcAngle = Math.asin(arcIntersectY / PENALTY_ARC_RADIUS);
  drawArc(-HALF_LENGTH + PENALTY_SPOT_DISTANCE, 0, PENALTY_ARC_RADIUS, -arcAngle, arcAngle);

  // Right penalty area
  drawRect(HALF_LENGTH - PENALTY_AREA_LENGTH, -PENALTY_AREA_WIDTH / 2, HALF_LENGTH, PENALTY_AREA_WIDTH / 2);

  // Right goal area
  drawRect(HALF_LENGTH - GOAL_AREA_LENGTH, -GOAL_AREA_WIDTH / 2, HALF_LENGTH, GOAL_AREA_WIDTH / 2);

  // Right penalty spot
  drawFilledCircle(HALF_LENGTH - PENALTY_SPOT_DISTANCE, 0, 0.3);

  // Right penalty arc
  drawArc(HALF_LENGTH - PENALTY_SPOT_DISTANCE, 0, PENALTY_ARC_RADIUS, Math.PI - arcAngle, Math.PI + arcAngle);

  // Corner arcs (quarter circles into the pitch)
  // Bottom-left
  drawArc(-HALF_LENGTH, -HALF_WIDTH, CORNER_ARC_RADIUS, 0, Math.PI / 2);
  // Top-left
  drawArc(-HALF_LENGTH, HALF_WIDTH, CORNER_ARC_RADIUS, -Math.PI / 2, 0);
  // Bottom-right
  drawArc(HALF_LENGTH, -HALF_WIDTH, CORNER_ARC_RADIUS, Math.PI / 2, Math.PI);
  // Top-right
  drawArc(HALF_LENGTH, HALF_WIDTH, CORNER_ARC_RADIUS, Math.PI, Math.PI * 3 / 2);

  // Goals
  ctx.lineWidth = 1.5;

  // Left goal
  drawLine(-HALF_LENGTH, -GOAL_WIDTH / 2, -HALF_LENGTH - GOAL_DEPTH, -GOAL_WIDTH / 2);
  drawLine(-HALF_LENGTH - GOAL_DEPTH, -GOAL_WIDTH / 2, -HALF_LENGTH - GOAL_DEPTH, GOAL_WIDTH / 2);
  drawLine(-HALF_LENGTH - GOAL_DEPTH, GOAL_WIDTH / 2, -HALF_LENGTH, GOAL_WIDTH / 2);

  // Right goal
  drawLine(HALF_LENGTH, -GOAL_WIDTH / 2, HALF_LENGTH + GOAL_DEPTH, -GOAL_WIDTH / 2);
  drawLine(HALF_LENGTH + GOAL_DEPTH, -GOAL_WIDTH / 2, HALF_LENGTH + GOAL_DEPTH, GOAL_WIDTH / 2);
  drawLine(HALF_LENGTH + GOAL_DEPTH, GOAL_WIDTH / 2, HALF_LENGTH, GOAL_WIDTH / 2);

  clearGlow();
}

function drawPlayer(x, y, team) {
  const pos = toCanvas(x, y);
  const color = team === 'home' ? COLOR_HOME_TEAM : COLOR_AWAY_TEAM;
  const glowColor = team === 'home' ? GLOW_HOME : GLOW_AWAY;
  const radius = PLAYER_RADIUS * SCALE;

  // Set glow for player
  setGlow(glowColor, 12);

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  clearGlow();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBall(x, y) {
  // Only use x and y, ignore z
  const pos = toCanvas(x, y);
  const radius = BALL_RADIUS * SCALE;

  // Set glow for ball
  setGlow(GLOW_BALL, 15);

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = COLOR_BALL;
  ctx.fill();

  clearGlow();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

// drawTeammateLines disabled (click detection disabled)
// function drawTeammateLines(players) { ... }

function drawFrame(index) {
  if (!matchData) return;

  // Clear canvas with transparent background (CSS handles the black)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw pitch
  drawPitch();

  // Get frame data
  const players = matchData.players[index];
  const ball = matchData.ball[index];

  // Draw teammate lines disabled (click detection disabled)
  // drawTeammateLines(players);

  // Draw players (no need to sort - CSS 3D handles depth)
  for (const player of players) {
    drawPlayer(player.x, player.y, player.team);
  }

  // Draw ball (x and y only)
  if (ball) {
    drawBall(ball.x, ball.y);
  }

  // Update screen positions for hit testing (disabled)
  // updatePlayerScreenPositions(players);
}

// ============================================
// ANIMATION LOOP
// ============================================

function animate(timestamp) {
  if (!matchData) {
    requestAnimationFrame(animate);
    return;
  }

  const frameInterval = 1000 / SOURCE_FPS;

  if (timestamp - lastFrameTime >= frameInterval) {
    drawFrame(frameIndex);
    // Skip last 5 frames
    const totalFrames = matchData.players.length - 5;
    frameIndex = (frameIndex + 1) % totalFrames;
    lastFrameTime = timestamp;
  }

  requestAnimationFrame(animate);
}

// ============================================
// INITIALIZATION
// ============================================

async function loadData() {
  try {
    const response = await fetch('data/goal_sequence.json');
    matchData = await response.json();
    console.log(`Loaded ${matchData.players.length} frames`);
  } catch (error) {
    console.error('Failed to load match data:', error);
  }
}

loadData().then(() => {
  requestAnimationFrame(animate);
});
