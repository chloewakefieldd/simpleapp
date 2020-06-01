import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './canvas';
import openSocket from 'socket.io-client';

const socket = openSocket('http://34.243.147.39:8000/');
var colour = '#000000';
var mouseIsDown = false;
setInterval(() => {socket.emit('heartbeat', socket.id)}, 2000)

export default function App() {
    
  const [drawHistory, setDrawHistory] = useState([]);

  useEffect(() => {
    socket.on('drawHistory', (receivedDrawHistory) => {
      setDrawHistory(receivedDrawHistory);
    });
    socket.on('drawOut', (newDrawData) => {
      setDrawHistory([newDrawData]);
    });
  }, []);

  function sendDrawData(e) {
    socket.emit('drawData', {
      clientID: socket.id,
      colour: colour,
      x: e.clientX,
      y: e.clientY,
      mousedown: mouseIsDown
    });
  }

  const handleMouseDown = (e) => {
    mouseIsDown = true;
    sendDrawData(e);
  }

  const handleMouseMove = (e) => {
    if (mouseIsDown) {
      sendDrawData(e);
    }
  }
  
  const handleMouseUp = (e) => {
    mouseIsDown = false;
    sendDrawData(e);
  }
  
  const clear = () => {
    socket.emit('clear');
  }

  return (
    <>
      <div id="colourSwatches">
        <div id="blackSwatch" onClick={() => {colour = '#000000'}}></div>
        <div id="redSwatch" onClick={() => {colour = '#ff0000'}}></div>
        <div id="greenSwatch" onClick={() => {colour = '#00ff00'}}></div>
        <div id="blueSwatch" onClick={() => {colour = '#0000ff'}}></div>
        <div id="clearSwatch" onClick={clear}></div>
      </div>
      <div id="clickCapture"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></div>
      <Canvas colour={colour} drawHistory={drawHistory}/>
    </>
  );
}
