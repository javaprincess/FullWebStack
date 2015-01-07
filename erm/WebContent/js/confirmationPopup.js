function confirmationPopup(){
	
	this.callbackFunction = null;
	this.confirmationCallbackObject = null;
	this.confirmationObjectWindow = null;
	
	this.initializeElement = function(){
		
		$(".whatever-confirmation-need-to-be-process").off("click");
		$(".whatever-confirmation-need-to-be-cancel").off("click");
		
		var that = this;
		
		$(".whatever-confirmation-need-to-be-process").on("click", function(){
			if(that.callbackFunction && $.isFunction(that.callbackFunction)){
				that.callbackFunction(that.confirmationCallbackObject);				
			}
			that.closePopup();
		});
		
		
		$(".whatever-confirmation-need-to-be-cancel").on("click", function(){
			that.closePopup();
		});
	};
	
	this.closePopup = function(){
		this.resetFields();
		confirmationObjectWindow.close();
	};
	
	this.resetFields = function(){
		$(".confirmationTextSection").html("");
    	$(".whatever-confirmation-need-to-be-process").html("Process");
    	this.callbackFunction = null;
    	this.confirmationCallbackObject = null;
	};
	
	
	this.openConfirmationWindow = function(confirmationLayerId, confirmationText, confirmationButtonText, commentId, callbackProcessor){
		this.resetFields();
		this.confirmationCallbackObject = commentId;
		this.callbackFunction = callbackProcessor;
		if (!$(confirmationLayerId).data("kendoWindow")) {
			$(confirmationLayerId).kendoWindow({
                width: "550px",
                height : "200px",
                minWidth : "550px",
                minHeight : "200px",
                title: "",
                actions: [
                    "Close"
                ],
                visible : false
            });
        }
		confirmationObjectWindow = $(confirmationLayerId).data("kendoWindow");	
		
		$(".confirmationTextSection").html(confirmationText);
		$(".whatever-confirmation-need-to-be-process").html(confirmationButtonText);
		
		
		confirmationObjectWindow.setOptions({
			visible : true,
			modal : true
		});
		confirmationObjectWindow.center();
		confirmationObjectWindow.open();
		
	};
	
}

var confirmationObjectWindow = null;