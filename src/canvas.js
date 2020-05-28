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
    var clientID = dataPoint.clientID;

    if (this.activelyDrawingClients[clientID]) {
      
      console.log("client " + clientID + " exists");
      this.activelyDrawingClients[clientID].activeDrawLine.push({
        colour: dataPoint.colour,
        x: dataPoint.x,
        y: dataPoint.y,
        mousedown: dataPoint.mousedown
      });

      var fromPoint = this.activelyDrawingClients[clientID].activeDrawLine.shift();
      var fromX = fromPoint.x;
      var fromY = fromPoint.y;

      if (this.activelyDrawingClients[clientID].activeDrawLine[0].mousedown) {
        var toX = this.activelyDrawingClients[clientID].activeDrawLine[0].x;
        var toY = this.activelyDrawingClients[clientID].activeDrawLine[0].y;
      } else {
        var toPoint = this.activelyDrawingClients[clientID].activeDrawLine.shift();
        var toX = toPoint.x;
        var toY = toPoint.y;
        delete this.activelyDrawingClients[clientID];
      }

      console.log('fromX:',fromX);
      console.log('fromY:',fromY);
      console.log('toX:',toX);
      console.log('toY:',toY);

      this.doMeAPaint(
        fromX,
        fromY,
        toX,
        toY,
        fromPoint.colour
      );

    } else {
      console.log("client " + clientID + " does not exist")
      this.activelyDrawingClients[clientID] = {
        activeDrawLine: [{
          colour: dataPoint.colour,
          x: dataPoint.x,
          y: dataPoint.y,
          mousedown: dataPoint.mousedown
        }]
      }
    }

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
  
  doMeAPaint(fromX,fromY,toX,toY,colour) {
    this.paint(
      {
        offsetX: fromX,
        offsetY: fromY
      },
      {
        offsetX: toX,
        offsetY: toY
      },
      colour
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
