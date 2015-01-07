//TMA: This object has 2 elements:
//1) strandsGrid.progress
//2) strandsGrid.gridFunctions
//strandsGrid.progress contains progress related functions like
//* hidespinner
//* showInProgress
//* showSpinner
//* showCompleted
//* setUpMessage
//strandsGrid.gridFunctions is where all the juicy stuff happens.
//strandsGrid.gridFunctions has 2 functions: 1) parse and 2) ondatabound
//TMA 5/28/14
//MEMORY LEAK CANDIDATES identified by circular JS/DOM references are marked by //MLC-cr
//http://www.javascriptkit.com/javatutors/closuresleak/index3.shtml

//DESIGN NOTE (DN): GLOBAL OBJECT
strandsGrid = {};

strandsGrid.progress = {
				hideSpinner : function hideSpinner() {
					$("#strands-grid-spinner").hide();
					$(".territory-link").popover({trigger: 'manual', placement: 'bottom', html: true, 'template': '<div class="popover" onmouseover="$(this).mouseleave(function() {$(this).hide(); });"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>' });
					$(".media-link").popover({trigger: 'manual', placement: 'bottom', html: true, 'template': '<div class="popover" onmouseover="$(this).mouseleave(function() {$(this).hide(); });"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>' });			
				},
				showInProgress : function showInProgress() {
					console.log("Rights strands loading...");
					this.showSpinner();
					//hideStrandsSection();
				},
				showSpinner : function showSpinner() {
					$("#strands-grid-spinner").show();
				},
				showCompleted : function showCompleted() {
					console.log("Showing strands....");
					this.hideSpinner();
					gridStrandsConfigurator.fixGroupingsIcons();
					console.log("Done Showing strands....");			
				},
				setUpMessage: function setUpMessage() {
					$("#strands-message").hide();
					//MLC-cr TMA 5/29/14 -- yes I did this a day later
					$("#message-alert-close-button").click(messageAlertCloseButtonClick);
					function messageAlertCloseButtonClick() {
						$("#strands-message").hide();
					};					
				}
		
}; //end progress
///////////////////////BEGIN: GRIDFUNCTIONS////////////////////////////////////
strandsGrid.gridFunctions = {
		
	///////////////////////BEGIN: PARSE////////////////////////////////////
	parse: function parseStrands(data) {
		
				
		
			    var mtlValues = null;
			    mtlValues = gridStrandsConfigurator.filter.mtlValues;
				strands.selections.clearAll();								
				console.log("right strands grid, parsing data for " + data.length + " strands");
				//first expand the data 
				strands.convertStrandsToLongFormat(data);
				//data is expanded at this point
				
				//LOCAL FUNCTION VARS INITS
				var media = [];
				var territory = [];
				var language = [];
				var restrictions = [];
				var strandSets = [];
				//LOCAL FUNCTION VARS INITS
				
				var toRestrictionsCodesList = function toRestrictionsCodesList(restrictionCodes) {
					if (!restrictionCodes) {
						return "";
					}
					return restrictionCodes.join(", ");
				};
				
				var toRestrictionsString = function toRestrictionString(restrictionCodes) {
					var string = "";
					var code = null;
					var convertedCode = null;
					for ( var i = 0; restrictionCodes
							&& i < restrictionCodes.length; i++) {
						code = restrictionCodes[i];
						convertedCode = "#" + code + "#";
						string += convertedCode;
					}		
					return string;
				};
				var toColorCodedRestrictionsString= function toColorCodedRestrictionsString(strand,restrictions) {
					
					var strandId = strand.rightStrandId;

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
					var str="";
					var first=true;
					var anyHasComments=false;
					var anyHasMappings=false;
					var restrictionsHasElements=false;
					
					$.each(restrictions,function(idx,element) {
						restrictionsHasElements=true;
						var isBusiness = element.business;
						var isLegal = element.legal;
						var restrictionCode = element.restriction.code;
						if (element.hasComments) {
							anyHasComments = true;
						}
						if (element.mappedToClearanceMemo) {
							//console.log("element.mappedToClearanceMemo %o", element);
							anyHasMappings = true;
						}
						var formated = applyFormat(restrictionCode,isBusiness,isLegal);
						if (!first) {
							str+=", ";
						}
						str+=formated;
						first = false;
					});
					
					//if any of the restriction has comments append the comment icon
					var rMappedToClearanceMemo = false;
					var rHasComments = false;									
					if (restrictionsHasElements) {
						var iconMappingsId = "r_hasMappings_sID_" + strandId;
						var iconMappingsClass = "";
						if (anyHasComments) {
							iconCommentsClass = "icon-comments";
							rHasComments = true;
						}
						if (anyHasMappings) {
							iconMappingsClass = "icon-sitemap";
							rMappedToClearanceMemo = false;											
						}
						var iconMappings = "&nbsp; <i title=\"mappings\" id=\"" + iconMappingsId + "\" class='" +iconMappingsClass +"'></i>";
						str += iconMappings;
					}
					strand.rMappedToClearanceMemo = rMappedToClearanceMemo;
					strand.rHasComments = rHasComments;
					return str;
				}; 
				
				this.toTitleCase = function toTitleCase(str) {
					return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				};
				
				var setRestrictionCodes = function setRestrictionsCodes(strand) {
					var restrictionCodes = null;
					restrictionCodes = strand.restrictionCodes;
					var ermProductRightRestrictions = null;
					ermProductRightRestrictions = strand.ermProductRightRestrictions;
					// sort restrictions by codes
					ermProductRightRestrictions.sort(function(a,b) {										
						return a.restriction.code.toUpperCase().localeCompare(b.restriction.code.toUpperCase());										
					});
					var restrictionCodesString = null;
					restrictionCodesString = toRestrictionsString(restrictionCodes);
					var restrictionCodesList = null;
					restrictionCodesList = toRestrictionsCodesList(restrictionCodes);
					strand.restrictionCodesString = restrictionCodesString;
					strand.restrictionCodesList = restrictionCodesList;
					strand.colorRestrictionCodeList = toColorCodedRestrictionsString(strand,ermProductRightRestrictions);
				};

				var getMTLId = function(element) {
					return element.id;
				};
				var mediaAccumulator = null;
				mediaAccumulator = strands.getAccumulator(
						media, getMTLId);
				var territoryAccumulator = null;
				territoryAccumulator = strands.getAccumulator(
						territory, getMTLId);
				var languageAccumulator = null;
				languageAccumulator = strands.getAccumulator(
						language, getMTLId);
				var restrictionsAccumulator = null;
				restrictionsAccumulator = strands
						.getAccumulator(restrictions, function(
								restriction) {
							return restriction.code;
						});

				var strandSetAccumulator = null;
				strandSetAccumulator = strands.getAccumulator(
						strandSets, function(strandSet) {
							return strandSet.rightStrandSetId;
						});

				var accumulateMTL = null;
				accumulateMTL = function(strand) {
					mediaAccumulator.accumulate(strand.media);
					territoryAccumulator
							.accumulate(strand.territory);
					languageAccumulator.accumulate(strand.language);

				};

				var accumulateRestriction = null;
				accumulateRestriction = function(restriction) {
					if (restriction) {
						restrictionsAccumulator
								.accumulate(restriction);
					}
				};

				var accumulateStrandSet = null;
				accumulateStrandSet = function accumulateStrandSet(strandSet) {
					if (strandSet) {
						strandSetAccumulator.accumulate(strandSet);
					}
				};

				var refreshSelectors = null;
				refreshSelectors = function refreshSelectors() {
					mtlValues.media = media;
					mtlValues.territory = territory;
					mtlValues.language = language;
					mtlValues.restrictions = restrictions;
					mtlValues.strandSets = strandSets;
					strands.refreshFilterElements(mtlValues);

				};

				var setDates = null;
				setDates = strands.setDates;
				var setStrandSetName = null;
				setStrandSetName = function setStrandSetName(strand) {
					var strandSetName="";
					if (strand.strandSet && strand.strandSet.strandSetName) {
						strandSetName=strand.strandSet.strandSetName;
					}
					strand.strandSetName=strandSetName.replace(/^\s\s*/, '_').replace(/\s\s*$/, '_');
				};

				var setRestrictionDates = null;
				setRestrictionDates = function setRestrictionDates(strand) {
					$.each(strand.ermProductRightRestrictions,
							function(idx, elem) {
								var restriction = null;
								setDates(elem);
								restriction = elem.restriction;
								accumulateRestriction(restriction);
							});

				};

				var res = [];
				$.each(data, function(idx, elem) {
					if (elem.excludeFlag === undefined
							|| elem.excludeFlag === null) {
						elem.excludeFlag = false;
					}
					setDates(elem);
					setStrandSetName(elem);
					setRestrictionDates(elem);
					accumulateMTL(elem);
					accumulateStrandSet(elem.strandSet);
					setRestrictionCodes(elem);
					res.push(elem);
				});
				refreshSelectors();
				return res;
	   }, //end parse
////////////////////////END: PARSE///////////////////////////////////
	   
////////////////////////BEGIN: ONDATABOUND///////////////////////////
	  ondatabound:function ondatabound() {
		//setup the strands buttons with it's actions (create strand,modify strands,etc)
		strandsGrid.progress.showCompleted();
		
		var strandsIndex = null; //if this is used by an event it may not be collected naturally cause it is always reachable if the event doesn't get detached.
		strandsIndex = strands.indexStrands(gridStrandsConfigurator.getDS().data());
		//TODO this is a candidate to move to other palace
		
		gridStrandsConfigurator.strandsById = strandsIndex.strandsById;
		gridStrandsConfigurator.strandRestrictionsById = strandsIndex.strandRestrictionsById;
		

		//MLC-cr 5/28/14
		$(".strand-checkbox").on('click', strandCheckboxClick);
		function strandCheckboxClick() {
			console.log("strand checkbox selected for id " + this.name);
			var id = parseInt(this.name);				
			var selected = this.checked;
			//var ds = gridStrandsConfigurator.getDS();
			
			strands.setSelected(gridStrandsConfigurator.getDS().data(), id, selected);
			
			console.log("Done selecting strand " + id);
			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
    		if (ermSidePanelScope.isERMSidePanelOut) {
    		  setTimeout(function() {	
    			  strands.toggleMapUnMapAndStrandComments();
    		  },10);
    		}

		};

		//MLC-cr 5/28/14
		var setSelectedValue = setSelectedValueFunction;
		function setSelectedValueFunction(multiSelect, value) {
			var hasValue = function hasValue(multiSelect, value) {
				var selectedValues = multiSelect.value();
				//TMA var inArray = $.inArray(value, selectedValues) >= 0;
				//TMA return inArray;
				return $.inArray(value, selectedValues) >= 0;
			};
			if (!hasValue(multiSelect, value)) {
				var selectedValues = multiSelect.value();
				// selectedValues.push(value);
				var newValues = selectedValues.slice();
				newValues.push(value);
				multiSelect.value(newValues);
			}
		};
		
		//MLC-cr 5/28/14
		var setSelectedMediaValue = setSelectedMediaValueFunction;
		function setSelectedMediaValueFunction(id) {
			var mediaMultiSelect = $("#media-multi-select").data(
					"kendoMultiSelect");

			var multiSelect = mediaMultiSelect;
			setSelectedValue(multiSelect, id);
		};

		//MLC-cr 5/28/14
		var setSelectedTerritoryValue = setSelectedTerritoryValueFunction;
		function setSelectedTerritoryValueFunction(id) {
			var territoryMultiSelect = $("#territory-multi-select").data(
					"kendoMultiSelect");

			var multiSelect = territoryMultiSelect;
			setSelectedValue(multiSelect, id);
		};

		//MLC-cr 5/28/14
		var setSelectedLanguageValue = setSelectedLanguageValueFunction;
		function setSelectedLanguageValueFunction(id) {
			var languageMultiSelect = $("#language-multi-select").data(
					"kendoMultiSelect");

			var multiSelect = languageMultiSelect;
			setSelectedValue(multiSelect, id);
		};

		//MLC-cr 5/28/14
		var setSelectedStrandSetValue = setSelectedStrandSetValueFunction;
		function setSelectedStrandSetValueFunction(id) {
			var strandSetMultiSelect = $("#strand-set-multi-select").data(
					"kendoMultiSelect");

			var multiSelect = strandSetMultiSelect;
			setSelectedValue(multiSelect, id);
		};

		//MLC-cr 5/28/14
		var setSelectedRestrictionValue = setSelectedRestrictionValueFunction;
		function setSelectedRestrictionValueFunction(id) {
			var restrictionMultiSelect = $("#restrictions-multi-select")
					.data("kendoMultiSelect");

			var multiSelect = restrictionMultiSelect;
			setSelectedValue(multiSelect, id);
		};
		
		//MLC-cr 5/28/14
		var setStartDate = setStartDateFunction;
		function setStartDateFunction(date) {
			$("#start-date-filter").val(date);
		};
		//MLC-cr 5/28/14
		var setEndDate = setEndDateFunction;
		function setEndDateFunction(date) {
			$("#end-date-filter").val(date);
			
		};
		var startDateLinks = $(".start-date-link");
		startDateLinks.unbind('click');
		//MLC-cr TMA 5/28/14
		startDateLinks.on('click', startDateLinkClick);
		function startDateLinkClick(e){
			//TMA var value = this.innerHTML.trim();
			e.preventDefault();
			//TMA setStartDate(value);	
			setStartDate(this.innerHTML.trim());
			
			gridStrandsConfigurator.expandFilter();
		};
		var endDateLinks = $(".end-date-link");
		endDateLinks.unbind('click');


		//MLC-cr TMA 5/28/14
		endDateLinks.on('click', endDateLinkClick);
		function endDateLinkClick(e){
			var value = this.innerHTML.trim();
			e.preventDefault();
			setEndDate(value);					
			gridStrandsConfigurator.expandFilter();
		};

		
		var mediaLinks = $(".media-link");
		mediaLinks.unbind('click');


		//MLC-cr TMA 5/28/14
		mediaLinks.on('click', mediaLinkClick);
		function mediaLinkClick(e) {
			e.preventDefault();
			var id = parseInt(this.name);
			console.log("media clicked id " + id);
			setSelectedMediaValue(id);
			gridStrandsConfigurator.expandFilter();
		};

		
		var territoryLinks = $(".territory-link");
		territoryLinks.unbind('click');


		//MLC-cr -- TMA changed 5/28/14
		territoryLinks.on('click', territoryLinkClick);
		function territoryLinkClick(e) {
			e.preventDefault();
			var id = parseInt(this.name);
			console.log("territory clicked id " + id);
			setSelectedTerritoryValue(id);
			gridStrandsConfigurator.expandFilter();
		};

		var languageLinks = $(".language-link");
		languageLinks.unbind('click');
		
		//MLC-cr -- TMA changed 5/28/14
		languageLinks.on('click', languageLinkClick);
		function languageLinkClick(e) {
			e.preventDefault();
			var id = parseInt(this.name);
			console.log("language clicked id " + id);
			setSelectedLanguageValue(id);
			gridStrandsConfigurator.expandFilter();
		};

		var strandSetLinks = $(".strand-set-link");
		strandSetLinks.unbind('click');

		//MLC-cr -- TMA changed 5/28/14
		strandSetLinks.on('click', strandSetLinkClick);
		function strandSetLinkClick(e) {
			e.preventDefault();
			var id = parseInt(this.name);
			console.log("strand set clicked id " + id);
			setSelectedStrandSetValue(id);
			gridStrandsConfigurator.expandFilter();
		};

		var restrictionLinks = $(".restriction-link");
		restrictionLinks.unbind('click');

		//MLC-cr -- TMA changed 5/28/14
		restrictionLinks.on('click', restrictionLinkClick);
		function restrictionLinkClick(e) {
			e.preventDefault();
			var id = this.name;
			console.log("restriction clicked id " + id);
			setSelectedRestrictionValue(id);
			gridStrandsConfigurator.expandFilter();
		};
		
		var productRestrictionLinks = $(".product-restriction-link");
		productRestrictionLinks.unbind('click');

		//MLC-cr -- TMA changed 5/28/14
		productRestrictionLinks.on('click', productRestrictionLinkClick);
		function productRestrictionLinkClick(e) {
			e.preventDefault();
			var grid = $("#strandsGrid").data("kendoGrid");								
			if (this.parentNode.parentNode.nextSibling.className.indexOf("k-detail-row") == 0 && this.parentNode.parentNode.nextSibling.style.display.indexOf("none") == -1){
			  grid.collapseRow(this.parentNode.parentNode);
			} else {
			  grid.expandRow(this.parentNode.parentNode);
			}
		};

		var clearSelection = $("#grid-clear-selection");
		clearSelection.unbind('click');

		//MLC-cr -- TMA changed 5/28/14
		clearSelection.on('click', clearSelectionClick);
		function clearSelectionClick(e) {
			e.preventDefault();
			
			var ds = null;
			ds = gridStrandsConfigurator.getDS();
			var filter = ds.filter();
			
			var allData = null;
			allData = ds.data().toJSON();
			
			$("#strand-grid-select-all").removeAttr('checked');

			//MLC-cr 
			$.each(allData, function(idx, elem) {
				elem.selected = false;
				//AMV also remove the strand restrictions 
				if (elem.ermProductRightRestrictions) {
					$.each(elem.ermProductRightRestrictions,function(idx,elem) {
						elem.selected = false;
					});
				}
			});
			
			ds.data(allData);
			
			strands.selections.clearStrandsSelection();
			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
			if (ermSidePanelScope.isERMSidePanelOut)
		      strands.toggleMapUnMapAndStrandComments();
		};

		var selectRightRestrictionsButton = $("#select-right-restrictions-grid-button");
		selectRightRestrictionsButton.unbind('click');
		
		//MLC-cr -- TMA changed 5/28/14
		selectRightRestrictionsButton.on('click', selectRightRestrictionsButtonClick);
		function selectRightRestrictionsButtonClick() {
			console.log("select-right-restrictions-grid-button clicked");
			// run filter first
			var filters = strands.getFilter();
			var strandsGrid = $("#strandsGrid").data("kendoGrid");
			strandsGrid.dataSource.filter(filters);
			var expandAfterSelect = false;
			gridStrandsConfigurator.selectStrandRestrictionsByValuesInMultiselect(expandAfterSelect);			          
		};
		
		var selectAndExpandRightRestrictionsButton = $("#select-expand-right-restrictions-grid-button");
		selectAndExpandRightRestrictionsButton.unbind('click');
		
		//QUESTION:  why do we have two functions with the same name, same functionality except
		//to change a local var -- expandAfterSelect?
		//TODO -- comment this one out
		//MLC-cr -- TMA changed 5/28/14
		selectAndExpandRightRestrictionsButton.on('click', selectAndExpandRightRestrictionsButtonClick);
		function selectAndExpandRightRestrictionsButtonClick() {
			console.log("select-expand-right-restrictions-grid-button clicked");
			// run filter first
			var filters = strands.getFilter();
			var strandsGrid = $("#strandsGrid").data("kendoGrid");
			strandsGrid.dataSource.filter(filters);
			var expandAfterSelect = true;
			gridStrandsConfigurator.selectStrandRestrictionsByValuesInMultiselect(expandAfterSelect);			          
		};
		
		
		var selectButton = $("#select-grid-button");
		selectButton.unbind('click');
		
		//MLC-cr -- TMA changed 5/28/14
		selectButton.on('click', selectButtonClick);
		function selectButtonClick() {
			var dataSource = null;
			dataSource = gridStrandsConfigurator.getDS();
			var filter = null;
			filter = strands.getFilter();

			var allData = null;
			allData = dataSource.data().toJSON();
			// this only returns the rows visible to the user
			// var view = dataSource.view();
			var query = null;
			query = new kendo.data.Query(allData);
			var filteredData = null;
			filteredData = query.filter(filter).data;
			// var array = $scope.dataArray;
			console.log("selectAll clicked");

			//MLC-cr 
			$.each(allData, function(idx, elem) {
				elem.selected = false;
				var id = elem.rightStrandId;
				strands.selections.unSelectStrand(id);
			});
			//MLC-cr
			$.each(filteredData, function(idx, elem) {
				elem.selected = true;
				var id = elem.rightStrandId;	
				console.log("Selecting id: " + id);
				strands.selections.selectStrand(id);						
			});

			dataSource.data(allData);
			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
			if (ermSidePanelScope.isERMSidePanelOut)
		      strands.toggleMapUnMapAndStrandComments();
		};
						
		var collapseAllStrandInfoCodes = $("#collapseAllStrandInfoCodes");                                                  
		collapseAllStrandInfoCodes.unbind('click');
		
		//MLC-cr -- TMA changed 5/28/14
		collapseAllStrandInfoCodes.on('click', collapseAllStrandsInfoCodesClick);
		function collapseAllStrandsInfoCodesClick(event){
		  var rcscope = erm.scopes.rights();
          rcscope.showExpandStrandInformationalCodes = true;
          if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
      		rcscope.$apply();
          }
          gridStrandsConfigurator.collapseAllRestrictions();
        }; 
        
        var expandRestrictions = $("#expandAllStrandInfoCodes");                                                  
        expandRestrictions.unbind('click');
        
      //MLC-cr -- TMA changed 5/28/14
        expandRestrictions.on('click', expandRestrictionsClick);
        function expandRestrictionsClick(event){
          // need to expand all master grid elements to load the restrictions in the dom
          // collapse all, then determine which dom elements have children so they can be individually expanded
      	  console.log("expandRestrictions clicked");
      	  gridStrandsConfigurator.expandAllRestrictions();
        };                    

		var selectAllCheckbox = $("#strand-grid-select-all");
		selectAllCheckbox.unbind('click');
		
		//MLC-cr -- TMA changed 5/28/14
		selectAllCheckbox.on('click', selectAllCheckboxClick);
		function selectAllCheckboxClick(event) {
			//TMA var dataSource = ds;
			//TMA var filter = dataSource.filter();
			//TMA var allData = dataSource.data().toJSON();
			var ds = null;
			ds = gridStrandsConfigurator.getDS();
			var filter = null;
			filter = ds.filter();
			var allData = null;
			allData = ds.data().toJSON();
			
			// this only returns the rows visible to the user
			// var view = dataSource.view();
			var query = null;
			query = new kendo.data.Query(allData);
			var filteredData = null;
			filteredData = query.filter(filter).data;
			var selected = this.checked;
			// var array = $scope.dataArray;
			console.log("selectAll clicked selected=" + selected);
			
			//MLC-cr 
			$.each(allData, function(idx, elem) {
				elem.selected = false;
				strands.selections.clearStrandsSelection();
			});
			//MLC-cr 
			$.each(filteredData, function(idx, elem) {
				var id = elem.rightStrandId;
				elem.selected = selected;
				if (selected) {
					strands.selections.selectStrand(id);
				} else {
					strands.selections.unSelectStrand(id);
				}
				
			});

			ds.data(allData);
			var ermSidePanelScope =  null;
			ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
			if (ermSidePanelScope.isERMSidePanelOut) {
	    	  strands.toggleMapUnMapAndStrandComments();
			}
		};
		
		
		
		gridStrandsConfigurator.setNumberOfLegalAndBusinessElementsFromDS(gridStrandsConfigurator.getDS());
		
		// only show expand iconds for strands with restrictions
		for (var i = 0; i < strands.selections.strandIdsWithRestrictions.length; i++ ) {			
		  $($("#cb" + strands.selections.strandIdsWithRestrictions[i]).parent().prev().children()[0]).css({"display":"block"});					   
	    }	
	}
	////////////////////////END: ONDATABOUND///////////////////////////
};