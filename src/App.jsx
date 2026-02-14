import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./App.css";

function App() {
  const [heart, setHeart] = useState(80);
  const [gyro, setGyro] = useState(2);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("ไม่จม");
  const drownCountRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = Math.floor(Math.random() * 50) + 50;
      const newGyro = Number((Math.random() * 3).toFixed(2));

      setHeart(newHeart);
      setGyro(newGyro);

      setData(prev => [...prev.slice(-9), { value: newGyro }]);

      // Check drowning condition (4+ readings ≈ 8+ seconds @ 2s interval)
      if (newGyro < 0.5 && (newHeart < 55 || newHeart > 130)) {
        drownCountRef.current++;
        if (drownCountRef.current >= 4) {
          setStatus("จม");
        }
      } else {
        drownCountRef.current = 0;

        // ไม่จม: Gyro > 1.2 Hz AND Heart Rate 60–110 BPM
        if (newGyro > 1.2 && newHeart >= 60 && newHeart <= 110) {
          setStatus("ไม่จม");
        }
        // เฝ้าระวัง: Gyro 0.5–1.2 Hz OR Heart Rate < 60 OR Heart Rate > 120 BPM
        else if ((newGyro >= 0.5 && newGyro <= 1.2) || newHeart < 60 || newHeart > 120) {
          setStatus("เฝ้าระวัง");
        }
        // Default to safe
        else {
          setStatus("ไม่จม");
        }
      }

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (status === "จม") return "red";
    if (status === "เฝ้าระวัง") return "orange";
    return "green";
  };

  return (
    <div className="container">
      <h1>Public Safety Drowning Detection System</h1>

      <div className="cards">

        <div className="card">
          <h2>Heart Rate</h2>
          <h1>{heart} BPM</h1>
        </div>

        <div className="card">
          <h2>Gyroscope (Hz)</h2>
          <h1>{gyro} Hz</h1>
          <LineChart width={250} height={150} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" />
          </LineChart>
        </div>

        <div className="card">
          <h2>Status</h2>
          <h1 style={{ color: getColor() }}>
            {status === "จม" && "❗ "}
            {status === "เฝ้าระวัง" && "⚠️ "}
            {status === "ไม่จม" && "🟢 "}
            {status}
          </h1>
        </div>

      </div>
    </div>
  );
}

export default App;
