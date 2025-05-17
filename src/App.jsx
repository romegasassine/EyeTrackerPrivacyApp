import FaceTracker from './components/FaceTracker';
import { useState } from 'react';

function App() {
  const [blur, setBlur] = useState(false);

  return (
    <div
      id="app-container"
      style={{
        filter: blur ? "blur(10px)" : "none",
        transition: "filter 0.2s ease",
      }}
    >
      <h1>Eye Privacy App</h1>
      <FaceTracker setBlur={setBlur} />
    </div>
  );
}

export default App;
