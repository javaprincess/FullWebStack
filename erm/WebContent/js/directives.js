'use strict';

/* Directives */

/**
 * Displays a tree in a multiselect box.
 * Use for media, territory and language
 * Example:
 * 	<div erm-tree-multiselect selected="selected" source="tree" idField="id" nameField="description" size="5"></div>
 * NOT USED REMOVE
 */
app.directive('ermTreeMultiselect',function($log){
	return {
		restrict: 'A',
		controller: function($scope) {

		},
		scope: {
			source:'=',
			selected: '='
		},
		link: function(scope,elem,attrs) {
			var selectedElements = scope.selected;
			var source = scope.source;
			var size =attrs.size;
			var idField = attrs.idfield;
			var nameField = attrs.namefield;

			var pad=function(string,level) {
			  var numberOfSpaces = level*2;
			  var space = "&nbsp;";
			  var i =0;
			  for (i =0;i<numberOfSpaces;i++) {
				  string=space+string;
			  }
			  return string;
			};
			var getCssForLevel=function(level) {
				return "treeNodeLevel"+level;
			};
			
			
			var findElementInNode = function(value,node) {
				if (!node) return null;
				if (node.data[idField]===value) {
					return node;
				}
				if (!node.children||node.children.lengt===0) {
					return false;
				}
				return findElementInTree(value,node.children);
			};
			
			var findElementInTree=function(value,tree) {
				var i = 0;
				for (i=0;tree&&i<tree.length;i++) {
					var element = findElementInNode(value,tree[i]);
					if (element) {
						return element;
					}					
				}
				return null;
			};
			
			var isNodeAncestor = function(node,value) {
				var i = 0;
				var child = null;
				if (!node) {
					return false;
				}
				if (!node.children||node.children===0) {
					return false;
				}
				for (i=0; i<node.children.length;i++) {
					child = node.children[i];
					if (child.data&&child.data[idField]===value) {
						return true;
					}
					if (isNodeAncestor(child,value)) {
						return true;
					}
				}
				return false;				
			};
			/**
			 * Returns true if e1 is ancestor of e2 in the tree
			 */
			var isAncestor = function(e1,e2,tree) {
				//first find the element with that value in the tree
				var element=findElementInTree(e1,tree);
				var result = isNodeAncestor(element,e2); 
				return result;
			};
			
			var getOptionsShouldBeSelected = function(selectedValue,currentSelected,tree) {
				var selected=[];
				var i = 0;
				var current=null;
				for (i = 0;currentSelected&&i<currentSelected.length;i++) {
					current = currentSelected[i];
					if (current===selectedValue) {
						selected.push(current);
					} else if (!isAncestor(current,selectedValue,tree) &&
							   !isAncestor(selectedValue,current,tree)) {
							selected.push(current);
					}
				}
 
				return selected;
			};
			
			var refreshSelect = function(select,selectedValues) {
				var options = select.find("option");
				var i = 0;
				var val=null;
				var option = null;
				var inArray=false;
				for (i = 0; i<options.length;i++) {
					option = options[i];
					val = option.value;
					inArray=$.inArray(val,selectedValues);
					if (inArray>=0) {
						option.selected=true;
					} else {
						option.selected=false;
					}
				}
			};
			
			var getOption = function(data,level) {
				var padded = pad(data[nameField],level);
				var css = getCssForLevel(level);
				var option = $("<option class='"+ css+"' value="+ data[idField]+">");
				option.click(function(){
					$log.log("option changed %o",this);
					var value=this.value;
					var selected = this.selected;
					if (selected) {
						var select = $(this.parentElement);
						var selectedValues = select.val();
						var optionsShouldBeSelected = getOptionsShouldBeSelected(value,selectedValues,source);						
						refreshSelect(select,optionsShouldBeSelected);
						select.change();
						$log.log("options should be selected %o",optionsShouldBeSelected);
					}
				});
				option.html(padded);
				return option;
			};
			
			var updateSelectedElementsInModel= function(model,selectedElements) {
				var i = 0;
				var value = null;
				model.length=0;
				for (i = 0; selectedElements&&i<selectedElements.length;i++) {
					value = selectedElements[i].value;
					model.push(value);
				}
				scope.$apply();
			};
			
			
			var appendOptionElements = function(root, level,options) {
				var option = getOption(root.data,level);
				var nextLevel = level+1;
				var i = 0;
				options.push(option);
				for (i=0; root.children&&i<root.children.length;i++) {
					appendOptionElements(root.children[i],nextLevel,options);
				}
			};
			
			$log.log("erm-tree-multiselect directive");
			//construct the select
			var i=0;
			var level=0;
			var select=$("<select multiple='true' size=" + size +">");
			select.change(function() {
				var val = select.val();
				var selected = select.find(":selected");
				$log.log("Selected elements %o",selected);
				updateSelectedElementsInModel(selectedElements, selected);
			});
			var options = new Array();
			for (i=0;source&&i<source.length;i++) {
				appendOptionElements(source[i],level,options);
			}
			for (i=0;i<options.length;i++) {
				select.append(options[i]);
			}
			
			elem.append(select);
			//end construct select
		}
	};
	
});

app.directive('ermSpinner',function() {
	var spinner = "<i class='icon-spinner icon-spin icon-large'></i>&nbsp;";
	return {
		restrict: 'A',
		scope: {
			message: '@'
		},
		link: function(scope,elem,attrs) {
			scope.$watch('message',function(){
				elem.html(spinner + scope.message);
			});
				
		}
	};
});

app.directive('ermSortIndicator',function() {
	return {
		restrict: 'A',
		scope: {
			isSorted: '=',
			ascending: '='
		},
		template: "<i ng-class=\"isSorted&&ascending&&'icon-sort-by-alphabet'||isSorted&&!ascending&&'icon-sort-by-alphabet-alt'||''\"></i>",
		link: function(scope,elem,attrs) {

		}
	};
});
app.directive('ermSortIndicatorNonAlpha',function() {
	return {
		restrict: 'A',
		scope: {
			isSorted: '=',
			ascending: '='
		},
		template: "<i ng-class=\"isSorted&&ascending&&'icon-sort'||isSorted&&!ascending&&'icon-sort'||''\"></i>",
		link: function(scope,elem,attrs) {

		}
	};
});
	 
app.directive('ermHasRightsIndicator',  function($log) {
	  return {
	      restrict: 'A',
	      scope: {
	    	product: '='  
	      },	  
	      link: function (scope, elem, attrs) {
	    	scope.$watch('product',function(product){
	    		//$log.log("p changed to %o",product);
		    	var style ="'color:green'";	    		
	    		var indicator = product.rightsIndicator;	    		
		    	if (indicator==="N") {
		    		style ="'color:red'";
		    	}	    		
		    	var html = "<span style="+style +">"+indicator + "</span>";
		    	elem.html(html);
	    	});
	      }
	   };
	  });
	 
 app.directive('ermRightsIndicatorIcon',  function($log) {
   return {
     restrict: 'A',
     scope: {
       product: '='  
     },	  
     getRigthsIndicator:function(type) {},   	 
     link: function (scope, elem, attrs) {
     var product = scope.product;
	 var img = null;
	 var title = null;
	 var showImage = true;
	 var rightsIconType = "N";
	 if (product.ermProductVersionHeader != null)
	   rightsIconType = product.ermProductVersionHeader.rightsIconType;
	 else if (product.rightsIndicator != null)
	   rightsIconType = product.rightsIndicator;
	 switch(rightsIconType) {
	   case "CM+B":
	     img="CM+BusinessStrand";
	     title="Clearance Memo with Business Strand(s)";
	     break;
	   case "CM+LB":
	   case "CM+BL":
		 img="CM+LegalAndBusinessAgree";
		 title="Clearance Memo with Legal and Business Strand(s)";
	     break;
	   case "CM+L":
	     img="CM+LegalStrand";
	     title="Clearance Memo with Legal Strand(s)";
		 break;
	   case "CM+":
		 img="CMexistsOnly";
		 title="Clearance Memo";
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
	     title="Business Strand(s)";
	     break;
	   case "BL":
	   case "LB":
	     img="NoCM+LegalAndBusinessAgree";
	     title="Legal and Business Strand(s)";
	 	 break;
	   case "L":
	     img="NoCM+LegalStrand";
	     title="Legal Strand(s)";
	     break;
	   case "N":
	   case "":
	   default:
		 showImage = false;
		 break;
	 };
	 if (showImage)
	   elem.html("<img title='" + title + "' src='/erm/img/" + img +".png" + "'/>");	
     }
  };
  });

app.directive('ermHasRightsIndicatorIcon',  function($log) {
	  return {
	      restrict: 'A',
	      scope: {
	    	product: '='  
	      },	  
	      link: function (scope, elem, attrs) {
	    	var product = scope.product;
	    	var iconRights = "<img src='/erm/img/HasRightsIcon.png'>";
	    	var iconNoRights = "<img src='/erm/img/NoRightsIcon.png'>";
	    	if (product.hasRightStrands===true) {
	    		elem.html(iconRights);
	    	}
	    	if (product.hasRightStrands===false) {
	    		elem.html(iconNoRights);
	    	}
	      }
	   };
	  });

app.directive('ermProductSearchResults', function($log){
	return {
		templateUrl: 'partials/searchResults.html',
		restrict: 'A',
		scope: {
			groups: '=',
			showTotal: '=',
			showSearch: '=',
			searchId: '=',
			isFoxipediaSearch: '='
		},
		controller: 'ProductSearchResultsController',
		link: function postLink(scope, iElement, iAttrs) {
			$log.log('erm-product-search-results');
			scope.$watch('groups',function(groups){
				$log.log("Groups changed. Clearing up sort order");
				scope.results.clearSort();
			});
		}		
	};
});


app.directive('ermJob', function($log){
	return {
		templateUrl: 'partials/job.html',
		restrict: 'A',
		scope: {
			job: '=',
			jobId: '=',
			checkingStatus: '=',
			detailsShown: '='
		},
		controller: 'JobsController',
		link: function postLink(scope, iElement, iAttrs) {
			$log.log('erm-job jobId %o job %o', scope.jobId, scope.job);
			scope.$watch('job',function(job){
				if (job != null) {
				  $log.log("Job changed. Should refresh job %o ", job);
				  $("#pendingJobStatus_"+job.id).html(job.status);
				}
			});
		}		
	};
});

