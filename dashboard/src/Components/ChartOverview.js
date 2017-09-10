import React, { Component } from 'react';
import $ from 'jquery';

const chartAPIId = "http://localhost:8080/api/chart/"

class ChartOverview extends Component {
	constructor(props) {
	    super(props);
	    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
  		this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
  	}
  	handleEditButtonClick(e){
  		e.preventDefault();
  	}
	handleDeleteButtonClick(e) {
		e.preventDefault();
		// console.log('The link was clicked.');
		var url = chartAPIId + this.props.chartId;
		var onDeleteListener = this.props.onDelete;
		if(onDeleteListener !== undefined){
			onDeleteListener(this.props.chartId);
		}
		return console.log(url);
	}
  render() {
    return (
    	<div>
    		 <li className="list-group-item">
    		 	<span className="badge">{ this.props.type }</span>
    		 	<a href="#" onClick={this.handleEditButtonClick}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
    		 	&nbsp;
    		 	<a href="#" onClick={this.handleDeleteButtonClick}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
    		 	&nbsp; &nbsp;
    		 	{this.props.name} 
    		 </li>
      	</div>
    );
  }
}

export default ChartOverview;
