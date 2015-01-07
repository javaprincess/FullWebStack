'use strict';


/**
 * This service provides messages (error messages) by code.
 * Those messages can be loaded from a back end service or can be hard coded.
 * The purpose of this service is that messages can be customized with ease 
 */
app.service('messageService',function(){
	/**
	 * Return an error message object with the code and description of the message
	 * @param  The error code to fetch
	 * @returns A message object. If the error message is not found then a generic message is retrieved
	 * 	        and the notFound property will be set on the returned object
	 * 			The message object has the following structure
	 * 			{
	 * 				code: 'PS-001',
	 * 				description: 'Invalid Search'
	 * 			}
	 */
	this.getMessage=function(errorCode) {
		//TODO implement
		return null;
	};
	
});

/**
 * Provides the path for REST services
 */
app.service('pathProvider',function(){
	var p = paths("rest");
	this.Territory=p.getTerritoryRESTPath();
	this.Products=p.getProductRESTPath();
	this.FoxipediaGroups=p.getFoxipediaGroupsRESTPath();
	this.ProductVersions=p.getProductVersionRESTPath();
	this.ProductTypes=p.getProductTypesRESTPath();
	this.Media=p.getMediaRESTPath();
	this.Language=p.getLanguageRESTPath();
	this.Rights = p.getRightsRESTPath();
	this.ProductRestrictions = p.getProductRestrictionsRESTPath();
	this.ProductDummyRestrictions = p.getProductDummyRestrictions();
	this.ProductVersionSingle = p.getProductVersionSingleRESTPath();
	this.ProductRightsIndicator = p.getProductRightsIndicatorRESTPath();
	this.CommentByFoxVersionId = p.getCommentsProductVersionRESTPath();
	this.ProductVersionTree = p.getProductVersionTreeRESTPath();
	this.ProductWithFoxId = p.getFoxProductRESTPath();
	this.MediaNodes = p.getFoxMediaNodesRESTPath();
	this.Codes=p.getCodesServiceRESTPath();
    this.LegalConfirmationStatus = p.getLegalConfirmationStatusRESTPath();
    this.BusinessConfirmationStatus = p.getBusinessConfirmationStatusRESTPath();
    this.CommentStatus = p.getCommentStatusRESTPath();
    this.TerritoryNodes = p.getFoxTerritoryNodesRESTPath();
    this.LanguageNodes = p.getFoxLanguageNodesRESTPath();
    this.loadRightStrands = p.getProductRightStrandRESTPath();
    this.ClearanceMemo = p.getClearanceMemoRESTPath();            
    this.ErmContractList = p.getContractualPartyErmContractListRESTPath();
    this.productGrantsList = p.getProductGrantsListRESTPath();
    this.productGrantStatusAdd = p.getProductGrantsAddStatusRESTPath();
    this.productGrantStatusEdit = p.getProductGrantsEditStatusRESTPath();
    this.getProductGrantsGetComment = p.getProductGrantsGetCommentRESTPath();    
    this.jobStatus = p.getJobsRESTPath() + "/:jobId";    
    this.jobDetail = p.getJobDetailRESTPath() + "/:jobId"; 
    this.deleteJob = p.getDeleteJobRESTPath() + "/:jobId";
    this.stopJob = p.getStopJobRESTPath() + "/:jobId";
    this.hasPendingJobs = p.getHasPendingJobsRESTPath();
    this.pendingJobsForUser = p.getPendingJobsRESTPath();
    this.allJobsForUser = p.getAllJobsForUserRESTPath();
    this.baselineVersionsByFoxVersionId = p.getBaselineVersionsRESTPath();
    this.getAllReportByUserIdRESTPath = p.getAllReportByUserIdRESTPath();
    this.copyrightNotice = p.getCopyrightNoticeRESTPath();
    this.xProductCopyValidate = p.getXProductCopyValidateRESTPath();
    this.xProductCopyValidateAndCopy = p.getXProductCopyValidateAndCopyRESTPath();
    this.getSyncReleaseDate = p.getSyncReleaseDateRESTPath();
    this.xProductDelete = p.getXProductDeleteRESTPath();
    this.updateBusinessConfirmationStatus = p.getUpdateBusinessConfirmationStatusRESTPath();
});


/**
 * ProductService is a service responsible for retrieving Product information. 
 * Main functions include:
 *  -findProductsByTitle: Get the main data for the product. This does NOT include the product versions.
 *  -find: Performs the search for products given a user query string. This might include a comma separated product ids, titles, etc.
 *  -findProductVersions: Returns all the product versions for a particular foxId.
 *  
 *   All functions are implementing calling ReSTfull service /erm/rest/Products
 */
app.service('productService',function($resource,$log,pathProvider,utilService){
		var SEASON_TYPE="SEASN";
		var SERIES_TYPE="SRIES";
		this.productTypes = null;
		this.productTypesLoaded = false;
	
		this.isProductTypeParentInHierarchy = function(productType) {
			return (SEASON_TYPE==productType||SERIES_TYPE==productType);
		};
	
		this.findProductsByTitle = function(title) {
			var Products = $resource(pathProvider.Products,{q:title});
			var products=Products.query();
			return products;			
		};
		
		/**
		 * TMA
		 */
		this.copyrightNotice = function(foxVersionId, onSuccess) {
			var productCopyrightNotice = $resource(pathProvider.copyrightNotice,{foxVersionId:foxVersionId});
			var pCN = productCopyrightNotice.get(function(){
				if (angular.isFunction(onSuccess)) {
					onSuccess(pCN);
				}				
			});
			return pCN;			
		};
		
		
		/**
		 * TMA
		 */
		
		this.find= function(q, onSuccess, onFailure) {			
			var qJson = angular.toJson(q);
			$log.log("Searching for products q=%s",qJson);			
			$.post(pathProvider.Products, {q:qJson}, function(data){	   
				$log.log("Finished product search");
				if (angular.isFunction(onSuccess) && $.isArray(data)) {
					onSuccess(data);
				}				
			}).fail(function(xhr,status,message,rcscope){
				// failed  to update saveDoNotLicense				
				console.log(onFailure);	
				if (angular.isFunction(onFailure)) {
				  onFailure(xhr);
				}				
				console.log("failed search");		   				
			});		 		
		};
		
		this.findFoxipediaGroups = function(q,onSuccess) {
			var qJson = angular.toJson(q);
			$log.log("Searching for foxipediaGroups q=%s",qJson);
			var FoxipediaGroups = $resource(pathProvider.FoxipediaGroups,{"q":qJson});			
			var foxipediaGroups = FoxipediaGroups.query(function(){
				$log.log("Finished foxipedia group search");
				if (angular.isFunction(onSuccess)) {
					onSuccess(foxipediaGroups);
				}								
			});
			return foxipediaGroups;
		};
		
		
		/**
		 * Returns all the versions of a product.
		 * It applies the after function to the array of products once the information is fetched. 
		 * Typically this is used to set the child products to the parent product. It could also be used to sort, etc
		 */
		this.findProductVersions = function(foxId,strandsQuery,onSuccess) {
			var Products = $resource(pathProvider.ProductVersions,{foxId:foxId,strandsQuery:strandsQuery});
			var productVersions = Products.query(function(){
				$log.log("find product versions finished # of versions: "  + productVersions.length);
				if (angular.isFunction(onSuccess)) {
					onSuccess(productVersions);
				}
			});
			return productVersions;
		};
		
		/**
		 * Returns all the versions of a product except the default version.
		 * It applies the after function to the array of products once the information is fetched. 
		 * Typically this is used to set the child products to the parent product. It could also be used to sort, etc
		 */
		this.findProductVersionsExcludeDefault = function(foxId,strandsQuery,product,onSuccess) {
			var Products = $resource(pathProvider.ProductVersions,{foxId:foxId,strandsQuery:strandsQuery});
			var productVersions = Products.query(function(){
				$log.log("find product versions finished # of versions: "  + productVersions.length);
				if (product != null) {
				  if (productVersions.length == 0)
				    product.hasChildren = false;
				  product.expanding = false;
				}
				if (angular.isFunction(onSuccess)) {
					onSuccess(productVersions);
				}
			});
			return productVersions;
		};	
		
		this.init = function() {
			$log.log("ProductService.init");
			//get all the media when the service is initialized.
			//This will have it available for all future use			
		};
		
		this.init();
		
		
		
		
	});


app.service('codesService',function($resource,$log,utilService){

	/**
	 * Returns an object with the following methods:
	 * getAll Gets all the data from the service (ie all the code table values) and caches it.
	 * It will also construct a map with all the values indiexed by id
	 * get Gets the cached data. if data has not been loaded, it calls getAll.
	 * getMap returns the map of values
	 */
	this.data= function(path,idFunction) {
		return {
			all:null,
			map:null,
			getAll: function() {
				var Service = $resource(path);
				var map = null;
				var that = this;				
				$log.log("CodesService.getAll(): " + path);

				//After getting all the data, put the data in the map
				var data = null;
				data = Service.query(function(){
				     map = utilService.toMap(data,idFunction);
					 //$log.log("map: %o", map);					 
				     that.map=map;				     
				     that.all = data;
					 that.loaded=true;
				});									
				
				return data;							
			},
			get : function() {
				if (this.all==null) {
					this.all=this.getAll();
				}
				return this.all;			
			},
			getMap : function() {	
				if (this.map===null) {
					this.get();
				}				
				return this.map;				
			},
			
			
		};
		
	};
	
});

app.service('confirmationStatusService',function(codesService,pathProvider){
	var path = pathProvider.LegalConfirmationStatus;
	var LegalConfirmation = codesService.data(path,function(elem) {
		return elem.confirmationStatusId;
	});
	
	this.getLegalConfirmationStatus= function() {
		return LegalConfirmation.get();
	};
	
	this.getLegalConfirmationStatusMap = function() {		
		return LegalConfirmation.getAll();
	};
});

app.service('businessConfirmationStatusService',function(codesService,pathProvider){
	var path = pathProvider.BusinessConfirmationStatus;
	
	var BusinessConfirmation = codesService.data(path,function(elem) {
		return elem.confirmationStatusId;
	});
	
	this.getBusinessConfirmationStatus = function() {		
		return BusinessConfirmation.get();
	};
	
	this.getBusinessConfirmationMap = function() {
		console.log("BusinessConfirmation.getAll(): " + BusinessConfirmation.getAll());
		return BusinessConfirmation.getAll();
	};
	
	this.toMap = function(array,idFunction) {
		console.log("toMap array: " + array + " idFunction " + idFunction);
		var i=0;
		var id=null;
		var map=[];
		for (i=0;i<array.length;i++) {
			id = idFunction(array[i]);			
			map[id]=array[i];
			console.log("id: " + id + " map[id] " + map[id]);
		}
		return map;
	};
	
});

app.service('commentStatusService',function(codesService,pathProvider){
	var path = pathProvider.CommentStatus;
	
	var commentStatus = codesService.data(path,function(elem) {
		return elem.commentStatusId;
	});
	
	this.getCommentStatus = function() {		
		return commentStatus.get();
	};
	
	this.getCommentStatusMap = function() {
		console.log("CommentStatus.getAll(): " + commentStatus.getAll());
		return commentStatus.getAll();
	};
	
	this.toMap = function(array,idFunction) {
		console.log("toMap array: " + array + " idFunction " + idFunction);
		var i=0;
		var id=null;
		var map=[];
		for (i=0;i<array.length;i++) {
			id = idFunction(array[i]);			
			map[id]=array[i];
			console.log("id: " + id + " map[id] " + map[id]);
		}
		return map;
	};
	
});

/**
 * Service to query media
 */
//TODO delete
//app.service('mediaService',function($resource,$log,pathProvider,utilService){
//	this.media=null;
//	this.mediaMap=null;
//	this.loaded = false;
//	
//	/**
//	 * Returns a media by id
//	 */
//	this.getMediaById = function(mediaId) {
//		var media = this.mediaMap[mediaId];		
//		return media;
//	};
//	
//	/**
//	 * Gets all media, the media will be cached. Next time the media is requested the cached version will be returned
//	 */
//	this.getMedia = function() {
//		if (this.media==null) {
//			this.media=this.getAllMedia();
//		}
//		return this.media;
//	};
//	
//	/**
//	 * Gets all media from the REST service
//	 */
//	this.getAllMedia = function() {
//		var Media = $resource(pathProvider.Media);
//		var that = this;
//		var map = null;
//		$log.log("Getting all media from REST service");
//
//		//After getting the media, put the media in the mediaMap
//		var media = Media.query(function(){
//		     map = utilService.toMap(media,function(media) {
//		    	 		return media.id;
//		     		});
//		    that.mediaMap=map;
//		    that.media = media;
//			that.loaded=true;
//		});			
//		
//		return media;			
//		};	
//		
//	this.init = function() {
//		$log.log("MediaService.init");
//		//get all the media when the service is initialized.
//		//This will have it available for all future use
//		if (!this.loaded) {
//			this.getAllMedia();
//		}		
//	};
//	
//	/**
//	 * 
//	 */
//	this.getMediaNodes = function(onSuccess){
//		var res = $resource(pathProvider.MediaNodes);
//		var rootNode = res.get(function(){
//			if(angular.isFunction(onSuccess)){
//				onSuccess(rootNode);
//			}
//		});
//		
//	};
//	
//	this.init();
//		
//	});


///**
// * Service to query territories
// * TODO DELETE
// */
//app.service('territoryService_delete',function($resource,$log,pathProvider,utilService){
//	this.territories=null;
//	this.territoryMap=null;
//	this.loaded = false;
//	
//	/**
//	 * Returns a territory by id
//	 */
//	this.getTerritoryById = function(territoryId) {
//		var territory = this.territoryMap[territoryId];		
//		return territory;
//	};
//	
//	/**
//	 * Gets all territories, the territories will be cached. Next time the territories are requested the cached version will be returned
//	 */
//	this.getTerritories = function() {
//		if (this.territories==null) {
//			this.territories=this.getAllTerritories();
//		}
//		return this.media;
//	};
//	
//	/**
//	 * Gets all media from the REST service
//	 */
//	this.getAllTerritories = function() {
//		var Territory = $resource(pathProvider.Territory);
//		var that = this;
//		var map = null;
//		$log.log("Getting all territories from REST service");
//
//		//After getting the media, put the media in the mediaMap
//		var territories = Territory.query(function(){
//		     map = utilService.toMap(territories,function(territory) {
//		    	 return territory.id;
//			});
//		    that.territoryMap=map;
//		    that.territories = territories;
//			that.loaded=true;
//		});			
//		
//		return territories;			
//		};	
//		
//	this.init = function() {
//		$log.log("TerritoryService.init");
//		//get all the territories when the service is initialized.
//		//This will have it available for all future use
//		if (!this.loaded) {
//			this.getAllTerritories();
//		}		
//	};
//	
//	this.getTerritoryNodes = function(onSuccess){
//		var res = $resource(pathProvider.TerritoryNodes);
//		var rootNode = res.get(function(){
//			if(angular.isFunction(onSuccess)){
//				onSuccess(rootNode);
//			}
//		});
//		
//	};
//	
//	this.init();
//		
//	});



/**
 * Service to query languages
 */
//TODO remove
//app.service('languageService',function($resource,$log,pathProvider, utilService){
//	this.languages=null;
//	this.languageMap=null;
//	this.loaded = false;
//	
//	
//	/**
//	 * Returns a media by id
//	 */
//	this.getLanguageById = function(languageId) {
//		var language = this.languageMap[languageId];		
//		return language;
//	};
//	
//	
//	/**
//	 * Gets all languages, the languages will be cached. Next time the languages are requested the cached version will be returned
//	 */
//	this.getLanguages = function() {
//		if (this.languages==null) {
//			this.languages=this.getAllLanguages();
//		}
//		return this.languages;
//	};
//	
//	
//	/**
//	 * Gets all media from the REST service
//	 */
//	this.getAllLanguages = function() {
//		var Language = $resource(pathProvider.Language);
//		var that = this;
//		var map = null;
//		$log.log("Getting all languages from REST service");
//
//		//After getting the languages, put the languages in the languageMap
//		var languages = Language.query(function(){
//		     map = utilService.toMap(languages,function(language) {
//		    	 return language.id;
//			});
//		    that.languageMap=map;
//		    that.languages = languages;
//			that.loaded=true;
//		});			
//		
//		return languages;			
//		};
//		
//		this.init = function() {
//			$log.log("LanguageService.init");
//			//get all the media when the service is initialized.
//			//This will have it available for all future use
//			if (!this.loaded) {
//				this.getLanguages();
//			}		
//		};
//		
//		this.getLanguageNodes = function(onSuccess){
//			var res = $resource(pathProvider.LanguageNodes);
//			var rootNode = res.get(function(){
//				if(angular.isFunction(onSuccess)){
//					onSuccess(rootNode);
//				}
//			});
//			
//		};
//		
//		this.init();
//		
//	
//});

/**
 * Service to query for rights for products
 */
app.service('rightsService',function($resource,$log,pathProvider) {
	
	/**
	 * Returns the Erm product version
	 */
	this.findRightsDefinition = function(foxVersionId,onSuccess) {
		var rightUrl = $resource(pathProvider.Rights,{foxVersionId:foxVersionId});
		var product = rightUrl.get(function(){
				if (angular.isFunction(onSuccess)) {
					onSuccess(product);
				}
			});
		return product;
	};
	
	/**
	 * Returns all the restrictions pertaining to a particular fox version ID.
	 */
	this.getAllRestrictions = function(foxVersionId, onSuccess){
		var foxId = new Number(foxVersionId);
		var foxIdString = foxId.toString();
		var restrictions = $resource(pathProvider.ProductRestrictions, {foxVersionId:foxIdString});
		var pRestrictions = restrictions.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(pRestrictions);
			}
		});
		return pRestrictions;
	};
	
	/**
	 * Return a dummy ErmProductVersion object used for testing purposes.
	 * TODO remove 
	 */
	
	this.getDummyRestrictions = function(foxVersionId, onSuccess){
		var foxId = new Number(foxVersionId);
		var foxIdString = foxId.toString();
		var restrictions = $resource(pathProvider.ProductDummyRestrictions, {foxVersionId:foxIdString});
		var pRestrictions = restrictions.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(pRestrictions);
			}
		});
		return pRestrictions;
	};
	
	/**
	 * Query rights, q is an object containing the query.
	 *  
	 * Example:
	 * {
	 *  products: [1234,3345], //product version ids
	 *  territories: [1], //territories ids
	 *  media: [1], //media id
	 *  language: [1], //language id
	 *  from: '10/20/2001', //the start date (optional) 
	 *  to: null // (optional). If undefined or null, open end date
	 * }
	 * TODO remove
	 */
	this.queryRights = function(q) {
		var qJson = angular.toJson(q);
		var query ={q:qJson};
		var Rights = $resource(pathProvider.Rights,query);
		var rights = Rights.query();
		$log.log("Got rights for query %o. Results are %o",q,rights );
	};
	
	/**
	 * 
	 */
	this.productVersionSingle = function(foxVersionId, onSuccess,isFoxipediaSearch){
		var foxId = new Number(foxVersionId);
		var foxIdString = foxId.toString();	
		var params = {foxVersionId:foxIdString};
		if (isFoxipediaSearch) {
			params.isFoxipediaSearch = true;
		}
		var ProductVersion = $resource(pathProvider.ProductVersionSingle, params);
		var versions = ProductVersion.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(versions);
			}
		});
		return versions;
	};
	
	/**
	 * 
	 */
	this.productRightsIndicator = function(foxVersionId, onSuccess){
		console.log("Getting product rights indicator for " + foxVersionId);
		var foxVersionIdNumber = new Number(foxVersionId);
		var foxVersionIdString = foxVersionIdNumber.toString();
		var ProductVersion = $resource(pathProvider.ProductRightsIndicator, {foxVersionId:foxVersionIdString});
		var indicator = ProductVersion.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(indicator);
			}
		});
		return indicator;
	};
	
		
	/**
	 * 
	 */
	this.productVersionTree = function(foxVersionId, isFoxipediaSearch, onSuccess){
		var params = {foxVersionId:foxVersionId};
		if (isFoxipediaSearch) {
			params.isFoxipediaSearch = isFoxipediaSearch;
		}
		
		var res = $resource(pathProvider.ProductVersionTree, params);
		var tree = res.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(tree);
			}
		});
		return tree;
	};
	
	this.findProductsByFoxId = function(foxId, onSuccess) {
		var res = $resource(pathProvider.ProductWithFoxId,{foxId:foxId});
		var product=res.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(product);
			}
		});
		return product;			
	};
	
	/**
	 * 
	 */
	this.loadRightStrands = function(foxVersionId, onSuccess){
		var res = $resource(pathProvider.loadRightStrands, {foxVersionId:foxVersionId});
		var rightStrands = res.query(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(rightStrands);
			}
		});
	};
	
	this.updateBusinessConfirmationStatus = function updateBusinessConfirmationStatus(foxVersionId,businessConfirmationStatusId,onSuccess,onError) {
		var path = pathProvider.updateBusinessConfirmationStatus;
		var Update = $resource(path+"/"+foxVersionId);
		Update.save(businessConfirmationStatusId,function(){
			if(angular.isFunction(onSuccess)){
				onSuccess();
			}
		},
		function(data){
			if(angular.isFunction(onError)){
				onError(data);
			}
			
		});
	};
	
	this.updateLegalConfirmationStatus = function(foxVersionId, confirmationStatusId) {
  	  var rcscope = angular.element(document.getElementById("rightsController")).scope();	  
	  console.log("updating confirmation status with " + confirmationStatusId);
	  //TODO change path to use functions
	  var url = rightStrandObject.path.getRightsRESTPath()+"/updateproduct/legalconfstatus/"+foxVersionId;	   
	  $.post(url, '"' + confirmationStatusId + '"', function(data){	   
		// update saveDoNotLicense
		console.log("Updated confirmationStatusId");
		// Add indicator to screen for user				  
		rcscope.currentProductArray.savingProduct = false;		   
		rcscope.currentProductArray.finishedSavingProduct = true;
		$("body").css("cursor", "default");
		setTimeout(function() {
		  rcscope.currentProductArray.finishedSavingProduct = false;
		  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		  }
		}, erm.statusIndicatorTime);		
		rcscope.currentProductArray.legalConfirmationStatusId = confirmationStatusId;
		rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		}
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to update legal confirmation status");		   
		// Add indicator to screen for user		
		rcscope.currentProductArray.savingProduct = false;
		rcscope.currentProductArray.errorSavingProduct = true;
		$("body").css("cursor", "default");
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		}
	  });
	};
	
	
	
	this.updateFoxProducedInd = function(foxVersionId, foxProducedInd) {
  	  var rcscope = angular.element(document.getElementById("rightsController")).scope();	  
	  console.log("updating fox produced indicator with " + foxProducedInd);
	  var foxVersionId = rcscope.foxVersionId;
	  var url = rightStrandObject.path.getRightsRESTPath()+"/updateproduct/foxProducedInd/"+foxVersionId;	   
	  $.post(url, '"' + foxProducedInd + '"', function(data){	   
		// update saveDoNotLicense
		console.log("Updated foxProducedInd");
		// Add indicator to screen for user				  
		rcscope.currentProductArray.savingProduct = false;		   
		rcscope.currentProductArray.finishedSavingProduct = true;
		$("body").css("cursor", "default");
		setTimeout(function() {
		  rcscope.currentProductArray.finishedSavingProduct = false;
		  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		  }
		}, erm.statusIndicatorTime);
		rcscope.currentProductArray.foxProducedInd = foxProducedInd;				
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
		  rcscope.$apply();
		}
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to update fox produced indicator");		   
		// Add indicator to screen for user		
		rcscope.currentProductArray.savingProduct = false;
		rcscope.currentProductArray.errorSavingProduct = true;
		$("body").css("cursor", "default");
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
		  rcscope.$apply();
		}
	  });
	};
	
	this.updateFutureMedia = function updateFutureMedia(foxVersionId,flag,onSuccess,onError) {
		var url = rightStrandObject.path.getRightsRESTPath()+"/updateproduct/futuremedia/"+foxVersionId + "/" +flag;
		$.post(url,{},function(data) {
			if (angular.isFunction(onSuccess)) {
				onSuccess(data);
			}				
			
		}).fail(function (xhr,status,message){
			console.log(xhr.responseText);
			if (angular.isFunction(onError)) {
				onError(xhr);
			}				
			
		});
			
		
	};
	
	//TODO remove we don't mantain scripted flag anymore
	this.updateScriptedFlag = function(foxVersionId, setScriptedFlag){
	  //TODO why are we passing foxVersionId and then getting it from someplace else?
	  //change this
	  rcscope = angular.element(document.getElementById("rightsController")).scope();	  
	  console.log("updating scripted with " + rcscope.currentProductArray.scriptedFlag);
	  var foxVersionId = rcscope.foxVersionId;
	  var url = rightStrandObject.path.getRightsRESTPath()+"/updateproduct/scripted/"+foxVersionId;	   
	  $.post(url, '"' + rcscope.currentProductArray.scriptedFlag + '"', function(data){	   
		// update saveDoNotLicense
		console.log("Updated Scripted");
		// Add indicator to screen for user				  
		rcscope.currentProductArray.savingProduct = false;		   
		rcscope.currentProductArray.finishedSavingProduct = true;
		setTimeout(function() {
		  rcscope.currentProductArray.finishedSavingProduct = false;
		  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		  }
		}, erm.statusIndicatorTime);
		rcscope.currentProductVersionLocal = rcscope.searchTree(rcscope.productVersionTree, foxVersionId);
		rcscope.currentProductVersionLocal.scriptedFlag = rcscope.currentProductArray.scriptedFlag;
		console.log("cscope.currentProductVersionLocal %o", rcscope.currentProductVersionLocal);
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		}		
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to update scripted");		   
		// Add indicator to screen for user		
		rcscope.currentProductArray.savingProduct = false;
		rcscope.currentProductArray.errorSavingProduct = true;
		rcscope.currentProductArray.scriptedFlag = !rcscope.currentProductArray.scriptedFlag;
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			rcscope.$apply();
		}
	  });
	};
	
	this.syncReleaseDate = function(foxVersionId, longDate, gridId){
		var scope = angular.element(document.getElementById("rightsController")).scope();
		var url = pathProvider.getSyncReleaseDate+"/"+foxVersionId;
		rightStrandObject.showGeneralPopupWindow("Sync in progress, please wait...");
		var payload = undefined;
		if (longDate) {
			payload = '"'+longDate+'"'; 
		}
		$.post(url, payload, function(data){	
			rightStrandObject.closeGeneralPopupWindow();
			scope.showSuccessMessage();
			gridStrandsConfigurator.setUpStrandsGrid(foxVersionId,data);
			$("#rightStrandshowAllDates").prop("checked", false);
			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
			ermSidePanelScope.loadProductComments();
			if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
				scope.$apply();
			}
		}).fail(function(xhr,status,message,rcscope){
			rightStrandObject.closeGeneralPopupWindow();
			errorPopup.showErrorPopupWindow(xhr.responseText);
		});
	};
	
});

/**
 * Service to load all the required initial data
 * Calls init on the services
 */
app.service('clearanceMemoService',function($resource, $log, pathProvider){
	var path = pathProvider.ClearanceMemo;	
	/**
	 * Returns an object containing the rights definition for a product.
	 * This includes the rights header, the rights strand, restrictions and comments
	 */
	this.getClearanceMemo = function(foxVersionId,onSuccess) {		
	  var clearanceUrl = $resource(path,{foxVersionId:foxVersionId});
	  var clearanceMemo = clearanceUrl.get(function(){
		if (angular.isFunction(onSuccess)) {
		  onSuccess(clearanceMemo);
		}
	  });
	  return clearanceMemo;
	};
	
});

/**
 * Service to deal with all the subrights calls
 */
app.service('productSubrightsService', function($resource, $log, pathProvider){
	/**
	 * 
	 */
	this.loadSubrights = function(foxVersionId, onSuccess){
		var subrightsUrl = $resource(pathProvider.productGrantsList, {foxVersionId:foxVersionId});
		var subrights = subrightsUrl.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(subrights);
			}
		});		
	};
	
	/**
	 * 
	 */
	this.saveProductGrantStatus = function(jsonComment, onSuccess){
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		$.post(pathProvider.productGrantStatusAdd, {q:jsonComment}, function(data){
			onSuccess(data);
			if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
				rcscope.$apply();
			}			
		}).fail(function(xhr,status,message,rcscope){
			console.log(" STATUS ERROR RESPONSE : "+xhr.responseText);
		});
	};
	
	this.updateProductGrantStatus = function(jsonComment, onSuccess){
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		$.post(pathProvider.productGrantStatusEdit, {q:jsonComment}, function(data){
			onSuccess(data);
			if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
				rcscope.$apply();
			}
		}).fail(function(xhr,status,message,rcscope){
			console.log(" STATUS ERROR RESPONSE : "+xhr.responseText);
		});
	};
	
	this.getCommentByGrantCodeId = function getCommentByGrantCodeId(grantCodeId,foxVersionId,onSuccess) {
		var path = 'rest/grants/grants/:foxVersionId/:grantCodeId';
		var Grants = $resource(path,{foxVersionId:foxVersionId, grantCodeId:grantCodeId});
		var productGrant = Grants.get(function(){
			console.log('Got product grant ',productGrant);
			if(angular.isFunction(onSuccess)){
				onSuccess(productGrant);
			}		
		});
	};
	
	this.loadCommentsUsingGrantCodeId = function(grantCodeId, foxVersionId, onSuccess){
		var res = $resource(pathProvider.getProductGrantsGetComment, {foxVersionId:foxVersionId, grantCodeId:grantCodeId});
		var comments = res.query(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(comments);
			}
		});
	};
});

/**
 * Service to load all the required initial data
 * Calls init on the services
 */
app.service('initService',function($log){
	$log.log("executing initService");

//	this.init(onSuccess) {
//		$log.log("initializing services");
//		mediaService.init();
//		if (angular.isFunction(onSuccess)) {
//			onSuccess();
//		}
//	};
//	this.init();
	
});

/**
 * This service is used to communicate data between controllers.
 * For example when a person selects a product from a search the selected product is placed in this
 * service so that other controller (for example rights controller) can pick up the selected product and avoid
 * having to do a different query 
 */
app.service('sharedStateService',function($log){
	
	this.currentProduct = {
		product:null,
		productVersion: null
	};
	
	this.setCurrentProduct = function(product,productVersion) {
	};
	
	this.setCurrentProductOnly = function(product){
		this.currentProduct.product = product;
	};
	
	this.getCurrentProduct = function() {
		return this.currentProduct;
	};
	
});

/**
 * Service that contains utility functions
 */
app.service('utilService', function() {
	 /**
	  * Returns an array of the ids for the objects.
	  * Example:
	  * objects =[{
	  *  foxVersionId: 1234,
	  *  title: "A brand new title"
	  * },
	  * {foxVersionId: 2345,
	  *  title: "Another title"
	  * }];
	  * getIdFunction=function(o) {
	  *  return o.foxVersionId;
	  * };
	  * var ids = collectIds(objects,getIdFunction);
	  * ids will be [1234,2345]
	  * @param objects. An array of objects with an id field (the name of the field can be anything)
	  * @paramn idFunction. A function that returns the id value of an object
	  */
	 this.collectIds = function(objects, idFunction) {
		 var ids =[];
		 var i;
		 var r;
		 var id;
		 for (i =0; i<objects.length;i++) {
			 r=objects[i];
			 id = idFunction(r);
			 ids.push(id);
		 }
		 return ids;
	 };
	 
	
	 /**
	  * Returns a map of the elements in the array. The key is the returned value fo applying the idFunction to each element
	  */
	this.toMap = function(array,idFunction) {
			var i=0;
			var id=null;
			var map=[];
			for (i=0;i<array.length;i++) {
				id = idFunction(array[i]);
				map[id]=array[i];
			}
			return map;
	};
	
	/**
	 * Truncate a string whose length exceeds 'desiredStringLength' to the appropriate length
	 */
	this.truncateString = function(desiredStringLength, stringToTruncate){
		if(desiredStringLength && stringToTruncate){
			if(desiredStringLength > 3 && stringToTruncate.length > desiredStringLength){
				return stringToTruncate.substr(0, (desiredStringLength - 3)) + "...";
			}
		}
		return stringToTruncate;
	};
});

/**
 * This service will house all the comments related queries to the server.
 */
app.service('commentService', function($resource,$log,pathProvider){
	/**
	 * this function load the comments based on a product foxVersionId.
	 */
	this.loadCommentByFoxVersionId = function(foxVersionId, onSuccess){
		var commentHttpResource = $resource(pathProvider.CommentByFoxVersionId, {foxVersionId:foxVersionId});
		var comments = commentHttpResource.query(function(){
			
			if(angular.isFunction(onSuccess)){
				onSuccess(comments);
			}
		});
		
		return comments;
	};
});

/**
 * This service will house all the comments related queries to the server.
 */
app.service('attachmentsService', function($resource,$log,pathProvider){
	/**
	 * this function load the attachments based on a product foxVersionId.
	 */	
	this.loadBaselineVersionsByFoxVersionId = function(foxVersionId){
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();
	  $.get(pathProvider.baselineVersionsByFoxVersionId + foxVersionId, '', function(attachments){	   
		var baselineVersionSelect= $("#baselineVersions");
		baselineVersionSelect.empty();
		$("<option />", {value: "0", text: "-- SELECT CLEARANCE REPORT PDF --"}).appendTo(baselineVersionSelect);
		for (var i = 0; i < attachments.length; i++) {		  
		  $("<option />", {value: attachments[i].documentId, text: attachments[i].attachmentName + " (" + rcscope.getCustomDisplayDateWithTime(attachments[i].createDate) + ")"}).appendTo(baselineVersionSelect);	     
		}
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to update baseline versions");		   			
	  });		
	};
});

app.service('jobsService',function($resource,$log,pathProvider) {
	this.getPendingJobs = function getPendingJobs(onSuccess) {
		var jobsResource = $resource(pathProvider.pendingJobsForUser), jobs;
		jobs = jobsResource.query(function(){
			if (angular.isFunction(onSuccess)) {
				onSuccess(jobs);
			}				
		});		
	};
	
	this.stopJob = function stopJob(jobId,onSuccess) {
		var path = pathProvider.stopJob;
		var stopJob = $resource(path,{jobId:jobId},{update:{method:'PUT'}});
		stopJob.update(null,function() {
			if(angular.isFunction(onSuccess)){
				onSuccess();
			}						
		});
	};
	
	this.deleteJob = function deleteJob(jobId,onSuccess) {
		var path = pathProvider.deleteJob;
		var deleteJob = $resource(path,{jobId:jobId},{remove:{method:'POST'}});
		return deleteJob.remove(null,function(){
			if(angular.isFunction(onSuccess)){
				onSuccess();
			}			
		});
	};
	
	this.getJobStatus = function getJobStatus(jobId,onSuccess) {
		$log.log("Getting job status for jobId " + jobId);
		var path = pathProvider.jobStatus;
		var jobResource = $resource(path),
			job;
		job = jobResource.get({jobId:jobId},function(job) {
			console.log("Executed getJobStatus");
			if(angular.isFunction(onSuccess)){
				onSuccess(job);
			}			
		});
		
		return job;		
	};
	
	this.getAllJobs = function getAllJobs(onSuccess) {
		var jobResource = $resource(pathProvider.allJobsForUser), jobs;
		jobs = jobResource.query(function(){
			if (angular.isFunction(onSuccess)) {
				onSuccess(jobs);
			}				
		});				
	};
	
	this.hasPendingJobs = function hasPendingJobs() {
		var jobResource = $resource(pathProvider.hasPendingJobs);
		var hasJobs = jobResource.query(); 
		return hasJobs;
	};
	
	
	this.getJobDetail = function getJobDetail(jobId,onSuccess) {
		$log.log("Getting job detail  for jobId " + jobId);
		var path =pathProvider.jobDetail;
		var jobResource = $resource(path),
			job;
		job = jobResource.get({jobId:jobId},function() {
			console.log("Executed getJobStatus");
			if(angular.isFunction(onSuccess)){
				onSuccess(job);
			}			
		});		
		return job;		
	};
	
});

app.service('reportService', function($resource, $log, pathProvider){
	
	this.loadReports = function(onSuccess){
		//var d = new Date();
		var res = $resource(pathProvider.getAllReportByUserIdRESTPath); //+"/"+d.getTime());
		var reports = res.get(function(){
			if(angular.isFunction(onSuccess)){
				onSuccess(reports);
			}
		});
		return reports;
	};
});

app.service('crossProductCopyService', function($resource, $log, pathProvider){	
	this.validate = function(jsonData, onSuccess){
		var qJson = angular.toJson(jsonData);
		//console.log("crossProductCopyService validate");
		//console.log("crossProductCopyService jsonData : %o", qJson);
		$.post(pathProvider.xProductCopyValidate, qJson, function(data){
			onSuccess(data);						
		}).fail(function(xhr,status,message,rcscope){
			console.log("STATUS ERROR RESPONSE : " + xhr.responseText);
			$(".crossProductSuccessDiv").removeClass("displayInline");
			$(".crossProductErrorDiv").addClass("displayInline");
			$(".crossProductErrorParagraph").html(xhr.responseText + "<BR/>");
		});
	};
	
	this.validateAndCopy = function(jsonData,onSuccess) {
		var qJson = angular.toJson(jsonData);
		//console.log("crossProductCopyService validate");
		//console.log("crossProductCopyService jsonData : %o", qJson);
		$.post(pathProvider.xProductCopyValidateAndCopy, qJson, function(data){
			onSuccess(data);						
		}).fail(function(xhr,status,message,rcscope){
			console.log("STATUS ERROR RESPONSE : " + xhr.responseText);
			$(".crossProductSuccessDiv").removeClass("displayInline");
			$(".crossProductErrorDiv").addClass("displayInline");
			$(".crossProductErrorParagraph").html(xhr.responseText + "<BR/>");
		});
		
	};

	/**
	 * Submit a XProduct delete job.
	 * NOTE: I first had it with $resource, but unfortunately there seems to be an issue with the confirmation dialog and $resource
	 * The call blocks untill there's a new event and then the ajax call processes.
	 * It is really strange AM 1/13/2014
	 */
	this.xDelete = function(jsonData,onSuccess) {
		var qJson = angular.toJson(jsonData);		
		var path = pathProvider.xProductDelete;		

		console.log("crossProductCopySerice.xDelete for job %o",jsonData);
		$.post(path, qJson, function(data){
			onSuccess(data);						
		}).fail(function(xhr,status,message,rcscope){
			console.log("STATUS ERROR RESPONSE : " + xhr.responseText);
			$(".crossProductDeleteSuccessDiv").removeClass("displayInline");
			$(".crossProductDeleteErrorDiv ").addClass("displayInline");
			$(".crossProductDeleteErrorParagraph").html(xhr.responseText + "<BR/>");
		});

	};
	
	
	
	
});



