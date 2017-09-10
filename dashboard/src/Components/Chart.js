import React, { Component} from 'react';
import {Charts} from './Charts';
import _ from 'lodash';

class Chart extends Component {
	constructor(props) {
    super(props);
  }
  render() {
    var Element = _.startCase(_.lowerCase(this.props.type));
    Element = Charts[Element];
    return (
      <Element name={this.props.name} data={this.props.data} />
    );
  }
}

export default Chart;
