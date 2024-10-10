 
let cachedProfileColor = null;

export function getRandomProfileColor() {
  if (!cachedProfileColor) {
    cachedProfileColor = generateRandomColor();
  }
  return cachedProfileColor;
}

function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color1 = '#';
  let color2 = '#';

  for (let i = 0; i < 6; i++) {
    color1 += letters[Math.floor(Math.random() * 16)];
    color2 += letters[Math.floor(Math.random() * 16)];
  }

  return [color1, color2];
}

export function resetProfileColor() {
  cachedProfileColor = null;
}