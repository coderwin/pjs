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
"use strict";
// 异步流程控制器
var Pjs = (function(){
	// 多个异步队列共存
	var uid = 0;
	// 异步队列map
	var bmap = {};
	// 单个异步队列的事件map，trigger事件的时候 会查询每一个事件相关异步队列
	var pmap = {};

	return {
		/**
		 * 建立异步队列
		 * @param  {Array/String} - 需要等待的异步事件队列
		 * @param  {Function} - 异步队列完成后执行的回调函数
		 * @param  {Object} - 回调函数执行上下文
		 */
		when: function(queue, callback, context){
			// 处理传入的异步队列为String的特殊情况
			if(typeof queue == "string") {
				((queue.split(",").length==1) 
					? (queue = [queue]) 
					: (queue = queue.split(",")));
			}
			// 每一个异步队列里面会包含
			// 回调函数，
			// 还没完成的(padding)事件，
			// 回调函数参数值，以及回调函数执行上下文
			bmap[++uid] = {
				callback: callback,
				pending: queue.slice(0), // 复制数组 queue.concat()
				pendingVal: {},
				context: (context||global)
			};
			// 为每一个事件添加 事件相关异步队列
			for (var i = 0; i < queue.length; i++) {
				// 可能存在多个when 等待同一个事件
				pmap[queue[i]] = pmap[queue[i]] || [];
				pmap[queue[i]].push(uid)
			}
		},
		/**
		 * 触发事件完成
		 * @param  {string} - 出发的事件名
		 * @param  {any} - 时间完成的回调值
		 */
		trigger: function(evt, val){
			var res, i, index, pendingVal;

			// 循环查找事件相关的每一个异步队列(when)
			for (i = 0; i < pmap[evt].length; i++) {
				// 把当前事件从padding中删掉
				res = bmap[pmap[evt][i]];
				index = res.pending.indexOf(evt);/*es5 sham*/
				res.pending.splice(index,1);

				//并把当前事件的值传入当前异步队列的paddingVal
				res.pendingVal[evt] = val;

				// 检查当前事件对应的异步队列when是否全部完成
				if (!res.pending.length) {
					pendingVal = res.pendingVal;
					// 全部完成之后删除异步when
					delete bmap[pmap[evt][i]]

					// 执行回调函数【异步执行】
					/**
					 *  var pjs = require('pjs');
					 *	pjs.when(['A'], function(){
					 *	    // A is done!!
					 *	    console.log(2);
					 *	});
					 *	$.getJSON(url1, function(data){
					 *	    // An ajax request
					 *	    pjs.trigger('A');
					 *	    console.log(1);
					 *	});
					 *	// 1应该比2先输出
					 */
					setTimeout(function(){
						res.callback.call(res.context, pendingVal)
					},0)
				}
			}
		}
	}
}());
// alias
Pjs.on = Pjs.bind = Pjs.when;
Pjs.fire = Pjs.trigger;
return Pjs
}))