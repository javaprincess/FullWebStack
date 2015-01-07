function kendoElementUtil(){
	
	/**
	 * returns a configured kendo date picker
	 */
	this.getKendoDatePicker = function(datePickerId, footerValue, formatValue, startValue, parseFormatValue, onChange, dataSourceField){
		$("#"+datePickerId).kendoDatePicker({
       		footer: footerValue,
       		format : formatValue,
       		parseFormats : [parseFormatValue],
       		start : startValue,
       		change : onChange
        });
		var datePicker = $("#"+datePickerId).data("kendoDatePicker");
		if(onChange){			
			//datePicker.bind("change", onChange);
		}		
		return datePicker;
	};
	
	/**
	 * returns a configured kendo combo box
	 */
	this.getKendoComboBox = function(comboBoxId, textField, valueField, template, onChange, dataSourceField){
		$("#"+comboBoxId).kendoComboBox({
            filter:"startswith",
            dataTextField: textField,
            dataValueField: valueField,
            template: template	                
        });	
		
		var comboBox = $("#"+comboBoxId).data("kendoComboBox");
		if(onChange){
			comboBox.bind("change", onChange);
		}
		
		if(dataSourceField){
			comboBox.setDataSource(dataSourceField);
		}
		return comboBox;
	};
	
	
	/**
	 * returns a configured kendo drop down list
	 */
	this.getKendoDropDownList = function(dropDownListId, textField, valueField, template, onChange, dataSourceField){
		
		$("#"+dropDownListId).kendoDropDownList({
            filter:"startswith",
            autoBind : true,
            dataTextField: textField,
            dataValueField: valueField,
            template: template
        });
		var dropDownList = $("#"+dropDownListId).data("kendoDropDownList");
		if(onChange){
			dropDownList.bind("change", onChange);
		} 
		
		if(dataSourceField){
			dropDownList.setDataSource(dataSourceField);
		}
		return dropDownList;
	};
	
	/**
	 * returns a configured kendo multi select box
	 */
	this.getKendoMultiSelect = function(multiSelectId, textField, valueField, template, onChange, dataSourceField){
		$("#"+multiSelectId).kendoMultiSelect({
            filter:"startswith",
            dataTextField: textField,
            dataValueField: valueField,
            itemTemplate: template
        });
		
		var multiSelect = $("#"+multiSelectId).data("kendoMultiSelect");
		if(onChange){
			multiSelect.bind("change", onChange);
		}
		if(dataSourceField){
			multiSelect.setDataSource(dataSourceField);
		}
		return multiSelect;
	};
	
	/**
	 * returns a configured kendo tree view
	 */
	this.getKendoTree = function(treeId, textField, valueField, onChange, dataSourceField){
		$("#"+treeId).kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
            dataTextField: [textField],
            dataValueField : valueField
        });
		
		var tree = $("#"+treeId).data("kendoTreeView");
		if(dataSourceField){
			tree.setDataSource(dataSourceField);
		}
		
		if(onChange){
			tree.dataSource.bind("change", onChange);
		}
		return tree;
	};
	
	/**
	 * returns a configured Selector tree
	 */
	this.getSelectorTree = function(treeId, accumulatorField, addField, removeField, textField, valueField, dataSourceField){
		var tree = null;
		if(accumulatorField && addField && removeField){
			$("#"+treeId).kendoHierarchySelector({
				dataSource : dataSourceField,
				add : addField,
				remove : removeField,
				accumulator : accumulatorField,
				id : valueField,
				text : textField
			});
			
		}
		else {
			$("#"+treeId).kendoHierarchySelector({
				dataSource : dataSourceField,
				id : valueField,
				text : textField
			});
		}
		
		tree = $("#"+treeId).data("kendoHierarchySelector");
		return tree;
	};
	
	/**
	 * 
	 */
	this.getSelectorTreeWithOptions = function(treeId, accumulatorField, addField, removeField, textField, valueField, dataSourceField){
		var tree = null;
		$("#"+treeId).kendoHierarchySelector({
			dataSource : dataSourceField,
			add : addField,
			remove : removeField,
			accumulator : accumulatorField,
			id : valueField,
			text : textField
		});		
		
		tree = $("#"+treeId).data("kendoHierarchySelector");
		return tree;
	};
	
	this.getKendoInfoCodeTree = function(treeId, accumulatorAdd, accumulatorRemove, addFieldAdd, removeFieldAdd, addFieldRemove, removeFieldRemove, textField, valueField, dataSourceField){
		var tree = null;
		$("#"+treeId).kendoInfoCodeSelector({
			dataSource : dataSourceField,
			addToAdd : addFieldAdd,
			removeFromAdd : removeFieldAdd,
			addToRemove : addFieldRemove,
			removeFromRemove : removeFieldRemove,
			accumulatorAdd : accumulatorAdd,
			accumulatorRemove : accumulatorRemove,
			value : valueField,
			text : textField
		});
		
		tree = $("#"+treeId).data("kendoInfoCodeSelector");
		return tree;
	};
	
}

var infoCodeUtil = {
		
		buildInfoCodeDataSource : function(data){
			var gridDataSource =new Array();
			if(data){
				$.each(data, function(idx, element){
					var ob = new Object();
					ob.code = element.code;
					ob.id = element.id;
					ob.restrictionTypeId = element.restrictionTypeId;
					ob.restrictionTypeName = element.restrictionTypeName;
					ob.description = element.description;
					ob.startDate = "";
					ob.endDate = "";
					er.allowEndDateFlag = element.allowEndDateFlag;
					er.allowStartDateFlag = element.allowStartDateFlag;
					gridDataSource.push(ob);
				});
			}
			return gridDataSource;
		},
		
		addDatesToDataSource : function(gridDataSource, resObject){
			var dsArray = new Array();
			if(gridDataSource ){
				if(resObject && resObject.restrictions){
					$.each(gridDataSource, function(idx, element){					
						$.each(resObject.restrictions, function(iddx, elem){
							if(elem.restrictionCodeId == element.id){
								element.startDate = elem.getCorrectStartDateForDisplay();
								element.endDate = elem.getCorrectEndDateForDisplay();
							}
						});
						dsArray.push(element);
					});
				}
				else {
					dsArray = gridDataSource;
				}
				
			}
			
			return dsArray;
		},
		
		getRestrictionObject : function(accumulNodes, resObject){
			
			if(accumulNodes){
				
				if(resObject && resObject.restrictions){
					var resArray = new Array();
					$.each(accumulNodes, function(idx, element){
						var bool = false;
						$.each(resObject.restrictions, function(id, elem){
							if(elem.restrictionCodeId == element.id){								
								bool = true;
							}
						});
						if(!bool){
							resArray.push(new restriction(element.id, "", "", "", "", ""));
						}
					});
					resObject.restrictions = resObject.restrictions.concat(resArray);
				}
				else {
					
					$.each(accumulNodes, function(idx, element){
						 var res = new restriction(element.id, "", "", "", "", "");
						 resObject.restrictions.push(res);
					});
				}
			}
		},
		
		
		populateProductVersionInfo : function(angularScope){
			var ia = new Array();
			var formatedDate = null;
			if(angularScope){
				   $("#sse_productTitlePopup").html(angularScope.currentProductArray.productTitle);
				   $("#ssse_productCode").html(angularScope.currentProductArray.productCode);
				   $("#ssse_productTypeCode").html(angularScope.currentProductArray.productTypeDesc);				   
				   formatedDate = erm.Dates.getFormatedReleaseDate(angularScope.currentProductArray.firstReleaseDate);
				   $("#ssse_firstReleaseDate").html(formatedDate);
				   $("#ssse_productionYear").html(angularScope.currentProductArray.productionYear);
				   $("#ssse_currentFoxId").html(angularScope.currentProductArray.foxId);
				   $("#ssse_currentFoxVersionId").html(angularScope.currentProductArray.foxVersionId);
				   $("#ssse_currentFoxIdJDE").html(angularScope.currentProductArray.jdeId);
			}
			return ia;
		}
};

var rightStrandCopyResponseType = {
		STRANDS_IDS : "strandsIds",
		MULTI_PRODUCT_RESPONSE : "multiProductResponse"
};