"use strict";
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS之类的
        module.exports = factory();
    } else {
        // 全局变量(root 即 window)
        root.PJS = factory();
    }
}(this, function () {

var Pjs = (function(){
	var uid = 0, bmap = {}, pmap = {};
	return {when: function(queue, callback, context){
			if(typeof queue == "string") {
				((queue.split(",").length==1) ? (queue = [queue]) : (queue = queue.split(",")));
			}
			bmap[++uid] = {callback: callback,
				padding: queue.slice(0),
				context: (context||global)
			};
			for (var i = 0; i < queue.length; i++) {
				pmap[queue[i]] = pmap[queue[i]] || [];
				pmap[queue[i]].push(uid)
			}
		},
		trigger: function(evt){
			var res, i, index;
			for (i = 0; i < pmap[evt].length; i++) {
				res = bmap[pmap[evt][i]];
				index = res.padding.indexOf(evt);/*es5 sham*/
				res.padding.splice(index,1);
				if (!res.padding.length) {
					delete bmap[pmap[evt][i]]
					setTimeout(function(){
						res.callback.call(res.context)
					},0)
				}
			}
		}
	}
}());
Pjs.fire = Pjs.trigger;
return Pjs
}))