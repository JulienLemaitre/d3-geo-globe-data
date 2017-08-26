import React, {Component} from 'react';
import * as d3 from 'd3';
// import * as topojson from 'topojson-client';

class GeoData extends Component {

  shouldComponentUpdate(nextProps) {
    this.drawChart(nextProps);
    return false;
  }

  drawChart(newProps) {
    const { data, land } = newProps;

    if (data && land) {
      const appBody = document.getElementsByClassName("App-body")[0];
      const width = appBody.offsetWidth;
      const height = appBody.offsetHeight;
      let scale = 300;
      let timer;
      const tooltip = document.getElementById("tooltip");
      const name = tooltip.querySelector(".name");
      const mass = tooltip.querySelector(".mass");
      const year = tooltip.querySelector(".year");
      const recclass = tooltip.querySelector(".recclass");

      // Projection
      let projection = d3.geoEquirectangular()
        .scale(scale)
        .translate([width / 2,height / 2]);
      let path = d3.geoPath(projection);

      // Scale
      const massExtent = d3.extent(data, d => +(d.properties.mass));

      const massScale = d3.scalePow()
        .domain(massExtent)
        .range([scale / 250, scale / 2])
        .exponent(.6);

      let svg = d3.select(this.svg);
      let g = svg.append("g");

      // Zoom

      svg.call(d3.zoom()
        .scaleExtent([0.7, 10])
        .translateExtent([[-width / 4,-height / 4], [width * 5 / 4 , height * 5 / 4]])
        .on("zoom", zoomed));

      function zoomed() {
        g.attr("transform", d3.event.transform);
      }

      function onImpactOver(d) {
        clearTimeout(timer);
        const time = d.properties.year.split("-")[0];
        let point = d3.select(d3.event.target);
        point.attr('class', 'point active');
        name.innerHTML = d.properties.name;
        mass.innerHTML = d.properties.mass;
        year.innerHTML = time;
        recclass.innerHTML = d.properties.recclass;
        tooltip.className = "active";
      }

      function onImpactOut() {
        let point = d3.select(d3.event.target);
        point.attr('class', "point visited");
        timer = setTimeout( () => {
          tooltip.className = "";
        }, 200 );
      }

      function update() {

        g.selectAll("defs").remove();
        g.selectAll("use").remove();
        g.selectAll("path").remove();

        g.append("defs").append("path")
          .datum({type: "Sphere"})
          .attr("id", "sphere")
          .attr("d", path);

        g.append("use")
          .attr("class", "stroke")
          .attr("xlink:href", "#sphere");

        g.append("use")
          .attr("class", "fill")
          .attr("xlink:href", "#sphere");

        if (land) {
          g.insert("path", ".graticule")
            .datum(land)
            .attr("class", "land")
            .attr("d", path);

          // svg.insert("path", ".graticule")
          //   .datum(countries)
          //   .attr("class", "boundary")
          //   .attr("d", path);
        }

        g.selectAll("path")
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
          .on("mouseover", d => onImpactOver(d))
          .on("mouseout", d => onImpactOut(d));
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
        <div id="tooltip">
          <div className="name">
          </div>
          <div className="mass">
          </div>
          <div className="year">
          </div>
          <div className="recclass">
          </div>
        </div>
      </div>
    );
  }
}

export default GeoData;