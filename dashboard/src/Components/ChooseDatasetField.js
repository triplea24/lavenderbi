import React, { Component } from 'react';
import $ from 'jquery';
const style={
	"listStyleType": "none",
};
class DatasetNode extends Component{
	constructor(props) {
	    super(props);
	   	this.state = {open: false};
	    this.handleToggleClick = this.handleToggleClick.bind(this);
  	}
  	handleToggleClick(event){
  		var state = this.state;
  		var open = state['open'];
  		open = !open;
  		state.open = open;
  		this.setState(state);
  	}
  	render(){
  		var content;
  		var name = this.props.name;
  		var nodeType = this.props.nodeType;
  		var isParent = this.props.isParent;
  		var nodeId = this.props.nodeId;
  		var type = this.props.type;
  		var childs = this.props.childs;
  		var expandIcon = null;
      var disabled = this.props.expectedType.find((t)=>{return t===type}) === undefined;
      var selected = this.props.selected;
      var label = name + (isParent ? "" : " (" + type + ")");
      var checked = (selected == nodeId) ? true : false; 
  		if(isParent){
	  		var expandIcon =  this.state.open ? "glyphicon glyphicon-envelope" : "glyphicon glyphicon-plus";
  		}
  		let childContent = null;
  		if(isParent && childs.length > 0){
  			childContent = this.state.open ? <ChooseDatasetField parent={name} chartFieldName={this.props.chartFieldName} selected={this.props.selected} onClickCheckbox={this.props.onClickCheckbox} data={childs} expectedType={this.props.expectedType}/> : null;
  		}else{
  			childContent = <input type="checkbox" disabled={disabled} checked={checked} onClick={this.props.onClickCheckbox} name={this.props.chartFieldName} value={nodeId}></input>;
  		}
  		return (
			<li>{isParent && childs.length > 0 && 
				<a href="#" onClick={this.handleToggleClick}><span className={expandIcon}></span></a>
			}
			{label}
			{childContent}</li>
  		);
  	}
}

class ChooseDatasetField extends Component {
	constructor(props) {
	    super(props);
	    this.selectedCheckbox = null;
	    this.onClickCheckbox = this.onClickCheckbox.bind(this);
  	}
  	onClickCheckbox(event){
	    this.props.onClickCheckbox(event);
  	}
  render() {
  	var data = this.props.data;
  	var content;
  	var content = data.map((node)=>{
  		return <DatasetNode parent={node.name} key={node.nodeId} chartFieldName={this.props.chartFieldName} selected={this.props.selected} onClickCheckbox={this.onClickCheckbox} name={node.name} nodeType={node.nodeType} isParent={node.isParent} nodeId={node.nodeId} type={node.type} childs={node.childs} expectedType={this.props.expectedType}/>
  	});
    return (
		 <ul style={style}>
		 	{content}
		 </ul>
    );
  }
}

export default ChooseDatasetField;
