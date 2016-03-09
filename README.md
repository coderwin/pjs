# 简易的异步流程控制器

## API

```javascript
var pjs = require("../src/pjs.js");

setTimeout(function(){
	pjs.trigger("A")
},1000)

setTimeout(function(){
	pjs.trigger("B")
},2000)

setTimeout(function(){
	pjs.trigger("C")
},1500)


pjs.when(["A", "B"], function(){
	console.log("A-B-Done!")
})

pjs.when(["A", "C"], function(){
	console.log("A-C-Done!")
})


//setTimeout可以换成ajax等一步操作
```