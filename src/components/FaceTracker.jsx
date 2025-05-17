import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const FaceTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.restore();
    
      if (results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
    
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];
    
        const leftEyeDist = Math.abs(leftEyeTop.y - leftEyeBottom.y);
        const rightEyeDist = Math.abs(rightEyeTop.y - rightEyeBottom.y);
    
        const eyeClosed = leftEyeDist < 0.01 && rightEyeDist < 0.01;
    
        if (eyeClosed) {
          console.log("👁️ Eyes closed — blurring screen");
          document.body.style.filter = "blur(10px)";
        } else {
          console.log("👁️ Eyes open — clearing blur");
          document.body.style.filter = "none";
        }
      }
    });    

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: 640,
          height: 480,
          border: "1px solid white", // for visibility
        }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
  
};

export default FaceTracker;
