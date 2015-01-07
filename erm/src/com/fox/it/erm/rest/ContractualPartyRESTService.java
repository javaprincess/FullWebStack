package com.fox.it.erm.rest;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.ErmAccessType;
import com.fox.it.erm.ErmContactType;
import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmContractualPartyType;
import com.fox.it.erm.ErmCountry;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmOrganizationType;
import com.fox.it.erm.ErmParty;
import com.fox.it.erm.ErmPartyType;
import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.service.ContractualPartyService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.service.impl.JsonToErmContractInfoObject;
import com.fox.it.erm.service.impl.JsonToErmPartyObject;
import com.fox.it.erm.util.ErmContractInfoCreateObject;

@Path("/ContractualParty")
public class ContractualPartyRESTService extends RESTService {
	
	private static final Logger logger = Logger.getLogger(CodesRESTService.class.getName());

	@EJB
	private ContractualPartyService contractualPartyService;
	
	@Inject
	private JsonService jsonService = new JacksonJsonService();

	/**
	 * Gets all the fox entities
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/foxEntities")
	public Response getFoxEntities() {
		CacheControl cacheControl = getCache();
		List<ErmParty> foxEntities = contractualPartyService.findAllFoxEntities();
		HashMap<Long, String> foxEntitiesMap = new HashMap<Long, String>();
		Collections.sort(foxEntities);
		for (ErmParty foxEntity : foxEntities) {
			//AMV changed from organization name to display name
			foxEntitiesMap.put(foxEntity.getPartyId(), foxEntity.getDisplayName());
		}
		String variable = "foxEntities";
		String foxEntitiesJs = getJsFromObject(variable, foxEntities,false);
		variable = "foxEntitiesMap";
		String foxEntitiesMapJs = getJsFromObject(variable,foxEntitiesMap,true);
		String text = foxEntitiesJs + foxEntitiesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}
	
	/**
	 * Gets all the fox entities
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contacts/{foxVersionId: \\d+}")
	public List<ErmParty> getContacts(@PathParam("foxVersionId") Long foxVersionId) {		
		List<ErmParty> contacts = contractualPartyService.findAllContacts(foxVersionId);			
		return contacts;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contacts")
	public List<ErmParty> getContacts(){
		List<ErmParty> contacts = contractualPartyService.findAllContacts();			
		return contacts;
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contactsproducts")	
	public List<ErmParty> getContactsAssociatedWithProducts() {
		List<ErmParty> contacts = contractualPartyService.findAllContatsAssociatedWithProducts();			
		return contacts;		
	}
	
	/**
	 * Get contact by party id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/contact/{partyId: \\d+}")
	public ErmParty getContact(@PathParam("partyId") Long partyId) {
		ErmParty contact = new ErmParty();
		contact.setComment(new EntityComment());
		contact.getComment().setComment(new Comment());
		contact.setActiveFlag("Y");
		if (partyId > 0)
		  contact = contractualPartyService.findContact(partyId);		
		return contact;
	}
	
	/**
	 * Get contact by party id
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/saveContact/{partyId: \\d+}")
	public void saveContact(@Context HttpServletRequest request, @PathParam("partyId") Long partyId, String q) {					
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		logger.log(Level.INFO," ermPartyString " + q);
		if (q != null) {
		  try {			
		    JsonToErmPartyObject converter = new JsonToErmPartyObject(jsonService);
		    ErmParty ermParty = converter.convert(q);		    
		    contractualPartyService.saveContact(ermParty, userId, isBusiness);
		  } catch (ErmValidationException ermValException) {
			logger.log(Level.SEVERE,"Validation exception saving party by party id for user " + userId, ermValException);							
		  } catch (ErmException ermException) {
			logger.log(Level.SEVERE,"Validation exception saving party by party id for user " + userId, ermException);
		  }
		}
	}
	
	/**
	 * Get contact by party id
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/searchContacts/{foxVersionId: \\d+}")
	public List<ErmParty> searchContacts(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String q) {							
	  logger.log(Level.INFO," ermPartyString " + q);				
	  JsonToErmPartyObject converter = new JsonToErmPartyObject(jsonService);
	  ErmParty ermParty = converter.convert(q);				    
	  return contractualPartyService.searchContacts(foxVersionId, ermParty);		  		
	}		
	
	/**
	 * Gets all the fox entities
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/productContacts/{foxVersionId: \\d+}")
	public List<ErmProductContact> getProductContacts(@PathParam("foxVersionId") Long foxVersionId) {		
		List<ErmProductContact> contacts = contractualPartyService.findAllContactsForProduct(foxVersionId);			
		return contacts;
	}
	
	/**
	 * Gets all the fox entities
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/assignContact/{foxVersionId: \\d+}")
	public void assignContact(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId) {
		Long partyId = request.getParameter("partyId") != null ? Long.parseLong(request.getParameter("partyId")) : 0;		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		if (partyId > 0) {
		  try {			
		    contractualPartyService.assignContactToProduct(foxVersionId, userId, isBusiness, partyId);
		  } catch (ErmValidationException ermValException) {
			    logger.log(Level.SEVERE,"Validation exception saving ErmContracts By Fox Version ID for user " + userId, ermValException);							
		  } catch (ErmException ermException) {
			logger.log(Level.SEVERE,"Validation exception saving ErmContracts By Fox Version ID for user " + userId, ermException);
		  }
		}		
	}
	
	
	/**
	 * Gets all the contractual parties
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/parties")	
	public Response getContractualParties() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllContractualParties: ");
		List<ErmParty> contractualParties = contractualPartyService.findAllContractualParties();
		Collections.sort(contractualParties);
		HashMap<Long, String> contractualPartiesMap = new HashMap<Long, String>();
		for (ErmParty contractualParty : contractualParties) {
			//AMV changed from organization name to display name
			contractualPartiesMap.put(contractualParty.getPartyId(), contractualParty.getDisplayName());
		}
		String variable = "contractualParties";
		String contractualPartiesJs = getJsFromObject(variable, contractualParties,false);
		variable = "contractualPartiesMap";
		String contractualPartiesMapJs = getJsFromObject(variable,contractualPartiesMap,true);
		
		String text = contractualPartiesJs + contractualPartiesMapJs;  
	  return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();
	}	
	
	
	/**
	 * Gets all the contractual parties
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/contractualPartyTypes")
	public Response getContractualPartyTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllContractualPartyTypes: ");
		List<ErmContractualPartyType> contractualPartyTypes = contractualPartyService.findAllContractualPartyTypes();
		HashMap<Long, String> contractualPartyTypesMap = new HashMap<Long, String>();
		for (ErmContractualPartyType contractualPartyType : contractualPartyTypes) {
			contractualPartyTypesMap.put(contractualPartyType.getContractualPartyTypeId(), contractualPartyType.getContractualPartyTypeDesc());
		}
		String variable = "contractualPartyTypes";
		String contractualPartyTypesJs = getJsFromObject(variable, contractualPartyTypes,false);
		variable = "contractualPartyTypesMap";
		String contractualPartyTypesMapJs = getJsFromObject(variable,contractualPartyTypesMap,true);
		
		String text = contractualPartyTypesJs + contractualPartyTypesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}
	
	/**
	 * Gets all the contractual parties
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/partyTypes")
	public Response getPartyTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllPartyTypes: ");
		List<ErmPartyType> partyTypes = contractualPartyService.findAllPartyTypes();
		HashMap<String, String> partyTypesMap = new HashMap<String, String>();
		for (ErmPartyType partyType : partyTypes) {
			partyTypesMap.put(partyType.getPartyTypeCode(), partyType.getPartyTypeDesc());
		}
		String variable = "partyTypes";
		String partyTypesJs = getJsFromObject(variable, partyTypes,false);
		variable = "partyTypesMap";
		String partyTypesMapJs = getJsFromObject(variable, partyTypesMap,true);
		
		String text = partyTypesJs + partyTypesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}
	
	/**
	 * Gets all the contact types
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/contactType")
	public Response getContactTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllContactTypes: ");
		List<ErmContactType> contactTypes = contractualPartyService.findAllContactTypes();
		HashMap<Long, String> contactTypesMap = new HashMap<Long, String>();
		for (ErmContactType contactType : contactTypes) {
			contactTypesMap.put(contactType.getContactTypeId(), contactType.getContactTypeDesc());
		}
		String variable = "contactTypes";
		String contactTypesJs = getJsFromObject(variable, contactTypes,false);
		variable = "contactTypesMap";
		String contactTypesMapJs = getJsFromObject(variable,contactTypesMap,true);		
		String text = contactTypesJs + contactTypesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}
	
	/**
	 * Gets all the organization types
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/organizationType")
	public Response getOrganizationTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllOrganizationTypes: ");
		List<ErmOrganizationType> organizationTypes = contractualPartyService.findAllOrganizationTypes();
		HashMap<String, String> organizationTypesMap = new HashMap<String, String>();
		if (organizationTypes != null) 
		  for (ErmOrganizationType organizationType : organizationTypes)
			organizationTypesMap.put(organizationType.getOrganizationTypeCode(), organizationType.getOrganizationTypeDesc());	
		String variable = "organizationTypes";
		String organizationTypesJs = getJsFromObject(variable, organizationTypes,false);
		variable = "organizationTypesMap";
		String organizationTypesMapJs = getJsFromObject(variable,organizationTypesMap,true);		
		String text = organizationTypesJs + organizationTypesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}	
	
	/**
	 * Gets all the organization types
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/countries")
	public Response getCountries() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties getCountries: ");
		List<ErmCountry> countries = contractualPartyService.loadCountries();
		LinkedHashMap <String, String> countriesMap = new LinkedHashMap<String, String>();		 
		for (ErmCountry country : countries) {
		  countriesMap.put(country.getCountryCode(), country.getCountryDesc());
		}		
		String variable = "countriesMap";
		String countriesMapJs = getJsFromObject(variable,countriesMap,true);		
		String text = countriesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}
	
	/**
	 * Gets all the contact types
	 * @return
	 */
	@POST
	@Path("/switchAccessOrContactType/{productContactId: \\d+}")
	@Produces(MediaType.APPLICATION_JSON)
	public void switchAccessOrContactType(@Context HttpServletRequest request, @PathParam("productContactId") Long productContactId) {
		String typeSwitch = request.getParameter("typeSwitch");
		Long typeId = request.getParameter("typeId") != null ? Long.parseLong(request.getParameter("typeId")) : 0;
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		if (typeId > 0) {
		  if (typeSwitch != null && typeSwitch.equals("contactType")) {								
			try {			
			  contractualPartyService.switchContactType(productContactId, userId, isBusiness, typeId);
			} catch (ErmValidationException ermValException) {
			  logger.log(Level.SEVERE,"Validation exception saving ErmProductContact By Product Contact ID for user " + userId, ermValException);							
			} catch (ErmException ermException) {
			  logger.log(Level.SEVERE,"Validation exception saving ErmProductContact By Product Contact ID for user " + userId, ermException);
			}			
		  } else if (typeSwitch != null && typeSwitch.equals("accessType")) {							
			try {			
			  contractualPartyService.switchAccessType(productContactId, userId, isBusiness, typeId);
			} catch (ErmValidationException ermValException) {
			  logger.log(Level.SEVERE,"Validation exception saving ErmProductContact By Product Contact ID for user " + userId, ermValException);							
			} catch (ErmException ermException) {
			  logger.log(Level.SEVERE,"Validation exception saving ErmProductContact By Product Contact ID for user " + userId, ermException);
			}
		  }	
		}				
	}
	
	/**
	 * Gets all the contact types
	 * @return
	 */
	@POST
	@Path("/deleteProductContact/{productContactId: \\d+}")
	@Produces(MediaType.APPLICATION_JSON)
	public void deleteProductContact(@Context HttpServletRequest request, @PathParam("productContactId") Long productContactId) {		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		if (productContactId > 0) {		  	
		  try {			
			contractualPartyService.deleteErmProductContact(productContactId, userId, isBusiness);
		  } catch (ErmValidationException ermValException) {
			logger.log(Level.SEVERE,"Validation exception removing ErmProductContact By Product Contact ID for user " + userId, ermValException);							
		  } catch (ErmException ermException) {
			logger.log(Level.SEVERE,"Validation exception removing ErmProductContact By Product Contact ID for user " + userId, ermException);
		  }		  
		}				
	}
	
	
	/**
	 * Gets all the contact types
	 * @return
	 */
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	@Path("/accessType")
	public Response getAccessTypes() {
		CacheControl cacheControl = getCache();
		logger.info("Inside /contractualParties findAllContactTypes: ");
		List<ErmAccessType> accessTypes = contractualPartyService.findAllAccessTypes();
		HashMap<Long, String> accessTypesMap = new HashMap<Long, String>();
		for (ErmAccessType accessType : accessTypes) {
			accessTypesMap.put(accessType.getAccessTypeId(), accessType.getAccessTypeDesc());
		}
		String variable = "accessTypes";
		String accessTypesJs = getJsFromObject(variable, accessTypes,false);
		variable = "accessTypesMap";
		String accessTypesMapJs = getJsFromObject(variable,accessTypesMap,true);
		
		String text = accessTypesJs + accessTypesMapJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();		
	}
	
	
	/**
	 * Gets all the contractual parties
	 * @return
	 */
	@GET
	@Path("/ermContractList/{foxVersionId: \\d+}")
	public List<ErmContractInfo> findErmContractsByFoxVersionID(@Context HttpServletRequest req, @PathParam("foxVersionId") Long foxVersionId) {
		logger.info("Inside /contractualParties findErmContractsByFoxVersionID: " + foxVersionId);
		List<ErmContractInfo> ermContractInfoList = contractualPartyService.findErmContractsByFoxVersionID(foxVersionId);
		logger.info("Inside /contractualParties found ermContractInfoList " + ermContractInfoList);
		return ermContractInfoList;
	}	

	/**
	 * Saves all contractual parties for a given fox id then saves the passed parties
	 */
	@POST
	@Path("/saveErmContractList")
	public void saveErmContractsByFoxVersionID(@Context HttpServletRequest request, String q) throws ErmValidationException, ErmException {
		logger.info("Inside /contractualParties saveErmContractsByFoxVersionID: ");
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			JsonToErmContractInfoObject converter = new JsonToErmContractInfoObject(jsonService);
			ErmContractInfoCreateObject cm = converter.convert(q);
			List<ErmContractInfo> ermContractInfoList = cm.getErmContractInfoList();
			Long foxVersionId = cm.getFoxVersionId();									
			contractualPartyService.saveErmContractsByFoxVersionID(foxVersionId, userId, isBusiness, ermContractInfoList);
			
		} catch (ErmValidationException ermValException) {
			logger.log(Level.SEVERE,"Validation exception saving ErmContracts By Fox Version ID for user " + userId, ermValException);
			throw getValidationException(ermValException.getMessage());
		}				
	}
	
	
	/**
	 * Deletes contractual parties for a given erm contract info id
	 */
	@POST
	@Path("/deleteErmContractList")
	public void deleteErmContractInfo(@Context HttpServletRequest request, String q) throws ErmValidationException, ErmException {
		logger.info("Inside /contractualParties saveErmContractsByFoxVersionID: ");
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			JsonToErmContractInfoObject converter = new JsonToErmContractInfoObject(jsonService);
			ErmContractInfoCreateObject cm = converter.convert(q);
			ErmContractInfo ermContractInfo = cm.getErmContractInfo();
			contractualPartyService.deleteErmContract(ermContractInfo.getContractInfoId(), userId, isBusiness);
		} catch (ErmValidationException ermValException) {
			logger.log(Level.SEVERE,"Validation exception saving ErmContracts By Fox Version ID for user " + userId, ermValException);
			throw getValidationException(ermValException.getMessage());
		}				
	}	
	
}
