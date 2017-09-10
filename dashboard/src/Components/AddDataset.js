import React, { Component } from 'react';
import $ from 'jquery';

const datasetPath = "http://localhost:8080/api/datasets/";

class AddPostgresDataset extends Component{
	constructor(props) {
	    super(props);
	    // this.parent = this._reactInternalInstance._currentElement._owner._instance;
	    // this.parent.state = {};
	    this.handleInputChange = this.handleInputChange.bind(this);
  	}
  	handleInputChange(event) {
	    var parent = this._reactInternalInstance._currentElement._owner._instance;
	    const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;

	    parent.setState({
	      [name]: value
	    });
  	}
	render(){
		return (
			<div>
				<div className="form-group">
				    <label htmlFor="databaseName">Database Name</label>
				    <input 
				    	type="text" className="form-control" 
				    	id="databaseName" name="name" 
				    	aria-describedby="databaseNameHelp" placeholder="players" 
				    	onChange={this.handleInputChange} ></input>
				</div>
				<div className="form-group">
					<label htmlFor="userName">User</label>
				    <input 
				    	type="text" className="form-control" 
				    	id="userName" name="user"  
				    	aria-describedby="userNameHelp" 
				    	placeholder="RR Martin"
				    	onChange={this.handleInputChange}>
				    </input>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
				    <input 
				    	type="password" className="form-control" 
				    	id="password" name="pass" 
				    	placeholder="WinterIsComing!"
				    	onChange={this.handleInputChange} >
				    </input>
				</div>
				<div className="form-group">
					<label htmlFor="host">Host</label>
				    <input 
				    	type="text" className="form-control" 
				    	id="host" name="host" 
				    	aria-describedby="hostHelp" 
				    	placeholder="localhost (Don't use this!!!)"
				    	onChange={this.handleInputChange} >
				    </input>
				</div>
				<div className="form-group">
					<label htmlFor="port">Port</label>
				    <input 
				    	type="number" className="form-control" 
				    	id="port" name="port" 
				    	aria-describedby="hostHelp" 
				    	placeholder="25"
				    	onChange={this.handleInputChange} >
				    </input>
				</div>
			</div>
		);
	}
}

class AddDataset extends Component {
	constructor(props) {
	    super(props);
	    this.state = {};

	    this.handleInputChange = this.handleInputChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
  	}
  	handleInputChange(event) {
	    const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;

	    this.setState({
	      [name]: value
	    });
  	}
	// TODO: If props.type == "postgres"
	handleSubmit(event) {
		console.log();
		if(this.state['dataset'] == undefined)
			this.state['dataset'] = this.state['name'];
	    event.preventDefault();
	    // TODO: POST request to store the datasets
	    this.state['engine'] = "postgres";
	    var body = this.state;
	    $.ajax({
	      type: "POST",
	      url: datasetPath,
	      dataType: 'json',
	      data: body,
	      cache: false,
	      success: function(data) {
	      	console.log(data);
	      	if(data.success){
	      		var url = "/dataset-list/"; 
				window.location.replace(url);	
	      	}else{
	      		alert("An error occured!");
	      	}
	      }.bind(this),
	      error: function(xhr, status, err) {
	        // alert("An error occured!");
	        console.error(this.props.url, status, err.toString());
	      }
	    .bind(this)});
  	}
  render() {
    return (
    	<div>
      		<h1 id="page-header" className="page-header">New Dataset</h1>
      		<form onSubmit={this.handleSubmit}>
			  <div className="form-group">
			    <label htmlFor="datasetName">Dataset Name</label>
			    <input type="text" className="form-control" id="datasetName" aria-describedby="datasetNameHelp" placeholder="GOT Players" name="dataset" onChange={this.handleInputChange} ></input>
			 	<small id="datasetNameHelp" className="form-text text-muted">{"It'll be database name if you leave it blank!"}</small>
			  </div>
			  <AddPostgresDataset/>
			  <button type="submit" className="btn btn-primary">Submit</button>
			</form>
      	</div>
    );
  }
}

export default AddDataset;