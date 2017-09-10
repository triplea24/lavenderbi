const express = require('express');
const bodyParser= require('body-parser');
const mongo = require('mongodb');
const cors = require('cors')
const MongoClient = mongo.MongoClient;
const ejs = require('ejs');
const pg = require('pg');
const util = require('util');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/css', express.static('css'));

var whitelist = [
    'http://localhost:3000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));

var db;

console.log("Start connecting to mongo server");
MongoClient.connect('mongodb://amir:1q2w3e4r5t@ds123534.mlab.com:23534/lavenderbi', (err, database) => {
	if (err) return console.log(err);
	console.log("Connected succesfully");
	db = database;
	app.listen(8080,()=>{
		console.log("May node be with you");
	});
	app.get('/', (req, res) => {
	  res.sendFile(__dirname + '/index.html');
	});
	function connectToPg(name,user,pass,host,port,onSuccess,onError){
		var connectionString = util.format("postgres://%s:%s@%s:%d/%s",user,pass,host,port,name);
		var client = new pg.Client(connectionString);
		// console.log(connectionString);
		client.connect()
		  .then(() => {
		  		onSuccess(client); 	
		  })
		  .catch(err => {
		  		onError(err);
		  		client.end();
		  });
	}
	app.post('/api/datasets/', (req, res) => {
		var engine = req.body.engine;
		var valid = false;
		if(engine == "postgres"){
			var name = req.body.name;
			var user = req.body.user;
			var pass = req.body.pass;
			var host = req.body.host;
			var port = req.body.port;
			connectToPg(name,user,pass,host,port,(client)=>{
				var tablesQueryString = "SELECT information_schema.tables.table_name,ordinal_position,column_name,data_type,is_nullable FROM information_schema.columns INNER JOIN information_schema.tables ON information_schema.tables.table_name = information_schema.columns.table_name WHERE information_schema.tables.table_schema = 'public'  AND table_type='BASE TABLE'";
				var tableQuery = client.query(tablesQueryString,(err,result)=>{
					if(err)
			  			res.send({success:false,error:err.message});
			  		console.log(result);
					var tables = {};
					for(var i = 0 ; i < result.rows.length ; i++){
						var row = result.rows[i];
						var table_name = row.table_name;
						if(tables[table_name]==undefined){
							tables[table_name] = {name:table_name,columns:[]};
						}
						var column = {
							index: row.ordinal_position,
							name: row.column_name,
							type: row.data_type,
							"null": row.is_nullable == "YES" ? true : false, 
						};
						tables[table_name].columns.push(column);
					}
					var datas={};
					var length = Object.keys(tables).length;
					Object.keys(tables).map((key,index) => {
						var table = tables[key];
						console.log(table);
						var query = "SELECT * FROM " + table.name + " LIMIT 100";
						client.query(query,(err,result)=>{
							if (err) return res.send({success:false,error:err.message});
							datas[table.name] = [];
							for(var i = 0 ; i < result.rows.length ; i++){
								var row = result.rows[i];
								var data = {};
								for(var j = 0 ; j < table.columns.length ; j++){
									var col = table.columns[j];
									var val = row[col.name];
									console.log(col);
									data[col.name] = val;
								}
								console.log(data);
								datas[table.name].push(data);
							}
							if(index+1 == length){
								client.end();
								db.collection('datasets').save(req.body, (err, result) => {
									if (err) return res.send({success:false,error:err.message});
									var id = result.ops[0]._id;
									var response = {
										success: true,
										id: id,
										tables: tables,
										datas: datas,
									};
								    res.send(response);
								});
							}
						});
					});
	  			});
			},(err)=>{
				console.log(err.message);
			  	return res.send({success:false,error:err.message});
			});
		}
	});
	app.get('/api/datasets/', (req, res) => {
		db.collection('datasets').find().toArray(function(err, results) {
			var error;
			var datasetLength = results.length;
			results.map((item,itemidx)=>{
				var name = item.name;
				var user = item.user;
				var pass = item.pass;
				var host = item.host;
				var port = item.port;
				connectToPg(name,user,pass,host,port,(client)=>{
					var tablesQueryString = "SELECT information_schema.tables.table_name,ordinal_position,column_name,data_type,is_nullable FROM information_schema.columns INNER JOIN information_schema.tables ON information_schema.tables.table_name = information_schema.columns.table_name WHERE information_schema.tables.table_schema = 'public'  AND table_type='BASE TABLE'";
					var tableQuery = client.query(tablesQueryString,(err,result)=>{
						error = err; 
						item.tables = {};
						for(var i = 0 ; i < result.rows.length ; i++){
							var row = result.rows[i];
							var table_name = row.table_name;
							if(item.tables[table_name]==undefined){
								item.tables[table_name] = {name:table_name,columns:[]};
							}
							var column = {
								index: row.ordinal_position,
								name: row.column_name,
								type: row.data_type,
								"null": row.is_nullable == "YES" ? true : false, 
							};
							item.tables[table_name].columns.push(column);
						}
						item.datas={};
						var length = Object.keys(item.tables).length;
						Object.keys(item.tables).map((key,index) => {
							var table = item.tables[key];
							var query = "SELECT * FROM " + table.name + " LIMIT 100";
							client.query(query,(err,result)=>{
								error = err;
								if(err)return;
								item.datas[table.name] = [];
								for(var i = 0 ; i < result.rows.length ; i++){
									var row = result.rows[i];
									var data = {};
									for(var j = 0 ; j < table.columns.length ; j++){
										var col = table.columns[j];
										var val = row[col.name];
										console.log(col);
										data[col.name] = val;
									}
									console.log(data);
									item.datas[table.name].push(data);
								}
								results[itemidx].tables = item.tables;
								results[itemidx].datas = item.datas;
								if(index+1 == length){
									db.collection('datasets').update({_id:item._id},item, (err, result) => {
										error = err;
										if(itemidx+1 === datasetLength){
											client.end();
											if (error) 
												return res.send({success:false,error:error.message});
											else{
												results.success = true;
												return res.send(results);
											}
										}
									});
								}
							});
						});
		  			});
				},(err)=>{
				  	error = err;
				});
			});
		});
	});
	app.put('/api/datasets/', (req, res) => {
		// Check the access level
	 //  	db.collection('datasets').find().toArray(function(err, results) {
		// 	res.send(results);
		// });
	});
	app.delete('/api/datasets/', (req, res) => {
		// Check the access level
	 //  	db.collection('datasets').find().toArray(function(err, results) {
		// 	res.send(results);
		// });
	});

	app.get('/api/datasets/:datasetId',(req,res)=>{
		var id = req.params.datasetId;
		if(id == null)res.send({success:false,error:"Id is invalid"});
		try{
			var o_id = new mongo.ObjectID(id);	
		}catch(err){
			res.send({success:false,error:err.message});
		}
		var query = {_id:o_id};
		db.collection('datasets').findOne(query,(err,item)=>{
			if(err){
				err.success = false;
				res.send(err);
			} 
			if(item == null)return res.send("Item is null!");
			item['success'] = true;
			var name = item.name;
			var user = item.user;
			var pass = item.pass;
			var host = item.host;
			var port = item.port;
			// console.log(item);
			connectToPg(name,user,pass,host,port,(client)=>{
				var tablesQueryString = "SELECT information_schema.tables.table_name,ordinal_position,column_name,data_type,is_nullable FROM information_schema.columns INNER JOIN information_schema.tables ON information_schema.tables.table_name = information_schema.columns.table_name WHERE information_schema.tables.table_schema = 'public'  AND table_type='BASE TABLE'";
				var tableQuery = client.query(tablesQueryString,(err,result)=>{
					if(err)
			  			res.send({success:false,error:err.message});
					item.tables = {};
					for(var i = 0 ; i < result.rows.length ; i++){
						var row = result.rows[i];
						var table_name = row.table_name;
						if(item.tables[table_name]==undefined){
							item.tables[table_name] = {name:table_name,columns:[]};
						}
						var column = {
							index: row.ordinal_position,
							name: row.column_name,
							type: row.data_type,
							"null": row.is_nullable == "YES" ? true : false, 
						};
						item.tables[table_name].columns.push(column);
					}
					item.datas={};
					var length = Object.keys(item.tables).length;
					Object.keys(item.tables).map((key,index) => {
						var table = item.tables[key];
						// client.end();
						// return res.send(table);
						console.log(table);
						var query = "SELECT * FROM " + table.name + " LIMIT 100";
						client.query(query,(err,result)=>{
							if (err) return res.send({success:false,error:err.message});
							item.datas[table.name] = [];
							for(var i = 0 ; i < result.rows.length ; i++){
								var row = result.rows[i];
								var data = {};
								for(var j = 0 ; j < table.columns.length ; j++){
									var col = table.columns[j];
									var val = row[col.name];
									console.log(col);
									data[col.name] = val;
								}
								console.log(data);
								item.datas[table.name].push(data);
							}
							if(index+1 == length){
								client.end();
								// res.send(result);
								db.collection('datasets').update({_id:item._id},item, (err, result) => {
									if (err) return res.send({success:false,error:err.message});
								    res.send(item);
								});
							}
						});
					});
	  			});
			},(err)=>{
				console.log(err.message);
			  	res.send({success:false,error:err.message});
			});

		});
	});
	app.delete('/api/datasets/:datasetId',(req,res)=>{
		// TODO: Check the access level
		var id = req.params.datasetId;
		if(id == null)res.send({success:false,error:"Id is invalid"});
		try{
			var o_id = new mongo.ObjectID(id);	
		}catch(err){
			res.send({success:false,error:err.message});
		}
		var query = {_id:o_id};
		db.collection('datasets').deleteOne(query,(err,item)=>{
			if(err){
				err.success = false;
				res.send(err);
			} 
			res.send({success:true});
		});
	});
	app.post('/api/dashboards/',(req,res)=>{
		// return res.send({success: true,body: req.body});
		db.collection('dashboards').save(req.body, (err, result) => {
				if (err) return res.send({success:false,error:err.message});
				var id = result.ops[0]._id;
				var response = {
					success: true,
					id: id,
				};
			    res.send(response);
		});
	});
	app.get('/api/dashboards/', (req, res) => {
		// Check the access level
	  	db.collection('dashboards').find().toArray(function(err, results) {
			res.send(results);
		});
	});
	app.get('/api/dashboards/:dashboardId', (req, res) => {
		// res.send(req.body);
		var id = req.params.dashboardId;
		if(id == null)res.send({success:false,error:"Id is invalid"});
		try{
			var o_id = new mongo.ObjectID(id);	
		}catch(err){
			res.send({success:false,error:err.message});
		}
		var query = {_id:o_id};
		db.collection('dashboards').findOne(query,(err,item)=>{
			if(err){
				err.success = false;
				res.send(err);
			} 
			if(item == null)return res.send("Item is null!");
			item.success = true;
			res.send(item);
		});
	});

	

});
