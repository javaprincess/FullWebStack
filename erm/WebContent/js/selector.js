//this is a custom component
(function($){
	var kendo = window.kendo;
	var ui = kendo.ui;
	var Widget = ui.Widget;
	var CHANGE = "change";
	var padText = true;

	var isIE = function() {
		if (navigator.appName==='Microsoft Internet Explorer') {
			return true;
		}
		return false;
	};

	if (isIE()) {
		//padText=false;
	}
	
//***************************
	function Util(textField,valueField) {
		this.textField = textField;
		this.valueField=valueField;	
		this.accumulatorSortArray = new Array();
		this.setValueAndTextField = function(valueField,textField) {				
			this.valueField=valueField;
			this.textField=textField;
		};
		this.getValue = function(element) {
			var valueField = this.valueField;
			return element[valueField];
		};
		this.getText=function(element){
			var textField = this.textField;
			return element[textField];
		};

		this.toTitleCase = function(str) {
			if(str){
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			}
			else {
				return "";
			}
		};
		
		this.populateSelector= function(selector,data,level) {
			var that = this;
			this.removeElements(selector);
			var populateSelector = function(selector,data,level) {
				if (!level) {
					level=0;
				}
				$.each(data,function(idx,element){
					element.displayFlag = true;
					var s = element.text;
					if(!s){
						s = that.getText(element); 
					}
					if (padText && s != null) {
						s=that.pad(s,level); //that.pad(that.toTitleCase(s),level);
					}
					var id = that.getValue(element);
					var option = $('<option title="' + s + '" class="level' + level + '" value="' + id + '">' + s + '</option>');
					selector.append(option);
					if (element.items&&element.items.length>0) {
						populateSelector(selector,element.items,level+1);
					}

				});
			};
			populateSelector(selector,data,0);

		};
		
		this.populateSelectorAlt= function(selector,data,level) {
			var that = this;
			this.removeElementsFromAccumulatorOnly(selector);
			var populateSelectorAlt = function(selector,data,level) {
				if (!level) {
					level=0;
				}
				$.each(data,function(idx,element){
					
					var s = element.text;						
					if(!s){						
						s = element.code.toUpperCase() + " - " + that.toTitleCase(element.description);							
					}
					if (padText) {
						s=that.pad(s,level); //that.pad(that.getText(element),level);						
					}
					var id = that.getValue(element);
					var option = $('<option title="' + s + '" class="level' + level + '" value="' + id + '">' + s + '</option>');
					if(element.displayFlag){						
						option.removeClass("selectorSelectedRow");
						option.attr("disabled", false);	
						option.css("background-color", "#ffffff");
					}
					else {
						if(isIE()){
							option = $('<option title="' + s + '" class="level' + level + '" value="' + id + '" style="background-color : #c1e6c8;">' + s + '</option>');
						}						
						option.addClass("selectorSelectedRow");
						option.attr("disabled", true);
					}
					
					selector.append(option);						
					
					
					if (element.items&&element.items.length>0) {
						populateSelectorAlt(selector,element.items,level+1);
					}
				});
			};
			populateSelectorAlt(selector,data,0);
			if(isIE()){
				//IE does not refresh the select box upon updating, so we manually force the focus back on the select box
				selector.focus();
			}
		};
		
		this.processDataSourceAlt = function(dataSource, ids) {
			var data = dataSource.data();
			var processDataSource = function(data) {
				
				$.each(data,function(idx,element){										
					var id = element.id;					
					if(ids.indexOf(id) > -1){
						element.displayFlag = false;
					}
					else {
						element.displayFlag = true;
					}
					if (element.items&&element.items.length>0) {
						processDataSource(element.items);
					}					
				});
			};
			processDataSource(data);
		};
				
		this.getSelectedValues= function(selector) {
			var selected = this.getSelected(selector);
			var values = [];
			$.each(selected,function(idx,element){
				values.push(element.value);
			});
		};

		this.getSelected= function(selector) {
			var selected=[];
			selector=$(selector);
			selector.find(":selected").each(function(idx,element){
				selected.push({value:parseInt(element.value),text:element.text});
			});
			return selected;

		};

		this.getValuesFromElements= function(elements) {
			var values = [];
			$.each(elements,function(idx,element){
				return values.push(element.value);
			});
			return values;
		};

		this.getValues= function(selector) {
			var values=[];
			selector.find("option").each(function(idx,element){
				values.push(parseInt(element.value));
			});
			return values;
		};
		this.add= function(selector,accumulator) {
			var that = this;
			var selected = this.getSelected(selector);	
			var accumulatorValues = this.getValues(accumulator);
			$.each(selected,function(idx,element){
				if($.inArray(element.value, accumulatorValues) < 0){
					that.accumulatorSortArray.push($.trim(element.text)+"@"+element.value);
					//accumulator.append($("<option value='" + element.value +"'>" + $.trim(element.text) + "</option>"));					
				}				
			});
			
			this.accumulatorSortArray.sort();
			this.removeElementsFromAccumulatorOnly(accumulator);
			$.each(this.accumulatorSortArray, function(id, elem){
				var index = elem.lastIndexOf("@");
				var text = elem.substring(0, index);
				var value = elem.substring(index+1);
				accumulator.append($("<option title='"+$.trim(text)+"' value='" + value +"'>" + $.trim(text) + "</option>"));			
			});
			
		};

		this.getElementsFromDS= function(ds,values) {
			var that = this;
			var accumulateElementsFromData= function(data,values,accumulator) {
				if (data==null||data.length==0) return;
				$.each(data,function(idx,element) {
				var id = that.getValue(element);
				if ($.inArray(id,values)>=0) {
					accumulator.push(element);
				}
				accumulateElementsFromData(element.items,values,accumulator);
				});
			};
			var data = ds.data().toJSON();
			var elements =[];
			accumulateElementsFromData(data,values,elements);
			return elements;
		};



		this.addValuesToAccumulator= function(ds,selector,values) {
			//first get the elements from the ds that match the values
			var elements = this.getElementsFromDS(ds,values);				
			var that=this;	
			$.each(elements,function(idx,element){
				var id = that.getValue(element);
				var text = that.getText(element);
				var option = null;
				if ($.inArray(id,values)>=0) {
					that.accumulatorSortArray.push(text+"@"+id);
					//option = "<option value='"+ id +"'>"+text +"</option>";					
					//selector.append(option);
				}
			});
			
			this.accumulatorSortArray.sort();
			$.each(this.accumulatorSortArray, function(id, elem){
				var index = elem.lastIndexOf("@");
				var text = elem.substring(0, index);
				var value = elem.substring(index+1);
				selector.append($("<option value='" + value +"'>" + $.trim(text) + "</option>"));
			});
			
		};
		this.remove= function(selector,accumulator) {
			var that = this;
			var selected = accumulator.find(":selected").each(function(idx,element){
				var st = $(element).text()+"@"+$(element).val();
				that.accumulatorSortArray.splice(that.accumulatorSortArray.indexOf(st), 1);
				$(element).remove();
				
				//TMA remove and detach
				$(element).detach();
			});
		};
		this.clear= function(selector) {
			var selected = selector.find(":selected").each(function(idx,element){
				$(element).removeAttr("selected");
			});				
		};

		this.select= function(selector,values) {
			this.clear(selector);
			$(selector).find("option").each(function(idx,element){
				var id = parseInt(element.value);
				if ($.inArray(id,values)>=0){
					if(!$(element)[0].disabled){						
						element.selected=true;
					}
				}
			});
			
			
		};

		this.removeElements= function(selector) {
			this.accumulatorSortArray = null;
			this.accumulatorSortArray = new Array();
			/*
			if(isIE()){
				
				console.log(" USING IE PATH ");
				if($(selector) && $(selector)[0] && $(selector)[0].options){
					$(selector)[0].options.length = 0;
				}
				
				//$(selector).empty();
			}
			else {
				console.log(" USING CHROME PATH ");
				$(selector).find("option").remove();
			}
			*/
			/*
			var options = $(selector).find("option");
			if(options && options.length > 0){
				$.each(options, function(id, elem){
					$(elem).remove();
					//$("'select"+selector+" option[value=\""+elem.value+"\"]'").remove();
				});
			}
			*/
			//$(selector).children("option").remove();
			$(selector).find("option").remove();
			
			//TMA remove and detach
			$(selector).find("option").detach();
		};
		
		this.removeElementsFromAccumulatorOnly= function(selector) {
			$(selector).find("option").remove();
			
			//TMA remove and detach
			$(selector).find("option").detach();
		};

		this.getValuesFromDS= function(ds,values) {
			var elements = this.getElementsFromDS(ds,values);
			var valuesFromDS = [];
			var that = this;
			$.each(elements,function(idx,element){
				var id = that.getValue(element);
				if ($.inArray(id,values)>=0) {
					valuesFromDS.push(id);
				}
			});
			return valuesFromDS;
		};


		this.pad= function(s,level) {
			var n = level * 2;
			var i = 0;
			var spaces = "";
			var space = "&nbsp;";
			for (i=0;i<n; i++) {
				spaces = spaces + space;
			}
			return spaces + s;
		};
		
		this.getDataItemsFromDS = function(data, values){
			var dataArray = new Array();
			for(var i = 0; i < values.length; i++){
				var v = this.findDataItemFromDS(data, values[i]);
				if(v){
					dataArray.push(v);
				}				
			}			
			return dataArray;
		};
		
		this.findDataItemFromDS = function(data, value){
			
			for(var i = 0; i < data.length; i++){
				if(data[i].id && data[i].id == value){
					return data[i];
				}
				else if(data[i].items && data[i].items.length > 0){
					var ret = this.findDataItemFromDS(data[i].items, value);
					if(ret){
						return ret;
					}
				}
			}
		};
};
	
		
//***************************


	//TODO remove once we're sure this isn't used
	var util = {
	
			setValueAndTextField: function(valueField,textField) {				
				this.valueField=valueField;
				this.textField=textField;
			},
			getValue: function(element) {
				var valueField = this.valueField;
				return element[valueField];
			},
			getText:function(element){
				var textField = this.textField;
				return element[textField];
			},

			populateSelector: function(selector,data,level) {
				var that = this;
				var populateSelector = function(selector,data,level) {
					if (!level) {
						level=0;
					}
					$.each(data,function(idx,element){
						var s = element.text;
						if(!s){
							s = that.getText(element); 
						}
						if (padText) {
							s=that.pad(s,level); //that.pad(that.getText(element),level);
						}
						var id = that.getValue(element);
						var option = $('<option title="' + s + '" class="level' + level + '" value="' + id + '">' + s + '</option>');
						selector.append(option);
						if (element.items&&element.items.length>0) {
							populateSelector(selector,element.items,level+1);
						}

					});
				};
				populateSelector(selector,data,0);

			},

			getSelectedValues: function(selector) {
				var selected = this.getSelected(selector);
				var values = [];
				$.each(selected,function(idx,element){
					values.push(element.value);
				});
			},

			getSelected: function(selector) {
				var selected=[];
				selector=$(selector);
				selector.find(":selected").each(function(idx,element){
					selected.push({value:parseInt(element.value),text:element.text});
				});
				return selected;

			},

			getValuesFromElements: function(elements) {
				var values = [];
				$.each(elements,function(idx,element){
					return values.push(element.value);
				});
				return values;
			},

			getValues: function(selector) {
				var values=[];
				selector.find("option").each(function(idx,element){
					values.push(parseInt(element.value));
				});
				return values;
			},
			add: function(selector,accumulator) {
				var selected = this.getSelected(selector);	
				var accumulatorValues = this.getValues(accumulator);
				$.each(selected,function(idx,element){
					if($.inArray(element.value, accumulatorValues) < 0){
						accumulator.append($("<option value='" + element.value +"'>" + $.trim(element.text) + "</option>"));
					}
					
				});
			},

			getElementsFromDS: function(ds,values) {
				var that = this;
				var accumulateElementsFromData= function(data,values,accumulator) {
					if (data==null||data.length==0) return;
					$.each(data,function(idx,element) {
					var id = that.getValue(element);
					if ($.inArray(id,values)>=0) {
						accumulator.push(element);
					}
					accumulateElementsFromData(element.items,values,accumulator);
					});
				};
				var data = ds.data().toJSON();
				var elements =[];
				accumulateElementsFromData(data,values,elements);
				return elements;
			},



			addValuesToAccumulator: function(ds,selector,values) {
				//first get the elements from the ds that match the values
				var elements = this.getElementsFromDS(ds,values);				
				var that=this;	
				$.each(elements,function(idx,element){
					var id = that.getValue(element);
					var text = that.getText(element);
					var option = null;
					if ($.inArray(id,values)>=0) {
						option = "<option value='"+ id +"'>"+text +"</option>";					
						selector.append(option);
					}
				});

			},
			remove: function(selector,accumulator) {
				var selected = accumulator.find(":selected").each(function(idx,element){
					
					element.remove();
					
					//TMA remove and detach
					element.detach();
				});
			},
			clear: function(selector) {
				var selected = selector.find(":selected").each(function(idx,element){
					$(element).removeAttr("selected");
				});				
			},

			select: function(selector,values) {
				this.clear(selector);
				$(selector).find("option").each(function(idx,element){
					var id = parseInt(element.value);
					if ($.inArray(id,values)>=0){
						element.selected=true;
					}
				});
				
				
			},

			removeElements: function(selector) {
				$(selector).find("option").remove();
				
				//TMA remove and detach
				$(selector).find("option").detach();
			},

			getValuesFromDS: function(ds,values) {
				var elements = this.getElementsFromDS(ds,values);
				var valuesFromDS = [];
				var that = this;
				$.each(elements,function(idx,element){
					var id = that.getValue(element);
					if ($.inArray(id,values)>=0) {
						valuesFromDS.push(id);
					}
				});
				return valuesFromDS;
			},


			pad: function(s,level) {
				var n = level * 2;
				var i = 0;
				var spaces = "";
				var space = "&nbsp;";
				for (i=0;i<n; i++) {
					spaces+=space;
				}
				return spaces + s;
			},
			
			getDataItemsFromDS : function(data, values){
				var dataArray = new Array();
				$.each(data, function(idx, element){					
					if(values.indexOf(element.id) >= 0){
						dataArray.push(element);
					}
				});
				return dataArray;
			}


	};

	var Selector = Widget.extend({
			init: function(element,options) {
				var that = this;
				var isMultiple = element.multiple===true;
				var accumulator = $("#"+options.accumulator);
				
				var add=$("#"+options.add).click(function(){
					that.util.add(element,accumulator);	
					that.populateSelectorAlt();
				});
				$(element).dblclick(function(){
					//that.util.add(element,accumulator);
					$("#"+options.add).click();
				});
				var remove=$("#"+options.remove).click(function(){
					that.util.remove(element,accumulator);
					that.populateSelectorAlt();
				});
				
				accumulator.dblclick(function(){
					//that.util.remove(element,accumulator);
					$("#"+options.remove).click();
				});
				that.util = new Util(options.id,options.text);
				that.value = options.id;
				that.text = options.text;
				that.util.setValueAndTextField(that.value,that.text);				
				that.isMultiple = isMultiple;
				//base call to initialize the widget
				Widget.fn.init.call(this,element,options);
				that._dataSource();


			},
			_selector: function() {
				return $(this.element);
			},

			_accumulator: function() {
				return $("#" + this.options.accumulator);
			},

			options : {
				name: "HierarchySelector",
				autoBind: true
			},

			set: function(values) {
				this.setSelected(values);
				this.setAccumulated(values);

			},

			clearSelected:function() {
				this.util.clear(this._selector());
			},
			setSelected:function(values) {
				this.util.select(this._selector(),values);
			},

			getSelected: function() {
				return this.util.getSelected(this._selector());
			},
			getAccumulated: function() {
				return this.util.getValues(this._accumulator());
			},
			clearAccumulated: function() {
				this.util.removeElements(this._accumulator());
			},
			setAccumulated: function(values) {
				var accumulator = this._accumulator();
				var val = this.util.getValuesFromDS(this.dataSource,values);
				this.util.removeElements(accumulator);
				this.util.addValuesToAccumulator(this.dataSource,accumulator,val);
			},


			clear: function() {
				this.clearSelected();
				this.clearAccumulated();
			},

			values: function() {
				//if the selector is single select
				//get the values from the selector not the accumulator
				//otherwise get the values from the accumulator
				if (this.isMultiple) {
					return this.getAccumulated();
				}
				var values =  this.util.getValuesFromElements(this.getSelected());
				return values;
			},

			refresh: function() {
				var that = this;
				var data = that.dataSource.data();								
				var selector = that.element;
				that.util.populateSelector(selector,data);					
			},

			_dataSource: function() {
				var that = this;
				that.dataSource = kendo.data.DataSource.create(that.options.dataSource);
				//bind to change event
				that.dataSource.bind(CHANGE,function () {
					that.refresh();
				});

				//trigger a read on the dataSource if one hasn't happened yet
				if (that.options.autoBind) {
					that.dataSource.fetch();
				}
			},
			
			getDataItemsFromDS : function(values){
				var that = this;
				var data = that.dataSource.data();
				return that.util.getDataItemsFromDS(data, values);				
			},
			
			getAllDataItemsFromDS : function(){
				return this.dataSource.data();
			},
			
			setDataSource : function(dataSource){
				
				var that = this;
				var dataItems = this.dataSource;
				if(dataItems && dataItems.length > 0){
					$.each(dataItems, function(id, elem){
						that.dataSource.remove(elem);
						
						//TMA remove and detach
						that.dataSource.detach(elem);
					});
				}				
				this.options.dataSource = dataSource;
				this._dataSource();
			},
			populateSelectorAlt: function(){
				var data = this.dataSource.data();			
				this.util.processDataSourceAlt(this.dataSource, this.getAccumulated());
				this.util.populateSelectorAlt(this._selector(),this.dataSource.data());				
			},
			populateSelector: function(){
				this.util.populateSelector(this._selector(), this.dataSource.data());
			}
			
			

		}); //end extend 

	ui.plugin(Selector);

})(jQuery);