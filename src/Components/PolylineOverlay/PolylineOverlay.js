import React, { PureComponent } from 'react';
import { CanvasOverlay } from 'react-map-gl';
import PropTypes from 'prop-types';

// This helper class was found here: https://github.com/visgl/react-map-gl/issues/591
export default class PolylineOverlay extends PureComponent {
  _redraw({ width, height, ctx, isDragging, project }) {
    const {
      points,
      color = 'red',
      lineWidth = 2,
      renderWhileDragging = true,
    } = this.props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach((point) => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  }

  render() {
    return <CanvasOverlay redraw={this._redraw.bind(this)} />;
  }
}

PolylineOverlay.propTypes = {
  points: PropTypes.array,
  color: PropTypes.string.isRequired,
  lineWidth: PropTypes.number,
  renderWhileDragging: PropTypes.bool,
};
