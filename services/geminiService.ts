import { GoogleGenAI } from "@google/genai";
import { PostureStatus } from "../types";

// @ts-ignore
export const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// Static Database of Tips
const POSTURE_TIPS = [
  "Keep your feet flat on the floor to support your lower back.",
  "Ensure the top of your monitor is at or slightly below eye level.",
  "Keep your shoulders relaxed and rolled back, not hunched.",
  "Elbows should be at a 90-degree angle while typing.",
  "Take a micro-break: look away from the screen for 20 seconds.",
  "Check your head position; ears should align with your shoulders.",
  "Avoid crossing your legs to maintain proper circulation.",
  "Engage your core slightly to support your spine.",
  "Ensure your lower back is supported by your chair.",
  "Keep your mouse close to your keyboard to avoid overreaching.",
  "Blink often to keep your eyes moist and reduce strain.",
  "Stand up and stretch your hamstrings for a moment.",
  "Adjust your chair height so your knees are level with your hips.",
  "Keep your wrists straight and hovering while typing.",
  "Hydrate! Drinking water helps maintain disc height in your spine.",
  "Chin tuck: gently pull your chin back to align your neck.",
  "Release tension in your jaw; keep your teeth slightly apart.",
  "Sit back in your chair, don't perch on the edge.",
  "Ensure proper lighting to avoid leaning in to see the screen.",
  "Take a deep breath and reset your posture now."
];

export const getPostureTip = async (status: string): Promise<string> => {
  // If user is idle, suggest movement
  if (status === PostureStatus.IDLE) {
    return "You've been away. Remember to stretch before sitting back down.";
  }

  // If posture is bad, give a specific correction first, otherwise random tip
  if (status === PostureStatus.SLOUCHING) {
    return "Lift your chest and pull your chin back slightly.";
  }
  
  if (status === PostureStatus.LEANING) {
    return "Center your weight evenly on both hips.";
  }

  // Return a random tip from the database
  const randomIndex = Math.floor(Math.random() * POSTURE_TIPS.length);
  return POSTURE_TIPS[randomIndex];
};