import React, { Component } from 'react';
import * as d3 from 'd3';

class Tooltip extends Component {

  componentDidUpdate() {
    let tooltip = d3.select("#tooltip");
    const { tooltipOn } = this.props;

    if (tooltipOn) {
      tooltip
        .transition()
        .duration(100)
        .style('opacity', 0.9);
    } else {
      tooltip
        .transition()
        .duration(400)
        .style('opacity', 0);
    }
  }

  render() {

    const { date, gdp, left, top } = this.props;
    const tooltipStyle = {
      left: (left + 20) + "px",
      top: (top - 20) + "px"
    };

    return (
      <div id="tooltip" style={tooltipStyle}>
        <div className="gdp">
          {gdp}
        </div>
        <div className="date">
          {date}
        </div>
      </div>
    );
  }
}

export default Tooltip;