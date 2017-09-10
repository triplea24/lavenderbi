import React, { Component } from 'react';
import ChartOverview from './ChartOverview';
import ChooseDatasetField from './ChooseDatasetField'
import { 
	List,ListItem,Grid,
	Cell,Badge,Dialog,
	Button,DialogTitle, 
	DialogContent, DialogActions,
	ListItemContent,ListItemAction,
	Checkbox,Radio,Tabs,Tab,RadioGroup
} from 'react-mdl';
import AddChart from './AddChart'
import $ from 'jquery';

const sampleData = [{
	"name": "Elephant SQL",
	"nodeType": "dataset",
	"isParent": true,
	"nodeId": 0,
	"type": "",
	"childs": [{
		"name": "ts_test",
		"nodeType": "table",
		"isParent": true,
		"nodeId": 1,
		"type": "",
		"childs": [{
			"name": "title",
			"nodeType": "column",
			"isParent": false,
			"nodeId": 2,
			"type": "text"
		}, {
			"name": "id",
			"nodeType": "column",
			"isParent": false,
			"nodeId": 3,
			"type": "integer"
		}]
	}]
}];

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  }
};

const chartAPIId = "http://localhost:8080/api/chart/";
const dashboardAPI = "http://localhost:8080/api/dashboards/";

class AddDashboard extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	chartModalIsOpen: false,
	    	activeTabId: 1,
	    	chartId: 1,
	    	charts: {},
	    };

	    this.handleInputChange = this.handleInputChange.bind(this);
	    this.handleSave = this.handleSave.bind(this);
	    this.openChartModal = this.openChartModal.bind(this);
	    this.handleAddChartClick = this.handleAddChartClick.bind(this);
	    this.onItemCLick = this.onItemCLick.bind(this);

	    this.onDialogClose = this.onDialogClose.bind(this);
	    this.onDialogCancel = this.onDialogCancel.bind(this);
	    this.onDialogSubmit = this.onDialogSubmit.bind(this);
	    this.onDeleteChart = this.onDeleteChart.bind(this);
	       
	    this.dashboard = {};
	}
	onDialogClose(){
		var state = this.state;
		state.chartModalIsOpen = false;
		this.setState(state);
	}
	onDialogCancel(){

	}
	onDialogSubmit(res){
		var state = this.state;
		state.charts[res.id] = res;
		this.setState(state);
	}
	openChartModal(){
		var state = this.state;
		state.chartModalIsOpen = true;
		state.chartId++;
		this.setState(state);
	}
  	handleAddChartClick(event){
  		event.preventDefault();
  		console.log(event);
  		this.openChartModal();
  	}
	handleInputChange(event) {
	    const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;
	    this.dashboard[name] = value;
	}
	onItemCLick(event){
		const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;
	}
	handleSave(event){
		var dashboard = this.dashboard;
		var valid = dashboard.name != undefined && dashboard.name!= "";
		dashboard.charts = [];
		Object.keys(this.state.charts).map((key)=>{
			var chart = this.state.charts[key];
			dashboard.charts.push(chart);
		});
		if(!valid)
			event.preventDefault();
		else{
			$.ajax({
		      type: "POST",
		      url: dashboardAPI,
		      dataType: 'json',
		      data: dashboard,
		      cache: false,
		      success: function(data) {
		      	console.log(data);
		      	if(data.success){
		      		console.log("Success");
					var url = "/dashboards/" + data.id; 
					window.location.replace(url);
		      	}else{
		      		// TODO: Show an error
		      	}
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }
		    .bind(this)});
			event.preventDefault();
		}
	}
	onDeleteChart(chartId){
		var state = this.state;
		var url = chartAPIId + chartId;
		console.log("on Delete " + chartId );
		if(state.charts[chartId]!== undefined){
			delete state.charts[chartId];
			console.log(state.charts);
			return this.setState(state);
			// TODO: If I want to remove from the API database I should use lines below
			$.ajax({
		      type: "DELETE",
		      url: url,
		      dataType: 'json',
		      cache: false,
		      success: function(data) {
		      	console.log(data);
		      	if(data.success)
		      		console.log("Redirect!");
		      }.bind(this),
		      error: function(xhr, status, err) {
		        console.error(this.props.url, status, err.toString());
		      }
		    .bind(this)});
		}
	}
  render() {
  	var charts = Object.keys(this.state.charts).map((key)=>{
  		var chart = this.state.charts[key];
  		return <ChartOverview onDelete={this.onDeleteChart} key={chart.id} name={chart.name} chartId={chart.id} type={chart.type} />;
  	});
    return (
    	<div>
      		<AddChart type="map" onClose={this.onDialogClose} onCancel={this.onDialogCancel} onSubmit={this.onDialogSubmit} open={this.state.chartModalIsOpen} chartId={this.state.chartId}/>
      		<h1 id="page-header" className="page-header">New Dashboard</h1>
      		<form onSubmit={this.handleSave}>
	      		<div className="form-group">
				    <label htmlFor="dashboardName">Dashboard Name</label>
				    <input type="text" className="form-control" id="dashboardName" aria-describedby="dashboardNameHelp" placeholder="Untitled Dashbaord" name="name" onChange={this.handleInputChange} ></input>
				 	<small id="dashboardNameHelp" className="form-text text-muted">{"Please pick out a name for your dashbaord"}</small>
				</div>
				<ul className="list-group">
					<li className="list-group-item">
		    		 	<a href="#" onClick={this.handleAddChartClick}>
		    		 	<span className="glyphicon glyphicon-plus" aria-hidden="true"></span></a>
		    		 	&nbsp; &nbsp;
		    		 	{"Add a new Chart"}
		    		</li>
		        	{charts}
		        </ul>	
			  	<button type="submit" className="btn btn-primary">Submit</button>
      		</form>
      	</div>
    );
  }
}

export default AddDashboard;
