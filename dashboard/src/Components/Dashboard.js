import React, { Component } from 'react';
import Chart from './Chart'
import $ from 'jquery';
import _ from 'lodash-joins'

const dashboardAPI = "http://localhost:8080/api/dashboards/";

class Dashboard extends Component {
	constructor(props) {
	    super(props);
      this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
      this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
      
      this.params = this.props.match.params;
      this.dashboardId = this.params.dashboardId;
      this.state = {
        dashboard: {charts:[]},
        datasets: {},
      }
  }
  componentDidMount() {
    var url = dashboardAPI + this.dashboardId;
    $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            cache: true,
            success: function(data) {
              if(data.success){
                var state = this.state;
                state.dashboard = data;
                this.setState(state);
              }
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }
          .bind(this)});
    url = 'http://localhost:8080/api/datasets/';
    $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            cache: true,
            success: function(data) {
              var state = this.state;
              state.datasets = data;
              this.setState(state);
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }
          .bind(this)});
  }
	handleEditButtonClick(e){
		e.preventDefault();
	}
	handleDeleteButtonClick(e) {
		e.preventDefault();
		var url = dashboardAPI + this.props.chartId;
		var onDeleteListener = this.props.onDelete;
		if(onDeleteListener !== undefined){
			onDeleteListener(this.props.chartId);
		}
		return console.log(url);
	}

  render() {

    var charts = this.state.dashboard.charts.map((chart)=>{
      const datasets = this.state.datasets;
      var tables = [];
      Object.keys(chart.fields).map((key,index)=>{
        tables.push([]);
        var name = key;
        var field = chart.fields[key];
        var datasetName = field.dataset;
        var table = field.table;
        var column = field.column;
        var dataset = _.find(datasets,(d)=>{
          return d.dataset == datasetName;
        });
        if(dataset!== undefined){
          var values = dataset.datas[table];
          values.map((v)=>{
            var param = {};
            param[name] = v[column];
            param['id'] = v['id'];
            tables[index].push(param);
          });
        }
      });
      var accessor = function (obj) {
        // TODO: It can be find out dynamically
        return obj['id'];
      };
      console.log(tables);
      var data = tables[0];
      for(var i = 1 ; i < tables.length ; i++){
        data = _.hashInnerJoin(data, accessor, tables[i], accessor);
      }
      return(
        <div key={chart.id} className="col-md-12">
          <Chart type={chart.type} name={chart.name} data={data}/>
        </div>
      );
    });
    return (
    	<div>
        <h1 id="page-header" className="page-header">{this.state.dashboard !== undefined && this.state.dashboard.name}</h1>
    	  <div className="row">
          {charts}
        </div>
      </div>
    );
  }
}

export default Dashboard;
