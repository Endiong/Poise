import { NormalizedLandmark } from '@mediapipe/pose';

// Type alias for clarity
type Landmark = NormalizedLandmark;

/**
 * Calculates the angle between three points (A, B, C) where B is the vertex.
 * Returns angle in degrees.
 */
export const calculateAngle = (a: Landmark, b: Landmark, c: Landmark): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) {
        angle = 360.0 - angle;
    }
    return angle;
};

/**
 * Calculates the vertical offset between two points.
 * Useful for checking shoulder alignment (leaning).
 */
export const calculateVerticalOffset = (a: Landmark, b: Landmark): number => {
    return Math.abs(a.y - b.y);
};

/**
 * Calculates the slope of the line connecting two shoulders.
 * Returns absolute slope value.
 */
export const calculateShoulderSlope = (left: Landmark, right: Landmark): number => {
    return Math.abs((right.y - left.y) / (right.x - left.x));
};

/**
 * Calculates the normalized neck alignment score.
 * Compares the midpoint of shoulders to midpoint of ears.
 */
export const calculateNeckCompression = (
    leftShoulder: Landmark,
    rightShoulder: Landmark,
    leftEar: Landmark,
    rightEar: Landmark
): number => {
    const avgShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const avgEarY = (leftEar.y + rightEar.y) / 2;
    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);

    // Vertical distance
    const neckLength = avgShoulderY - avgEarY;

    // Avoid division by zero
    if (shoulderWidth === 0) return 0;

    // Return ratio of neck length to shoulder width
    return neckLength / shoulderWidth;
};
