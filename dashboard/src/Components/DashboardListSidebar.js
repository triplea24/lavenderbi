import React, { Component } from 'react';
import DatasetOverview from './DatasetOverview';
import $ from 'jquery';

// const datasetPath = "";
const dashboardsAPIPath = "http://localhost:8080/api/dashboards/";


class DashboardListSidebar extends Component {
  constructor(props) {
      super(props);
      this.state = {dashboards: []};
      this.updateState = this.updateState.bind(this);
  }
  updateState(key,value){
    var state = this.state;
    state[key] = value;
    this.setState(state);
  }
  componentDidMount() {
    $.ajax({
            type: "GET",
            url: dashboardsAPIPath,
            dataType: 'json',
            cache: true,
            success: function(data) {
              this.updateState("dashboards",data);
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }
          .bind(this)});
  }

  componentWillUnmount() {
  }
  render() {

    var dashboards = this.state.dashboards.map(function(dashboard,index){
                        return <li key={index}><a href={'/dashboards/' + dashboard._id}>{dashboard.name}</a></li>;
                      })
    return (
        <ul className="well nav collapse" id="btn-dashboard-list" role="menu">
          <li><a href="/dashboard-new/"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span> New Dashboard</a></li>
          {dashboards}
        </ul>
    );
  }
}

export default DashboardListSidebar;
