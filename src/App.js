import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './canvas';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

var mouseIsDown = false;
var colour = '#000000';

setInterval(() => {socket.emit('heartbeat', socket.id)}, 2000)

export default function App() {
  console.log("APP RE-RENDER");
    
  const [drawData, setDrawData] = useState({});
  const [drawHistory, setDrawHistory] = useState([]);

  useEffect(() => {
    socket.on('drawHistory', (receivedDrawHistory) => {
      console.log('ON - drawHistory');
      setDrawHistory(receivedDrawHistory);
    });
    // socket.on('drawOut', (newDrawData) => {
    //   console.log('on drawOut');
    //   //setDrawData(newDrawData);
    // });
  });

  function printMouseCoords(e) {
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
    printMouseCoords(e);
  }
  
  const handleMouseUp = (e) => {
    mouseIsDown = false;
    printMouseCoords(e);
  }

  return (
    <>
      <div id="colourSwatches">
        <div id="blackSwatch" onClick={() => {colour='#000000'}}></div>
        <div id="blueSwatch" onClick={() => {colour='#0000ff'}}></div>
      </div>
      <div id="clickCapture"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></div>
      <Canvas drawData={drawData} drawHistory={drawHistory}/>
    </>
  );
}
