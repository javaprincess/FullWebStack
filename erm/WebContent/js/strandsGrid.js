//////////////////////////////////////
//TMA: 5/12/14
//This .js file contains 3 global objects that just keep growing and growing:
//1. strands
//2. gridStrandsConfigurator
//3. productRestrictionsGridConfigurator
//I don't understand the architectural decision to make these objects a singleton 
//as I'm not sure what value we gain by making these 3 objects singletons because they 
//just keep getting bigger by holding references to objects that are no longer needed
//but can't be GC'd
//A NOTE ON PERFORMANCE:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
//It is unwise to unnecessarily create functions within other functions 
//if closures are not needed for a particular task, as it will negatively affect 
//script performance both in terms of processing speed and memory consumption.
//TMA 5/28/14
//MEMORY LEAK CANDIDATES identified by circular JS/DOM references are marked by //MLC-cr
//http://www.javascriptkit.com/javatutors/closuresleak/index3.shtml
///////////////////////////////////

  //start strands object
 var strands = {
    filter: {
    	current: undefined,
    	clear: function() {
    		this.current = undefined;
    		this.elements.clear();
    	},
    	set: function(filter) {
    		this.current = filter;
    	},
    	elements: {
    		MEDIA_MULTI_SELECT_ID: "#media-multi-select",
    		TERRITORY_MULTI_SELECT_ID: "#territory-multi-select",
    		LANGUAGE_MULTI_SELECT_ID:"#language-multi-select",
    		RESTRICTIONS_MULTI_SELECT_ID:"#restrictions-multi-select",
    		STRAND_SET_MULTI_SELECT_ID: "#strand-set-multi-select",
    		BUSINESS_RADIO_ID:"#business-radio",
    		LEGAL_RADIO_ID:"#legal-radio",
    		INCLUSIONS_RADIO_ID:"#inclusions-radio",
    		EXCLUSIONS_RADIO_ID: "#exclusions-radio",
    		START_DATE_ID:"#start-date-filter",
    		END_DATE_ID:"#end-date-filter",
    		ALL_INCLUSION_EXCLUSION_ID: "#all-inclusion-exclusion-radio",
    		ALL_BUSINESS_LEGAL_ID: "#all-business-legal-radio",
    		ALL_RESTRICTIONS_ID:  "#restrictions-all",
    		ANY_RESTRICTIONS_ID: "#restrictions-any",
    		media: function() {return $(this.MEDIA_MULTI_SELECT_ID).data("kendoMultiSelect");},
    		territory: function() {return $(this.TERRITORY_MULTI_SELECT_ID).data("kendoMultiSelect");},
    		language: function() {return $(this.LANGUAGE_MULTI_SELECT_ID).data("kendoMultiSelect");},
    		restrictions: function() {return $(this.RESTRICTIONS_MULTI_SELECT_ID).data("kendoMultiSelect");},
    		strandSet:function() {return $(this.STRAND_SET_MULTI_SELECT_ID).data("kendoMultiSelect");},
    		startDate:function() {return $(this.START_DATE_ID);},
    		endDate:function() {return $(this.END_DATE_ID);},
    		business: function() {return $(this.BUSINESS_RADIO_ID);},
    		legal: function() {return $(this.LEGAL_RADIO_ID);},    		
    		inclusions: function() {return $(this.INCLUSIONS_RADIO_ID);},
    		exclusions: function() {return $(this.EXCLUSIONS_RADIO_ID);},
    		allInclusionExclusion: function() {return $(this.ALL_INCLUSION_EXCLUSION_ID);},
    		allBusinessLegal: function() {return $(this.ALL_BUSINESS_LEGAL_ID);},
    		allRestrictions: function() {return $(this.ALL_RESTRICTIONS_ID);},
    		anyRestrictions: function() {return $(this.ANY_RESTRICTIONS_ID);},
			setSelectedValue: function setSelectedValue(multiSelect, value) {
				if (!value) return;
    			var hasValue = function hasValue(multiSelect, value) {
    				var selectedValues = multiSelect.value();
    				return $.inArray(value, selectedValues) >= 0;
    			};
    			if (Array.isArray(value)) {
    				value.forEach(function(value) {
    	    			if (!hasValue(multiSelect, value)) {
    	    				var selectedValues = multiSelect.value();
    	    				// selectedValues.push(value);
    	    				var newValues = selectedValues.slice();
    	    				newValues.push(value);
    	    				multiSelect.value(newValues);
    	    			}    					
    				});
    			} else {
	    			if (!hasValue(multiSelect, value)) {
	    				var selectedValues = multiSelect.value();
	    				// selectedValues.push(value);
	    				var newValues = selectedValues.slice();
	    				newValues.push(value);
	    				multiSelect.value(newValues);
	    			}
    			}
    		},
    		setRadioValue: function setRadioValue(radio) {
    			radio.prop("checked", true);
    		},
    		setValue: function setValue(field,val) {
    			field.val(val);
    		},
    		setMedia: function setMedia(val) {
    			this.setSelectedValue(this.media(),val);
    		},
    		setTerritory: function setTerritory(val) {
    			this.setSelectedValue(this.territory(),val);    			
    		},
    		setLanguage: function setLanguage(val) {
    			this.setSelectedValue(this.language(),val);    			
    		},
    		setRestrictions: function setRestrictions(val) {
    			this.setSelectedValue(this.restrictions(),val);    			
    		},
    		setStrandSet:function setStrandSet(val) {
    			this.setSelectedValue(this.strandSet(),val);    			
    		},
    		setStartDate: function setStartDate(val) {
    			this.setValue(this.startDate(),val);
    		},
    		setEndDate: function setEndDate(val) {
    			this.setValue(this.endDate(),val);    			
    		},
    		setBusiness: function setBusiness(selected) {
    			if (selected) {
    				this.setRadioValue(this.business());
    			}
    		},
    		setAllBusinessLegal: function setAllBusinessLegal(selected) {
    			if (selected) {
    				this.setRadioValue(this.allBusinessLegal());
    			}
    		},
    		setAllRestrictions: function setAllRestrictions(selected) {
    			if (selected) {
    				this.setRadioValue(this.allRestrictions());
    			}    			    			
    		},
    		setAnyRestrictions: function setAnyRestrictions(selected) {
    			if (selected) {
    				this.setRadioValue(this.anyRestrictions());
    			}    			    			    			
    		},
    		
    		setAllInclusionExclusion: function setAllInclusionExclusion(selected) {
    			if (selected) {
    				this.setRadioValue(this.allInclusionExclusion());
    			}    			
    		},
    		
    		setLegal: function setLegal(selected) {
    			if (selected) {    			
    				this.setRadioValue(this.legal());
    			}
    		},
    		setInclusions:function setInclusions(selected) {
    			if (selected) {    			
    				this.setRadioValue(this.inclusions());
    			}
    		},
    		setExclusions: function setExclusions(selected) {
    			if (selected) {    			
    				this.setRadioValue(this.exclusions());
    			}
    		},
    		getValuesFromUI: function getValuesFromUI() {
    			 var copy = function copy(array) {
    				 if (!$.isArray(array)) {return array;}
    				 return array.slice(0);
    				 
    			 };
    			 
    		     var selectedMediaValues =copy(this.media().value());
    		     var selectedTerritoryValues = copy(this.territory().value());
    		     var selectedLanguageValues = copy(this.language().value());
    		     var selectedRestrictionValues = copy(this.restrictions().value());
    		     var selectedStrandSetValues=copy(this.strandSet().value());

    		     var business=this.business().is(':checked');
    		     var allBusinessLegal = this.allBusinessLegal().is(':checked');
    		     var allInclusionExclusion = this.allInclusionExclusion().is(':checked');
    		     var allRestrictions = this.allRestrictions().is(':checked');
    		     var anyRestrictions = !allRestrictions;
    		     var legal = this.legal().is(':checked');
    		     var inclusions = this.inclusions().is(':checked');
    		     var exclusions = this.exclusions().is(':checked');
    		     var startDate = this.startDate().val();
    		     var endDate = this.endDate().val();

    		     return {
    		    	media: selectedMediaValues,
    		    	territory: selectedTerritoryValues,
    		    	language: selectedLanguageValues,
    		    	restrictions: selectedRestrictionValues,
    		    	allRestrictions:allRestrictions,
    		    	anyRestrictions: anyRestrictions,
    		    	strandSet: selectedStrandSetValues,
    		    	allBusinessLegal: allBusinessLegal,
    		    	allInclusionExclusion: allInclusionExclusion,
    		    	business: business,
    		    	legal: legal,
    		    	inclusions: inclusions,
    		    	exclusions: exclusions,
    		    	startDate: startDate,
    		    	endDate: endDate    		    	
    		     };
    			
    		},
    		clear: function clear() {
    			var multi = null;
    			multi = this.media();
    			multi.value("");
    			multi.input.blur();	
    			
    			multi = this.territory();
    			multi.value("");
    			multi.input.blur();	
    			
    			multi = this.language();
    			multi.value("");
    			multi.input.blur();
    			

    			multi = this.strandSet();
    			multi.value("");
    			multi.input.blur();
    			
    			multi = this.restrictions();
    			multi.value("");
    			multi.input.blur();
    			
    			this.startDate().val("");
    			this.endDate().val("");
    			
    			this.allInclusionExclusion().prop("checked",true);
    			this.allBusinessLegal().prop("checked",true);
    			this.anyRestrictions().prop("checked",true);

    		},
    		setValuesInUI: function setValuesInUI(values) {
    			if (values===undefined) {
    				values = strands.filter.current;
    			}
    			
    			this.clear();
    			values = values||{};
    			this.setMedia(values.media);
    			this.setTerritory(values.territory);
    			this.setLanguage(values.language);
    			this.setStrandSet(values.strandSet);
    			this.setRestrictions(values.restrictions);
    			this.setStartDate(values.startDate);
    			this.setEndDate(values.endDate);
    			this.setBusiness(values.business);
    			this.setLegal(values.legal);
    			this.setAllBusinessLegal(values.allBusinessLegal);
    			this.setAllInclusionExclusion(values.allInclusionExclusion);
    			this.setInclusions(values.inclusions);
    			this.setExclusions(values.exclusions);
    			this.setAllRestrictions(values.allRestrictions);
    			this.setAnyRestrictions(values.anyRestrictions);
    		},
    		
    		
    		
    	}

    },
	clear: function clear() {
		
		console.log("clearing the grid");
		strands.selections.clearAll();
	},
	selections: {
		strandIdsWithRestrictions:[],
		strandIds:[],
		strandRestrictionIds:[],
		productRestrictionIds:[],
		add: function add(array,value) {
			if (value && array && array.indexOf(value)<0) {
				array.push(value);
			}
		},
		remove: function remove(array,value) {
			var index = array.indexOf(value);
			if (index > -1) {
			    array.splice(index, 1);
			}			
		},
		selectStrands: function selectStrands(ids) {
			this.strandIds=[];
			var that = this;
			if (!ids||ids.length==0) return;
			$.each(ids,function(idx,element){
				that.selectStrand(element);
			});
		},
		selectStrandRestrictions: function selectStrandRestritions(ids) {
			this.strandRestrictionIds=[];
			var that = this;			
			if (!ids||ids.length==0) return;				
			$.each(ids,function(idx,element){
				that.selectStrandRestriction(element);
			});
			
		},
		selectProductRestrictions: function selectProductRestrictions(ids) {
			this.productRestrictionIds=[];
			var that = this;			
			if (!ids||ids.length==0) return;
			$.each(ids,function(idx,element){
				that.selectProductRestriction(element);
			});
			
		},
		
		selectStrand:function selectStrand(strandId) {
			this.add(this.strandIds,strandId);
		},
		selectStrandRestriction: function selectStrandRestriction(strandRestrictionId) {
			this.add(this.strandRestrictionIds,strandRestrictionId);
		},
		selectProductRestriction: function selectProductRestriction(productRestrictionId) {
			this.add(this.productRestrictionIds,productRestrictionId);
		},
		unSelectStrand:function selectStrand(strandId) {
			this.remove(this.strandIds,strandId);
		},
		unSelectStrandRestriction: function selectStrandRestriction(strandRestrictionId) {
			this.remove(this.strandRestrictionIds,strandRestrictionId);			
		},
		unSelectProductRestriction: function selectProductRestriction(productRestrictionId) {
			this.remove(this.productRestrictionIds,productRestrictionId);			
		},
		clearStrandsSelection: function clearStrandsSelection() {
			this.strandIds=[];
			this.strandRestrictionIds=[];
		},
		clearProductRestrictionsSelection: function clearProductRestrictionsSelection() {
			this.productRestrictionIds=[];
		},
		clearAll: function() {
			this.clearStrandsSelection();
			this.clearProductRestrictionsSelection();
		},
		getSelectedStrandIds: function getSelectedStrandIds() {
			return this.strandIds;
		},
		getSelectedStrandRestrictionIds: function getSelectedStrandRestrictionIds() {
			return this.strandRestrictionIds;
		},
		getSelectedProductRestrictionIds: function getSelectedProductRestrictionIds() {
			return this.productRestrictionIds;
		}
		
		
	}, //end selections
	indexStrands: function indexStrands(data) {
		
		var strandsById = [];
		var restrictionsById = [];
		if (data&&data.length>0) {
			$.each(data,function(idx,strand) {
				var strandId = strand.rightStrandId;
				strandsById[strandId] = strand;
				var restrictions = strand.ermProductRightRestrictions;
				if (restrictions && restrictions.length>0) {
					$.each(restrictions,function(idx,restriction){
						var restrictionId = restriction.rightRestrictionId;
						restrictionsById[restrictionId]=restriction;
					});
				}
			});
		}
		return {
			'strandsById':strandsById,
			'strandRestrictionsById':restrictionsById
		};
	},
	
	
	strandRestrictionsHaveComments: function strandRestrictionsHaveComments(strand) {
		if(!strand) return false;
		var hasComments = false;
		var restrictions = strand.ermProductRightRestrictions;
		$.each(restrictions,function(idx,elem) {
			if (elem.hasComment) {
				hasComments = true;
			}
			
		});
		return hasComments;
	},
	
	
	strandRestrictionsHaveMappings: function strandRestrictionsHaveMappings(strand) {
		if(!strand) return false;
		var hasMappings = true;
		var restrictions = strand.ermProductRightRestrictions;
		$.each(restrictions,function(idx,elem){
			if (elem.mappedToClearanceMemo) {
				hasMappings = true;
			}
		});
		return hasMappings;
	},
	
  
	clearMultiselect: function clearMultiselect(multiselect) {
		multiselect.value([]);
		//NOTE that this is a hack, need to find out why is it not working correctly
		multiselect._values=[];
		
	},
	
	clearRestrictionsMultiselect: function clearRestrictionsMultiselect() {
		var restrictionMultiSelect= null;
		restrictionMultiSelect = $("#restrictions-multi-select").data("kendoMultiSelect");		
		this.clearMultiselect(restrictionMultiSelect);
	}, 
	
	
	
	getStrandsHasCommentPredicate: function getStrandsHasCommentPredicate(strand) {
		return strand.hasComments;
	},
	getRestrictionHasCommentPredicate: function getRestrictionHasCommentPredicate(restriction) {
		if (!restriction.restriction) {
			return false;
		}
		return restriction.restriction.hasComments;
	}, 		
	
	getProductRestrictionIdsWithPredicate: function getProductRestrictionIdsWithPredicate(restrictions,predicate) {
		var ids = [];
		$.each(restrictions,function(idx,element){
			//TMA
			//console.log("idx: ", idx);
			//console.log("element: ", element);
			//TMA
			if (predicate(element)) {
				ids.push(element.productRestrictionId);
			}
		});
		return ids;
	},
	getStrandIdsWithPredicate: function getStrandIdWithPredicate(strands,predicate) {
		var ids = [];
		$.each(strands,function(idx,element){
			if (predicate(element)) {
				ids.push(element.rightStrandId);
			}
			//TMA
			//console.log("idx: ", idx);
			//console.log("element: ", element);
			//TMA
		});
		return ids;
	},
	getStrandRestrictionIdsWithPredicate: function getStrandRestrictionIdsWithPredicate(strands,predicate) {
		var ids = [];
		$.each(strands,function(idx,strand){
			$.each(strand.ermProductRightRestrictions, function(idx,element) {
				if (predicate(element)) {
					ids.push(element.rightRestrictionId);
				}
				
				//TMA
				//console.log("strand: ", strand);
				//console.log("idx: ", idx);
				//console.log("element: ", element);
				//TMA
			});
		});
		return ids;
	}, 		
	
	cloneRestriction: function cloneRestriction(restriction) {
		var cloned  = {};
		if (!restriction) {
			return null;
		}
		$.extend(cloned,restriction);
		return cloned;
	},
	
	convertDatesToLongFormat: function convertDatesToLongFormat(s) {
		//for some reason strands have startDateCodeId but strand restrictions have startDateCdId
		var startDateCodeId = s.startDateCodeId || s.startDateCdId;
		var endDateCodeId = s.endDateCodeId || s.endDateCdId;
		if (startDateCodeId) {
			s.startDateCode = erm.dbvalues.getDateCodeById(startDateCodeId);
		}
		if (endDateCodeId) {
			s.endDateCode = erm.dbvalues.getDateCodeById(endDateCodeId);
		}
		if(s.contractualStartDateCodeId){
			s.contractualStartDateCode = erm.dbvalues.getDateCodeById(s.contractualStartDateCodeId);
		}
		if(s.contractualEndDateCodeId){
			s.contractualEndDateCode = erm.dbvalues.getDateCodeById(s.contractualEndDateCodeId);
		}
	},

	convertStrandRestrictionToLongFormat: function convertStrandRestrictionToLongFormat(r) {
		if (r.restrictionCdId) {
			var restriction = erm.dbvalues.getRestrictionById(r.restrictionCdId);
			var clonedRestriction = this.cloneRestriction(restriction);
			r.restriction = clonedRestriction;			
		}
		this.convertDatesToLongFormat(r);
	},
	
	
	convertToLongFormat: function convertToLongFormat(s) {
		var setRestrictionCodes = function setRestrictionCodes(s) {
			var codes = [];
			var code = null;
			if (s.ermProductRightRestrictions) {
				$.each(s.ermProductRightRestrictions,function(idx,element){
					if (element.restriction) {
						element.restriction.hasComments=element.hasComments;
						element.restriction.mappedToClearanceMemo = element.mappedToClearanceMemo;
						code = element.restriction.code;
						codes.push(code);
					}
				});
			}
			//now sort the codes alphabetically
			codes.sort();
			s.restrictionCodes=codes;
		};
		var that = this;
		that.convertDatesToLongFormat(s);
		if (s.mediaId) {
			s.media = erm.dbvalues.getMediaById(s.mediaId);
		}
		if (s.territoryId) {
			s.territory = erm.dbvalues.getTerritoryById(s.territoryId);
		}
		if (s.languageId) {
			s.language = erm.dbvalues.getLanguageById(s.languageId);
		}
		if (s.ermProductRightRestrictions) {
			$.each(s.ermProductRightRestrictions,function(idx,element) {
				that.convertStrandRestrictionToLongFormat(element);
				
				//TMA
				
				//console.log("idx convertToLong: ", idx);
				//console.log("element: ", element);
				//TMA
			});
		} else {
			s.ermProductRightRestrictions = [];			
		}
		
		setRestrictionCodes(s);
		
	},
	convertStrandsToLongFormat:function convertStrandsToLongFormat(strands) {
		var that = this;
		$.each(strands,function(idx,element){
			that.convertToLongFormat(element);
		});
	},
	
	 getProductRestrictionHasCommentsIcon: function getProductRestrictionHasCommentsIcon(hasComments,id) {
		 	var css="";
			if (hasComments){
				css="icon-comments";
			} 
			return "<i title=\"Comments\" onClick=\"strands.showProductRestrictionComments(" + id +");\" id=\"pr_commentsID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		
	 },
	 
	 getProductRestrictionIsMappedIcon: function getProductRestrictionIsMappedIcon(isMapped,id) {
		 	var css="";
			if (isMapped){
				css="icon-sitemap";
			} 
			return "<i title=\"Clearance Memo Mapping\" onClick=\"strands.showProductRestrictionMappings(" + id +");\" id=\"mappedID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		
	 },

	 getStrandRestrictionsForStrandHasCommentsIcon: function getStrandRestrictionsForStrandHasCommentsIcon(hasComments,strandId) {
		 	var css="";
		 	if (hasComments){
		 		css="icon-comments";
			}
			return "<i title=\"Comments\" onClick=\"strands.showStrandRestrictionCommentsOfStrand(" + strandId +");\" id=\"r_hasComments_sID_" + strandId + "\" class='" + css +"' style='cursor: pointer;'></i>";		 	
	 },	 
	 
	 getStrandRestrictionHasCommentsIcon: function getStrandRestrictionHasCommentsIcon(hasComments,id) {
		 	var css="";
		 	if (hasComments){
		 		css="icon-comments";
		 	}
			return "<i title=\"Comments\" onClick=\"strands.showStrandRestrictionComments(" + id +");\" id=\"sr_commentsID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		 	
	 },
	 getHasCommentsIcon: function getHasCommentsIcon(hasComments, id) {
		var css="";
		if (hasComments){
	 		css="icon-comments";
		}
		return "<i title=\"Comments\" onClick=\"strands.showStrandComments(" + id +");\" id=\"commentsID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		
	 },
	 
	 getStrandMappedIcon: function getStrandMappedIcon(isMapped, id) {
		var css="";
		if (isMapped){
		  css="icon-sitemap";
		}				
		return "<i title=\"Clearance Memo Mapping\" onClick=\"strands.showStrandMappings(" + id +");\" id=\"mappedID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		
	 },
	 
	 getStrandRestrictionMappedIcon: function getStrandRestrictionMappedIcon(isMapped, id) {
		var css="";
		if (isMapped){
		  css="icon-sitemap";
		}				
		return "<i title=\"Clearance Memo Mapping\" onClick=\"strands.showStrandRestrictionMappings(" + id +");\" id=\"mappedID_" + id + "\" class='" + css +"' style='cursor: pointer;'></i>";		
	 },	 	 
  
	 getStrandColumns:function(readOnly) {
		var allColumns = [];
//		var optionalColumn = {
//				"field" : "",
//				"width": 70,
//				"template" : "<input id='cb#=data.rightStrandId #' name='#=data.rightStrandId #' class='strand-checkbox' type='checkbox' #if (data.selected) {# checked #}#> ",
//				"title" : "<input id='strand-grid-select-all' name='selectAll' type='checkbox'> <a href='\\#' id='grid-clear-selection' class='gridClear'>Clear</a>"
//			};
		var mandatoryColumns=[
								{
									"field" : "",
									"width": 70,
									"template" : "<input id='cb#=data.rightStrandId #' name='#=data.rightStrandId #' class='strand-checkbox' type='checkbox' #if (data.selected) {# checked #}#> ",
									"title" : "<input id='strand-grid-select-all' name='selectAll' type='checkbox'> <a href='\\#' id='grid-clear-selection' class='gridClear'>Clear</a>"
								},		                      
								{
									"field" : "iconType",
									"width": 35,
									"template" : "<img title='#=strands.getIndicatorTitle(iconType) #' src='img/#=strands.getIndicator(iconType) #'>",
									"title" : "B/L"
								},
								{
									"field" : "media.name",
									"title" : "Media",
									"template" : "#= strands.getMediaLink(data.media, data.iconType) #"
								},
								{
									"field" : "territory.name",
									"title" : "Territory",
									"template" : "#= strands.getTerritoryLink(data.territory, data.iconType) #"
								},
								{
									"field" : "language.name",
									"title" : "Language",
									"template" : "#= strands.getLanguageLink(data.language) #"
								},
								{
									"field" : "excludeFlag",
									"width": 65,
									"title" : "Excluded",
									"template" : "#= strands.getInclusionIcon(excludeFlag) #",
								},
								{
									//it was startDateDate
									"field" : "startDateLongValue", // this is a
																// field
																// generated
																// by the ds
																// parse
																// method
									"width": 90,
									"title" : "Start",
									"template" : "#=strands.getStartDateLink(data.startDateDate,data.startDateCode) #", 
									"groupHeaderTemplate" : "Start: #= strands.getGroupDate(value) # ",
								},
								{
									"field" : "endDateLongValue", // this is a
																// field
																// generated
																// by the ds
																// parse
																// method
									"width": 90,									
									"title" : "End",
									"template" : "#=strands.getEndDateLink(data.endDateDate,data.endDateCode) #",
									"groupHeaderTemplate" : "End: #= strands.getGroupDate(value) # ",
								},
								{
									//"field" : "contractualStartDate", 
									"field" : "contractualStartDateLongValue",
									"width": 90,																		
									"title" : "Term Start Date",
									"template" : "#=strands.getDate(data.contractualStartDate, data.contractualStartDateCode) #",
									"groupHeaderTemplate" : "Term Start Date: #= strands.getGroupDate(value) # ",
									"hidden" : true
								},
								{
									"field" : "contractualEndDateLongValue", 
									"width": 90,									
									"title" : "Contractual End Date",
									"template" : "#=strands.getDate(data.contractualEndDate, data.contractualEndDateCode) #",
									"groupHeaderTemplate" : "Contractual End Date: #= strands.getGroupDate(value) # ",
									"hidden" : true
								},
								{
									"field" : "overrideStartDateLongValue", 
									"width": 90,									
									"title" : "Override Start Date",
									"template" : "#=strands.getDate(data.overrideStartDate, null) #",
									"groupHeaderTemplate" : "Override Start Date: #= strands.getGroupDate(value) # ",
									"hidden" : true
								},
								{
									"field" : "overrideEndDateLongValue", 
									"width": 90,									
									"title" : "Override End Date",
									"template" : "#=strands.getDate(data.overrideEndDate, null) #",
									"groupHeaderTemplate" : "Override End Date: #= strands.getGroupDate(value) # ",
									"hidden" : true
								},
								{
									"field" : "releaseDate", 
									"width": 90,									
									"title" : "US Release Date",
									"template" : "#=strands.getDate(data.releaseDate, null) #",
									"groupHeaderTemplate" : "US Release Date: #= strands.getDate(value, null) # ",
									"hidden" : true
								},
								{
									"field" : "strandSetName",
									"title" : "Strand Set Name",
									"template" : "#=strands.getStrandSetLink(data.strandSet) #"
								},
								{
									"field" : "restrictionCodesList",
									"title" : "Informational Codes",	
									"template": "#=strands.getColorCodedInfoCodes(data)#",
								},
								{
									"field":"hasComments",
									"title":"<i class='icon-comments'></i>",
									"width": 30,									
									"template":"#=strands.getHasCommentsIcon(data.hasComments, data.rightStrandId)#"
								},
								{
									"field":"mappedToClearanceMemo",
									"title":"<i class='icon-sitemap'></i>",
									"width": 30,									
									"template":"#=strands.getStrandMappedIcon(data.mappedToClearanceMemo, data.rightStrandId)#"
								}								
								];
//		if (!readOnly) {
//			allColumns.push(optionalColumn);
//		}
		$.each(mandatoryColumns,function(idx,element) {
		    allColumns.push(element);
		    
		  //TMA
			//console.log("idx getStrandColumn: ", idx);
			//console.log("element: ", element);
			//TMA
		});		
		return allColumns;		 
	 },	  
	 hasStrandSet: function(strands) {
		 var hasSet = false;
		 $.each(strands,function(idx,strand) {
			 if (strand.strandSetId) {
				 hasSet=true;
			 }			 
		 });
		 return hasSet;
	 },
	 
	 toTitleCase: function(str) {
	   return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	 },
	 
	 toColorCodedRestrictionsString: function toColorCodedRestrictionsString(data) {
			var applyFormat = function applyFormat(code,isBusiness,isLegal) {
				var tag  ="";
				var style = "";
				if (isBusiness && !isLegal) {
					style="icb";
				} else if (!isBusiness && isLegal) {
					style="icl";
				}
				tag = "<span class='" + style + "'>" + code + "</span>";
				return tag;
				
			};
			var str = "";
			var first = true;
			var isBusiness = data.business;
			var isLegal = data.legal;
			var restrictionCode = data.restriction.code;
			var formated = applyFormat(restrictionCode,isBusiness,isLegal);
			if (!first) {
				str+=", ";
			}
			str+=formated;
			first = false;			
			return str;
	 },
	
	 getStrandRestrictionColumns: function(rightStrandId, readOnly) {		 		 
			
		var allColumns = [];

		var mandatoryColumns = [
								{
								    "field": "",
								    "template": "#= strands.getSelectCheckbox(data.rightRestrictionId,data.selected) #",
								    "title": "<input  id='cbrsrall" + rightStrandId +"' name='" + rightStrandId + "'  type='checkbox' class='cbrsrall-checkbox'> <a id='clear-restriction-"+ rightStrandId+"' href='\\#' name='"+ rightStrandId+ "' class='strand-restriction-clear'>Clear</a>"
								},
	                            { field: "iconType", 
	                              title:"B/L",	                              
	                              template: "<img title='#=strands.getIndicatorTitle(iconType) #' src='img/#=strands.getIndicator(iconType) #'>",
	                            },
	                            { field: "restriction.code", 
	                              title: "Code", 
	                              template: " #=strands.getRestrictionLink(strands.toColorCodedRestrictionsString(data), restriction.code)#",	                             
	                            },
	                            { field: "restriction.description", 
	                              title: "Description",
	                              template: "#=strands.toTitleCase(restriction.description) #",
	                            },
	                            {
	                                "field": "restriction.restrictionTypeName",
	                                "title": "Type"
	                            },                                                        
	                            { field: "startDateDate", 
	                              title:"Start Date",
	                              template: "#=data.startDateStrValue #"
	                            },
	                            { field: "endDateDate", 
	                              title: "End Date",
	                              template: "#= data.endDateStrValue#"
	                            },	                            
								{
								  field : "restriction.hasComments",
								  title : "<i class='icon-comments'></i>",
								  width : 30,									
								  template :"#=strands.getStrandRestrictionHasCommentsIcon(data.hasComments, data.rightRestrictionId)#"
								},
								{
								  field :"restriction.mappedToClearanceMemo",
							      title :"<i class='icon-sitemap'></i>",
								  width : 30,									
								  template :"#=strands.getStrandRestrictionMappedIcon(data.mappedToClearanceMemo, data.rightRestrictionId)#"
								}
	                        ];
//		if (!readOnly) {
//			allColumns.push(optionalColumn);
//		}
		$.each(mandatoryColumns,function(idx,element) {
		    allColumns.push(element);
		    
		  //TMA
			//console.log("idx getStrandRestrictionComment: ", idx);
			//console.log("element: ", element);
			//TMA
		});
		return allColumns;
	 },	  
		  
	 //show a new strands grid in a div
	 showStrandsGrid:function(strands,divId, parentDivId,bool, gridHeight) {
		 var columns = [
						{
							"field" : "iconType",
							"template" : "<img title='#=strands.getIndicatorTitle(iconType) #' src='img/#=strands.getIndicator(iconType) #'>",
							"title" : "Indicator"
						},
						{
							"field" : "media.name",
							"title" : "Media",
							"template" : "#= strands.getMediaLink(data.media, data.iconType) #" 
						},
						{
							"field" : "territory.name",
							"title" : "Territory",	
							"template" : "#= strands.getTerritoryLink(data.territory, data.iconType) #"
						},
						{
							"field" : "language.name",
							"title" : "Language",
							"template" : "#= strands.getLanguageLink(data.language) #"
						},
						{
							"field" : "excludeFlag",
							"title" : "Excluded",
							"width": 65,							
							"template" : "#= strands.getInclusionIcon(excludeFlag) #"
						},
						{
							"field" : "startDateDate", 
							"title" : "Start",
							"template" : "#=strands.getDate(data.startDateDate,data.startDateCode) #"
						},
						{
							"field" : "endDateDate", 
							"title" : "End",
							"template" : "#=strands.getDate(data.endDateDate,data.endDateCode) #"
						},
						{
							"field" : "contractualStartDate", 
							"width": 90,									
							"title" : "CSD",
							"template" : "#=strands.getDate(data.contractualStartDate, data.contractualStartDateCode) #",
							"hidden" : true
						},
						{
							"field" : "contractualEndDate", 
							"width": 90,									
							"title" : "CED",
							"template" : "#=strands.getDate(data.contractualEndDate, data.contractualEndDateCode) #",
							"hidden" : true
						},
						{
							"field" : "overrideStartDate", 
							"width": 90,									
							"title" : "OSD",
							"template" : "#=strands.getDate(data.overrideStartDate, null) #",
							"hidden" : true
						},
						{
							"field" : "overrideEndDate", 
							"width": 90,									
							"title" : "OED",
							"template" : "#=strands.getDate(data.overrideEndDate, null) #",
							"hidden" : true
						},
						{
							"field" : "releaseDate", 
							"width": 90,									
							"title" : "ERM RD",
							"template" : "#=strands.getDate(data.releaseDate, null) #",
							"hidden" : true
						},
						{
							"field" : "strandSetName",
							"title" : "Strand Set Name"							
						},
						{
							"field" : "restrictionCodesList",
							"title" : "Informational Codes"
							
						}];

		 
		  var ds = new kendo.data.DataSource({
			  data:strands,
			  sort : [
				        {field: "media.name", dir:"asc"},
				        {field: "territory.name", dir:"asc"},
				        {field: "language.name", dir:"asc"},
				        {field: "startDateDate", dir:"asc"}
				        ]
		  	});
		  console.log("Datasource has " + strands.length  + " elements");
		  console.log("Before display grid");
		  //first clear the div from the page (same thing we're doing for the main right strands grid)
		  var clearGrid = function() {
			  	$("#" +divId).remove();
			  	
			  	//TMA remove and detach
			  	$("#" +divId).detach();
			  	
				$("#" + parentDivId).append("<div id='"+divId +"'></div>");		  
		  };
		  clearGrid();
		  var gridOptions = {
					dataSource : ds,
					groupable : (bool == null ? true:bool),
					sortable : true,
					filterable : false,
					selectable: "multiple, row",
                    resizable: true,
					pageable : (bool == null ? ({
						refresh : true,
						pageSizes : true
					}) : bool),
					columns : columns,
					scrollable : true						
		  };
		  if(gridHeight){
			  gridOptions.height = gridHeight;
		  }
		  $("#" + divId).kendoGrid(gridOptions);
		  
	 },
	 
	 getProductRestrictionColumns: function(readOnly) {
		var allColumns=[];
//		var optionalColumn=	{
//                "field": "",
//                "template": "<input id='cbpr#=data.productRestrictionId #' name='#=data.productRestrictionId #' class='product-restriction-checkbox' type='checkbox' #if (data.selected) {# checked #}#> ",
//                "title": "<input id='product-restriction-grid-select-all' name='selectAll' type='checkbox'> <a href='\\#' id='product-restriction-grid-clear-selection'>Clear</a>"
//              };

		var mandatoryColumns = [
                    	{
                            "field": "",
                            "template": "<input id='cbpr#=data.productRestrictionId #' name='#=data.productRestrictionId #' class='product-restriction-checkbox' type='checkbox' #if (data.selected) {# checked #}#> ",
                            "title": "<input id='product-restriction-grid-select-all' name='selectAll' type='checkbox'> <a href='\\#' id='product-restriction-grid-clear-selection'>Clear</a>"
                        },		                        
	                    {
	                      "field": "iconType",
	                      "template": "<img title='#=strands.getIndicatorTitle(data.iconType) #' src='img/#=strands.getIndicator(data.iconType) #'>",
	                      "title": "Indicator"
	                    }, 
	                    {
	                      "field":"restriction.description",
	                      "title": "Type"
	                    },
	                    {
	                      "field":"restriction.hasComments",
						  "title":"<i class='icon-comments'></i>",
						  "width": 30,
						  //getProductRestrictionHasCommentsIcon
						  "template":"#=strands.getProductRestrictionHasCommentsIcon(restriction.hasComments, data.productRestrictionId) #"						  
//						  "template":"#=strands.getHasCommentsIcon(restriction.hasComments, data.productRestrictionId)#"
						},						
						{
							"field":"restriction.mappedToClearanceMemo",
							"title":"<i class='icon-sitemap'></i>",
							"width": 30,									
							"template":"#=strands.getProductRestrictionIsMappedIcon(restriction.mappedToClearanceMemo, data.productRestrictionId)#"
						}
	                    ];
//		if (!readOnly) {
//			allColumns.push(optionalColumn);
//		}
		$.each(mandatoryColumns,function(idx,element){
			allColumns.push(element);
			
			//TMA
			//console.log("idx getProductRestrictionColumn: ", idx);
			//console.log("element: ", element);
			//TMA
		});
		return allColumns;
 
	 },	
	 
	 showProductRestrictionsGrid: function(restrictions,divId) {
			var columns = [
				                    {
				                      "field": "iconType",
				                      "template": "<img title='#=strands.getIndicatorTitle(data.iconType) #' src='img/#=strands.getIndicator(data.iconType) #'>",
				                      "title": "Indicator"
				                    }, 
				                    {
				                  	"field":"restriction.description",
				                      "title": "Type"
				                    },
				                    {
				                      "field": "startDateDate", //this is a field generated by the ds parse method
				                      "title": "Start",
				                      "template":"#=strands.getDate(data.startDateDate,data.startDateCodeId) #"
				                    },
				                    {
				                      "field": "endDateDate", //this is a field generated by the ds parse method
				                      "title": "End",
				                      "template": "#=strands.getDate(data.endDateDate,data.endDateCodeId) #"
				                    },
				                    {
				                      "field":"restriction.hasComments",
									  "title":"<i class='icon-comments'></i>",
									  "width": 30,									
									  "template":"#=strands.getHasCommentsIcon(restriction.hasComments, data.productRestrictionId)#"
									},									
									{
										"field":"restriction.mappedToClearanceMemo",
										"title":"<i class='icon-sitemap'></i>",
										"width": 30,									
										"template":"#=strands.isMappedIcon(restriction.mappedToClearanceMemo, data.productRestrictionId)#"
									}
				                    ];
			
		  var ds = new kendo.data.DataSource({
			  data:restrictions
		  	});
					  	
			$("#"+divId).kendoGrid({
			      dataSource: ds,
			      groupable: true,
			      sortable: true,
			      filterable: false,
			      selectable: "multiple, row",
			      resizable: true,
			      pageable: {
			        refresh: true,
			        pageSizes: true
			      },            
			      columns: columns
			    });
			
			
		 
	 },
	 selectGridElements: function(grid,ids,getIdFunction) {
		    var rows=grid.tbody.find("tr");
		    var contains = function(id) {
		      return ($.inArray(id,ids)>=0);
		    };
		    //grid.clearSelection();
		    $.each(rows,function(idx,elem){		    			    	
		        var dataItem=grid.dataItem(elem);
		        var id = getIdFunction(dataItem);
		        var inArray = contains(id);
		        
		      //TMA
				//console.log("idx selectGridElements: ", idx);
				//console.log("elem: ", elem);
				//TMA
		        if (inArray) {
		          //var checkbox = grid.dataItem(elem);
		          //console.log("CHECKBOX: %o", checkbox);
		          grid.select(elem);
		        }
		    });

		    //TMA
		   // console.log("dataItem: ", dataItem );
		   // console.log("id: ", id );
		  },
		  
  setMessage:function(message,elementId) {
		var savedCountMessageElementId="#" + elementId;
		var element = $(savedCountMessageElementId);
		element.find(".message").html(message);
//		element.html(message);	
		element.show();
   },
   
   afterDSLoad : function(savedIds) {		
//		setTimeout(function() {		
//		  //strands.showAllStrandCommentsWithCallback(true, true, true, true, gridStrandsConfigurator.selectStrandsInGrid, savedIds);		 	
//		}, 500);
   },
   
   showAllStrandComments: function showAllStrandComments(showStrands,showStrandRestrictions,showProductRestrictions, toggleAll) {
	   strands.showAllStrandCommentsWithCallback(showStrands, showStrandRestrictions, showProductRestrictions, toggleAll, null, null); 
   },
   
   showAllStrandCommentsWithCallback: function showAllStrandCommentsWithCallback(showStrands,showStrandRestrictions,showProductRestrictions, toggleAll, callbackFunction, callbackVar) {
	   //console.log("inside showAllStrandComments toggleAll " + toggleAll);
//	   var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	   var ermSidePanelScope = erm.scopes.comments();
	   ermSidePanelScope.checkAllStrandComments(false);			   
	   var selectionsObject  = this.getStrandsAndRestrictionsWithComments(showStrands,showStrandRestrictions,showProductRestrictions);
	   //console.log("selectionsObject %o", selectionsObject);
	   strands.selections.selectStrands(selectionsObject.rightStrandIds);
	   strands.selections.selectStrandRestrictions(selectionsObject.rightStrandRestrictionIds);
	   //gridStrandsConfigurator.selectByIds(selectionsObject.rightStrandIds, selectionsObject.rightStrandIds);
	   gridStrandsConfigurator.selectByIds(selectionsObject.rightStrandIds, selectionsObject.rightStrandRestrictionIds);
	   strands.selections.selectProductRestrictions(selectionsObject.productInfoCodeIds);
	   productRestrictionsGridConfigurator.selectByIds(selectionsObject.productInfoCodeIds);
	   var checkedStrandsAndCodesObj = this.checkedStrandsAndCodesObj();
	   var rcscope = erm.scopes.rights();	   
//	   var rcscope = angular.element(document.getElementById("rightsController")).scope();
	   rcscope.showExpandStrandInformationalCodes = true;
	   if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
	     rcscope.$apply();
	   }
	   $("#strand-grid-select-all").removeAttr('checked');
	   $("#product-restriction-grid-select-all").removeAttr('checked');	   
	   this.toggleAllStrandComments(checkedStrandsAndCodesObj, toggleAll, true);
	   ermSidePanelScope.rightStrandOrRestrictionChecked = false;
	   gridStrandsConfigurator.selectByIds([], []);	   
	   productRestrictionsGridConfigurator.selectByIds([]);
	   gridStrandsConfigurator.unCheckRightStrandElements();
	   gridStrandsConfigurator.unCheckRightStrandRestrictions();
	   productRestrictionsGridConfigurator.unCheckProductRestrictions();
	   ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds = [];
	   ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds = [];
	   ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds = [];
	   strands.selections.clearAll();
	   if(callbackFunction && callbackVar && $.isFunction(callbackFunction)){
		   callbackFunction(callbackVar);
	   }
	   
	   //TODO re fetch and compute the count
	   ermSidePanelScope.loadStrandCommentCounts();	   
   },
  
   getStrandsAndRestrictionsWithComments: function getStrandsAndRestrictionsWithComments(includeStrands,includeStrandRestrictions,includeProductRestrictions) {
	   var strandIds = [];
	   var strandRestrictionIds = [];
	   var restrictionIds = [];
	   if (includeStrands) {
		   strandIds= gridStrandsConfigurator.getStrandIdsWithComments();
	   }
	   if (includeStrandRestrictions) {
		   strandRestrictionIds = gridStrandsConfigurator.getStrandRestrictionIdsWithComments();
	   }
	   if (includeProductRestrictions) {
		   restrictionIds = productRestrictionsGridConfigurator.getIdsWithComments();
	   }
	   return {
		   'rightStrandIds' : strandIds,
		   'rightStrandRestrictionIds': strandRestrictionIds,
		   'productInfoCodeIds' : restrictionIds		   		   
	   };
   },
   
   checkedStrandsAndCodesObj: function checkedStrandsAndCodesObj() {

	   var selectedStrands = gridStrandsConfigurator.getSelectedStrandsByIds();
	   var strandIds = strands.selections.getSelectedStrandIds();
	   var strandsMap = strands.getSelectedRightStrandMapFromElements(selectedStrands);
	   var selectedRightRestrictions = gridStrandsConfigurator.getSelectedStrandRestrictionsByIds();
	   var rightRestrictionIds = strands.selections.getSelectedStrandRestrictionIds();
	   var rightRestrictionsMap = strands.getSelectedStrandRestrictionMapFromElements(selectedRightRestrictions);
	   var selectedProductRestrictions = productRestrictionsGridConfigurator.getSelectedProductRestrictionsByIds();
	   var selectedProductRestrictionIds = strands.selections.getSelectedProductRestrictionIds();
	   var productRestrictionsMap = productRestrictionsGridConfigurator.getSelectedProductCodeMapFromElements(selectedProductRestrictions);

	   	var checkedStrandsAndCodesObj = {
	   	   		'rightStrandIds' : strandIds,
	   	   	    'rightStrandMap' : strandsMap,
	   	   	    'rightStrandRestrictionIds' : rightRestrictionIds,
	   	   	    'rightStrandRestrictionMap' : rightRestrictionsMap,
	   	   	    'productInfoCodeIds' : selectedProductRestrictionIds,
	   	     	'productInfoCodeMap' : productRestrictionsMap
	   	   	};
	   	//console.log("Inside function checkedStrandsAndCodesObj %o", checkedStrandsAndCodesObj);
	   	return checkedStrandsAndCodesObj;
   
   },
   
  getCommentSelection: function getCommentSelection(strandId,restrictionId,productInfoCodeId) {
	  var productInfoCodeIds = [];
	  var strandIds=[];
	  var rightStrandRestrictionIds = [];
 
	  var strandsMap = null;
	  var productInfoCodeMap = null;
	  var rightStrandRestrictionMap = null;

		  		  
	  if (strandId) {
		  if ($.isArray(strandId)) {
			  strandIds = strandId;
		  } else {
			  strandIds.push(strandId);		  
		  }
		  strandsMap = strands.getSelectedRightStrandMapFromElements(gridStrandsConfigurator.getStrandsByIds(strandIds));		  
	  }
	  
	  if (restrictionId) {
		  if ($.isArray(restrictionId)) {
			  rightStrandRestrictionIds = restrictionId;
		  } else {
			  rightStrandRestrictionIds.push(restrictionId);
		  }	
		  rightStrandRestrictionMap = strands.getSelectedStrandRestrictionMapFromElements(gridStrandsConfigurator.getStrandRestrictionsByIds(rightStrandRestrictionIds));
	  }
	  
	  if (productInfoCodeId) {
		  if ($.isArray(productInfoCodeId)) {
			  productInfoCodeIds = productInfoCodeId;
		  } else {
			  productInfoCodeIds.push(productInfoCodeId);
		  }
		  productInfoCodeMap = productRestrictionsGridConfigurator.getSelectedProductCodeMapFromElements(productRestrictionsGridConfigurator.getProductRestrictionsByIds(productInfoCodeIds));
	  }
	  
	  return {
		  "productInfoCodeIds":productInfoCodeIds,
		  "productInfoCodeMap" : productInfoCodeMap,		  
		  "rightStrandIds":strandIds,
		  "rightStrandMap":strandsMap,
		  "rightStrandRestrictionIds":rightStrandRestrictionIds,
		  "rightStrandRestrictionMap": rightStrandRestrictionMap
	  };
  },
  
  getRestrictionIdsForStrand: function getRestrictionIdsForStrand(strand) {	  
		 var ids = [];
		 if (strand) {
			 $.each(strand.ermProductRightRestrictions,function(idx,elem){
				 var id = elem.rightRestrictionId;
				 ids.push(id);
				 
				//TMA
					//console.log("idx getStrandRestrictionIdsForStrand: ", idx);
					//console.log("elem: ", elem);
					//TMA
			 });
		 }
		 return ids;
	  
	  },
  
  openStrandsPannel: function openStrandsPannel() {
	  rsToggleERMSidePanel('strandcomments');	  
  },
  openMappingsPanel: function openMappingsPanel() {
	  rsToggleERMSidePanel('clearancemapping');	  
  },
  showProductRestrictionComments: function showProductRestrictionComments(productRestrictionId) {
	 var selection = this.getCommentSelection(null,null,productRestrictionId);
	 this.openStrandsPannel();
	 this.toggleStrandComments(selection);	  
  },
  showProductRestrictionMappings: function showProductRestrictionMappings(productRestrictionId) {
	 var selection = this.getCommentSelection(null,null,productRestrictionId);	 
	 this.openMappingsPanel();
	 var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();	  	   
	 ermSidePanelScope.checkedStrandsAndCodesObj = selection;				
	 showMappedCheckedItems();	 
  },
  showStrandComments: function showStrandComments(strandId) {
	 var selection = this.getCommentSelection(strandId,null,null);
	 this.openStrandsPannel();
	 this.toggleStrandComments(selection);	   
  },
  
  showStrandMappings: function showStrandMappings(strandId) {
	 var selection = this.getCommentSelection(strandId,null,null);
	 this.openMappingsPanel();
	 var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();	  	   
	 ermSidePanelScope.checkedStrandsAndCodesObj = selection;				
	 showMappedCheckedItems();
  },  
  
  showStrandRestrictionComments: function showStrandRestrictionComments(strandRestrictionId) {
	 var selection = this.getCommentSelection(null,strandRestrictionId,null);
	 this.openStrandsPannel();	 
	 this.toggleStrandComments(selection);	 
  },
  
  showStrandRestrictionMappings: function showStrandRestrictionMappings(strandRestrictionId) {
	var selection = this.getCommentSelection(null,strandRestrictionId,null);
	this.openMappingsPanel();
	var ermSidePanelScope =  null;
	ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();	  	   
	ermSidePanelScope.checkedStrandsAndCodesObj = selection;				
	showMappedCheckedItems();
  },  
  
  showStrandRestrictionCommentsOfStrand: function showStrandRestrictionCommentsOfStrand(strandId) {
	  var strand = gridStrandsConfigurator.getStrandById(strandId);
	  var restrictionIds = this.getRestrictionIdsForStrand(strand);
	  var selection = this.getCommentSelection(null,restrictionIds,null);
	  this.openStrandsPannel();	  
	  this.toggleStrandComments(selection);  
  },
  showAllCommentsForStrand:function showAllCommentsForStrand(strandId) {
	  var strand = gridStrandsConfigurator.getStrandById(strandId);
	  var restrictionIds = this.getRestrictionIdsForStrand(strand);
	  var selection = this.getCommentSelection(strandId,restrictionIds,null);
	  this.toggleStrandComments(selection);	  	  
  },
   
  toggleMapUnMapAndStrandComments: function toggleMapUnMapAndStrandComments() {
      var selectionsObject = this.checkedStrandsAndCodesObj();
      this.toggleMapUnmapButtons(selectionsObject);
      this.toggleStrandComments(selectionsObject);	        
  },
   
  toggleMapUnmapButtons : function(checkedStrandsAndCodesObj) {
	//console.log("toggleMapUnmapButtons 1: %o", checkedStrandsAndCodesObj);
	var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	if (!checkedStrandsAndCodesObj) {  
		checkedStrandsAndCodesObj = this.checkedStrandsAndCodesObj();
	}	     
    ermSidePanelScope.checkedStrandsAndCodesObj = checkedStrandsAndCodesObj;
    //console.log("toggleMapUnmapButtons 2: %o", checkedStrandsAndCodesObj);
	if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest') {
		ermSidePanelScope.$apply();
	}
   	clearanceMemoObject.toggleMapUnmapButtons();
  },
  
  toggleStrandComments: function(checkedStrandsAndCodesObj) {
	  this.toggleAllStrandComments(checkedStrandsAndCodesObj, false, false);
  },
  
  toggleAllStrandComments: function(checkedStrandsAndCodesObj, toggleAll, showAll) {
	if (!checkedStrandsAndCodesObj) {  
		checkedStrandsAndCodesObj = this.checkedStrandsAndCodesObj();
	}
   	var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	ermSidePanelScope.checkedStrandsAndCodesObj = checkedStrandsAndCodesObj;
	if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest') {
		ermSidePanelScope.$apply();
	}
	ermSidePanelScope.toggleStrandComments(showAll);
	ermSidePanelScope.loadCommentsForRightStrandsAndCodes(toggleAll);
  },	
  
  detailInitRestrictions:function detailInitRestrictions(e,readOnly) {
    var detailRow = e.detailRow;
    //TMA var data = e.data;
    var ds = new kendo.data.DataSource({
                       //TMA data: data.ermProductRightRestrictions,
    				   data: e.data.ermProductRightRestrictions,
                       pageSize: 5000
    });
    
    var rightStrandId = e.data.rightStrandId;

    detailRow.find(".strand-restrictions").kendoGrid({
                        dataSource: ds,
                        scrollable: false,
                        sortable: true,
                        selectable: "multiple, row",
                        pageable: {
                        	numeric : false,
                        	//pageSize : 5000,
                        	previousNext : false,
                        	buttonCount : 0,
                        	pageSizes : false
                        },
                        resizable: true,                        
                        dataBound: function dataBound(kendoEvent) {
                          //--                        	 
                          var grid = kendoEvent.sender;      	
                          var setSelectedValue = function setSelectedValue(multiSelect,value) {
                            var hasValue = function(multiSelect,value) {
                              var selectedValues = multiSelect.value();
                              var inArray = $.inArray(value,selectedValues)>=0;
                              return inArray;
                            };
                            if (!hasValue(multiSelect,value)) {
                              var selectedValues = multiSelect.value();
	                  		  var newValues = selectedValues.slice();
	                		  newValues.push(value);
	                		  multiSelect.value(newValues);
                              
//                              selectedValues.push(value);
//                              multiSelect.value(selectedValues);
                            }
                          }; //end setSelectedValue
                          


                          var setSelectedRestrictionValue = function setSelectedRestrictionValue(id) {
                            var restrictionMultiSelect=$("#restrictions-multi-select").data("kendoMultiSelect");

                            var multiSelect = restrictionMultiSelect;
                            setSelectedValue(multiSelect,id);
                          }; //end setSelectedRestrictionValue

                          //--

                          var restrictionLinks = $(".restriction-link");
                          restrictionLinks.unbind('click');
                          
                          //MLC-cr TMA 5/28/14
                          restrictionLinks.on('click', restrictionLinksClick);
                          function restrictionLinksClick(e) {
                            e.preventDefault();
                            var code = this.name;
                            console.log("restriction clicked id " + code);
//                            var id = erm.dbvalues.getRestrictionByCode(code).id;
                            //get the code and converted to id
                            
                            setSelectedRestrictionValue(code);
                            gridStrandsConfigurator.expandFilter();
                          }; //end on click

                          var clearSelection = $("#clear-restriction-"+rightStrandId);
                          clearSelection.unbind('click');
                          
                          //MLC-cr TMA 5/28/14
                          clearSelection.on('click', clearSelectionClick);
                          function clearSelectionClick(e){
                            e.preventDefault();
                            var dataSource = ds;
                            var filter = dataSource.filter();
                            var allData = dataSource.data();
                            var rightStrandId = this.name;
                            $("#cbrsrall"+ rightStrandId).removeAttr('checked');
                            $.each(allData,function(idx,elem){
                              elem.selected=false;                              
                              strands.setSelectedStrandRestriction(dataSource.data(), elem.rightRestrictionId, false);
                            //TMA
              				//console.log("idx detailInitRestrictions: ", idx);
              				//console.log("elem: ", elem);
              				//TMA
                            });
                            dataSource.data(allData);            
                          };
                          
                          var restrictionCheckboxes = detailRow.find(".strand-restriction-checkbox");
                          restrictionCheckboxes.unbind('click');
                          
                          //MLC-cr TMA 5/28/14
                          restrictionCheckboxes.click(restrictionCheckboxesClick);
                          function restrictionCheckboxesClick(e){
                        	  var restrictionsGrid = grid;
                              var id = parseInt(this.name);
                              console.log("restrictionCheckboxes: id - " + id);
                              var dataSource = restrictionsGrid.dataSource;
                              var selected = this.checked;
                              console.log("setSelectedStrandRestriction ");
                              var selectedStrandRestrictions = strands.setSelectedStrandRestriction(dataSource.data(),id,selected);
                              var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
                      		  if (ermSidePanelScope.isERMSidePanelOut) {
                                strands.toggleMapUnMapAndStrandComments();
                      		  }
                              return selectedStrandRestrictions;
                            }; 
                          
                          
                          
                          var selectAllCheckbox = $("#cbrsrall"+ rightStrandId);
                          selectAllCheckbox.unbind('click');
                          
                        //MLC-cr TMA 5/28/14
                          selectAllCheckbox.on('click', selectAllCheckboxClick);
                          function selectAllCheckboxClick(event){      
                              var dataSource = ds;
                   	          var allData = dataSource.data();
                   	          var that = this;                                                            
                              $.each(allData,function(idx,elem) {                            	
                                elem.selected=that.checked;                                
                                strands.setSelectedStrandRestriction(dataSource.data(), elem.rightRestrictionId, elem.selected);
                              });
                              dataSource.data(allData);
                              
                              //AMV 
                              //enable add comment button
                          	  var ermSidePanelScope =  null;
                        	  ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
                        	  if (ermSidePanelScope.isERMSidePanelOut) {
                        	   strands.toggleMapUnMapAndStrandComments();
                        	  }
                              
                          };
                        }, //end databound
                        columns: strands.getStrandRestrictionColumns(rightStrandId,readOnly) 
                    });
                },
  setSelected: function(s,id,selected) {
	//console.log("setSelected with %o",s);
	//MLC-cr 
    $.each(s,function(idx,elem) {
      if (elem.rightStrandId===id) {
    	  console.log("setSelected with %o",elem.rightStrandId);
        elem.selected=selected;
        if (selected) {
        	strands.selections.selectStrand(id);
        } else {
        	strands.selections.unSelectStrand(id);
        }
      }
    });
  },
  setSelectedStrandRestriction:function(strandRestrictions,id,selected) {
	  	console.log("setSelectedStrandRestriction: strandRestrictions %o", strandRestrictions, " id " + id + " selected: " + selected);
	  	if (strandRestrictions[0].ermProductRightRestrictions != null) {
	  	  $.each(strandRestrictions,function(idx,elem) {	  		  	
	  		$.each(elem.ermProductRightRestrictions,function(idx,innerelem) {
	          if (innerelem.rightRestrictionId===id) {
	            console.log("elem %o", innerelem);
	            innerelem.selected=selected;
	            if (selected) {
	            	strands.selections.selectStrandRestriction(id);
	            } else {
	            	strands.selections.unSelectStrandRestriction(id);	            	
	            }
	          }
	        });
	  	  });	  
	  	} else {
	  	   $.each(strandRestrictions,function(idx,elem) {
	        if (elem.rightRestrictionId===id) {
	          elem.selected=selected;
	          if(selected){
	              strands.selections.selectStrandRestriction(id);
	              //don't select the parent right strand.
//	        	  $("#cb"+elem.rightStrandId)[0].checked = selected;
		          strands.processingRestrictionCheckboxClick(gridStrandsConfigurator.getDS().data(), elem.rightStrandId, true);
	          }	else {
	        	  strands.selections.unSelectStrandRestriction(id);
	          }          	          
	        }
	      });
	  	}
  },
  
  processingRestrictionCheckboxClick : function(data, strandId, checked){
//	  var selected = checked;
	  //don't select the parent strand anymore
//	  strands.setSelected(data, strandId, selected);
  },

  setSelectedProductRestriction:function(productRestrictions,id,selected) {
	    $.each(productRestrictions,function(idx,elem) {
	        if (elem.productRestrictionId===id) {
	          elem.selected=selected;
	          if (selected) {
	        	  strands.selections.selectProductRestriction(id);
	          } else {
	        	  strands.selections.unSelectProductRestriction(id);
	          }
	        } 
	      });
	  
  },
    
 	getIndicator:function(type) {
    var img = null;
    switch(type) {
       case "CM+B":
	     img="CM+BusinessStrand";
	     break;
	   case "CM+LB":
	   case "CM+BL":
		 img="CM+LegalAndBusinessAgree";
	     break;
	   case "CM+L":
	     img="CM+LegalStrand";
		 break;
	   case "CM+":
		 img="CMexistsOnly";
	     break;
	   case "CMDP+B":
	     img="CMDP+BusinessStrand";
	     break;
	   case "CMDP+LB":
	   case "CMDP+BL":
		 img="CMDP+LegalAndBusinessAgree";
	     break;
	   case "CMDP+L":
	     img="CMDP+LegalStrand";
		 break;
	   case "CMDP+":
		 img="CMDPexistsOnly";
	     break;		     
	   case "B":
	     img="NoCM+BusinessStrand";		     
	     break;
	   case "BL":
	   case "LB":
	     img="NoCM+LegalAndBusinessAgree";
	 	 break;
	   case "L":
	     img="NoCM+LegalStrand";
	     break;		   		
	   default:
		 img="NoIcon";
		 break;
    };
 		return img+".png";
 	},
 	getIndicatorTitle:function(type) {
 	  var title = null;
 	  switch(type) {
 	  	case "CM+B":
	     title="Clearance Memo with Business Strand(s)";
	     break;
 	  	case "CM+LB":
 	  	case "CM+BL":
		 title="Clearance Memo with Legal and Business Strand(s)";
	     break;
 	  	case "CM+L":
	     title="Clearance Memo with Legal Strand(s)";
		 break;
 	  	case "CM+":
		 title="Clearance Memo";
	     break;
 	  	case "B":
	     title="Business Strand(s)";
	     break;
 	  	case "BL":
 	  	case "LB":
	     title="Legal and Business Strand(s)";
	 	 break;
 	  	case "L":
	     title="Legal Strand(s)";
	     break;
 	  	case "N":		 
 	  	default:			 
		 break;
 	  };
 	  return title;
 	},
 	getInclusionIcon:function(excludeFlag) {
 		if (true===excludeFlag) {
 			return "<span style='color:red'><i class='icon-stop'></i></span>";
 		} else {
 			return "<span style='color:green'></span>";
 		}
 	},
  getValueLink:function(value,type) {
    return "<a href='#' class='" +type +"-link' name='" + value.id +"'>" +value.name + "</a>";
  },
  getNoteForBusinessLegal:function(value, isLegal, isBusiness) {
	  //console.log("getNoteForBusinessLegal isLegal " + isLegal + " isBusiness " + isBusiness + " value.businessNote " + value.businessNote);
	  return 'data-toggle="popover" data-html="true" data-placement="right" data-animation="true" data-content="' + (isLegal && value.legalNote != null ? "<p style=\'text-align: left;\'>" + value.legalNote + "</p>" : "") + (isBusiness && value.businessNote != null ? "<p style=\'text-align: left;\'>" + value.businessNote + "</p>" : "") + '"';
  },
  getValueLinkWithNote:function(value, type, isLegal, isBusiness) {
    return '<a onMouseOver="showToolTip(this);" href="#" ' + this.getNoteForBusinessLegal(value, isLegal, isBusiness) + ' class="' + type + '-link" id="' + type + '-' + value.id + '" name="' + value.id + '">' +value.name + ' ' + (value.activeFlag=="N" ? "*" : "") + '</a>';
  },	
  getMediaLink:function(media, iconType) {    
    return this.getValueLinkWithNote(media, 'media', (iconType.indexOf('L') > -1), (iconType.indexOf('B') > -1));
  },
  getTerritoryLink:function(territory, iconType) {	
    return this.getValueLinkWithNote(territory, 'territory', (iconType.indexOf('L') > -1), (iconType.indexOf('B') > -1));	
  },
  getLanguageLink:function(language) {
    return this.getValueLink(language,'language');
  },
  getStrandSetLink:function(set) {
    if (!set) return "";
    return "<a href='' class='strand-set-link' title='" + set.strandSetName + "' name='" + set.rightStrandSetId +"'>" +set.strandSetName + "</a>";
  },
  getColorCodedInfoCodes: function getColorCodedInfoCodes(strand) {	
	  //TMA memory leak -- trying to reduce the footprint of this function
	  var id = null;
	  var codesStr = null;
	  var rHasComments = null;
	  var icon = null;
	  var str = null;
	  
	id = strand.rightStrandId;
	codesStr = strand.colorRestrictionCodeList;
	rHasComments = strand.rHasComments;
	//TODO verify
	icon = strands.getStrandRestrictionsForStrandHasCommentsIcon(rHasComments, id);
	str = codesStr + "&nbsp;" + icon;
	//TODO change this
	if (strand.ermProductRightRestrictions && strand.ermProductRightRestrictions.length>0){
		strands.selections.strandIdsWithRestrictions.push(id);		
	}
	return "<a href='' class='product-restriction-link'>"+  str + "</a>";
  },
  getRestrictionLink:function(str, restrictionCode) {
    return "<a href='' class='restriction-link' name='" + restrictionCode +"'>" + str + "</a>";
  },
  getDateLink:function getDateLink(type,date,dateCode) {
	  if (!dateCode&&!date) return "";
	  var dateValue=erm.Dates.getDates(date,dateCode);
	  return "<a href='' class='" + type + "-link'>" + dateValue + "</a>";	  
  },
  getStartDateLink: function getStartDateLink(date,dateCode) {
	  return this.getDateLink("start-date",date,dateCode);
  },
  getEndDateLink: function getEndDateLink(date,dateCode) {
	  return this.getDateLink("end-date",date,dateCode);
  },
  getSelectCheckbox:function(rightStrandId,selected) {
	var checked = "";
	if (selected) {
		checked = "checked";
	}
	var html = "";
	html = "<input id='cb" + rightStrandId + "' name='" +rightStrandId + "' class='strand-restriction-checkbox' type='checkbox' " + checked +"/>";
	return html;	
  },	
  
 	getStrandSetName: function(record) {
 		var strandSet = record.strandSet;
 		if (strandSet==null) return "";
 		return strandSet.strandSetName.replace(/^\s\s*/, '_').replace(/\s\s*$/, '_');
 	},
 	getGroupDate: function getGroupDate(value) {
 		console.log("value: %o", value);
 		if (value == null)
 			return "";
 		if (value == -2) {
 		  return "TBA";
 		} else if (value == -1) {
 	 	  return "P";
 	 	} else {
 		  return erm.Dates.getDates(value, null);
 		}
 	},
 	getDate:function(date,dateCode) {
    return erm.Dates.getDates(date,dateCode);
 	},
 	
 	getIsStrandSelectedMap: function(ids,ds) {
 		var map = new Object();
        var allData = ds.data().toJSON();
        //firt make the ids into a map
        var idsMap = new Object();
        $.each(ids,function(idx,elem){
        	idsMap[elem]=1;
        });
        $.each(allData,function(idx,elem) {
        	var id = elem.rightStrandId;
        	if (idsMap[id]) {
        		map[id]=elem.selected;
        	}
        }); 		
 		return map;
 	},
 	
	  getSelectedElementsFromDS : function(ds) {
	        var allData = ds.data().toJSON();
	        var selectedElements = [];
	        $.each(allData,function(idx,elem) {
	            if (elem.selected) {
	                selectedElements.push(elem);
	            }
	        });
	        return selectedElements;   
	    },
	    
		getStrandRestrictionsByIds: function getStrandRestrictionsByIds(data,ids) {
			var all = [];
			if (!ids||ids.length==0) {
				return all;
			}
			$.each(data,function(idx,elem){
				$.each(element.ermProductRightRestrictions,function(idx,elem) {
					var id = elem.rightRestrictionId;
					if (ids.indexOf(id)>=0) {
						all.push(elem);
					}
				});
			});
			return all;
		},
	    
	    getSelectedStrandRestrictionsFromDS: function(ds) {
	        var allData = ds.data().toJSON();
	        var selectedElements = [];	        
	        $.each(allData,function(idx,element) {
	        	$.each(element.ermProductRightRestrictions,function(idx,elem) {	        		
		            if (elem.selected) {
		            	elem.parentBusinessInd = element.businessInd;
		            	elem.parentLegalInd = element.legalInd;
		                selectedElements.push(elem);
		            }	        		
	        	});
	        });
	        return selectedElements;   
		  
	  },  

	  translateCodeToDate: function(dateCodeId) {
		  var P = 1;
		  var TBA = 2;
		  var P_TRANSLATION = -1;
		  var TBA_TRANSLATION=-2;
		  var NULL = -3;
		  if (dateCodeId==P) {
			  return P_TRANSLATION;
		  }
		  if (dateCodeId==TBA) {
			  return TBA_TRANSLATION;
		  }
		  return  NULL;
		  
		  
	  },
	  
		/*
		 *There are some issues with dates and time zones. For example: 03/05/1973. It gets converted to Thu Mar 04 1943 23:00:00 GMT-0800 (Pacific Standard Time)
		 *Which is correct, but the kendo date picker displays 03/04/1973. So we need to get the string and convert to date again
		 */
		toCorrectDate: function(d) {
			if (!d) return d;
			//it puts some strange characters in the date. We need to remove them
			//see http://stackoverflow.com/questions/21413757/tolocaledatestring-changes-in-ie11
			var dateStr = d.toLocaleDateString('en-US').replace(/[^ -~]/g,'');
			var date = new Date(dateStr);
			if (!date) {
				return d;
			}
			return date;
		},
	

	  
 	  setDates:function(elem) {
 	      var startDate = null;
 	      var startDateLongValue = null;
 	      var contractualStartDate = null;
 	      var contractualStartDateLongValue = null;
 	      var contractualEndDate = null;
 	      var contractualEndDateLongValue = null;
 	      var overrideStartDate = null;
 	      var overrideStartDateLongValue = null;
 	      var overrideEndDate=null;
 	      var overrideEndDateLongValue = null;
 	      var endDateLongValue = null;
 	      var endDate = null;
 	      //start date
 	      if (elem.startDate) {
 	          startDate = strands.toCorrectDate(new Date(elem.startDate));
 	          startDateLongValue=startDate.getTime();
 	      } 
 	      elem.startDateDate=startDate;
 	      //if the date is null, assign a ficticious negative value to the date so that we can sort based ond codes also
 	      if (!elem.startDateDate && elem.startDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.startDateDate=strands.translateCodeToDate(elem.startDateCode.refDateId);
 	    	  startDateLongValue = elem.startDateDate; 
 	      }
 	      elem.startDateStrValue = erm.Dates.getDates(elem.startDateDate,elem.startDateCode);
 	      elem.startDateLongValue = startDateLongValue;
 	      
 	      //end date 	      
 	      if (elem.endDate) {
 	          endDate = new Date(elem.endDate);
 	          endDate = strands.toCorrectDate(endDate);
 	          endDateLongValue=endDate.getTime(); 	          
 	      }
 	      
 	      elem.endDateDate = endDate;
 	      if (!elem.endDateDate && elem.endDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.endDateDate=strands.translateCodeToDate(elem.endDateCode.refDateId);
 	    	  endDateLongValue = elem.endDateDate;
 	      }
 	      elem.endDateStrValue = erm.Dates.getDates(elem.endDateDate,elem.endDateCode);
 	      elem.endDateLongValue = endDateLongValue;


 	      //contractual start date
 	      if (elem.contractualStartDate) {
 	    	 contractualStartDate = strands.toCorrectDate(new Date(elem.contractualStartDate));
 	    	 contractualStartDate = strands.toCorrectDate(contractualStartDate);
 	    	 contractualStartDateLongValue=contractualStartDate.getTime();
 	      } 
 	      elem.contractualStartDateDate=contractualStartDate; 	      
 	      //if the date is null, assign a ficticious negative value to the date so that we can sort based ond codes also
 	      if (!elem.contractualStartDateDate && elem.contractualStartDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.contractualStartDateDate=strands.translateCodeToDate(elem.contractualStartDateCode.refDateId);
 	    	  contractualStartDateLongValue = elem.contractualStartDateDate; 
 	      }
 	      elem.contractualStartDateLongValue = contractualStartDateLongValue; 	      

 	      
 	      //contractual end date
 	      if (elem.contractualEndDate) {
 	    	 contractualEndDate = strands.toCorrectDate(new Date(elem.contractualEndDate));
 	    	 contractualEndDateLongValue=contractualEndDate.getTime();
 	      } 
 	      elem.contractualEndDateDate=contractualEndDate; 	      
 	      //if the date is null, assign a ficticious negative value to the date so that we can sort based ond codes also
 	      if (!elem.contractualEndDateDate && elem.contractualEndDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.contractualEndDateDate=strands.translateCodeToDate(elem.contractualEndDateCode.refDateId);
 	    	  contractualEndDateLongValue = elem.contractualEndDateDate; 
 	      }
 	      elem.contractualEndDateLongValue = contractualEndDateLongValue;
 	      
 	      //override start date
 	      if (elem.overrideStartDate) {
 	    	 overrideStartDate = strands.toCorrectDate(new Date(elem.overrideStartDate));
 	    	 overrideStartDateLongValue=overrideStartDate.getTime();
 	      } 
 	      elem.overrideStartDateDate=overrideStartDate; 	      
 	      //if the date is null, assign a ficticious negative value to the date so that we can sort based ond codes also
 	      if (!elem.overrideStartDateDate && elem.overrideStartDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.overrideStartDateDate=strands.translateCodeToDate(elem.overrideStartDateCode.refDateId);
 	    	  overrideStartDateLongValue = elem.overrideStartDateDate; 
 	      }
 	      elem.overrideStartDateLongValue = overrideStartDateLongValue; 	      

 	      
 	      //override end date
 	      if (elem.overrideEndDate) {
 	    	 overrideEndDate = strands.toCorrectDate(new Date(elem.overrideEndDate));
 	    	 overrideEndDateLongValue=overrideEndDate.getTime();
 	      } 
 	      elem.overrideEndDateDate=overrideEndDate; 	      
 	      //if the date is null, assign a ficticious negative value to the date so that we can sort based ond codes also
 	      if (!elem.overrideEndDateDate && elem.overrideEndDateCode) {
 	    	  //need to make reference to strands and not this because the function might be executed in a different context
 	    	  elem.overrideEndDateDate=strands.translateCodeToDate(elem.overrideEndDateCode.refDateId);
 	    	  overrideEndDateLongValue = elem.overrideEndDateDate; 
 	      }
 	      elem.overrideEndDateLongValue = overrideEndDateLongValue; 	      
 	      
 	      
 	      
 	  },
 	

  /**
   * Sets the filter in the UI, the filter is previously saved. If will select the saved options from the saved filter
   */
  setFilterInUI: function setFilterInUI(filter) {
	  
  },
 	  
  getFilter: function() {
     var selectedMediaValues =$("#media-multi-select").val();
     var selectedTerritoryValues = $("#territory-multi-select").val();
     var selectedLanguageValues = $("#language-multi-select").val();
     var selectedRestrictionValues = $("#restrictions-multi-select").val();
     var selectedStrandSetValues=$("#strand-set-multi-select").val();
     var allRestrictions = $("#restrictions-all").is(':checked');
     var business=$("#business-radio").is(':checked');
     var legal = $("#legal-radio").is(':checked');
     var inclusions = $("#inclusions-radio").is(':checked');
     var exclusions = $("#exclusions-radio").is(':checked');
     var startDate = $("#start-date-filter").val();
     var endDate = $("#end-date-filter").val();

     if (!business&&!legal) {
        business=true;
        legal=true;
     }
     if (!inclusions&&!exclusions) {
        inclusions=true;
        exclusions=true;
     }
     return this.getFilterFromValues(selectedMediaValues,selectedTerritoryValues,selectedLanguageValues,legal,business,inclusions,exclusions,selectedRestrictionValues,selectedStrandSetValues,startDate,endDate,allRestrictions);

  },

  getFilterFromValues : function(mediaValues,territoryValues,languageValues,legal,business,inclusion,exclusion,restrictionValues,strandSetValues,startDate,endDate,allRestrictions) {
	  var anyRestrictions = !allRestrictions;
	  var getFilter= function(values,fieldName,op,multiFilterOperator) {
	        var i = 0;
	        var v = null;    
	        if (!op) {
	          op = "eq";
	        }
	        if (values==null||values.length==0) {
	            return {};
	        }
	        if (values.length==1) {
	          if ($.isNumeric(values[0])) {
	            v = parseInt(values[0]);
	          } else {
	            v=values[0];
	          }
	          return {field:fieldName,operator:op,value:v};
	        }
	        var filter = {logic:multiFilterOperator,filters:[]};
	        var condition = null;

	        for (i = 0; i<values.length;i++) {
	          if ($.isNumeric(values[i])) {
	        	  v = parseInt(values[i]);
	          } else {
	        	  v = values[i];
	          }
	          condition = {field:fieldName,operator:op,value:v};
	          filter.filters.push(condition);
	        } 
	        return filter;		  
	  };
      var getOrFilter = function(values,fieldName,op) {
    	  return getFilter(values,fieldName,op,"or");
      };
      var getAndFilter = function(values,fieldName,op) {
    	  return getFilter(values,fieldName,op,"and");    	  
      };
      


      var getBooleanFilter = function(value,fieldName) {
         var op="eq";
         return {field:fieldName,operator:op,value:value};
      };



     var filters = [];
     if (!legal||!business) {
        if (legal) {
            filters.push(getBooleanFilter(legal,"legal"));            
        }
        if (business) {
            filters.push(getBooleanFilter(business,"business"));            
        }

     }
     if (!inclusion||!exclusion) {
       if (inclusion) {
            filters.push(getBooleanFilter(false,"excludeFlag"));  
       } else {
            filters.push(getBooleanFilter(true,"excludeFlag"));  
       }
     }

     if (mediaValues&&mediaValues.length>0) {
        filters.push(getOrFilter(mediaValues,"media.id"));
     }

     if (territoryValues&&territoryValues.length>0) {
        filters.push(getOrFilter(territoryValues,"territory.id"));
     }
     if (languageValues&&languageValues.length>0) {
        filters.push(getOrFilter(languageValues,"language.id"));
     }
     if (strandSetValues&&strandSetValues.length>0) {
        filters.push(getOrFilter(strandSetValues,"strandSetId"));      
     }     
     if (restrictionValues&&restrictionValues.length>0 && anyRestrictions) {
        filters.push(getOrFilter(restrictionValues,"restrictionCodesString","contains"));
     }
     if (restrictionValues&&restrictionValues.length>0 && allRestrictions) {
         filters.push(getAndFilter(restrictionValues,"restrictionCodesString","contains"));
      }
     
     if (startDate&&startDate.trim().length>0) {
    	 filters.push(getBooleanFilter(startDate,"startDateStrValue"));   	 
     }
     if (endDate&&endDate.trim().length>0) {
    	 filters.push(getBooleanFilter(endDate,"endDateStrValue"));   	     	 
     }


     var allFilters = {
        logic: "and",
        filters: filters
     };
     return allFilters;
  },
  
  getFilteredDataFromDS: function getFilteredDataFromDS(ds) {
		var filter = ds.filter();
		var allData = ds.data();
		var query = new kendo.data.Query(allData);
		var filteredData = query.filter(filter).data;
		return filteredData;
  },
  

  getIds: function(strands) {
    var ids = [];
    $.each(strands,function(idx,elem) {
      ids.push(elem.rightStrandId);
    });
    return ids;
  }, 
  getStrandsByIds: function getStrandsByIds(strands,ids) {
	var s = [];
	if (!ids||ids.length==0) return s;
	$.each(strands, function(idx,element){
		var id = element.rightStrandId;
		if (ids.indexOf(id)>=0) {
			s.push(element);
		}
	});
	return s;
  },
  getStrandRestrictionsByIds: function getStrandRestrictionsByIds(strands,ids) {
	var r=[];
	if (!ids||ids.length==0) return r;
	$.each(strands, function(idx,element){
		if (element.ermProductRightRestrictions) {
			$.each(element.ermProductRightRestrictions,function(idx,element){
				var id = element.rightRestrictionId;
				if (element.rightRestrictionId) {
					if (ids.indexOf(id)>=0) {
						r.push(element);
					}					
				}
			}); 
		}
	});
	return r;

  },
  getProductRestrictionsById: function getProductRestrictionsById(productRestrictions,ids) {
		var r = [];
		if (!ids||ids.length==0) return r;
		$.each(productRestrictions, function(idx,element){
			var id = element.productRestrictionId;
			if (ids.indexOf(id)>=0) {
				r.push(element);
			}
		});
		return r;	  
  },
  
  getSelectedRightStrandMapFromElements: function(strands) {
	var selectedMap = Array();
	$.each(strands,function(idx,elem) {
	  var mappedElements = {
			  description : " - " + elem.media.name + ", " + elem.territory.name + ", " + elem.language.name,
			  isBusiness : elem.business,
			  isLegal : elem.legal,
			  isExclusion : elem.exclusion,
			  strand : elem
			  //isMediaActive : (elem.media.activeFlag == 'N' ? false : true),
			  //isTerritoryActive : (elem.territory.activeFlag == 'N' ? false : true),
			  //territoryId : elem.territory.id
	  };
	  selectedMap[elem.rightStrandId] = mappedElements;   	  
	});
	return selectedMap;
  },
  
  
  
  isSelectedStrandsPartOfStrandSet: function(strands) {
	var partOfStrandSet = false;
	$.each(strands,function(idx,elem) {
      if (elem.strandSet != null)	  
	    partOfStrandSet = true;	     	  
	});
	return partOfStrandSet;
  },
  
  getStrandRestrictionIds:function(strandRestrictions) {
    var ids = [];
    $.each(strandRestrictions,function(idx,elem) {
      ids.push(elem.rightRestrictionId);
    });
    return ids;
  },
  
  getSelectedStrandRestrictionMapFromElements: function(strandRestrictions) {
	var selectedMap = Array();
	var that = this;
	$.each(strandRestrictions,function(idx,elem) {
		var mappedElements = {
				description : " - " + elem.restriction.code + (elem.restriction.restrictionTypeName != null ? " " + elem.restriction.restrictionTypeName : ""),
				isBusiness : elem.business,
				isLegal : elem.legal,
				restrictionTypeName : elem.restriction.restrictionTypeName,
				startDate : that.getDate(new Date(elem.startDate), elem.startDateCdId),
				endDate : that.getDate(new Date(elem.endDate), elem.endDateCdId)//this.getDate(elem.endDate, elem.endDateCdId)
		};
		selectedMap[elem.rightRestrictionId] = mappedElements;   	  
	});
	return selectedMap;
  },

  getAccumulator: function(list,idFunction) {
    var ids=[];
    return {
      accumulate: function(element) {
        if (!element) return;
        var id = idFunction(element);
        if (id && !ids[id]) {
          //element is not in
          ids[id]=1;
          list.push(element);
        }
      }
    };
    },
    
    showHideColumn : function(divId){    	
    	var grid = $("#"+divId).data("kendoGrid");
    	var checked = $("#rightStrandshowAllDates")[0].checked;
		var contractualStarDateColumn = "contractualStartDateLongValue";
		var contractualEndDateColumn = "contractualEndDateLongValue";
		var overrideStartDateColumn = "overrideStartDateLongValue";
		var overrideEndDateColumn = "overrideEndDateLongValue";
		var releaseDateColumn = "releaseDate";
    	
    	if(checked){
			grid.showColumn(contractualStarDateColumn);
			grid.showColumn(contractualEndDateColumn);
			grid.showColumn(overrideStartDateColumn);
			grid.showColumn(overrideEndDateColumn);
			grid.showColumn(releaseDateColumn);
		}
		else {
			grid.hideColumn(contractualStarDateColumn);
			grid.hideColumn(contractualEndDateColumn);
			grid.hideColumn(overrideStartDateColumn);
			grid.hideColumn(overrideEndDateColumn);
			grid.hideColumn(releaseDateColumn);
		}
		grid.refresh();
    },
    isDifferentReleaseDate: function isDifferentReleaseDate(firstReleaseDate,data) {
		var items = data;
		var firstReleaseIsNull = false;
		var releaseDay = null;
		var releaseMonth = null;
		var releaseYear = null;
		var isDate = function isDate(val){
			if (!val) return false;
			if (isNaN(val)) return false;
			return true;
		};
    	if (!firstReleaseDate) firstReleaseIsNull = true;
		if(items && items.length > 0){
			if (!firstReleaseIsNull) {
				releaseDay = firstReleaseDate.getDate();
				releaseMonth = firstReleaseDate.getMonth();
				releaseYear = firstReleaseDate.getFullYear();
			}
			
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				//only perform the check if is a business strand
				if (item.business && item.inclusion) {
					//if the first release date is null and the strand has a release date return true
					if (firstReleaseIsNull && isDate(item.releaseDate)) {
						return true;
					}
					if(!firstReleaseIsNull && (!item.releaseDate || isNaN(item.releaseDate))){
						return true;
					}
					if (!firstReleaseIsNull) {
						var date = new Date(item.releaseDate);
						var day = date.getDate();
						var month = date.getMonth();
						var year = date.getFullYear();
						if((releaseDay != day) || (releaseMonth != month) || (releaseYear != year)){
							return true;
						}
					}
				}
			}
		}
    	return false;    	
    },
    shouldSyncReleaseDate : function shouldSyncReleaseDate(data){
    	var scope = erm.scopes.rights();
//    	var scope = angular.element(document.getElementById("rightsController")).scope();
    	var firstReleaseDate = erm.Dates.getFirstReleaseDate(scope.currentProductArray.firstReleaseDate);
    	var isDifferent =  this.isDifferentReleaseDate(firstReleaseDate, data);
		scope.shouldShowSyncButton = isDifferent;
		if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
			  scope.$apply();
		}    	   
    	
    }, 
    refreshGrid : function(gridId){
    	console.log(" REFRESHING GRID ... : "+gridId);
    	$("#"+gridId).data("kendoGrid").refresh();
    }

  };
  //end strands object
  /////////////////////////////////////////////////
 
 strands.refreshFilterElements = function refreshFilterElements(mtlValues) {
		var clearMutliselect = function(multiselect) {
			multiselect.value([]);
		};

		var resetMultiselect = function(multiselect, data) {
			clearMutliselect(multiselect);
			var ds = multiselect.dataSource;
			ds.data(data);
		};

		var mediaInGrid = null;
		mediaInGrid = mtlValues.media;
		var mediaDS = null;
		mediaDS = new kendo.data.DataSource({
			data : mediaInGrid,
		    sort : [
			        {field: "name", dir:"asc"}
			        ]
			
		});

		var territoryInGrid = null;
		territoryInGrid = mtlValues.territory;
		var territoryDS = null;
		territoryDS = new kendo.data.DataSource({
			data : territoryInGrid,
		    sort : [
			        {field: "name", dir:"asc"}
			        ]				
		});

		var languageInGrid = null;
		languageInGrid = mtlValues.language;
		var languageDS = null;
		languageDS = new kendo.data.DataSource({
			data : languageInGrid,
		    sort : [
			        {field: "name", dir:"asc"}
			        ]				
			
		});

		var restrictionsIdGrid = null;
		restrictionsIdGrid = mtlValues.restrictions;
		var restrictionsDS = null;
		restrictionsDS = new kendo.data.DataSource({
			data : restrictionsIdGrid,
		    sort : [
			        {field: "description", dir:"asc"}
			        ]												
		});

		var strandSetsInGrid = null;
		strandSetsInGrid = mtlValues.strandSets;
		var strandSetDS = null;
		strandSetDS = new kendo.data.DataSource({
			data : strandSetsInGrid,
		    sort : [
			        {field: "strandSetName", dir:"asc"}
			        ]								
		});

		console.log("refreshFilterELements. Setting up multiselects");
		var mediaMultiSelect = null;
		mediaMultiSelect = $("#media-multi-select");
		var mediaKendoMultiSelect = null;
		mediaKendoMultiSelect = mediaMultiSelect
				.data("kendoMultiSelect");
		var territoryMultiSelect = $("#territory-multi-select");
		var territoryKendoMultiSelect = territoryMultiSelect
				.data("kendoMultiSelect");
		var languageMultiSelect = $("#language-multi-select");
		var languageKendoMultiSelect = languageMultiSelect
				.data("kendoMultiSelect");
		var strandSetMultiSelect = $("#strand-set-multi-select");
		var strandSetKendoMultiSelect = strandSetMultiSelect
				.data("kendoMultiSelect");
		var restrictionsMultiSelect = $("#restrictions-multi-select");
		var restrictionKendoMultiSelect = restrictionsMultiSelect
				.data("kendoMultiSelect");

		if (mediaKendoMultiSelect) {
			resetMultiselect(mediaKendoMultiSelect, mediaInGrid);
		} else {
			mediaKendoMultiSelect = mediaMultiSelect.kendoMultiSelect({
				dataSource : mediaDS,
				dataValueField : "id",
				dataTextField : "name"
			});
		}

		if (territoryKendoMultiSelect) {
			resetMultiselect(territoryKendoMultiSelect, territoryInGrid);
		} else {
			territoryKendoMultiSelect = territoryMultiSelect
					.kendoMultiSelect({
						dataSource : territoryDS,
						dataValueField : "id",
						dataTextField : "name"
					});

		}

		if (languageKendoMultiSelect) {
			resetMultiselect(languageKendoMultiSelect, languageInGrid);
		} else {
			languageKendoMultiSelect = languageMultiSelect
					.kendoMultiSelect({
						dataSource : languageDS,
						dataValueField : "id",
						dataTextField : "name"
					});
		}

		if (strandSetKendoMultiSelect) {
			resetMultiselect(strandSetKendoMultiSelect, strandSetsInGrid);
		} else {
			strandSetKendoMultiSelect = strandSetMultiSelect
					.kendoMultiSelect({
						dataSource : strandSetDS,
						dataValueField : "rightStrandSetId",
						dataTextField : "strandSetName"
					});

		}

		if (restrictionKendoMultiSelect) {
			resetMultiselect(restrictionKendoMultiSelect,
					restrictionsIdGrid);
		} else {
			restrictionKendoMultiSelect = restrictionsMultiSelect
					.kendoMultiSelect({
						dataSource : restrictionsDS,
						dataValueField : "code",
						dataTextField : "description"
					});
		}

		//MLC-cr TMA 5/28/14
		$("#filter-grid-button").off();
		$("#filter-grid-button").click(filterGridButtonClick);
		function filterGridButtonClick() {
			var filters = strands.getFilter();
			//now save the filter
			var valuesFromFilter = strands.filter.elements.getValuesFromUI();
			strands.filter.set(valuesFromFilter);
			var strandsGrid = null;
			strandsGrid = $("#strandsGrid").data("kendoGrid");
			strandsGrid.dataSource.filter(filters);
			var rcscope = erm.scopes.rights();
            rcscope.showExpandStrandInformationalCodes = true;
            if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
	          rcscope.$apply();
	        }
		};

		//MLC-cr TMA 5/28/14
		$("#filter-clear-button").off();		
		$("#filter-clear-button").click(filterClearButtonClick);
		function filterClearButtonClick() {				
			var filter = {};
			strands.filter.clear();
			var strandsGrid = null;
			strandsGrid = $("#strandsGrid").data("kendoGrid");
			strandsGrid.dataSource.filter(filter);
			//AMV need to manualy clear restriction's multilselect as they keep accumulating values
			strands.clearRestrictionsMultiselect();
			resetStrandsAndRestrictionsCheckboxes();
			var multi = null;
			multi = $("#territory-multi-select").data("kendoMultiSelect");
			multi.value("");
			multi.input.blur();	
			
			var multi = null;
			multi = $("#media-multi-select").data("kendoMultiSelect");
			multi.value("");
			multi.input.blur();	
			
			var multi = null;
			multi = $("#language-multi-select").data("kendoMultiSelect");
			multi.value("");
			multi.input.blur();
			
			var multi = null;
			multi = $("#strand-set-multi-select").data("kendoMultiSelect");
			multi.value("");
			multi.input.blur();
			
			var multi = null;
			multi = $("#restrictions-multi-select").data("kendoMultiSelect");
			multi.value("");
			multi.input.blur();				
			$("#all-inclusion-exclusion-radio").prop("checked",true);
			$("#all-business-legal-radio").prop("checked",true);			
			$("#start-date-filter").val("");
			$("#end-date-filter").val("");
		};
		
		//MLC-cr TMA 5/28/14
		var resetStrandsAndRestrictionsCheckboxes = resetStrandsAndRestrictionsCheckboxesFunction;
		function resetStrandsAndRestrictionsCheckboxesFunction(){
			$("#grid-clear-selection").click();
		};

	};//end refreshFilterElements	
    
  //start grid strands configurator
  
  var gridStrandsConfigurator = {
		  editMode:true,
		  strandsById :[],
		  strandRestrictionsById:[],
		  setEditMode:function(edit) {
			this.editMode=edit;  
		  },
		  getDS: function() {
			var grid = null;
			grid = $("#strandsGrid").data("kendoGrid"); 
			if (!grid) return undefined;
			return grid.dataSource;
		  },
		  filter : {
				mtlValues: {
						media : [],
						territory : [],
						language : [],				
						//amv trying to figure out what's wrong with restrictions selector
						restrictions: [],
						clear: function clear() {
							this.media = [];
							this.territory = [];
							this.language = [];
						}
					},
		  		clear: function clear() {
		  			this.mtlValues.clear();
		  		}
				
		},
		getFilteredData: function getFilteredData() {
			return strands.getFilteredDataFromDS(this.getDS());
		},
		  
	clear: function clear() {
	  //this.strandsById=[];
	  this.strandsById = null;
	  this.strandRestrictionsById=[];
	  strands.clear();
	  this.clearGrid();
	},		  
	fixGroupingsIcons: function fixGroupingsIcons() {
		var fixCommentIcon = null;
		fixCommentIcon = function fixCommentIcon() {
			var commentsIcon = null;
			commentsIcon = $(".k-group-indicator[data-title=\"<i class='icon-comments'></i>\"]").find('.k-link');
			if (commentsIcon && commentsIcon.length>0) {
				var html = null;
				html = commentsIcon.html();
				html = html.replace("&lt;i class='icon-comments'&gt;&lt;/i&gt;",'Comments');
				commentsIcon.html(html);			
			}

		};
		var fixMappingIcon = function fixMappingIcon() {
			var commentsIcon = $(".k-group-indicator[data-title=\"<i class='icon-sitemap'></i>\"]").find('.k-link');
			if (commentsIcon && commentsIcon.length>0) {
				var html = commentsIcon.html();
				html = html.replace("&lt;i class='icon-sitemap'&gt;&lt;/i&gt;",'Mapping');
				commentsIcon.html(html);			
			}
			
		};
		setTimeout(function() {
			fixCommentIcon();
			fixMappingIcon();
		},500);
	},
	
	getStrandIdByRestrictionId: function getStrandIdByRestrictionId(restrictionId) {
		var restriction = this.getStrandRestrictionById(restrictionId);
		if (!restriction) return null;
		return restriction.rightStrandId;
	},
	
	getStrandById: function getStrandById(id) {
		var strands = null;
		var ids =[];
		ids.push(id);
		strands =this.getStrandsByIds(ids);
		if (strands&&strands.length==1) {
			return strands[0];
		}
		return null;
	},
	getStrandById: function getStrandById(id) {
		var ids =[];
		ids.push(id);
		var strands = this.getStrandsByIds(ids);
		if (strands.length==0) {
			return null;
		}
		return strands[0];
		
	},
	getStrandRestrictionById: function getStrandRestrictionById(id) {
		var ids=[];
		ids.push(id);
		var restrictions = this.getStrandRestrictionsByIds(ids);
		if (restrictions.length==0) {
			return null;
		}
		return restrictions[0];
	},
	
	getStrandsByIds: function getStrandsByIds(ids) {
		var strands = [];
		var indexed = this.strandsById;
		$.each(ids,function(idx,id){
			var strand = indexed[id];
			if (strand) {
				strands.push(strand);
			}
		});
		return strands;
	},

	getStrandRestrictionsByIds: function getStrandRestrictionsByIds(ids) {
		var restrictions = [];
		var indexed = this.strandRestrictionsById;
		$.each(ids,function(idx,id){
			var restriction = indexed[id];
			if (restriction) {
				restrictions.push(restriction);
			}
		});
		return restrictions;
		
	},
	
	setStrandHasComment: function setStrandHasComment(strandId, hasComment) {		
		//first set the model
		var strand = this.getStrandById(strandId);
		if (strand) {
			strand.hasComments = hasComment;
			//now set the icon		
			this.setStrandHasCommentIcon(strandId, hasComment);
		}
	},
	
	setStrandHasMapping: function setStrandHasMapping(strandId,map) {
		//first set the model
		var strand = this.getStrandById(strandId);
		strand.mappedToClearanceMemo = map;
		console.log("setStrandHasMapping: %o", strandId, " map %o", map);
		//now set the icon		
		this.setStrandHasMapIcon(strandId, map);
	},
	
	setStrandAnyRestrictionHasComment: function setStrandAnyRestrictionHasComment(strandId, hasComment) {
		var strand = this.getStrandById(strandId);
		strand.rHasComments = hasComment;
		this.setStrandRestrictionHasCommentIconsByStrandId(strandId,hasComment);		
	},
	
	setStrandAnyRestrictionHasMap: function setStrandAnyRestrictionHasComment(strandId, map) {
		var strand = this.getStrandById(strandId);
		strand.rMappedToClearanceMemo = map;
		this.setStrandRestrictionHasMapIconsByStrandId(strandId,map);		
	},
	
	setStrandRestrictionHasComment: function setStrandRestrictionHasComment(restrictionId, hasComment) {
		//first find the restriction
		var strandRestriction = this.getStrandRestrictionById(restrictionId);
		var strandId = strandRestriction.rightStrandId;
		strandRestriction.hasComments = hasComment;
		strandRestriction.restriction.hasComments = hasComment;
		this.setStrandRestrictionHasCommentIconByStrandRestrictionId(restrictionId,hasComment);
		if (hasComment) {
			this.setStrandAnyRestrictionHasComment(strandId,hasComment);
		}		
	},

	setStrandRestrictionHasMapping: function setStrandRestrictionHasMapping(restrictionId, map) {
		//first find the restriction
		console.log("restrictionId " + restrictionId);
		console.log("restrictionId " + map);
		var strandRestriction = this.getStrandRestrictionById(restrictionId);
		var strandId = strandRestriction.rightStrandId;
		strandRestriction.mappedToClearanceMemo = map;
		this.setStrandRestrictionHasMapIconByStrandRestrictionId(restrictionId,map);
		if (map) {
			this.setStrandAnyRestrictionHasMap(strandId,map);
		}		
	},			

	setStrandHasCommentIcon: function setStrandHasCommentIcon(strandId,hasComment) {
		var cssClass = "icon-comments";
		var id ="commentsID_"+strandId;
		if (!hasComment) {
			cssClass="";
		}
		$("#" +id).attr('class',cssClass);
		
	},
	
	setStrandHasMapIcon: function setStrandHasMapIcon(strandId,map) {
		var cssClass = "icon-sitemap";
		var id ="mappedID_"+strandId;
		if (!map) {
			cssClass="";
		}
		$("#" +id).attr('class',cssClass);
		console.log("setStrandHasMapIcon: %o", $("#" +id));
	},
	
	
	setStrandRestrictionHasCommentIconsByStrandId: function setStrandRestrictionHasCommentIconsByStrandId(strandId,hasComment) {
		var cssClass = "icon-comments";
		var id ="r_hasComments_sID_"+strandId;
		if (!hasComment) {
			cssClass="";
		}
		$("#" +id).attr('class',cssClass);
	},
	setStrandRestrictionHasCommentIconByStrandRestrictionId: function setStrandRestrictionHasCommentIconByStrandRestrictionId(strandRestrictionId,hasComment) {
		var cssClass = "icon-comments";
		var id ="sr_commentsID_"+strandRestrictionId;
		if (!hasComment) {
			cssClass="";
		}
		$("#" +id).attr('class',cssClass);
	},
	
	setStrandRestrictionHasMapIconsByStrandId: function setStrandRestrictionHasMapIconsByStrandId(strandId,map) {
		var cssClass = "icon-sitemap";
		var id ="r_hasMappings_sID_"+strandId;
		if (!map) {
			cssClass="";
		}	
		$("#" +id).attr('class',cssClass);
	},
	setStrandRestrictionHasMapIconByStrandRestrictionId: function setStrandRestrictionHasMapIconByStrandRestrictionId(strandRestrictionId,map) {
		var cssClass = "icon-sitemap";
		var id ="mappedID_"+strandRestrictionId;
		if (!map) {
			cssClass="";
		}		
		$("#" +id).attr('class',cssClass);		
	},
	
	/**
	 * Sets the comment icon on strand row if the child restriction 
	 * @param strandRestrictionId
	 * @param hasComment
	 */
	setStrandRestrictionHasCommentIcon: function setRestrictionHasCommentIcon(strandRestrictionId,hasComment) {
		//first get the parent strand
		var ids = [];
		ids.push(strandRestrictionId);
		var ds = null;
	    ds = gridStrandsConfigurator.getDS();
		var data = null;
		data = ds.data();
		var restrictions = null;
		restrictions =- strands.getStrandRestrictionsByIds(data,ids);
		var restriction = null; 
		var strandId = null;
		var strand = null;
		var strandIds =[];
		var str = [];
		if (restrictions && restrictions.length>0) {
			restriction = restrictions[0];
			strandId = restriction.rightStrandId;
			if (!hasComment) {
				strandIds.push(strandId);
				str = strands.getStrandsByIds(data, strandIds);
				if (str && str.length>0) {
					strand = str[0];
				}
				hasComment = strand.rHasComments;
			}
			this.setStrandRestrictionHasCommentIconByStrandRestrictionId(strandRestrictionId,hasComment);
			//now that we have the strand id
			this.setStrandRestrictionHasCommentIconsByStrandId(strandId, hasComment);
		}
	},
	
	setStrandRestrictionHasMappedIconsByStrandId: function setStrandRestrictionHasMappedIconsByStrandId(strandId,isMapped) {
		var cssClass = "icon-sitemap";
		if (!isMapped) {
			cssClass="";
		}
		$("#r_hasMappings_sID_"+strandId).attr('class',cssClass);
	},

	setStrandRestrictionIsMappedIcon: function setStrandRestrictionIsMappedIcon(strandRestrictionId,isMapped) {
		//first get the parent strand
		var ids = [];
		ids.push(strandRestrictionId);
		var ds= null;
		ds = gridStrandsConfigurator.getDS();
		var data = null;
		data = ds.data();
		var restrictions = null;
		restrictions = strands.getStrandRestrictionsByIds(data,ids);
		var restriction = null; 
		var strandId = null;
		var strand = null;
		var strandIds =[];
		var str = [];
		if (restrictions && restrictions.length>0) {
			restriction = restrictions[0];
			strandId = restriction.rightStrandId;
			if (!isMapped) {
				strandIds.push(strandId);
				str = strands.getStrandsByIds(data, strandIds);
				if (str && str.length>0) {
					strand = str[0];
				}
				if (!strand || !strands.strandRestrictionsHaveMappings(strand)) {
					isMapped = false;
				}
			}
			//now that we have the strand id
			this.setStrandRestrictionHasMappedIconsByStrandId(strandId, isMapped);
		}
	},
	
	
    getStrandsMapByRestrictionIds: function getStrandsMapByRestrictionIds(ids) {
		var ds = null;
		ds = gridStrandsConfigurator.getDS();
    	var allData = null;
    	allData = ds.data();
		var map={};
		//first convert the ids into a map, so we can query quickly
		var idsMap={};
		$.each(ids,function(idx,elem){
			idsMap[elem]=1;
		});
		$.each(allData,function(idx,strand) {
			var strandId = strand.rightStrandId;
			$.each(strand.ermProductRightRestrictions,function(idx,restriction) {
				var restrictionId = restriction.rightRestrictionId;
				if (idsMap[restrictionId]===1) {
					map[restrictionId]=strandId;
				}
			});
		});
		return map;
    },
	collapseAllRestrictions: function collapseAllRestrictions() {
    	  var grid = null;
    	  grid = $("#strandsGrid").data("kendoGrid");              	  
      	  grid.collapseRow($("tbody").find("tr.k-master-row"));              	     	
    },
    
    
    expandRightStrand: function expandRightStrand(masterRow) {
	    var grid = null;
	    grid = $("#strandsGrid").data("kendoGrid");
		grid.expandRow(masterRow);	  			  	  	
    },
    
    expandChunkOfRestrictions: function expandChunkOfRestrictions(masterRow) {
	    var grid = null;
	    grid = $("#strandsGrid").data("kendoGrid");
		grid.expandRow(masterRow);	  	  
	  	grid.collapseRow(masterRow);		  
	  	if (masterRow != null && masterRow.nextSibling != null && masterRow.nextSibling.children[1] != null && masterRow.nextSibling.children[1].children[0] != null && masterRow.nextSibling.children[1].children[0].children[0] != null) {
	  	  if (masterRow.nextSibling.children[1].children[0].children[0].children[2] != null) {              			
	        if (masterRow.nextSibling.children[1].children[0].children[0].children[2].childElementCount > 0) {
	          grid.expandRow(masterRow);  
	  	    }
	  	  }
	  	}	
    },
    
    timedChunk: function timedChunk(items, process, context, callback){
        var todo = items.concat();   //create a clone of the original
        setTimeout(function(){
            var start = +new Date();	
            do {
        	  process.call(context, todo.shift());
            } while (todo.length > 0 && (+new Date() - start < 50));
            if (todo.length > 0){
                setTimeout(arguments.callee, 1);
            } else {
                callback(items);
            }
        }, 1);
    }, 
    
    finishedExpanding : function finishedExpanding() {
    	console.log("Finished expanding");
    	var rcscope = erm.scopes.rights();
		rcscope.expandStrandInformationalCodesSpinner = false;		
        rcscope.showExpandStrandInformationalCodes = false;
        if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
    		rcscope.$apply();            	
        }
    },
    
    expandPassedStrands : function expandPassedStrands(strandIds) {
    	setTimeout(function() {
    		var myVar = new Array();
    		for (var i = 0; i < strandIds.length; i++) {
    		  var strandCheckbox = document.getElementById("cb" + strandIds[i]);
    		  myVar.push(strandCheckbox.parentElement.parentElement);
    		}
    		gridStrandsConfigurator.timedChunk(myVar, gridStrandsConfigurator.expandRightStrand, this, gridStrandsConfigurator.finishedExpanding);
		}, 25);
    },
    
	expandAllRestrictions: function expandAllRestrictions() {
		setTimeout(function() {
			var rcscope = null;
			rcscope = erm.scopes.rights();
			rcscope.expandStrandInformationalCodesSpinner = true;
			if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			  rcscope.$apply();
			}
			var allMasterRows = $("tbody").find("tr.k-master-row");
		  	var myVar = new Array();	  	
		  	console.log("about to loop");
		  	for (var i= 0; i < allMasterRows.length; i++) {
		  		myVar.push(allMasterRows[i]);
		  	}
		  	gridStrandsConfigurator.timedChunk(myVar, gridStrandsConfigurator.expandChunkOfRestrictions, this, gridStrandsConfigurator.finishedExpanding);		  	
		}, 25);
	},
		  
	/**
	 * Finds all the strand restrictions that have one of the codes included in the parameter
	 * @param codes
	 * @param business
	 * @param legal
	 * @param onlyFiltered If olnyFiltered is true, it will find the restriciton ids for only the strands visible in the grid.
	 * 		  If the user filters on other criteria this will get only the strand restrictions for the strands that match the criteria
	 * @returns an array with the ids of the strands restrictions that match the criteria
	 */
	findStrandRestrictionIdsByRestrictionCode : function findStrandRestrictionIdsByRestrictionCode(codes,business,legal,onlyFiltered) {		
		var ds = null;
		ds = gridStrandsConfigurator.getDS();
		var data = null;
		if (onlyFiltered) {
			data = gridStrandsConfigurator.getFilteredData();
		} else {
			data = ds.data();			
		}		 
	
		var isRestrictionCode = function isRestrictionCode(restriction) {
			var restrictionCode = null;
			var rBusiness = restriction.business;
			var rLegal = restriction.legal;
			var isRestriction = false;
			if (restriction.restriction) {				
				restrictionCode = restriction.restriction.code;
			}			
			if (!restrictionCode) {
				return false;
			}
			if (!(business && legal)) {
				if (business && !rBusiness) {
					return false;
				}
				if (legal && !rLegal) {
					return false;
				}
			}
			isRestriction = codes.indexOf(restrictionCode)>=0;
			return isRestriction;
		};
		
		var ids = strands.getStrandRestrictionIdsWithPredicate(data,isRestrictionCode);
		return ids;
	}, 	  
	selectStrandRestrictionsByCode: function selectStrandRestrictionsByCode(codes,business,legal,onlyView) {
		var strandRestrictionIds = this.findStrandRestrictionIdsByRestrictionCode(codes,business,legal,onlyView);
		this.selectByIds([],strandRestrictionIds);	      
	},
	selectStrandRestrictionsByValuesInMultiselect: function selectStrandRestrictionsByValuesInMultiselect(expandAfterSelect) {
		var restrictionMultiSelect=$("#restrictions-multi-select").data("kendoMultiSelect");		
		var values=restrictionMultiSelect.value();
		var business = true;
		var legal = true; 
		var onlyView = true;
		var type = $("input:radio[name='business-legal-radio']:checked").val();
		if (type=='B') {
			legal = false;
		}
		if (type=='L') {
			business=false;
		}
		
		
		//AMV 3/20/2014
		//need to take into account the Business, Legal indicator also
		this.selectStrandRestrictionsByCode(values,business,legal,onlyView);
		if (expandAfterSelect) {
			this.expandAllRestrictions();
			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
			if (ermSidePanelScope.isERMSidePanelOut)
	    	  strands.toggleMapUnMapAndStrandComments();
		}
	}, 
		  
	/**
	 * Set the selected field to true for the provider ids in the model from DS
	 * @param strandIds
	 * @param strandRestrictionIds
	 */
	selectByIds: function selectByIds(strandIds,strandRestrictionIds) {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
	    var allData = null;
	    allData = ds.data().toJSON();
	    //console.log("selectByIds strandRestrictionIds %o", strandRestrictionIds);
		$.each(allData, function(idx, elem) {
			var strandId = elem.rightStrandId;
			if (strandIds.indexOf(strandId)>=0) {
				elem.selected = true;
			} else {
				elem.selected = false;
			} 
			//console.log("selectByIds elem.ermProductRightRestrictions %o", elem.ermProductRightRestrictions);
			if (elem.ermProductRightRestrictions) {
				$.each(elem.ermProductRightRestrictions,function(idx,elem) {
					var rightRestrictionId= elem.rightRestrictionId;
					if (strandRestrictionIds.indexOf(rightRestrictionId)>=0) {
						elem.selected = true;	
						strands.selections.selectStrandRestriction(elem.rightRestrictionId);			          			        	
					} else {
						elem.selected = false;
						strands.selections.unSelectStrandRestriction(elem.rightRestrictionId);
					}
				});
			}
		});
		ds.data(allData);	    //TMA: where is this used?
//	    var data = ds.data().toJSON();
		
	},	  

	 getStrandIdsWithComments: function getStrandIdsWithComments() {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
	    var data = null;
	    data = ds.data();
	    var ids = null;
	    ids = strands.getStrandIdsWithPredicate(data,strands.getStrandsHasCommentPredicate);
	    return ids;

	 },
	 
	 getStrandRestrictionIdsWithComments: function getStrandRestrictionIdsWithComments() {
			var ds= null;
			ds = gridStrandsConfigurator.getDS();    
		    var data = null;
		    data = ds.data();
		    var ids = null;
		    ids = strands.getStrandRestrictionIdsWithPredicate(data,strands.getRestrictionHasCommentPredicate);
		    return ids;		 
	 }, 
		  
	  showSelectedInNewGrid: function(divId) {
			var selectedElements = null;
			selectedElements = this.getSelectedElements();
			strands.showStrandsGrid(selectedElements, divId);
	  },
		  
  
	  selectStrandsInGrid : function(ids) {
		  	console.log("Selecting right strands in grid %o",ids);
		    //TMA var grid = $("#strandsGrid").data("kendoGrid");
		    //TMA strands.selectGridElements(grid,ids,function(elem){
		  	strands.selectGridElements($("#strandsGrid").data("kendoGrid"),ids,function(elem){
		      return elem.rightStrandId; 
		    });
		  },	
	
	  selectStrandRestrictionsInGrid : function(ids) {
		  console.log("Selecting strand reststrictions in grid %o",ids);		  		  
		  console.log(".strand-restrictions %o", $(".strand-restrictions"));
		  var grid = null;
		  grid = $("#infoCodeGrid").data("kendoGrid");
		  if (grid != null) {
		    strands.selectGridElements(grid,ids,function(elem){
			  return elem.rightStrandId; 
		    });
		  } 
	  },	  
		 
	  isSidePanelOpen: function isSidePanelOpen() {
		  var ermSidePanelScope = null;
		  ermSidePanelScope = erm.scopes.comments();
		  var isOpen = ermSidePanelScope.isERMSidePanelOut;
		  return isOpen;		  
	  },
	  
	  loadCommentCounts: function loadCommentCounts() {
		  var ermSidePanelScope = erm.scopes.comments();
		  ermSidePanelScope.loadStrandCommentCounts();		  
	  },
	  
	  loadCommentsFromSavedStrands: function(savedIds) {
		  var hasComments = false;
		  var strandIds = savedIds;
		  //TMA var savedStrands = this.getStrandsByIds(savedIds);
		  var strandRestrictionIds = [];
		  var selection = null;
		  //TMA $.each(savedStrands, function(idx,s){
		  $.each(this.getStrandsByIds(savedIds), function(idx,s){
			 if (s.hasComments||s.rHasComments) {
				 hasComments = true;
			 }			 
			 $.each(s.ermProductRightRestrictions,function(idx,r){
				strandRestrictionIds.push(r.rightRestrictionId); 
			 });
		  });
		  if (hasComments) {
			  //only if any of the saved strand had comments, refresh the comments panel
			  //TMA selection = strands.getCommentSelection(strandIds,strandRestrictionIds,null);
			  strands.toggleStrandComments(strands.getCommentSelection(strandIds,strandRestrictionIds,null));			  
		  }
	  },
	  
	  clearFilterAfterSave : function() {				
		$("#all-inclusion-exclusion-radio").prop("checked",true);
		$("#all-business-legal-radio").prop("checked",true);			
		$("#start-date-filter").val("");
		$("#end-date-filter").val("");
		console.log("done clearing options");	
	  },
	  	  
	  setSavedElements: function(savedIds)  {		  
		  var message = "Saved " + savedIds.length + (savedIds.length > 1 ? " rights strands": " rights strand");
		  var messageDivId="strands-message";
		  strands.setMessage(message,messageDivId);
		  this.selectStrandsInGrid(savedIds);
		  this.loadCommentCounts();
		  if (this.isSidePanelOpen()) {
			  this.loadCommentsFromSavedStrands(savedIds);
		  }	
		  console.log("Clicking filter clear button");	
		  this.clearFilterAfterSave();		  
	  },
	  
	  setDeletedElements: function(deletedIdsTotal)  {
		  var message = "Deleted " + deletedIdsTotal + (deletedIdsTotal.length > 1 ? " rights strands/restrictions": " rights strand/restriction") + "  Please wait...";
		  var messageDivId="strands-message";
		  strands.setMessage(message,messageDivId);	  
		  this.clearFilterAfterSave();
	  },
	  
	  setUpdatedElements: function(updatedIdsTotal)  {
		  var message = "Updated " + updatedIdsTotal + (updatedIdsTotal.length > 1 ? " rights strands/restrictions": " rights strand/restriction");
		  var messageDivId="strands-message";
		  strands.setMessage(message,messageDivId);	
		  this.clearFilterAfterSave();
	  },
	  
	  setUpdatedRestrictions: function(updatedIdsTotal, data)  {
		  var message = "Updated " + updatedIdsTotal.length + (updatedIdsTotal.length > 1 ? " restrictions": " restriction");
		  var messageDivId="strands-message";
		  strands.setMessage(message,messageDivId);	
		  var selected = null;
		  selected = strands.getStrandRestrictionsByIds(data, updatedIdsTotal);
		  this.loadCommentCounts();		  
		  if(selected){
			  var r = [];
			  $.each(selected, function(id, elem){
				  r.push(elem.rightStrandId);
			  });
			  this.selectStrandsInGrid(r);
		  }
		  this.clearFilterAfterSave();
	  },

	  toggleFilterCollapsed : true,
	  
	  expandFilter : function() {
		$("#toggle-filter").html("Hide Filter");
		gridStrandsConfigurator.toggleFilterCollapsed = false;
		$("#standsFilter").removeClass("collapse");
		$("#standsFilter").attr("style", "height: auto");
	  },
	  
	  collapseFilter : function() {
		$("#toggle-filter").html("Show Filter");
		gridStrandsConfigurator.toggleFilterCollapsed = true;
		$("#standsFilter").addClass("collapse");
		$("#standsFilter").attr("style", "height: 0");
	  },
	  
	  setUpFilter : function() {
		//MLC-cr TMA 5/28/14
		var toggleFilter = toggleFilterFunction;
		function toggleFilterFunction() {
			var toggleFilterLink = $("#toggle-filter");
			toggleFilterLink.unbind('click');
			
			//MLC-cr TMA 5/28/14
			toggleFilterLink.click(toggleFilterLinkClick);
			function toggleFilterLinkClick() {
				console.log("toggle filter clicked");										
				gridStrandsConfigurator.toggleFilterCollapsed = !gridStrandsConfigurator.toggleFilterCollapsed;
				if (gridStrandsConfigurator.toggleFilterCollapsed) {
				  gridStrandsConfigurator.collapseFilter();
				} else {
				  gridStrandsConfigurator.expandFilter();
				}										
			};
		};

		toggleFilter();

	},
	
	getIsStrandSelectedMap:function(ids) {
		var ds = null;
		ds = gridStrandsConfigurator.getDS();
		
		return strands.getIsStrandSelectedMap(ids,ds);
	},

	setNumberOfLegalAndBusinessElementsFromDS : function(ds) {	  
	  var rcscope = null;
	  rcscope = erm.scopes.rights();
	  rcscope.currentProductArray.businessStrandsCount = 0;
	  rcscope.currentProductArray.legalStrandsCount = 0;	 
  	  if (ds != null) {
		var allData = null;
		allData = ds.data().toJSON();		
	    $.each(allData,function(idx,elem) {	      
	      if (elem.legalInd)
	  	    rcscope.currentProductArray.legalStrandsCount++; 
		  if (elem.businessInd)
		    rcscope.currentProductArray.businessStrandsCount++;
	    });
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
		  rcscope.$apply();
	    rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
	  }
	},

	 getSelectedStrandRestrictionElements:function() {		
		  var ds = null;
		  ds = gridStrandsConfigurator.getDS();
		 //TMA var selectedStrandRestrictionsElements = strands.getSelectedStrandRestrictionsFromDS(ds);	
		 //TMA var selectedStrandRestrictionsElements = strands.getSelectedStrandRestrictionsFromDS(this.ds);
		 //TMA return selectedStrandRestrictionsElements;	
		 return strands.getSelectedStrandRestrictionsFromDS(ds);
	 },
	 
	 unCheckRightStrandElements: function() {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
		if (ds != null) {
		  var data = null;
		  data = ds.data();	      	     
		  $.each(data,function(idx,elem){
		    elem.selected=false;
		  });
		  ds.data(data);
		}
	 },
	 
	 unCheckRightStrandRestrictions: function() {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
		if (ds != null) {
		  var data = null;
		  data = ds.data();		
		  //MLC-cr 
		  $.each(data,function(idx,elem) {	  
			//MLC-cr 
	  		$.each(elem.ermProductRightRestrictions,function(idx,innerelem) {		         
	            innerelem.selected=false;		          
	        });
		  });	 
		  ds.data(data);
		}
	 },
	  
	 checkSelectedRightStrandElements: function(ids, checkedValue) {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
	    var data = null;
	    data = ds.data();
	  //MLC-cr 
	    $.each(ids, function(index, value)  {
	      //console.log("checkSelectedRightStrandElements value: " + value + " checkedValue: " + checkedValue);
		  strands.setSelected(data, value, checkedValue);		
	    });
	    ds.data(data);
	 }, 
	 getSelectedStrandsByIds: function getSelectedStrandsByIds(){
		 	var ds = null;
		    ds = gridStrandsConfigurator.getDS();
			var selected = null;
			if (ds != null) {
				selected = strands.getStrandsByIds(ds.data(), strands.selections.getSelectedStrandIds());
			}
		    return selected;
	 },
	 getSelectedStrandRestrictionsByIds: function getSelectedStrandRestrictionsByIds() {
		 	var ds = null;
		 	ds = gridStrandsConfigurator.getDS();
		 	var selected = null;
		 	if (ds != null) {
		 	  var data = null;
		 	  data = ds.data();
		      selected = strands.getStrandRestrictionsByIds(data, strands.selections.getSelectedStrandRestrictionIds());
		 	}
		    return selected;		 	
	 },
	  
	 checkSelectedRightStrandRestrictions: function(ids, checkedValue) {
		var ds= null;
		ds = gridStrandsConfigurator.getDS();    
	    var data = null;
	    data = ds.data();
	    
	  //MLC-cr 
	    $.each(ids, function(index, value) {    	
		  strands.setSelectedStrandRestriction(data, value, checkedValue);		  
	    });	    
	    this.selectByIds([],ids);
	    ds.data(data);
	 }, 
	 
	 
	 commentsRightStrandRestriction: function(ids, isRightStrand, hasComments) {
		var that = this;
		var strandIds = [];
		
		//MLC-cr TMA 5/28/14
		var refreshStrandRestrictionsIconForStrandFromServer = null;
		refreshStrandRestrictionsIconForStrandFromServer = refreshStrandRestrictionsIconForStrandFromServerFunction;
		function refreshStrandRestrictionsIconForStrandFromServerFunction(strandId) {
			var url = "rest/Comments/commentCount/strand/strandRestriction/"+strandId;
			$.get(url,function(data){
				var hasComments = false;
				if (data && data>0) {
					hasComments = true;
				}
				gridStrandsConfigurator.setStrandAnyRestrictionHasComment(strandId, hasComments);				
			});
		};
		
		//MLC-cr TMA 5/28/14
		var refreshStrandRestrictionIconFromServer = refreshStrandRestrictionIconFromServerFunction;
		function refreshStrandRestrictionIconFromServerFunction(restrictionId) {
			//TODO implement
			var url = "rest/Comments/commentCount/strandRestriction/"+restrictionId;
			$.get(url,function(data){
				var hasComments = false;
				if (data && data>0) {
					hasComments = true;
				}
				gridStrandsConfigurator.setStrandRestrictionHasComment(restrictionId, hasComments);
			});			
		};
		
		//MLC-cr TMA 5/28/14
		var refreshStrandIconFromServer = refreshStrandIconFromServerFunction;
		function refreshStrandIconFromServerFunction(strandId) {
			//TODO implement
			var url = "rest/Comments/commentCount/strand/"+strandId;
			$.get(url,function(data){
				var hasComments = false;
				if (data && data>0) {
					hasComments = true;
				}
				gridStrandsConfigurator.setStrandHasComment(strandId, hasComments);
			});			
			
		};
		//TODO re implement this
		if (isRightStrand) {
			//MLC-cr 
			$.each(ids,function(idx,id){
				that.setStrandHasComment(id,hasComments);
			});
		} else {
			$.each(ids,function(idx,id){
				that.setStrandRestrictionHasComment(id,hasComments);
			});
		}
		if (!hasComments) {
			if (isRightStrand) {
				strandIds = ids;
			} else {
				//the ids ara strand restriction ids
				//we need to find the ids for the strands
				$.each(ids,function(idx,id) {
					var strandId = gridStrandsConfigurator.getStrandIdByRestrictionId(id);
					strandIds.push(strandId);
				});
			}
			if (!isRightStrand) {
				if (strandIds&&strandIds.length>0) {
					$.each(strandIds,function(idx,elem){
						refreshStrandRestrictionsIconForStrandFromServer(elem);
					});
				}
				if (ids && ids.length>0) {
					$.each(strandIds,function(idx,elem){
						refreshStrandRestrictionIconFromServer(elem);
					});					
				}
			} else {
				//is right strand
				if (ids && ids.length>0) {
					$.each(strandIds,function(idx,elem){
						refreshStrandIconFromServer(elem);
					});										
				}
			}
			
		}
		 
	 },
	 
	 mapRightStrandRestriction: function(ids, isRightStrand, map) {
		var that = this;
		//TODO re implement this
		if (isRightStrand) {
		  $.each(ids,function(idx,id){
			that.setStrandHasMapping(id,map);
		  });
		} else {
		  $.each(ids,function(idx,id){
			that.setStrandRestrictionHasMapping(id,map);
		  });
		}
	 },
	 
	  getSelectedElements : function() {
		var ds = null;
		ds = gridStrandsConfigurator.getDS();
		var selectedElements = null;
		selectedElements = strands.getSelectedElementsFromDS(ds);
		return selectedElements;
	  },

	  getSelectedIds : function() {
		var ids;
		var timer = erm.timer("getSelectedIds").start();
		ids =  strands.getIds(this.getSelectedElements());
		timer.print();
		return ids;
	  },
	  
	  getSelectedMap : function() {
		return strands.getSelectedRightStrandMapFromElements(this.getSelectedElements());
	  },
	  
	  isSelectedStrandsPartOfStrandSet : function() {
		return strands.isSelectedStrandsPartOfStrandSet(this.getSelectedElements());
	  },	  	  

	  getSelectedStrandRestrictionIds : function getSelectedStrandRestrictionIds() {
		return strands.selections.getSelectedStrandRestrictionIds();		  
//		var ids = strands.getStrandRestrictionIds(this.getSelectedStrandRestrictionElements());	
//		return ids;
	  },
	  
	  getSelectedStrandRestrictionMap : function() {
		var map = strands.getSelectedStrandRestrictionMapFromElements(this.getSelectedStrandRestrictionElements());
		return map;
	  },
      clearGrid : function clearGrid() {
    	    var clearGlobals = function clearGlobals() {
    	    	window.currentTooltip = null;
    	    };
    	  //MLC-cr TMA 5/28/14
    	    var clearEvents = clearEventsFunction;
    	    function clearEventsFunction() {
    	    	var sc =$(".strand-checkbox");
    	    	var rl =$(".restriction-link");
    	    	var src =$(".strand-restriction-clear");
    	    	var cball =$(".cbrsrall-checkbox");
    	    	var sdl =$(".start-date-link");
    	    	var edl =$(".end-date-link");
    	    	var ml =$(".media-link");
    	    	var tl =$(".territory-link");
    	    	var ll=$(".language-link");
    	    	var ssl=$(".strand-set-link");
    	    	var rl=$(".restriction-link");
    	    	var prl=$(".product-restriction-link");
    	    	
    	    	sc.off();
    	    	rl.off();
    	    	src.off();
    	    	cball.off();
    	    	sdl.off();
    	    	edl.off();
    	    	ml.off();
    	    	tl.off();
    	    	ll.off();
    	    	ssl.off();
    	    	rl.off();
    	    	prl.off();;


    	    	sc.remove();
    	    	rl.remove();
    	    	src.remove();
    	    	cball.remove();
    	    	sdl.remove();
    	    	edl.remove();
    	    	ml.remove();
    	    	tl.remove();
    	    	ll.remove();
    	    	ssl.remove();
    	    	rl.remove();
    	    	prl.remove();
    	    	
    	    	//TMA remove and detach
    	    	sc.detach();
    	    	rl.detach();
    	    	src.detach();
    	    	cball.detach();
    	    	sdl.detach();
    	    	edl.detach();
    	    	ml.detach();
    	    	tl.detach();
    	    	ll.detach();
    	    	ssl.detach();
    	    	rl.detach();
    	    	prl.detach();
    	    	
    	    	/*
    	    	$(".strand-checkbox").off();
    	    	$(".restriction-link").off();
    	    	$(".strand-restriction-clear").off();
    	    	$(".cbrsrall-checkbox").off();
    	    	$(".start-date-link").off();
    	    	$(".end-date-link").off();
    	    	$(".media-link").off();
    	    	$(".territory-link").off();
    	    	$(".language-link").off();
    	    	$(".strand-set-link").off();
    	    	$(".restriction-link").off();
    	    	$(".product-restriction-link").off();
    	    	*/
    	    	
    	    	$("#grid-clear-selection").off();
    	    	$("#select-right-restrictions-grid-button").off();
    	    	$("#select-expand-right-restrictions-grid-button").off();
    	    	$("#select-grid-button").off();
    	    	$("#collapseAllStrandInfoCodes").off();
    	    	$("#expandAllStrandInfoCodes").off();
    	    	$("#strand-grid-select-all").off();
    	    	
    	    	
    	    	
    	    };
    	  //MLC-cr TMA 5/28/14
	  		var clearFilter = clearFilterFunction;
	  		function clearFilterFunction() {
				var clearMultiSelect = function(id) {
//					multiselect = $(id).data("kendoMultiSelect");
//					if (multiselect) {
//						multiselect.value([]);						
//						multiselect.destroy();
//					}
//			    	$(id).empty();				
				};
				
				clearMultiSelect("#media-multi-select");
				clearMultiSelect("#territory-multi-select");
				clearMultiSelect("#language-multi-select");
				clearMultiSelect("#restrictions-multi-select");			
			};
			//MLC-cr TMA 5/28/14
			var clearDS = clearDSFunction;
			function clearDSFunction(ds) {
				var clearArray = function clearArray(array) {
					if (array) {
						while (array.length > 0) {
						      array.pop();
						}						
					}
				};
				if (ds) {
					var pristine = ds._pristine;
					var pristineData = ds._pristineData;
					var view = ds._view;
//					var data = ds._data;
					clearArray(pristine);
					clearArray(pristineData);
					clearArray(view);
//					clearArray(data);
					ds._pristine=null;
					ds._pristineData=null;
					ds._view = null;
					ds._data=null;	
				}
			};
	    	var grid = null;
	    	grid = $("#strandsGrid").data("kendoGrid");
	    	clearEvents();
	    	clearGlobals();
	    	this.filter.clear();
	    	if (grid) {
	    		grid.destroy();
	    		clearDS(grid.dataSource);
	    		grid.dataSource =  null;
	    	//}
	    	$("#strandsGrid").empty();
			$("#strandsGrid").remove();
			
			//TMA --remove and detach
			$("#strandsGrid").detach();
			//$("#strandsGrid").unwrap();
			//TMA --remove and detach
	    	}  
	    	
			$("#strands-grid-section").append("<div id='strandsGrid' class='smallFontRights'></div>");
			clearFilter();			
	  },

	  setUpStrandsGrid : function(foxVersionId, savedIds,isRestrictionEdit,applyFilter) {
		var readOnly = !this.editMode;
		/**
		 * Removes the grid from the DOM and then re adds it.
		 * This is to fix an issue when the grid gets refresehd, grouping of columns no longer works
		 */
		gridStrandsConfigurator.clearGrid();
		strandsGrid.progress.showInProgress();
		strandsGrid.progress.setUpMessage();
		var elementId = "strandsGrid";

		var url = paths().getRightStrandsRESTPath() + "/grid/" + foxVersionId;

 		
		//Ajax call to get strands
		$.getJSON(url, function getStrandsFromServer(dataArray){
			strands.shouldSyncReleaseDate(dataArray);
			var dataLength = dataArray.length;
			
			var ds = null;
			ds = new kendo.data.DataSource(
					{	
						data : dataArray,
						pageSize : 50000,
						schema : {
							parse : strandsGrid.gridFunctions.parse
						},						
						sort : [
						        {field: "media.name", dir:"asc"},
						        {field: "territory.name", dir:"asc"},
						        {field: "language.name", dir:"asc"},
						        {field: "startDateDate", dir:"asc"}
						        ]
					});
			// end ds
			//that is gridStrandsConfigurator
//			gridStrandsConfigurator.ds = ds;			
			
			var baseGridConfig = null;
			baseGridConfig = {

					dataSource : ds,
					groupable : true,
					sortable: true,
					filterable : false,
					resizable: true,
					selectable: "multiple, row",
					detailTemplate : "<div class='strand-restrictions'></div>",
					detailInit : detailInitRestrictions,
					dataBound : strandsGrid.gridFunctions.ondatabound,
					pageable: {
                    	numeric : false,
                    	previousNext : false,
                    	buttonCount : 0,
                    	pageSizes : false
                    },
					scrollable : true,
					height : eval(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 250),
					columns : strands.getStrandColumns(readOnly)
		 }; 
			//dataLenghth has the number of rows
			//if the rows exceed 19, make the height 550px
			if(dataLength > 19){
				baseGridConfig.height=eval(Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 250),
				$("#" + elementId).kendoGrid(baseGridConfig);
			}
			else {
				//baseGridConfig.height= (eval(dataLength * 90) + "px");				
				$("#" + elementId).kendoGrid(baseGridConfig);
			}

			strands.afterDSLoad(savedIds);
			if (savedIds) {
				console.log("strands grid onDataBoud saved ids %o", savedIds);
				// if the saved elements was provided
				// show the message and select the elements
				if(isRestrictionEdit){
					gridStrandsConfigurator.setUpdatedRestrictions(savedIds, gridStrandsConfigurator.getDS().data());
				} else {
					gridStrandsConfigurator.setSavedElements(savedIds);
				}			
			}
			if (applyFilter) {
				strands.filter.elements.setValuesInUI();
			}
			
		});
		
		//MLC-cr TMA 5/28/14
		var detailInitRestrictions = detailInitRestrictionsFunction;
		function detailInitRestrictionsFunction(e) {
			console.log("detailInitRestrictions e %o", e);
			strands.detailInitRestrictions(e,readOnly);
		};
	}
	};
  

function rsToggleERMSidePanel(panel) {	
	var scope = null;
	scope = angular.element(document.getElementById("mainController")).scope();
	scope.openERMSidePanel();	
	var ermSidePanelScope = null;
	ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();		
	ermSidePanelScope.switchERMSidePanels(panel);
	if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
	  scope.$apply();
	if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest')
	  ermSidePanelScope.$apply();
}

