import React, {Component} from 'react';
import * as d3 from 'd3';
// import * as topojson from 'topojson-client';

class GeoData extends Component {

  shouldComponentUpdate(nextProps) {

    console.log("shouldComponentUpdate:", nextProps);
    this.drawChart(nextProps);

    return false;
  }

  drawChart(newProps) {

    const { data, land } = newProps;

    if (data && land) {
      const width = 960;
      const height = 600;
      const self = this;
      let scale = 200;

      // Projection
      let projection = d3.geoEquirectangular()
        .scale(scale);
      let path = d3.geoPath(projection);

      // Scale
      const massExtent = d3.extent(data, d => +d.properties.mass);

      const massScale = d3.scaleSqrt()
        .domain(massExtent)
        .range([scale / 100, scale / 3]);


      const graticule = d3.geoGraticule();

      let svg = d3.select(this.svg)
        .style('width', width)
        .style('height', height);

      function update() {
        // angle = (angle - 0.25) % 360;
        // projection.rotate([angle,-20,0]);

        svg.selectAll("defs").remove();
        svg.selectAll("use").remove();
        svg.selectAll("path").remove();

        svg.append("defs").append("path")
          .datum({type: "Sphere"})
          .attr("id", "sphere")
          .attr("d", path);

        svg.append("use")
          .attr("class", "stroke")
          .attr("xlink:href", "#sphere");

        svg.append("use")
          .attr("class", "fill")
          .attr("xlink:href", "#sphere");

        svg.append("path")
          .datum(graticule)
          .attr("class", "graticule")
          .attr("d", path);


        if (land) {
          svg.insert("path", ".graticule")
            .datum(land)
            .attr("class", "land")
            .attr("d", path);

          // svg.insert("path", ".graticule")
          //   .datum(countries)
          //   .attr("class", "boundary")
          //   .attr("d", path);
        }

        svg.selectAll("path")
          .data(data)
          .enter().append("path")
          .attr('class', 'point')
          .attr('data-mass', d => +d.properties.mass)
          .attr('d', d => {
            const mass = +d.properties.mass;
            const radius = massScale(mass);
            const dPath = d3.geoPath().pointRadius(radius).projection(projection);
            return dPath(d);
          })
          .on("mouseover", d => self.props.onImpactOver(d))
          .on("mouseout", self.props.onImpactOut);
      }

      update();

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

    }
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