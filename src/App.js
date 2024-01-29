import React, { useState, useEffect } from "react";
import "./App.css";
import Swatch from "./components/swatch";
import rough from "roughjs/bundled/rough.esm";
import axios from "axios";

rough.generator();

const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

export const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  console.log(type)
  if (x1 < x2 || (x1 === x2 && y1 < y2)) {
    return { x1, y1, x2, y2 };
  } else {
    return { x1: x2, y1: y2, x2: x1, y2: y1 };
  }
};



function App() {
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [points, setPoints] = useState([]);
  // const [path, setPath] = useState([]);

  const [action, setAction] = useState("none");
  const [toolType, setToolType] = useState("pencil");

  const [nameFieldState, setNameFieldState] = useState("")
  const [name, setName] = useState("")

  const [monitor, setMonitor] = useState(false)

  const [newestData, setNewestData] = useState({})

  useEffect(() => {
    for (let person = 0; person < newestData.length; person++) {
      const canvas = document.getElementById(newestData[person].name);
      if (canvas == null) {
        return
      }
      const context = canvas.getContext("2d");

      context.lineCap = 5;
      context.moveTo(newestData[person].points[0].clientX, newestData[person].points[0].clientY);
      context.beginPath();
      for (let i = 0; i < newestData[person].points.length; i++) {
        let clientX = newestData[person].points[i].clientX / newestData.length
        let clientY = newestData[person].points[i].clientY / newestData.length

        var midPoint = midPointBtw(clientX, clientY);
        context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
        context.lineTo(clientX, clientY);
        context.stroke();
      }
    }
  }, [newestData])

  const handleMouseDown = (e) => {
    console.log(toolType);
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
  
    const getClientCoordinates = (event) => {
      if (event.type === "mousedown") {
        return { clientX: event.clientX, clientY: event.clientY };
      } else if (event.type === "touchstart" || event.type === "touchmove") {
        const touch = event.touches[0] || event.changedTouches[0];
        console.log(touch)
        return { clientX: touch.clientX, clientY: touch.clientY };
      }
      return { clientX: 0, clientY: 0 }; // Default to (0,0) if the event type is not recognized
    };
  
    const { clientX, clientY } = getClientCoordinates(e);
  
    if (toolType === "pencil") {
      setAction("sketching");
      setIsDrawing(true);
  
      const transparency = "1.0";
      const newEle = {
        clientX,
        clientY,
        transparency,
      };
      setPoints((state) => [...state, newEle]);
  
      context.lineCap = 5;
      context.moveTo(clientX, clientY);
      context.beginPath();
    } else if (toolType === "eraser") {
      setAction("erasing");
      context.clearRect(0, 0, canvas.width, canvas.height);
      setPoints([]);
      setElements([]);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const getClientCoordinates = (event) => {
      if (event.type === "mousedown") {
        return { clientX: event.clientX, clientY: event.clientY };
      } else if (event.type === "touchstart" || event.type === "touchmove") {
        const touch = event.touches[0] || event.changedTouches[0];
        console.log(touch)
        return { clientX: touch.clientX, clientY: touch.clientY };
      }
      return { clientX: 0, clientY: 0 }; // Default to (0,0) if the event type is not recognized
    };
  
    const { clientX, clientY } = getClientCoordinates(e);

    if (action === "sketching") {
      if (!isDrawing) return;

      const transparency = points[points.length - 1].transparency;
      const newEle = { clientX, clientY, transparency };

      setPoints((state) => [...state, newEle]);
      var midPoint = midPointBtw(clientX, clientY);
      context.quadraticCurveTo(clientX, clientY, midPoint.x, midPoint.y);
      context.lineTo(clientX, clientY);
      context.stroke();
    }
  };
  const handleMouseUp = () => {
    if (action === "sketching") {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.closePath();
      // const element = points;
      setPoints([]);
      // setPath((prevState) => [...prevState, element]); //tuple
      setIsDrawing(false);
      console.log(elements)
      if (name !== "monitor") axios.post("https://whiteboard-backend.fly.dev/appendData", { name: name, points: points })
    } else {
      setAction("erasing")
      setElements([])
    }
    setAction("none");
  };
  return (
    (monitor ? (
      <>
        <button onClick={() => {
          axios.get("https://whiteboard-backend.fly.dev/getData").then((e) => {
            let arr = []
            Object.entries(e.data).forEach((entry) => {
              const [key, value] = entry;
              console.log(key)
              arr.push(value)
            });
            console.log(arr)
            setNewestData(arr)
          })
        }}>Fetch</button>
        <button onClick={() => {
          axios.post("https://whiteboard-backend.fly.dev/eraseData").then(() => {
            axios.get("https://whiteboard-backend.fly.dev/getData").then((e) => {
              let arr = []
              Object.entries(e.data).forEach((entry) => {
                const [key, value] = entry;
                console.log(key)
                arr.push(value)
              });
              console.log(arr)
              setNewestData(arr)
            })
          })
        }}>Erase data</button>
        {newestData.length > 0 &&
          newestData.map((item) => {
            return (
              <div key={item.name}>
                <h2>{item.name}</h2>
                <canvas
                  id={item.name}
                  className="App"
                  width={window.innerWidth / newestData.length}
                  height={window.innerHeight / newestData.length}
                >
                  Canvas
                </canvas>
              </div>
            )
          })
        }
      </>

    ) : (
      (name ? (
        <div>
          <div>
            <Swatch setToolType={setToolType} />
          </div>
          <canvas
            id="canvas"
            className="App"
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleMouseMove}
          >
            Canvas
          </canvas>
        </div>
      ) : (
        <div>
          <h2>Enter your name:</h2>
          <input onChange={(e) => { setNameFieldState(e.target.value) }}></input>
          <button onClick={() => {
            if (nameFieldState === 'monitor') {
              setMonitor(true)
            } else { setName(nameFieldState) }
          }}>Submit</button>
        </div>
      ))
    ))

  );
}

export default App;
