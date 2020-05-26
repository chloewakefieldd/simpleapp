import React, {useState} from 'react';
import './App.css';
import Canvas from './canvas';


import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

const NUM_POLL_SKIPS = 9;



function App() {



  const [colour, setColour] = useState('000000');

  function printMouseCoords(e) {
    console.log(
      {
        colour: colour,
        x: e.clientX,
        y: e.clientY,
        mousedown: mousedown
      });
  }

  document.onclick = (e) => {
    //printMouseCoords(e);
    //alert('my colour is ' + colour);
    socket.emit('test', socket.id);
  }


  var mousedown = false;
  document.onmousedown = (e) => {
    mousedown = true;
    printMouseCoords(e);
  }
  document.onmouseup = (e) => {
    mousedown = false;
    printMouseCoords(e);
  }
  var counter = 0;
  document.onmousemove = (e) => {
    if (mousedown) {
      if (counter > NUM_POLL_SKIPS) {
        counter = 0;
        printMouseCoords(e);
      }
      counter++;
    }
  }

  socket.on('connect', () => {
    console.log('client, connect');
    socket.on('chloe', (colour) => {
      console.log('chloe');
      document.getElementsByTagName('body')[0].style.backgroundColor = colour;
      console.log(colour);
      setColour(colour);
    });
    socket.on('wakefield', (colour) => {
      console.log('wakefield');
      document.getElementsByTagName('body')[0].style.backgroundColor = colour;
      setColour(colour);
    });
  });



  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
