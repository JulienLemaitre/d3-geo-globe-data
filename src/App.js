import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import GeoData from './components/geo-data';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      land: null,
      tooltipData: null
    };
  }

  componentDidMount() {
    d3.json("geo-data.json", (error, result) => {
      if (error) throw error;

      const data = _.orderBy(result.features, [d => d.properties.mass, 'desc']);
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

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>D3 Geo - Meteorites Falls on Earth</h1>
        </div>
        <div className="App-body">
          <GeoData
            data = {this.state.data}
            land = {this.state.land}
          />
        </div>
      </div>
    );
  }
}

export default App;
