import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './canvas';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');
const NUM_POLL_SKIPS = 29;

function App() {

  useEffect(() => {
    socket.on('drawOut', (drawData) => {
      console.log('client received drawData', drawData);
      setDrawData(drawData);
    });
  });
    
  const [colour, setColour] = useState('unicorn');
  const [drawData, setDrawData] = useState({});

  function printMouseCoords(e) {
    const drawData = {
      colour: colour,
      x: e.clientX,
      y: e.clientY,
      mousedown: mousedown
    };
    //console.log(drawData);
    socket.emit('drawData', drawData);
  }

  var mousedown = false;
  const handleMouseDown = (e) => {
    mousedown = true;
    printMouseCoords(e);
  }
  const handleMouseUp = (e) => {
    mousedown = false;
    printMouseCoords(e);
  }
  var counter = 0;
  const handleMouseMove = (e) => {
    if (mousedown) {
      if (counter > NUM_POLL_SKIPS) {
        counter = 0;
        printMouseCoords(e);
      }
      counter++;
    }
  }
  
  return (
    <>
      <div id="colourSwatches">
        <div id="blackSwatch" onClick={() => {setColour('#000000')}}></div>
        <div id="blueSwatch" onClick={() => {setColour('#0000ff')}}></div>
      </div>
      <div id="clickCapture"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></div>
      <Canvas colour={colour} drawData={drawData}/>
    </>
  );
}

export default App;
