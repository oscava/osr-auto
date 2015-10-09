var Class = require("osr-class");

var debug = require("debug")("auto");

var fs = require("fs");

global.__models = {};
global.__services = {};
global.__controllers = {};

global.M = function( name ){
	return global.__models[name];
}

global.C = function( name ){
	return global.__controllers[name];
}

global.S = function( name ){
	return global.__services[name];
}

var Auto = Class.extends({
	$:function(){
		
	},
	//启动
	start:function( path ){
		this.path = path;
		this.loadModels();
		this.loadControllers();
		this.loadServices();
	},
	//加载model
	loadModels:function(){
		var _this = this;
		this.ergodicDir(this.path+"/models").forEach(function( item, index){
			var name = item.replace(_this.path,"").replace(/\//g,".").replace(".models.","").replace(".js","");
			var names = name.split(".");
			if("index" == names[names.length-1]){
				name = names.slice(0,names.length-1).join(".");
			}
			debug("load model",name,item);
			global.__models[name] = require( item );
		});
	},
	//加载controller
	loadControllers:function(){
		this.ergodicDir(this.path+"/controllers").forEach(function( item, index ){
			var name = item.replace(_this.path,"").replace(/\//g,".").replace(".controllers.","").replace(".js","");
			var names = name.split(".");
			if("index" == names[names.length-1]){
				name = names.slice(0,names.length-1).join(".");
			}
			debug("load controller",name,item);
			global.__controllers[name] = require( item );
		});
	},
	//加载service
	loadServices:function(){
		this.ergodicDir(this.path+"/services").forEach(function( item, index ){
			var name = item.replace(_this.path,"").replace(/\//g,".").replace(".services.","").replace(".js","");
			var names = name.split(".");
			if("index" == names[names.length-1]){
				name = names.slice(0,names.length-1).join(".");
			}
			debug("load service",name,item);
			global.__services[name] = require( item );
		});
	},
	//遍历文件夹
	ergodicDir:function( dir ){
		var files = fs.readdirSync( dir );
		var _this = this;
		var result = [];
		files.forEach(function( item, index){
			var temppath = dir + "/" + item;
			if(fs.statSync(temppath).isDirectory()){
				_this.ergodicDir( temppath ).forEach(function(sub,index){
					result.push(sub);
				});
			}else{
				result.push( temppath );
			}
		});
		return result;
	}
});

module.exports = Auto;