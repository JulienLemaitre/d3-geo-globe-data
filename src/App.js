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
  }

  onImpactOver(d) {
    console.log(d3.event, d);
    clearTimeout(this.timer);
    console.log("mouse over");
    this.setState({ tooltipData: d.properties })
  }

  onImpactOut() {
    this.timer = setTimeout( () => {
      console.log("mouseout");
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
