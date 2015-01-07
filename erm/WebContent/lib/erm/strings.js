if (!String.prototype.format) {
	String.prototype.format = function () {
	  var args = arguments;
	  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
	};
};
if (!String.prototype.lpad) {
	String.prototype.lpad = function(padString, length) {
	    var str = this;
	    while (str.length < length)
	        str = padString + str;
	    return str;
	};
}
if (!String.prototype.escapeToJSON) {
	String.prototype.escapeToJSON = function() {
	    return this.replace(/\n/g, "\\n")
	    .replace(/\\'/g, "\\'")
	    .replace(/\\"/g, "\\")
	    .replace(/\\&/g, "\\&")
	    .replace(/\\r/g, "\\r")
	    .replace(/\t/g, "\\t")
	    .replace(/\\b/g, "\\b")
	    .replace(/\\f/g, "\\f");

		
//	    return this.replace(/\\n/g, "\\n")
//	               .replace(/\\'/g, "\\'")
//	               .replace(/\\"/g, "\\")
//	               .replace(/\\&/g, "\\&")
//	               .replace(/\\r/g, "\\r")
//	               .replace(/\\t/g, "\\t")
//	               .replace(/\\b/g, "\\b")
//	               .replace(/\\f/g, "\\f");
	};	
}