import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import GeoData from './components/geo-data';
import Tooltip from './components/tooltip';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      land: null,
      tooltipData: null
    };

    this.onImpactOver = this.onImpactOver.bind(this);
    this.onImpactOut = this.onImpactOut.bind(this);
  }

  componentDidMount() {
    d3.json("geo-data.json", (error, result) => {
      if (error) throw error;

      const data = _.orderBy(result.features, [d => d.properties.mass, 'desc']);
      // console.log("result:",result,"data:", data);
      this.setState({ data });
    });
    d3.json("ne_110m_land3.json", (error, land) => {
      if (error) throw error;

      this.setState({ land });

      // world-map.json
      // land = topojson.feature(worldData, worldData.objects.land);
      // countries = topojson.mesh(worldData, worldData.objects.countries, function (a, b) {
      //   return a !== b;
      // });

    });
  }

  onImpactOver(d) {
    console.log(d3.event, d);
    clearTimeout(this.timer);
    console.log("mouse over");
    this.setState({ tooltipData: d.properties })
  }

  onImpactOut() {
    console.log("mouseout");
    this.timer = setTimeout( () => {
      console.log("mouseout timer");
    }, 1000 );

  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>D3 Geo Globe Data</h1>
        </div>
        <div className="App-body">
          <GeoData
            data = {this.state.data}
            land = {this.state.land}
            onImpactOver = {this.onImpactOver}
            onImpactOut = {this.onImpactOut}
          />
          <Tooltip
            data = {this.state.tooltipData}
          />
        </div>
      </div>
    );
  }
}

export default App;
