import React, { useRef, useState, useEffect } from 'react';
import { PostureStatus } from '../../types';
import { PictureInPictureIcon } from '../icons/Icons';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  postureStatus: PostureStatus;
  onToggleCamera: () => void;
  isCameraEnabled: boolean;
}

const getStatusColor = (status: PostureStatus, isEnabled: boolean) => {
  if (!isEnabled) return 'bg-gray-400';
  switch (status) {
    case PostureStatus.GOOD:
      return 'bg-green-500';
    case PostureStatus.SLOUCHING:
    case PostureStatus.LEANING:
      return 'bg-red-500';
    case PostureStatus.IDLE:
      return 'bg-gray-400';
    default:
      return 'bg-yellow-500'; // Analyzing/Unknown
  }
};

const CameraView: React.FC<CameraViewProps> = ({ videoRef, postureStatus, onToggleCamera, isCameraEnabled }) => {
  // We use a canvas to combine video + status overlay for the PiP stream
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  
  // Separate hidden video element for the PiP player source
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  const displayStatus = isCameraEnabled ? postureStatus : "Ready to Start";

  // Drawing Loop: Composes Video + Status Bar onto Canvas
  const drawCanvas = () => {
    if (canvasRef.current && videoRef.current && isCameraEnabled) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const video = videoRef.current;

      if (ctx && video.readyState >= 2) {
        // Match canvas size to video
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

        // 1. Draw Video Frame (Mirrored)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // 2. Draw Status Bar Overlay (Top Strip)
        const barHeight = 60; 
        let barColor = 'rgba(31, 41, 55, 0.9)'; // Default dark
        let statusText = 'WAITING';
        let textColor = '#FFFFFF';

        if (postureStatus === PostureStatus.GOOD) {
            barColor = 'rgba(34, 197, 94, 0.9)'; // Green
            statusText = 'GOOD POSTURE';
        } else if (postureStatus === PostureStatus.SLOUCHING) {
            barColor = 'rgba(239, 68, 68, 0.9)'; // Red
            statusText = 'SLOUCHING DETECTED';
        } else if (postureStatus === PostureStatus.LEANING) {
            barColor = 'rgba(239, 68, 68, 0.9)'; // Red
            statusText = 'LEANING DETECTED';
        } else if (postureStatus === PostureStatus.UNKNOWN) {
            barColor = 'rgba(234, 179, 8, 0.9)'; // Yellow
            statusText = 'ANALYZING...';
        }

        // Draw Bar Background
        ctx.fillStyle = barColor;
        ctx.fillRect(0, 0, canvas.width, barHeight);

        // Draw Text
        ctx.fillStyle = textColor;
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(statusText, canvas.width / 2, barHeight / 2);
      }
    }
    rafRef.current = requestAnimationFrame(drawCanvas);
  };

  useEffect(() => {
    if (isCameraEnabled) {
        drawCanvas();
    } else {
        cancelAnimationFrame(rafRef.current);
        // Force PiP close if active when camera stops
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(console.error);
        }
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isCameraEnabled, postureStatus]);

  const togglePip = async () => {
    if (!document.pictureInPictureEnabled || !pipVideoRef.current || !canvasRef.current) {
        alert("Picture-in-Picture is not supported.");
        return;
    }

    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        try {
            // Stream from the composited canvas
            const stream = canvasRef.current.captureStream(30);
            pipVideoRef.current.srcObject = stream;
            await pipVideoRef.current.play();
            await pipVideoRef.current.requestPictureInPicture();
        } catch (error) {
            console.error("Failed to enter PiP:", error);
        }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Hidden elements for PiP processing */}
      <canvas ref={canvasRef} className="hidden" />
      <video ref={pipVideoRef} className="hidden" muted playsInline />

      <div className="relative w-full bg-gray-900 dark:bg-black rounded-lg overflow-hidden mb-4 flex-1 max-h-[50vh] min-h-[300px] group">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        
        {/* Standard PiP Button */}
        {isCameraEnabled && (
            <button 
                onClick={togglePip}
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 text-xs font-bold flex items-center gap-2"
                title="Picture in Picture"
            >
                <PictureInPictureIcon className="w-4 h-4" />
                <span>PiP Mode</span>
            </button>
        )}

        {!isCameraEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-gray-400 font-medium text-sm">Camera is off</p>
            </div>
        )}
        {isCameraEnabled && postureStatus === PostureStatus.IDLE && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white p-4 text-center animate-in fade-in">
                <p className="text-base font-semibold">You seem to be idle</p>
                <p className="mt-1 text-xs text-gray-300">Move slightly to resume tracking.</p>
            </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${getStatusColor(postureStatus, isCameraEnabled)} ${isCameraEnabled && postureStatus !== PostureStatus.IDLE ? 'animate-pulse' : ''}`}></span>
          <p className="font-bold text-base text-gray-900 dark:text-white tracking-tight">{displayStatus}</p>
        </div>
        <button
          onClick={onToggleCamera}
          className={`px-5 py-2 rounded-full font-bold text-white text-xs transition-all shadow-md hover:shadow-lg active:scale-95 ${
            isCameraEnabled ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100'
          }`}
        >
          {isCameraEnabled ? 'Stop Session' : 'Start Session'}
        </button>
      </div>
    </div>
  );
};

export default CameraView;