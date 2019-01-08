when = (function() {
   sleep=function(timeout) {
       window.open("javascript:document.writeln('<script>window.setTimeout(function () { window.close(); }, " + timeout + ");<\/script>');");
   };
	defer = function() {
		var promiseObj=null;
		var runCount=0;
		promise=function(){

			while(null==promiseObj&&runCount<300)
			{
				
				sleep(200);
				runCount+=1;
			}
		
			return promiseObj;
		};
		resolve=function(input){
			promiseObj=input;
		};
		return {
			promise: promise,
			resolve: resolve
		};
	};
	return {
		defer: defer
	}

})();