import React, { useRef, useEffect } from 'react';
import { Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface PoseVisualizerProps {
    results: Results | null;
    width: number;
    height: number;
}

export const PoseVisualizer: React.FC<PoseVisualizerProps> = ({ results, width, height }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !results) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        // Draw the image first? No, we might want to overlay on the video element itself, 
        // or draw the video on the canvas. 
        // For efficiency, let's assume the video is behind this canvas.
        // If we want to draw the video frame `results.image`, we can do that too.

        // For now, let's just clear and draw landmarks.
        // transform coords since mediapipe gives normalized 0-1
        // Actually drawing_utils handles widely, but we need to ensure the canvas is scaled.

        // We can use the helper functions from mediapipe drawing_utils if we load them.
        // Since we don't have `@mediapipe/drawing_utils` installed in package.json in the previous step 
        // (Wait, I didn't verify if I installed `drawing_utils`? I installed `camera_utils`).
        // I should probably manually draw or install drawing_utils.
        // Let's implement manually to be safe and have custom "Premium" styling.

        if (results.poseLandmarks) {
            // Custom drawing for minimal, premium look
            const landmarks = results.poseLandmarks;

            // Draw connections
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';

            for (const [start, end] of POSE_CONNECTIONS) {
                const startLandmark = landmarks[start];
                const endLandmark = landmarks[end];
                if (startLandmark.visibility && startLandmark.visibility > 0.5 &&
                    endLandmark.visibility && endLandmark.visibility > 0.5) {
                    ctx.beginPath();
                    ctx.moveTo(startLandmark.x * width, startLandmark.y * height);
                    ctx.lineTo(endLandmark.x * width, endLandmark.y * height);
                    ctx.stroke();
                }
            }

            // Draw landmarks
            ctx.fillStyle = '#00F0FF'; // Cyberpunk Cyan
            for (const landmark of landmarks) {
                if (landmark.visibility && landmark.visibility > 0.5) {
                    ctx.beginPath();
                    ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        }

        ctx.restore();

    }, [results, width, height]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
            }}
        />
    );
};
