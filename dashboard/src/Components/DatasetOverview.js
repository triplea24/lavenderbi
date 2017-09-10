import React, { Component } from 'react';
import { withRouter } from 'react-router';

import $ from 'jquery';

const datsetAPIPath = "http://localhost:8080/api/datasets/"

class DatasetOverview extends Component {
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
		var url = datsetAPIPath+this.props.datasetId;
		// return console.log(url);
		$.ajax({
	      type: "DELETE",
	      url: url,
	      dataType: 'json',
	      // data: body,
	      cache: false,
	      success: function(data) {
	      	console.log(data);
	      	if(data.success)
	      		console.log("Redirect!");
	        // this.setState({data: data}); // Notice this
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }
	    .bind(this)});
	}
  render() {
    return (
    	<div>
    		 <li className="list-group-item">
    		 	<span className="badge">{ this.props.engine }</span>
    		 	<a href="#" onClick={this.handleEditButtonClick}><span className="glyphicon glyphicon-edit" aria-hidden="true"></span></a>
    		 	&nbsp;
    		 	<a href="#" onClick={this.handleDeleteButtonClick}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></a>
    		 	&nbsp; &nbsp;
    		 	{this.props.dataset} 
    		 </li>
      	</div>
    );
  }
}


// export default withRouter(DatasetOverview);
export default DatasetOverview;
