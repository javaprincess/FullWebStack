function ProductDetail(){
	
	this.paths = paths();
	
	this.initializeElements = function(){
		
		this.initializeButtons();
	};		
	
	this.initializeButtons = function(){
		var that = this;
//		$("#productFileNumberButton").off('click');
//		$("#productFileNumberButton").on('click', function(){
//			that.saveProductFileNumber();
//		});
		
//		$("#productFileNumberButtonDelete").off('click');
//		$("#productFileNumberButtonDelete").on('click', );
	};
	
	//AMV deprecate this
	this.saveProductFileNumber = function(){
		var scope = angular.element(document.getElementById("rightsController")).scope(); //.foxVersionId
		var foxVersionId = scope.foxVersionId;
		var pfn = $("#productFileNumberInput").val();
		if(pfn){
			var select = document.getElementById("centralFileNumberSelector");
			var opts = select.options;			
			var splitInput = pfn.split(",");
			var passedArray = new Array(); 	
			//var iChars = "~`!#$%^&@*+=-[]\\\';,/{}|\":<>?";
			for (var i=0; i < splitInput.length; i++) {
			  //for (var j = 0; j < splitInput[i].length; j++) {
			    //if (iChars.indexOf(splitInput[i].charAt(j)) != -1) {
				  //errorPopup.showErrorPopupWindow("Your central file number has special characters ~`!#$%^&@*+=-[]\\\';,/{}|\":<>? <BR/><BR/>These are not allowed<BR/><BR/>");
			      //return false;
			    //}			    
			  //}	
			  if (splitInput[i].trim().length > 200) {
				errorPopup.showErrorPopupWindow("You have entered a central file number that is greater than 200 characters.");
				return;
			  } else if ($.inArray(splitInput[i].trim(), passedArray) > -1) {
				errorPopup.showErrorPopupWindow("You have entered the same central file number twice.");
				return;
			  } else {
				passedArray.push(splitInput[i].trim());
			  }				
			}				
			for(var opt=0; opt < opts.length; opt++) {
			  for (var i=0; i < splitInput.length; i++) {			
			    if (splitInput[i].trim() == opts[opt].text) {
				  errorPopup.showErrorPopupWindow("That central file number already exists for this product.");
			      return;
			    }			    
			  }			  
			}			
			pfn = pfn.replace("&", "%26");
			var queryString = "q="+JSON.stringify(pfn)+"&foxVersionId="+foxVersionId;
			var url = this.paths.getSaveProductFileNumber();
			$("#productFileNumberButton").html('<i class="icon-spinner icon-spin"></i> Adding');
			$.post(url, queryString, function(data){
				$("#productFileNumberButton").html('<i class="icon-plus-sign"></i> Add');
				$("#productFileNumberInput").val('');
				scope.currentProductArray.productFileNumbers = data;
				if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
				  scope.$apply();
			}).fail(function(xhr,status,message){
				$("#productFileNumberButton").html('<i class="icon-plus-sign"></i> Add');
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
		else {
			errorPopup.showErrorPopupWindow("You must enter a file number before clicking the Save button");
		}
	};		
	
	/**
	 * 
	 */
	this.checkSessionHeartBeat = function(){
		$.getJSON(this.paths.getSessionHeartBeatCheck(), function(data){
			
		}).fail(function(xhr,status,message){
			erm.sessionManagement.redirectToLogin();
		});;
	};
}

//TMA memory leak -- same pattern of using object.getPrototypeOf();
//var productDetailObject = object.getPrototypeOf(ProductDetail());
var productDetailObject = new ProductDetail();