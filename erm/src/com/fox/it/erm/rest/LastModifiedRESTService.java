package com.fox.it.erm.rest;

import java.util.Date;
import java.util.HashMap;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.Cache;
import com.fox.it.erm.service.CodesService;
import com.fox.it.erm.service.ContractualPartyService;
import com.fox.it.erm.service.LanguageService;
import com.fox.it.erm.service.MediaService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.RestrictionService;
import com.fox.it.erm.service.TerritoryService;

@Path("/lastModified")
public class LastModifiedRESTService extends RESTService {
	
	@EJB
	private ContractualPartyService contractualPartyService;
	
	@EJB
	private ProductService productService;
	
	@EJB
	private  MediaService mediaService;
	
	@EJB
	private TerritoryService territoryService;
	
	@EJB
	private LanguageService languageService;
	
	@EJB
	private RestrictionService restrictionService;
	
	@EJB
	private CodesService codeService;

	
	private Date greatest(Date d1, Date d2) {
		if (d1==d2) return null;
		if (d1==null && d2!=null) return d2;
		if (d2==null && d1!=null) return d1;
		if (d1.getTime()>d2.getTime()) return d1;
		return d2;
	}
	
	/**
	 * Gets all the contractual parties
	 * @return
	 */
	@GET
  	@Produces(MediaType.APPLICATION_JSON)
	@Path("/classMapping")
	public Response getClassMapping() {
		CacheControl cacheControl = new CacheControl();
		cacheControl.setMaxAge(0);
		HashMap<String, Date> lastModifiedMap = new HashMap<String, Date>();
		
		
		Date now = new Date();
		Date contractualPartyTimestamp = now; 
		Date contractualPartyTypeTimestamp = now;		
		Date territoriesLastModified = now;
		Date languageLastModified = now;
		Date mediaLastModified = now;
		Date restrictionTimestamp = now;
		Date legalConfirmationStatusTimestamp = now; 
		Date contactTypesTimestamp = now;
		Date accessTypeTimestamp = now;
		Date datesTimestamp = now;
		
		
		contractualPartyTimestamp = contractualPartyService.getLastChangeContractualPartiesTimestamp();
		contractualPartyTypeTimestamp = contractualPartyService.getLastChangeContractualPartyTypesTimestamp();		
		territoriesLastModified = territoryService.getLastChangeInTreeTimestamp();
		languageLastModified = languageService.getLastChangeInTreeTimestamp();
		mediaLastModified = mediaService.getLastChangeInTreeTimestamp();
		restrictionTimestamp = restrictionService.getLastModifiedTimestamp();
		legalConfirmationStatusTimestamp = codeService.getLastChangeLegalConfirmationStatusTimestamp();
		contactTypesTimestamp = contractualPartyService.getLastChangeContactTypesTimestamp();
		accessTypeTimestamp = contractualPartyService.getLastChangeAccessTypesTimestamp();
		datesTimestamp = codeService.getLastModifiedDates();
		
		
		if (Cache.shouldRefresh()) {
			Date d = Cache.getDate();
			contractualPartyTimestamp = greatest(d,contractualPartyTimestamp);
			contractualPartyTypeTimestamp = greatest(d,contractualPartyTypeTimestamp);
			territoriesLastModified = greatest(d,territoriesLastModified);
			languageLastModified = greatest(d, languageLastModified);
			mediaLastModified = greatest(d,mediaLastModified);
			restrictionTimestamp = greatest(d,restrictionTimestamp);
			legalConfirmationStatusTimestamp = greatest(d, legalConfirmationStatusTimestamp);
			contactTypesTimestamp = greatest(d,contactTypesTimestamp);
			accessTypeTimestamp = greatest(d,accessTypeTimestamp);
			datesTimestamp = greatest(d,datesTimestamp);
		}
		
		lastModifiedMap.put("parties", contractualPartyTimestamp); 
		lastModifiedMap.put("foxEntities", contractualPartyTimestamp);

		lastModifiedMap.put("contractualPartyTypes", contractualPartyTypeTimestamp);
		lastModifiedMap.put("partyTypes", new Date());		

		lastModifiedMap.put("mediaNodes", mediaLastModified);
		lastModifiedMap.put("allMedia", mediaLastModified);

		lastModifiedMap.put("territoryNodes", territoriesLastModified);
		lastModifiedMap.put("allTerritories",territoriesLastModified);

		lastModifiedMap.put("languageNodes", languageLastModified);
		lastModifiedMap.put("allLanguages",languageLastModified);

		lastModifiedMap.put("restrictions", restrictionTimestamp);
		//product types don't have time stamp so we always pass current time stamp
		lastModifiedMap.put("productTypes", new Date());

		lastModifiedMap.put("legalConfirmationStatusMap", legalConfirmationStatusTimestamp);
		lastModifiedMap.put("enumsEntities", new Date());

		lastModifiedMap.put("contactTypes", contactTypesTimestamp);

		lastModifiedMap.put("accessTypes", accessTypeTimestamp);
		lastModifiedMap.put("organizationTypes", new Date());
		lastModifiedMap.put("countriesMap", new Date());

		lastModifiedMap.put("dateCodesAndStatus", datesTimestamp);
		return Response.ok(lastModifiedMap,MediaType.APPLICATION_JSON).cacheControl(cacheControl).build();
	}
	
}
