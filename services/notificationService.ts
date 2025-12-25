
export const sendNotification = (title: string, body: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
};

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Gentle chime for positive feedback (Good Posture)
export const playGoodSound = () => {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') context.resume();
    
    const now = context.currentTime;
    
    // C Major Triad (C5, E5, G5) - Ascending
    const notes = [523.25, 659.25, 783.99]; 
    
    notes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.connect(gain);
      gain.connect(context.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + (i * 0.08); // Slight stagger
      
      // Gentle envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.05, startTime + 0.05); // Low volume (subtle)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
      
      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } catch (error) {
    console.error("Error playing good sound:", error);
  }
};

// Soft alert for negative feedback (Slouching/Leaning)
export const playAlertSound = () => {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') context.resume();

    const now = context.currentTime;
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.connect(gain);
    gain.connect(context.destination);

    // Soft downward slide
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.05); // Low volume
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.frequency.setValueAtTime(300, now); // Lower pitch
    osc.frequency.linearRampToValueAtTime(200, now + 0.4); // Slide down
    osc.type = 'sine';

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (error) {
    console.error("Error playing alert sound:", error);
  }
};

// Legacy support
export const playBeep = playAlertSound;
