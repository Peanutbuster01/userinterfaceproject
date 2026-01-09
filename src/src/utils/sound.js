export const sounds = {
win: new Audio("src/assets/sounds/winning-218995.mp3"),

};

export function playSound(name) {
  const sound = sounds[name];
  if (!sound) return;
  sound.currentTime = 0;
  sound.play();
}