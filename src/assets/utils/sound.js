const sounds = {
  win: new Audio("/sounds/winning.mp3"),
  lose: new Audio("/sounds/losing.mp3"),
  buttonClick: new Audio("/sounds/buttonClick.mp3"),
};

export function playSound(name) {
  const sound = sounds[name];
  if (!sound) return;

  sound.currentTime = 0;
  sound.play();
}