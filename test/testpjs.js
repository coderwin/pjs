var pjs = require("../src/pjs.js");

setTimeout(function(){
	pjs.trigger("A", "dataA")
},1000)

setTimeout(function(){
	pjs.trigger("B", "dataB")
},2000)

setTimeout(function(){
	pjs.trigger("C", "dataC")
},1500)



pjs.when(["A", "B"], function(valMap){
	/*把A和B的返回值传到回调函数里面*/
	console.log(valMap)
	console.log("A-B-Done!")
})


pjs.when(["A", "C"], function(valMap){
	console.log(valMap)
	console.log("A-C-Done!")
})


//setTimeout可以是ajax等异步操作