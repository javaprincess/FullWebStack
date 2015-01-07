package com.fox.it.erm.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.FoxipediaProductGroup;
import com.fox.it.erm.ProductContains;
import com.fox.it.erm.ProductFileNumber;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductType;
import com.fox.it.erm.ProductVersion;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.util.ExceptionUtil;

@Path("/Products")
public class ProductRESTService extends RESTService{
	
	private static final Logger logger = Logger.getLogger(ProductRESTService.class.getName());
		
	private Logger getLogger() {
		return logger;
	}
	
	
	@EJB
	private ProductService productService;
	
	//	private static final Logger logger = Logger.getLogger(ProductRESTService.class.getName());

	@GET
    @Produces(MediaType.APPLICATION_JSON)	
	@Path("/{foxId: \\d+}")
	public ProductHeader findById(@PathParam("foxId") Long foxId) {
		return productService.findProductHeaderById(foxId);
	}
	

	/**
	 * Returns a product corresponding to the foxVersonId.
	 * In addition only the fox version will be included in the versions list for the product.
	 * This will be used by the view rights UI in case of a refresh and we need to re fetch the Product and ProductVersion pair
	 * @param foxVersionId
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/productVersion/{foxVersionId:\\d+}")
	public ProductVersion findProductByFoxVersionId(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId,@QueryParam("isFoxipediaSearch") boolean isFoxipediaSearch) {
		String userId = getUserId(request);
		return getProductByFoxVersionId(foxVersionId,userId,isFoxipediaSearch);
	}
	
	/**
	 * Returns product versions based of the foxId.	 
	 * This will be used by the view rights UI in case of a refresh and we need to re fetch the Product and ProductVersion pair
	 * @param foxId
	 * @param includeDefault
	 * @param strandsQuery string indicating if versions should include with/without strands or with/without legal strands
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/versions/{foxId:\\d+}")
	public List<ProductVersion> findProductVersions(@PathParam("foxId") Long foxId ,@QueryParam("includeDefault") Boolean includeDefaultParam, @QueryParam("strandsQuery") String strandsQuery) {
		boolean setHasRightStrands = true;
		boolean includeDefault = true;
		if (includeDefaultParam!=null) {
			includeDefault=includeDefaultParam.booleanValue();
		}
		List<ProductVersion> list = null;
		if (includeDefault) {
			list = productService.findProductVersionsSetDefault(foxId,setHasRightStrands,strandsQuery);
		} else {
			list = productService.findProductVersions(foxId,setHasRightStrands,includeDefault,strandsQuery);
		}
		Collections.sort(list);
		return list;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contains/{foxVersionId:\\d+}")	
	public ProductContains getProductContains(@PathParam("foxVersionId") Long foxVersionId) {
		return productService.getProductContains(foxVersionId);
	}
	


	
	/**
	 * Main product search function. 
	 * @param q. A string representing a JSON object containing the product query. 
	 * @see com.fox.it.erm.erm.ProductQuery
	 * @return
	 */
	@POST	
    @Produces(MediaType.APPLICATION_JSON)	
	public Response findProducts(@Context HttpServletRequest request) {
		getLogger().log(Level.SEVERE," inside findProducts ");
		String userId = getUserId(request);
		List<ProductHeader> listProductHeader = new ArrayList<ProductHeader>();
		try {
		  String q = request.getParameter("q");
		  if (q==null||q.isEmpty()) {
			throw getValidationException("q is required");
		  }
		  listProductHeader = productService.find(q,userId);
		} catch(ErmException e) {			
			getLogger().log(Level.SEVERE,"Search exception " + userId,e);			
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
			getLogger().log(Level.SEVERE,"Exception " + ermException.getMessage());
			return Response.ok(ermException.getMessage()).build();
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Search exception " + userId,e);			
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);
			getLogger().log(Level.SEVERE,"ErmException " + ermException.getMessage());
			return Response.ok(ermException.getMessage()).build();
		}	
		return Response.ok(listProductHeader).build();
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/productTypes")
	public Response findProductTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllContractualPartyTypes: ");
		List<ProductType> productTypes = productService.findProductTypes();
		HashMap<String, String> productTypesMap = new HashMap<String, String>();
		for (ProductType productType : productTypes)
			productTypesMap.put(productType.getCode(), productType.getName());
		String text = "erm.dbvalues.productTypes="+ new JacksonJsonService().toJson(productTypes) + ";\n" +
		"erm.dbvalues.productTypesMap="+ new JacksonJsonService().toJson(productTypesMap) + ";" +		 
		"erm.dynamicJSLoadedCounter++;";
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();							
	}
	
	@GET
	@Path("/foxipediaGroups")	
	@Produces(MediaType.APPLICATION_JSON)
	public List<FoxipediaProductGroup> findFoxipediaGroups(@QueryParam("q") String q) {
		List<FoxipediaProductGroup> productGroups = productService.findFoxipediaGroups(q);
		return productGroups;
	}
	
	/**
	 * Used by findProductByFoxVersionId
	 * @param foxVersionId
	 * @return
	 */
	private ProductVersion getProductByFoxVersionId(Long foxVersionId){		
		return getProductByFoxVersionId(foxVersionId, null, false);
	}
	
	private ProductVersion getProductByFoxVersionId(Long foxVersionId,String userId, boolean isFoxipediaSearch) {
		return productService.findProductVersionById(foxVersionId,userId,isFoxipediaSearch);		
	}
		
	@POST	// was DELETE but to had to change to get it to work correctly
	@Path("/deleteproductinfocode")	
	public void deleteproductinfocode(@Context HttpServletRequest request, String q) {		
		String userId = "";
		try {						
			userId = getUserId(request);
			boolean isBusiness = isBusiness(request);
			productService.deleteProductInfoCode(userId, isBusiness, q);					
		} catch(ErmValidationException e) {			
			getLogger().log(Level.SEVERE,"Validation exception deleting product info code for user " + userId,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception deleting product info code for user " + userId,e);
			throw getValidationException(e.getMessage());
		}
	}
	
	@POST
	@Path("/findByFoxVersionIds")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ProductVersion> getProductVersionsByFoxVersionIds(@Context HttpServletRequest request) throws ErmException{
		
		try{
			String stringIds = request.getParameter("q");
			this.getLogger().info(" INPUT PARAMETER FOR FOX VERSION IDS : "+ stringIds);
			String[] ids = stringIds.split(",");
			List<Long> foxVersionIds = new ArrayList<Long>();
			if(ids.length > 0){			  
			  for(String id : ids){			
				foxVersionIds.add(Long.parseLong(id));				
			  }
			}
			return productService.findProductVersions(foxVersionIds);
		}
		catch(Exception ex){
			ex.printStackTrace(System.err);
			throw new ErmException(ex);
		}
	}
	
	@POST
	@Path("/saveProductFileNumber")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ProductFileNumber> saveCentralFileNumber(@Context HttpServletRequest request) throws ErmException{
		
		try{
			String userId = getUserId(request);			
			String productFileNumbers = request.getParameter("q") != null ? request.getParameter("q").replaceAll("\"", "") : "";
			Long foxVersionId = Long.parseLong(request.getParameter("foxVersionId"));
			
			return productService.saveProductFileNumber(productFileNumbers, foxVersionId, userId);
		}
		catch(Exception ex){
			ex.printStackTrace(System.err);
			throw new ErmException(ex);
		}
		
	}
	
	@POST
	@Path("/deleteProductFileNumber")
	@Produces(MediaType.APPLICATION_JSON)
	public List<ProductFileNumber> deleteCentralFileNumber(@Context HttpServletRequest request) throws ErmException{
		
		try{
			String userId = getUserId(request);			
			String productFileNumberIds = request.getParameter("q") != null ? request.getParameter("q").replaceAll("\"", "") : "";			
			Long foxVersionId = Long.parseLong(request.getParameter("foxVersionId"));
			
			return productService.deleteProductFileNumber(productFileNumberIds, foxVersionId, userId);
			
		}
		catch(Exception ex){
			ex.printStackTrace(System.err);
			throw new ErmException(ex);
		}
	}
	

}
