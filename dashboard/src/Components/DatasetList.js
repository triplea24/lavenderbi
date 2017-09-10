import React, { Component } from 'react';
import DatasetOverview from './DatasetOverview';
import $ from 'jquery';

// const datasetPath = "";
const datasetPath = "http://localhost:8080/api/datasets/";


class DatasetList extends Component {
  constructor(props) {
      super(props);
      // updateState([],"Not Loaded");
      this.state = {datasets: [],status: "Not Loaded"};
      this.updateState = this.updateState.bind(this);
      this.updateStatus = this.updateStatus.bind(this);
  }
  updateState(datasets,status){
    this.setState({datasets: datasets,status: status});
  }
  updateStatus(status){
    var datasets = this.state.datasets;
    this.updateState(datasets,status);
  }
  componentDidMount() {
    this.updateStatus("Loading");
    $.ajax({
            type: "GET",
            url: datasetPath,
            dataType: 'json',
            cache: true,
            success: function(data) {
              console.log(JSON.stringify(data));
              this.updateState(data,"Loaded");
            }.bind(this),
            error: function(xhr, status, err) {
              this.updateState([],"Loaded");
              console.error(this.props.url, status, err.toString());
            }
          .bind(this)});
  }

  componentWillUnmount() {
    // clearInterval(this.timerID);
  }
  render() {

    var datasetsList = this.state.datasets.map(function(set,index){
                        return <DatasetOverview key={index} dataset={set.dataset} datasetId={set._id} engine={set.engine}/>
                      })
          // <DatasetOverview dataset="Cras justo odio" datasetId="59af3c30a2be6228d74ae01f" engine="postgres"/>
    var content;
    switch(this.state.status){
      case "Not Loaded":
        content = <li className="list-group-item well"><span>Preparing...</span></li>;
        break;
      case "Loading":
        content = <li className="list-group-item well"><span>Loading...</span></li>;
        break;
      default:
        var datasets = this.state.datasets;
        content = <li className="list-group-item well"><span>{"You don't have any dataset yet, please add one!"}</span></li>;
        if(datasets.length !== 0)
          content = "";
    }
    return (
      <div>
         <h1 id="page-header" className="page-header">My datasets</h1>
         <ul className="list-group">
          {content === "" ? datasetsList : content}
         </ul>	 
      </div>
    );
  }
}

export default DatasetList;
