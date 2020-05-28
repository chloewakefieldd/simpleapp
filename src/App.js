import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './canvas';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

var mouseIsDown = false;

var counter = 0;

setInterval(() => {socket.emit('heartbeat', socket.id)}, 2000)

export default function App() {
    
  //const [drawData, setDrawData] = useState({});
  const [drawHistory, setDrawHistory] = useState([]);

  useEffect(() => {
    socket.on('drawHistory', (receivedDrawHistory) => {
      console.log("SOCKET ON - drawHistory");
      setDrawHistory(receivedDrawHistory);
    });
    socket.on('drawOut', (newDrawData) => {
      console.log("SOCKET ON - drawOut");
      setDrawHistory([newDrawData]);
    });
  });

  function sendDrawData(e) {
    console.log("SEND_DRAW_DATA");
    socket.emit('drawData', {
      clientID: socket.id,
      x: e.clientX,
      y: e.clientY,
      mousedown: mouseIsDown
    });
  }

  const handleMouseDown = (e) => {
    console.log("HANDLE_MOUSE_DOWN");
    mouseIsDown = true;
    sendDrawData(e);
  }


  const handleMouseMove = (e) => {
    if (mouseIsDown) {
      if (counter > 49) {
        console.log("HANDLE_MOUSE_MOVE");
        sendDrawData(e);
        counter = 0;
      }
      counter++;
    }
  }
  
  const handleMouseUp = (e) => {
    console.log("HANDLE_MOUSE_UP");
    mouseIsDown = false;
    sendDrawData(e);
  }

  return (
    <>
      <div id="colourSwatches">
        <div id="blackSwatch"></div>
        <div id="blueSwatch"></div>
      </div>
      <div id="clickCapture"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></div>
      <Canvas  drawHistory={drawHistory}/>{/*drawData={drawData}*/}
    </>
  );
}
