import React, { Component } from 'react';

class Canvas extends Component {

  componentWillUpdate(nextProps) {
    this.drawData = nextProps.drawData;
    console.log("HERE", !!this.drawHistory);
    this.drawHistory = nextProps.drawHistory;
    console.log('componentWillUpdate, drawData: ', this.drawData);
    console.log('componentWillUpdate, drawHistory: ', this.drawHistory);
    console.log("HERE", !!this.drawHistory);
    this.doMeAPaint(this.drawHistory.shift());
  }
  
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

  resizeCanvas() {
    this.canvas.width=window.innerWidth
    this.canvas.height=window.innerHeight
  }

  componentDidMount() {
    this.resizeCanvas();
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;
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
