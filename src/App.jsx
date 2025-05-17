import { useState } from 'react';
import FaceTracker from './components/FaceTracker';

function App() {
  const [blur, setBlur] = useState(false);

  return (
    <div
      style={{
        filter: blur ? "blur(10px)" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      <h1>Eye Privacy App</h1>
      <FaceTracker setBlur={setBlur} />
    </div>
  );
}

export default App;
