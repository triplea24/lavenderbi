import React, { Component } from 'react';
import AddDashboard from './Components/AddDashboard'
import AddDataset from './Components/AddDataset'
import DatasetList from './Components/DatasetList'
import Dashboard from './Components/Dashboard'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import './App.css';

class App extends Component {
  componentDidMount() {
  }
  render() {
    return (
    	<Router>
    		<div>
    			<Route exact path="/dataset-list" component={DatasetList}/>
    			<Route exact path="/dataset-add" component={AddDataset}/>
          <Route exact path="/dashboard-new" component={AddDashboard}/>
          <Route exact path="/dashboards/:dashboardId" component={Dashboard}/>
    		</div>
      	</Router>
      // <h1 id="page-header" className="page-header">Dashboard</h1>
      // <DatasetOverview dataset="Cras justo odio" datasetId="59af3c30a2be6228d74ae01f" engine="postgres"/>
    );
  }
}

export default App;
