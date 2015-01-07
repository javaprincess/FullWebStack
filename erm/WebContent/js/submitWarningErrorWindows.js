function errorPopupWindow(){
	
	this.initializeErrorWindow = function initializaErrorWindow(){
		if (!$("#errorPopupWindow").data("kendoWindow")) {
			$("#errorPopupWindow").kendoWindow({
                width: "750px",
                height : "300px",
                minWidth : "750px",
                minHeight : "300px",
                title: "",
                actions: [
                    "Close"
                ],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                }
            });
        }
		globalErrorWindow = $("#errorPopupWindow").data("kendoWindow");
	};
	
	this.bindCloseButton = function(){
		$("#errorCloseButton").click(function(){
			globalErrorWindow.close();
		});
	};

	/**
	 * 
	 * @param textToShow
	 */
	this.showErrorPopupWindow = function showErrorPopupWindow(textToShow){
		$("#errorParagraph").html(textToShow);
		var d = $("#errorPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	/**
	 * 
	 */
	this.init = function(){
		this.initializeErrorWindow();
		this.bindCloseButton();
	};
		
}

function successPopupWindow(){
	this.callbackObject = null;
	
	this.initializeSuccessWindow = function(){
		if (!$("#successPopupWindow").data("kendoWindow")) {
			$("#successPopupWindow").kendoWindow({
                width: "750px",
                height : "300px",
                minWidth : "750px",
                minHeight : "300px",
                title: "",
                actions: [
                    "Close"
                ],
                visible : false,
                close : function(){
                	$("#successParagraph").html("");
                }
            });
        }
		globalSuccessWindow = $("#successPopupWindow").data("kendoWindow");
	};
	
	this.bindCloseButton = function(){
		var that = this;
		$("#successCloseButton").click(function(){
			globalSuccessWindow.close();
			if(that.callbackObject){
				that.callbackObject.processCallback();
				that.callbackObject = null;
			}
		});
	};

	/**
	 * 
	 * @param textToShow
	 */
	this.showSuccessPopupWindow = function (textToShow){
		$("#successParagraph").html(textToShow);
		var d = $("#successPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.showSuccessWithCallbackPopupWindow = function (textToShow, callbackObject){
		this.callbackObject = callbackObject;
		$("#successParagraph").html(textToShow);
		var d = $("#successPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	/**
	 * 
	 */
	this.init = function(){
		this.initializeSuccessWindow();
		this.bindCloseButton();
	};
		
}

var errorPopup = new errorPopupWindow();
var globalErrorWindow = null;

var successPopup = new successPopupWindow();
var globalSuccessWindow = null;
