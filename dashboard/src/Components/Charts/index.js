import Map from './Map';
export const Charts = {Map};

var res = {};
Object.keys(Charts).map((key)=>{
	var Element = Charts[key];
	res[Element.description.name] = Element.description;
});
export const ChartTypes = res;