import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

const FaceTracker = ({ setBlur }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

      const landmarks = results.multiFaceLandmarks[0];

      const leftEyeTop = landmarks[159];
      const leftEyeBottom = landmarks[145];
      const rightEyeTop = landmarks[386];
      const rightEyeBottom = landmarks[374];

      const leftEyeDist = Math.abs(leftEyeTop.y - leftEyeBottom.y);
      const rightEyeDist = Math.abs(rightEyeTop.y - rightEyeBottom.y);

      const eyeClosed = leftEyeDist < 0.01 && rightEyeDist < 0.01;

      if (eyeClosed) {
        console.log("👁️ Eyes closed");
        setBlur(true);
      } else {
        console.log("👁️ Eyes open");
        setBlur(false);
      }
    });

    const startCamera = async () => {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    };

    if (videoRef.current) {
      startCamera();
    }
  }, [setBlur]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{
        width: 640,
        height: 480,
        border: "1px solid white",
      }}
    />
  );
};

export default FaceTracker;
