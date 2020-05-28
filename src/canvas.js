import React, { Component } from 'react';

class Canvas extends Component {

  constructor(props) {
    super(props);
    console.log("CONSTRUCTOR");
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


  componentWillUpdate(nextProps) {
    console.log('COMPONENT_WILL_UPDATE')
    this.drawData = nextProps.drawData;
    this.drawHistory = nextProps.drawHistory;
    console.log('componentWillUpdate, drawData: ', this.drawData);
    console.log('componentWillUpdate, drawHistory: ');
    console.table(this.drawHistory);
    this.drawDrawHistory(this.drawHistory);
  }

  drawDrawHistory() {
    while(this.drawHistory.length > 0) {
      console.log("PRESTART");
      const dataToDraw = this.drawHistory.shift();
      this.processDataToDraw(dataToDraw);
      // this.doMeAPaint(dataToDraw);
    }
  }

  processDataToDraw(currentDataPoint) {
    console.log('currentDataPoint', currentDataPoint);
    console.log('this.activelyDrawingClients', this.activelyDrawingClients);
    // IF CLIENT ISNT AN ACTIVE CLIENT ALREADY, ADD THE CLIENT
    console.log('currentDataPoint.clientID', currentDataPoint.clientID);
  }

  
  // doMeAPaint(drawData) {
  //   this.paint(
  //     {
  //       offsetX: drawData.x,
  //       offsetY: drawData.y
  //     },
  //     {
  //       offsetX: 250,
  //       offsetY: 250
  //     },
  //     drawData.colour
  //   );
  // }

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
