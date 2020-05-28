import React, { Component } from 'react';

class Canvas extends Component {

  constructor(props) {
    super(props);
    console.log("CONSTRUCTOR");
    this.activelyDrawingClients = {};
    console.log('this.activelyDrawingClients', this.activelyDrawingClients);
  }

  componentDidMount() {
    console.log('COMPONENT_DID_MOUNT');
    this.canvas.width=window.innerWidth
    this.canvas.height=window.innerHeight
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
  }

  componentDidUpdate() {
    console.log('COMPONENT_DID_UPDATE');
    var myDrawHistory = this.props.drawHistory;
    console.table(myDrawHistory);
    while (myDrawHistory.length > 0) {
      var drawDataPoint = myDrawHistory.shift();
      this.processDataPoint(drawDataPoint);
    }
  }

  processDataPoint(dataPoint) {
    console.log("START - processDataPoint");

    if (this.activelyDrawingClients[dataPoint.clientID]) {
      console.log("client " + dataPoint.clientID + " exists");
    } else {
      console.log("client " + dataPoint.clientID + " does not exist")
      this.activelyDrawingClients[dataPoint.clientID] = "HELLO";
    }

    this.doMeAPaint(dataPoint);

    console.log("END - processDataPoint");
  }


  // componentWillUpdate(nextProps) {
  //   this.drawData = nextProps.drawData;
  //   this.drawHistory = nextProps.drawHistory;
  //   this.drawDrawHistory(this.drawHistory);
  // }

  // drawDrawHistory() {
  //   while(this.drawHistory.length > 0) {
  //     const dataToDraw = this.drawHistory.shift();
  //     this.processDataToDraw(dataToDraw);
  //     this.doMeAPaint(dataToDraw);
  //   }
  // }
  
  doMeAPaint(drawData) {
    this.paint(
      {
        offsetX: drawData.x,
        offsetY: drawData.y
      },
      {
        offsetX: 250,
        offsetY: 250
      },
      drawData.colour
    );
  }

  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }





  render() {
    return (
      <canvas
        ref={(ref) => (this.canvas = ref)}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.endPaintEvent}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}
export default Canvas;
