import React, { Component } from 'react';
import * as d3 from 'd3';
import GeoData from './components/geo-data';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null
    };
  }

  componentDidMount() {
    d3.json("geo-data.json", (error, data) => {
      if (error) throw error;
      this.setState({ data });
    })
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
          />
        </div>
      </div>
    );
  }
}

export default App;
