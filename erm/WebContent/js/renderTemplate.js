function renderTemplate(){
	
	this.tmpl_cache = {};
	
	this.render = function(tmpl_name) {
	    if ( !this.tmpl_cache ) { 
	       this.tmpl_cache = {};
	    }

	    if ( ! this.tmpl_cache[tmpl_name] ) {
	        var tmpl_dir = '/erm/templates';
	        var tmpl_url = tmpl_dir + "/" + tmpl_name + '.html';

	        var tmpl_string = "";
	        $.ajax({
	            url: tmpl_url,
	            method: 'GET',
	            async: false,
	            dataType : 'html',
	            success: function(data) {
	            	tmpl_string = data;
	            },
	            error : function(xhr,status,message){
	            	console.log("ERROR RETRIEVING TEMPLATE : %o",message);
	            }
	        	
	        });
	        this.tmpl_cache[tmpl_name] = tmpl_string;
	        return tmpl_string;
	    }
	    else {
	    	return this.tmpl_cache[tmpl_name];
	    }
	    
	};
	
	/**
	 * Retrieve the template and if necessary bind the template data 
	 * @param template
	 * @param templateData
	 * @param templateContainer
	 * @returns {renderTemplate}
	 */
	this.renderTemplate = function(template, templateData, templateContainer){
		var ew = "";
		var errorWindowTemplate = this.render(template);
		if(templateData){
			var theTemplate = Handlebars.compile(errorWindowTemplate);
			ew = theTemplate(templateData);			
		}
		else {
			ew = errorWindowTemplate;
		}
		templateContainer.html(ew);
	};
}

var renderTemplateObject = new renderTemplate();