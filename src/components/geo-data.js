import React, {Component} from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

class GeoData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    const { data } = nextProps;
    const width = 900;
    const height = 600;

    console.log(data);

    let projection = d3.geoOrthographic()
      // .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    let svg = d3.select(this.svg)
      .style('width', width)
      .style('height', height);

    d3.json("ne_110m_land3.json", (error, world) => {
      if (error) throw error;

      svg.selectAll("path")
        .data(world.features)
        .enter().append("path")
        .attr("d", path);

      svg.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr('d', path);
    });


    // Canvas

    // var context = d3.select("canvas").node().getContext("2d"),
    //   path = d3.geoPath(d3.geoOrthographic(), context);
    //
    // d3.json("https://unpkg.com/world-atlas@1/world/110m.json", (error, world) => {
    //   if (error) throw error;
    //
    //   context.beginPath();
    //   path(topojson.mesh(world));
    //   context.stroke();
    // });

    return false;
  }

  render() {
    return (
      <div className="chart">
        <svg ref={(svg => this.svg = svg)}></svg>
        {/*<canvas width="960" height="500"></canvas>*/}
      </div>
    );
  }
}

export default GeoData;