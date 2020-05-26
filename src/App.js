import React, {useState} from 'react';
import './App.css';
import Canvas from './canvas';


import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

const NUM_POLL_SKIPS = 9;


function App() {



  const [drawColour, setColour] = useState(['']);

  function printMouseCoords(e) {
    const drawData = {
      colour: drawColour[0],
      x: e.clientX,
      y: e.clientY,
      mousedown: mousedown
    };
    console.log(drawData);
    socket.emit('drawData', drawData);
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
      //document.getElementsByTagName('body')[0].style.backgroundColor = colour;
      console.log(colour);
      drawColour[0]=colour;
    });


    socket.on('drawOut', (drawData) => {
      console.log('Client received drawData: ', drawData);
    });



    // socket.on('wakefield', (colour) => {
    //   console.log('wakefield');
    //   document.getElementsByTagName('body')[0].style.backgroundColor = colour;
    //   setState(colour);
    // });
  });

  // var flip = false;
  // setInterval(() => {
  //   if (flip) {
  //     flip = false;
  //     drawColour[0]='#0000ff';
  //   } else {
  //     flip = true;
  //     drawColour[0]='#00ff00';
  //   }
  //   console.log('tick');
  // }, 2000);

  function changeColourBlack() {
    drawColour[0]='#000000';
  }
  function changeColourRed() {
    drawColour[0]='#ff0000';
  }
  function changeColourGreen() {
    drawColour[0]='#00ff00';
  }
  function changeColourBlue() {
    drawColour[0]='#0000ff';
  }
  

  return (
    <>
      <div id="colourSwatches">
        <div id="blackSwatch" onClick={changeColourBlack}></div>
        <div id="redSwatch" onClick={changeColourRed}></div>
        <div id="greenSwatch" onClick={changeColourGreen}></div>
        <div id="blueSwatch" onClick={changeColourBlue}></div>
      </div>
      <Canvas colour={drawColour}/>
    </>
  );
}

export default App;
