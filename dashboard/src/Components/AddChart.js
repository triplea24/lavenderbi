import React, { Component } from 'react';
import ChooseDatasetField from './ChooseDatasetField'
import {ChartTypes} from './Charts'
import { 
  List,ListItem,Grid,
  Cell,Badge,Dialog,
  Button,DialogTitle, 
  DialogContent, DialogActions,
  ListItemContent,ListItemAction,
  Checkbox,Radio,Tabs,Tab,RadioGroup,
  Textfield
} from 'react-mdl';
import $ from 'jquery';

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

class AddChart extends Component {
	constructor(props) {
	    super(props);
      var params;
      var chartType = ChartTypes.map.name;
      if(props.params !== undefined)
        params = props.params;
      else
        params = ChartTypes.map.params;
      var fields = this.createFields(params);
      var selectedField = this.selectedField;
      this.state = {
        open: true,
        selectedField: selectedField,
        chartType: chartType,
        chartId: 0,
        fields: fields,
        params: params,
        datas: [], 
        metaDatas: [], 
        chartTypes: ChartTypes,
      };
      this.closeDialog = this.closeDialog.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onCancel = this.onCancel.bind(this);
      this.afterOpenChartModal = this.afterOpenChartModal.bind(this);
      this.onChooseDatasetField = this.onChooseDatasetField.bind(this);
      this.onChooseCharField = this.onChooseCharField.bind(this);
      this.selectedDatasetField = null;
      this.onChangeChartType = this.onChangeChartType.bind(this);
      this.updateState = this.updateState.bind(this);
  	}
    createFields(params){
      var fields = {};
      for(var i = 0 ; i < params.length ; i++){
        var param = params[i];
        var field = {
          selected: null,
          checked: false,
          type: param.type,
          optional: param.optional,
          descrtption: param.descrtption,
        };
        fields[param.name] = field;
        if(i === 0)this.selectedField = param.name;
      }
      return fields;
    }
    closeDialog(){
      var onCloseListener = this.props.onClose;
      if(onCloseListener !== undefined){
        onCloseListener();
      }
    }
  onCancel() {
    this.closeDialog();  
    var onCancelListener = this.props.onCancel;
    if(onCancelListener !== undefined){
      onCancelListener();
    }
  }
  componentDidMount(){
    const url = 'http://localhost:8080/api/datasets/';
    $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            cache: true,
            success: function(data) {
              this.createDatas(data);
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }
          .bind(this)});
  }
  createDatas(data){
    var cnt = 0;
    var nodes = [];
    var res =  data.map((dataset,dix)=>{
      console.log(dataset);
      nodes.push([dix]);
      var d = {
        "name": dataset.dataset,
        "nodeType": "dataset",
        "isParent": true,
        "nodeId": cnt++,
        "id": dataset._id,
        "type": "",
      };
      d["childs"] = Object.keys(dataset.tables).map((key,tix)=>{
        var table = dataset.tables[key];
        nodes.push([dix,tix]);
        var t = {
          "name": table.name,
          "nodeType": "table",
          "isParent": true,
          "nodeId": cnt++,
          "type": "",
        };
        t["childs"] = Object.keys(table.columns).map((key,cix)=>{
          var column = table.columns[key];
          nodes.push([dix,tix,cix]);
          var c = {
            "name": column.name,
            "nodeType": "column",
            "isParent": false,
            "nodeId": cnt++,
            "type": column.type,
          };
          return c;
        });
        return t;
      });
      return d;
    });
    var state = this.state;
    state.datas = res;
    state.metaDatas = nodes;
    this.setState(state);
  }
  onSubmit(){
    var onSubmitListener = this.props.onSubmit;
    if(onSubmitListener !== undefined){
      var isValid = (this.chartName != "") && (this.chartName != null) ;
      var params = {};
      Object.keys(this.state.fields).map((key)=>{
        var field = this.state.fields[key];
        if(!field.optional && field.selected == null)
          isValid = false;
        var meta = this.state.metaDatas[field.selected];
        var data = this.state.datas;
        params[key] = {
          dataset: data[meta[0]].name,
          table: data[meta[0]].childs[meta[1]].name,
          column: data[meta[0]].childs[meta[1]].childs[meta[2]].name,
        };
      });
      var res = {
        name: this.chartName,
        id: this.props.chartId,
        type: this.state.chartType,
        fields: params,
      };
      if(isValid){
        console.log(res);
        onSubmitListener(res);
        this.closeDialog();  
      }
    }else{
      this.closeDialog();  
    }
  }

  afterOpenChartModal(){
    var onOpenListener = this.props.onOpen;
    if(onOpenListener !== undefined){
      onOpenListener();
    }
  }
  onChooseDatasetField(event){
    const target = event.target;
    const checked = target.checked;
    const name = target.name;
    const nodeId = target.value;
    console.log(checked);
    var state = this.state;
    if(this.selectedDatasetField !== null){
      state.fields[state.selectedField].selected = null;
    }
    if(checked){
      this.selectedDatasetField = target;
      state.fields[state.selectedField].selected = nodeId;
    }
    state.fields[state.selectedField].checked = checked;
    this.setState(state);
  }
  onChooseCharField(event){
    var target = event.target;
    var state = this.state;
    state.selectedField = target.value;
    this.setState(state);

  }
  updateState(key,val){
    var state = this.state;
    state[key] = val;
    this.setState(state);
  }
  onChangeChartType(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    var state = this.state;
    state.chartType = value;
    var params = this.state.chartTypes[value].params;
    state.params = params;
    var fields = this.createFields(params);
    state.fields = fields;
    var selectedField = this.selectedField;
    state.selectedField = selectedField;
    this.setState(state);
  }
  render() {
    var dialogStyle = { width: '800px' , height: 'auto'};
    var params = this.state.params;
    var types = Object.keys(this.state.chartTypes).map((key)=>{
      var type = this.state.chartTypes[key];
      var name = type.name;
      var label = type.label;
      return (
        <Radio key={name} value={name} ripple>{label}</Radio>
      );
    });
    var radios = params.map((param)=>{
      return (
        <Radio key={param.name} value={param.name} ripple>
        <ListItem twoLine>
          <ListItemContent subtitle={param.descrtption}>{param.name} ({param.type})</ListItemContent>
          <ListItemAction>
            <Checkbox checked={this.state.fields[param.name].checked} disabled />
          </ListItemAction>
        </ListItem>
        </Radio>
      );
    });
    return (
		      <Dialog style={dialogStyle} open={this.props.open}>
            <DialogTitle>Choose a chart to draw</DialogTitle>
            <DialogContent>
              <Textfield
                onChange={(event) => {this.chartName = event.target.value }}
                label="Chart Name"
                floatingLabel
                style={{width: '200px'}}/>
              <p> Chart Type : </p>
              <RadioGroup onChange={this.onChangeChartType} name="chart" value={this.state.chartType}>
                {types}
              </RadioGroup>
              <hr/>
              <Grid className="demo-grid-ruler">
                <Cell col={5}>
                <RadioGroup onChange={this.onChooseCharField} container="List" childContainer="ListItem" name="fields" value={this.state.selectedField}>
                  {radios}
                </RadioGroup>
                </Cell>
                <Cell col={7}>
                  <Tabs activeTab={this.state.activeTabId} onChange={(tabId) => this.setState({ activeTabId: tabId })} ripple>
                        <Tab>Datasets</Tab>
                    </Tabs>
                    <section>
                        <ChooseDatasetField chartFieldName={this.state.selectedField} onClickCheckbox={this.onChooseDatasetField} data={this.state.datas} expectedType= {this.state.fields[this.state.selectedField].type} selected={this.state.selectedField !== null ? this.state.fields[this.state.selectedField].selected : null}/>
                    </section>
                </Cell>     
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button type='button' onClick={this.onSubmit}>Submit</Button>
              <Button type='button' onClick={this.onCancel}>Cancel</Button>
            </DialogActions>
          </Dialog>
    );
  }
}

export default AddChart;
