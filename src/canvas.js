import React, { Component } from 'react';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.activelyDrawingClients = {};
  }

  componentDidMount() {
    this.canvas.width=window.innerWidth
    this.canvas.height=window.innerHeight
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
  }

  componentDidUpdate() {
    var myDrawHistory = this.props.drawHistory;
    while (myDrawHistory.length > 0) {
      var drawDataPoint = myDrawHistory.shift();
      this.processDataPoint(drawDataPoint);
    }
  }

  processDataPoint(dataPoint) {
    var clientID = dataPoint.clientID;

    if (this.activelyDrawingClients[clientID]) {
      
      this.activelyDrawingClients[clientID].activeDrawLine.push({
        colour: dataPoint.colour,
        x: dataPoint.x,
        y: dataPoint.y,
        mousedown: dataPoint.mousedown
      });

      var fromPoint = this.activelyDrawingClients[clientID].activeDrawLine.shift();
      var fromX = fromPoint.x;
      var fromY = fromPoint.y;

      var toX, toY;
      if (this.activelyDrawingClients[clientID].activeDrawLine[0].mousedown) {
        toX = this.activelyDrawingClients[clientID].activeDrawLine[0].x;
        toY = this.activelyDrawingClients[clientID].activeDrawLine[0].y;
      } else {
        var toPoint = this.activelyDrawingClients[clientID].activeDrawLine.shift();
        toX = toPoint.x;
        toY = toPoint.y;
        delete this.activelyDrawingClients[clientID];
      }

      this.doMeAPaint(
        fromX,
        fromY,
        toX,
        toY,
        dataPoint.colour
      );

    } else {
      this.activelyDrawingClients[clientID] = {
        activeDrawLine: [{
          colour: dataPoint.colour,
          x: dataPoint.x,
          y: dataPoint.y,
          mousedown: dataPoint.mousedown
        }]
      }
    }

  }
  
  doMeAPaint(fromX, fromY, toX, toY, colour) {
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
