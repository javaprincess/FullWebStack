(function($){
	var kendo = window.kendo;
	var ui = kendo.ui;
	var Widget = ui.Widget;
	var CHANGE = "change";


	var util = {
			separator : "@",
			setValueAndTextField: function(valueField,textField) {
				this.valueField=valueField;
				this.textField=textField;
			},
			getValue: function(element) {
				return element[this.valueField];
			},
			getText:function(element){
				return element[this.textField];
			},

			populateSelector: function(selector,data) {
				var that = this;
				this.removeElements(selector);
				$.each(data,function(idx,element){
					element.displayFlag = true;
					var s = that.getText(element);
					var id = that.getValue(element);
					var option = $("<option  title='"+s+"' value="+id+">" + s + "</option>");
					selector.append(option);
					});
			},
			
			populateSelectorAlt: function(selector,data) {
				var that = this;
				this.removeElements(selector);
				$.each(data,function(idx,element){
					
					var s = that.getText(element);
					var id = that.getValue(element);
					var option = $("<option  title='"+s+"' value="+id+">" + s + "</option>");
					if(element.displayFlag){
						option.removeClass("selectorSelectedRow");
						option.attr("disabled", false);	
					}
					else {
						option.addClass("selectorSelectedRow");
						option.attr("disabled", true);
					}
					selector.append(option);										
				});
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
				var that = this;
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
			hasValue:function(accumulator,value) {
				var filter = "option[value='"+ value+"']";
				var found = $(accumulator).find(filter);
				if (found.length>0) {
					return true;
				}
				return false;
			},
			add: function(selector,accumulator) {
				var selected = this.getSelected(selector);
				var that = this;
				$.each(selected,function(idx,element){
					if (!(that.hasValue(accumulator,element.value))) {
						accumulator.append($("<option title='"+$.trim(element.text)+"' value='" + element.value +"'>" + $.trim(element.text) + "</option>"));
					}
				});
			},
			addAndSort: function(selector,accumulator, accumulatorArray) {
				var selected = this.getSelected(selector);
				var that = this;
				$.each(selected,function(idx,element){
					if (!(that.hasValue(accumulator,element.value))) {
						accumulatorArray.push($.trim(element.text)+that.separator+element.value);
						//accumulator.append($("<option value='" + element.value +"'>" + $.trim(element.text) + "</option>"));
					}
				});
				accumulatorArray.sort();
				this.removeElements(accumulator);
				$.each(accumulatorArray, function(id, elem){
					var index = elem.lastIndexOf(that.separator);
					var text = elem.substring(0, index);
					var value = elem.substring(index+1);
					accumulator.append($("<option title='"+$.trim(text)+"' value='" + value +"'>" + $.trim(text) + "</option>"));
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



			addValuesToAccumulator: function(ds,accumulator,values) {
				//first get the elements from the ds that match the values
				var elements = this.getElementsFromDS(ds,values);
				var that=this;
				$.each(elements,function(idx,element){
					var id = that.getValue(element);
					var text = that.getText(element);
					var option = null;
					if ($.inArray(id,values)>=0) {
						option = "<option title='"+text+"' value='"+ id +"'>"+text +"</option>";
						if (!(that.hasValue(accumulator,id.toString()))) {
							accumulator.append($(option));
						}
					}
				});

			},
			addValuesToAccumulatorAndSort: function(ds,accumulator,values, accumulatorArray) {
				//first get the elements from the ds that match the values
				var elements = this.getElementsFromDS(ds,values);
				var that=this;
				$.each(elements,function(idx,element){
					var id = that.getValue(element);
					var text = that.getText(element);
					var option = null;
					if ($.inArray(id,values)>=0) {
						option = "<option title='"+text+"' value='"+ id +"'>"+text +"</option>";
						if (!(that.hasValue(accumulator,id.toString()))) {
							accumulatorArray.push(text+that.separator+id);
							//accumulator.append($(option));
						}
					}
				});
				accumulatorArray.sort();
				this.removeElements(accumulator);
				$.each(accumulatorArray, function(id, elem){
					var index = elem.lastIndexOf(that.separator);
					var text = elem.substring(0, index);
					var value = elem.substring(index+1);
					accumulator.append($("<option title='"+$.trim(text)+"' value='" + value +"'>" + $.trim(text) + "</option>"));
				});
			},
			remove: function(accumulator) {
				var selected = accumulator.find(":selected").each(function(idx,element){
					$(element).remove();
				});
			},
			removeAndSort: function(accumulator, accumulatorArray) {				
				var selected = accumulator.find(":selected").each(function(idx,element){	
					var st = $(element).text()+"@"+$(element).val();
					accumulatorArray.splice(accumulatorArray.indexOf(st), 1);
					$(element).remove();
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
						if(!$(element)[0].disabled){
							element.selected=true;
						}
					}
				});
				
				
			},

			removeElements: function(selector) {
				$(selector).find("option").remove();
			},
			removeElementsAndSort: function(selector, accumulatorArray) {
				if(accumulatorArray){
					accumulatorArray = null;
					accumulatorArray = new Array();
				}
				$(selector).find("option").remove();
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
			
			getDataItemsFromDS : function(data, values){
				var dataArray = new Array();
				$.each(data, function(idx, element){
					if(values.indexOf(element.id) >= 0){
						dataArray.push(element);
					}
				});
				return dataArray;
			},
			processDataSourceAlt : function(dataSource, idsAdd, idsRemove) {
				var data = dataSource.data();
				var processDataSource = function(data) {
					
					$.each(data,function(idx,element){										
						var id = element.id;					
						if((idsAdd.indexOf(id) > -1) || (idsRemove.indexOf(id) > -1)){
							element.displayFlag = false;
						}
						else {
							element.displayFlag = true;
						}
						
					});
				};
				processDataSource(data);
			}

	};

	var Selector = Widget.extend({
			init: function(element,options) {
				var that = this;
				var isMultiple = element.multiple===true;
				var selector = $(element);
 
				var accumulatorAdd = $("#"+options.accumulatorAdd);
				var accumulatorRemove = $("#"+options.accumulatorRemove);
				
				//var accumulatorAddArray = new Array();
				//var accumulatorRemoveArray = new Array();
				
				var addToAddId = "#" + options.addToAdd;
				var addToAdd = $(addToAddId);
				var removeFromAddId = "#" +options.removeFromAdd;
				var removeFromAdd = $(removeFromAddId);
				var addToRemoveId = "#" + options.addToRemove;
				var addToRemove = $(addToRemoveId);
				var removeFromRemoveId ="#" +options.removeFromRemove;
				var removeFromRemove = $(removeFromRemoveId);
				//TODO validate that a value cannot be in both places at the same time

				//set up buttons actions
				addToAdd.click(function(){
					//util.add(that._selector(),that._accumulatorAdd());
					util.addAndSort(that._selector(),that._accumulatorAdd(), that.getAccumulatorAddArray());
					that.populateSelectorAlt();
				});
				removeFromAdd.click(function(){
					//util.remove(that._accumulatorAdd());
					util.removeAndSort(that._accumulatorAdd(), that.getAccumulatorAddArray());
					that.populateSelectorAlt();

				});
				
				accumulatorAdd.dblclick(function(){
					removeFromAdd.click();
					//util.remove(that._accumulatorAdd());
					//that.populateSelectorAlt();
				});

				addToRemove.click(function(){
					//util.add(that._selector(),that._accumulatorRemove());
					util.addAndSort(that._selector(),that._accumulatorRemove(), that.getAccumulatorRemoveArray());
					that.populateSelectorAlt();
				});
				removeFromRemove.click(function(){
					//util.remove(that._accumulatorRemove());
					util.removeAndSort(that._accumulatorRemove(), that.getAccumulatorRemoveArray());
					that.populateSelectorAlt();
				});
				
				accumulatorRemove.dblclick(function(){
					removeFromRemove.click();
					//util.remove(that._accumulatorRemove());
					//that.populateSelectorAlt();
				});
				
				selector.dblclick(function(){
					$(addToAddId).click();
				});

				that.value = options.value;
				that.text = options.text;
				util.setValueAndTextField(that.value,that.text);				
				that.isMultiple = isMultiple;
				//base call to initialize the widget
				Widget.fn.init.call(this,element,options);
				that._dataSource();


			},
			accumulatorAddArray : new Array(),
			accumulatorRemoveArray : new Array(),
			getAccumulatorAddArray : function(){
				return this.accumulatorAddArray;
			},
			getAccumulatorRemoveArray : function(){
				return this.accumulatorRemoveArray;
			},
			_selector: function() {
				return $(this.element);
			},

			_accumulatorAdd: function() {
				return $("#" + this.options.accumulatorAdd);
			},

			_accumulatorRemove: function() {
				return $("#" + this.options.accumulatorRemove);				
			},

			options : {
				name: "InfoCodeSelector",
				autoBind: true
			},

			set: function(values) {
				//TODO check if this is needed
				this.setSelected(values);
			},

			clearSelected:function() {
				util.clear(this._selector());
			},
			setSelected:function(values) {
				util.select(this._selector(),values);
			},

			getSelected: function() {
				return util.getSelected(this._selector());
			},
			getAccumulatedAdd: function() {
				 return util.getValues(this._accumulatorAdd());
			},
			getAccumulatedRemove:function() {
				 return util.getValues(this._accumulatorRemove());
			},
			setSelectedAccumulatorAdd:function(values){
				util.select(this._accumulatorAdd(),values);
			},
			setSelectedAccumulatorRemove: function(values){
				util.select(this._accumulatorRemove(),values);
			},
			clearSelectedAccumulatorAdd:function(){
				util.clear(this._accumulatorAdd());
			},
			clearSelectedAccumulatorRemove:function(){
				util.clear(this._accumulatorRemove());
			},
			clear: function() {
				this.clearSelected();
				util.removeElements(this._accumulatorAdd());
				util.removeElements(this._accumulatorRemove());
				this.accumulatorAddArray = new Array();
				this.accumulatorRemoveArray = new Array();
			},
			
			clearAccumulatedAdd : function(){
				util.removeElements(this._accumulatorAdd());
			},


			refresh: function() {
				var that = this;
				var data = that.dataSource.data();
				var selector = that.element;
				util.populateSelector(selector,data);	
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
			
			setDataSource: function(ds){
				
				this.clear();
				util.removeElements(this._selector());
				this.dataSource = null;
				this.options.dataSource = ds;
				this._dataSource();
			},
			
			getDataItemsFromDS : function(values){
				var that = this;
				var data = that.dataSource.data();
				return util.getDataItemsFromDS(data, values);
				
			},
			getAllDataItemsFromDS : function(){
				return this.dataSource.data();
			},
			populateSelectorAlt: function(){
				var data = this.dataSource.data();	
				util.processDataSourceAlt(this.dataSource, this.getAccumulatedAdd(), this.getAccumulatedRemove());
				util.populateSelectorAlt(this._selector(),this.dataSource.data());				
			}

		}); //end extend 

	ui.plugin(Selector);

})(jQuery);