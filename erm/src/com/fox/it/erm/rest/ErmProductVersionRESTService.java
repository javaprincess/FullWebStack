package com.fox.it.erm.rest;

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
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductGrant;
import com.fox.it.erm.ErmProductLanguageRestriction;
import com.fox.it.erm.ErmProductMediaRestriction;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductTerritoryRestriction;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.ProductVersionBase;
import com.fox.it.erm.RightsAndRestrictions;
import com.fox.it.erm.service.ErmProductRestrictionService;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ProductVersionSaveService;
import com.fox.it.erm.service.RightStrandService;
import com.fox.it.erm.util.ErmNode;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
/**
 * This class is responsible for retrieving all information pertaining to a movie rights and privileges
 * @author YvesN
 *
 */
@Path("/Rights")
public class ErmProductVersionRESTService extends RESTService{

	@EJB
	private ErmProductVersionService ermProductVersionService;
	
	@EJB
	private ProductVersionSaveService saveService;
	
	@EJB
	private ErmProductRestrictionService ermProductRestrictionService;

	@EJB
	private RightStrandService rightStrandSaveService;
	
	private static final Logger logger = Logger.getLogger(ErmProductVersionRESTService.class.getName());
	
	
	private Logger getLogger() {
		return logger;
	}
	
	/**
	 * Main method used to retrieve all rights information based on  a foxVersionId.
	 * @param foxId
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)	
	public ErmProductVersion findById(@QueryParam("foxVersionId") Long foxId){
		ErmProductVersion emrProductVersion = ermProductVersionService.findById(foxId);
		if(emrProductVersion == null)
			emrProductVersion = new ErmProductVersion();
		logger.log(Level.INFO, "findById: foxVersionId: " + emrProductVersion.getFoxVersionId() + " isScriptedFlag: " + emrProductVersion.isScripted() + " emrProductVersion.getClearanceMemo(): " + emrProductVersion.hasClearanceMemo());			
		logger.log(Level.INFO, emrProductVersion.getCreateName());
		return emrProductVersion;
	}
	
	/**
	 * This method return all the restrictions attached to a particular Product version. This is so that we can have another
	 *  option beside having to retrieve the restrictions individually.
	 * @param foxId
	 * @return
	 */	
	public List<ErmProductGrant> getErmProductionGrants(@QueryParam("foxVersionId") Long foxId){
		
		return ermProductRestrictionService.findErmProductGrantByErmProductVersionId(foxId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/restrictionsAndGrant")
	public RightsAndRestrictions getAllRightsAndRestrictions(@QueryParam("foxVersionId") Long foxId){
		
		RightsAndRestrictions rnr = new RightsAndRestrictions();
		
		List<ErmProductGrant> productGrants = this.ermProductRestrictionService.findErmProductGrantByErmProductVersionId(foxId);
		if(productGrants != null && !productGrants.isEmpty())rnr.setProductGrants(productGrants);
		
		List<ErmProductMediaRestriction> productMediaRestrictions = this.ermProductRestrictionService.findErmProductMediaRestrictionByErmProductVersionId(foxId);
		if(productMediaRestrictions != null && !productMediaRestrictions.isEmpty()) rnr.setProductMediaRestrictions(productMediaRestrictions);
		
		List<ErmProductLanguageRestriction> productLanguageRestrictions = this.ermProductRestrictionService.findErmProductLanguageRestrictionByErmProductVersionId(foxId);
		if(productLanguageRestrictions != null && !productLanguageRestrictions.isEmpty()) rnr.setProductLanguageRestrictions(productLanguageRestrictions);
		
		//TODO change to findAllProductRestrictions
		List<ErmProductRestriction> productRestrictions = this.ermProductRestrictionService.findErmProductRestrictionByErmProductVersionId(foxId);
		if(productRestrictions != null && !productRestrictions.isEmpty()) rnr.setProductRestrictions(productRestrictions);
		
		List<ErmProductTerritoryRestriction> ermProductTerritoryRestrictions = this.ermProductRestrictionService.findErmProductTerritoryRestrictionByErmProductVersionId(foxId);
		if(ermProductTerritoryRestrictions != null && !ermProductTerritoryRestrictions.isEmpty()) rnr.setErmProductTerritoryRestrictions(ermProductTerritoryRestrictions);

				
				
		return rnr;
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/restrictions/{foxVersionId: \\d+}")
	public List<ErmProductRestriction> findAllRestrictions(@PathParam("foxVersionId") Long foxVersionId) {
		List<ErmProductRestriction> productRestrictions = this.ermProductRestrictionService.findAllProductRestrictions(foxVersionId);
		return productRestrictions;
	}
	
	/**
	 * Return all the movie versions or TV episode versions based on the fox version id.
	 * @param foxVersionId
	 * @return
	 */	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/tree")
	public ErmNode<? extends ProductVersionBase> getMovieTVNodeTree(@Context HttpServletRequest request, @QueryParam("foxVersionId") Long foxVersionId,@QueryParam("isFoxipediaSearch") boolean isFoxipediaSearch){
		ErmNode<? extends ProductVersionBase> erm = null;
		try {
			String userId = getUserId(request);			
			erm = ermProductVersionService.getMovieTVProductVersions(foxVersionId,userId,isFoxipediaSearch);
		}
		catch(Exception ex){
			logger.log(Level.SEVERE, ex.toString(),ex);
		}
		return erm;
	}
	
	
	@POST
	@Path("/restrictions")
	public List<Long> saveRestrictions(@Context HttpServletRequest request ) {
		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {
			String q = request.getParameter("q");
			List<ErmProductRestriction> list = saveService.saveRestrictions(userId, isBusiness, q);
			List<Long> ids = IdsAccumulator.getIds(list, new IdProvider<ErmProductRestriction>() {

				@Override
				public Long getId(ErmProductRestriction o) {
					return o.getProductRestrictionId();
				}

			});
			return ids;
		} catch (ErmValidationException e) {
			getLogger().log(Level.SEVERE,"Validation exception saving restrictions of user " + userId,e);
			throw getValidationException(e.getMessage());
		}
	}
	
	@POST	// was DELETE but to had to change to get it to work correctly
	@Path("/deleterestriction")		
	public void deleteRestrictions(@Context HttpServletRequest request, String q) {		
		String userId = "";
		try {						
			userId = getUserId(request);			
			boolean isBusiness = isBusiness(request);
			rightStrandSaveService.deleteRightRestriction(userId, isBusiness, q);
//			saveService.deleteRestriction(userId, isBusiness, q);					
		} catch(ErmValidationException e) {			
			getLogger().log(Level.SEVERE,"Validation exception deleting restriction for user " + userId,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception deleting restrictions for user " + userId,e);
			throw getValidationException(e.getMessage());
		}
	}
	
	@POST
	@Path("/restrictions/dnl/{foxVersionId}")	
	public void saveDoNotLicense(@Context HttpServletRequest request,@PathParam("foxVersionId") Long foxVersionId, String saveDoNotLicense) {
		String userId = "";
		try {
			userId = getUserId(request);
			boolean isBusiness = isBusiness(request);
			logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " saveDoNotLicense: " + saveDoNotLicense + " saveDoNotLicense boolean: " + Boolean.parseBoolean(saveDoNotLicense.replaceAll("\"", "")));
			saveService.saveDoNotLicense(foxVersionId, userId, isBusiness, Boolean.parseBoolean(saveDoNotLicense.replaceAll("\"", "")));
		} catch (ErmValidationException e) {
			getLogger().log(Level.SEVERE,"Validation exception saving  of user " + userId,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception saving for user " + userId,e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/updateproduct/scripted/{foxVersionId}")	
	public void updateScripted(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String isScripted) {
		String userId = "";
		try {			
			userId = getUserId(request);
			logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " isScripted: " + isScripted + " isScripted boolean: " + Boolean.parseBoolean(isScripted.replaceAll("\"", "")));
			saveService.updateScripted(foxVersionId, userId, Boolean.parseBoolean(isScripted.replaceAll("\"", "")));
		} catch (ErmValidationException e) {
			getLogger().log(Level.SEVERE,"Validation exception updating scripted value" ,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception updating scripted value ",e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/updateproduct/bsnsconfstatus/{foxVersionId}")	
	public void updateBusinessConfirmationStatus(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String businessConfirmationStatusIdStr) {
		String userId = "";
		try {			
			userId = getUserId(request);
			logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " businessConfirmationStatusId: " + businessConfirmationStatusIdStr);
			if (businessConfirmationStatusIdStr!=null) {
				Long businessConfirmationStatusId = Long.parseLong(businessConfirmationStatusIdStr);
				saveService.updateBusinessConfirmationStatus(foxVersionId,  businessConfirmationStatusId,userId);
				
			}

		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception updating businessConfirmationStatus value ",e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/updateproduct/legalconfstatus/{foxVersionId}")	
	public void updateLegalConfirmationStatus(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String legalConfirmationStatusId) {
		String userId = "";
		try {			
			userId = getUserId(request);
			logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " legalConfirmationStatusId: " + legalConfirmationStatusId);
			saveService.updateLegalConfirmationStatus(foxVersionId, userId, legalConfirmationStatusId != null ? Long.parseLong(legalConfirmationStatusId.replaceAll("\"", "")) : 0);
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception updating legalConfirmationStatus value ",e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/updateproduct/futuremedia/{foxVersionId}/{futureMedia}")
	public void updateFutureMedia(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId,@PathParam("futureMedia") String futureMedia) {
		String userId = "";
		try {			
			userId = getUserId(request);
			logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " futureMedia: " + futureMedia);
			Integer futureMediaInd = (futureMedia==null||futureMedia.trim().isEmpty())?null:Integer.parseInt(futureMedia);
			if (futureMediaInd.intValue()==-1) {
				futureMediaInd=null;
			}
			saveService.updateFutureMedia(foxVersionId, userId, futureMediaInd);
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception updating legalConfirmationStatus value ",e);
			throw getValidationException(e.getMessage());
		}	
		
	}
	
	@POST
	@Path("/updateproduct/foxProducedInd/{foxVersionId}")	
	public void updateFoxProducedInd(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String foxProducedInd) {
		String userId = "";
		try {			
			userId = getUserId(request);			
			try {
			  logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " foxProducedInd: " + (foxProducedInd != null ? Integer.parseInt(foxProducedInd.replaceAll("\"", "")) : null));
 			  saveService.updateFoxProducedInd(foxVersionId, userId, Integer.parseInt(foxProducedInd.replaceAll("\"", "")));
			} catch (NumberFormatException ne) {
				logger.log(Level.INFO, "foxVersionId: " + foxVersionId + " foxProducedInd: " + null);
				saveService.updateFoxProducedInd(foxVersionId, userId, null);
			}
		} catch (ErmValidationException e) {
			getLogger().log(Level.SEVERE,"Validation exception updating legalConfirmationStatus value" ,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception exception updating legalConfirmationStatus value ",e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	
	
	/**
	 * 
	 * @param request
	 * @return
	 */
	@POST
	@Path("/adoptproductrestriction")
	public List<ErmProductRestriction> adoptProductRestrictions(@Context HttpServletRequest request){
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		List<ErmProductRestriction> list = null;
		try{
			String jsonData = request.getParameter("q");
			list = saveService.adoptRestrictions(userId, isBusiness, jsonData);
		}
		catch(ErmException e){
			getLogger().log(Level.SEVERE,"Validation exception updating scripted value" ,e);
			throw getValidationException(e.getMessage());
		}
		catch(Exception e){
			getLogger().log(Level.SEVERE,"Validation exception updating scripted value" ,e);
			throw getValidationException(e.getMessage());
		}
		return list;
	}
}
