import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const formatTime = (time) => {
  const milliseconds = `0${(time % 1000) / 10}`.slice(-2);
  const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
  const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
  const hours = `0${Math.floor(time / 3600000)}`.slice(-2);
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
};

const localStoredTime = JSON.parse(localStorage.getItem("laps"));
function App() {
  const [time, setTime] = useState(0);
  const [timeIsRunning, setTimeIsRunning] = useState(false);
  const [laps, setLaps] = useState(localStoredTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("laps", JSON.stringify(laps));
  }, [laps]);

  function startTime() {
    if (!timeIsRunning) {
      setTimeIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prevState) => prevState + 10);
      }, 10);
    }
  }

  function handlePause() {
    console.log("clicked");
    if (timeIsRunning) {
      setTimeIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }

  function handleReset() {
    if (!timeIsRunning) {
      clearInterval(intervalRef.current);
      setTime(0);
      setLaps([]);
    }
  }

  function handleLap() {
    if (timeIsRunning) {
      setLaps((lap) => {
        return [...lap, time];
      });
    }
    console.log(time);
  }

  return (
    <div className="bg_cont">
      <div className="container">
        <div className="timer_screen">
          <h3 className="timer">{formatTime(time)}</h3>
        </div>
        <div className="button_grid">
          <button
            onClick={startTime}
            disabled={timeIsRunning}
            style={{ cursor: timeIsRunning ? "not-allowed" : "pointer" }}
          >
            Start
          </button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleLap}>Lap</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <div className="title_section">
          <p>Lap</p>
          <p>Time</p>
          <p>Total Time</p>
        </div>
        {laps.map((lap, index) => {
          return (
            <ul className="timer_list" key={index}>
              <li>Lap {index + 1}</li>
              <li className="lap_time">{formatTime(lap)}</li>
              <li className="lap_time">
                {formatTime(lap - (laps[index - 1] || 0))}
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default App;
