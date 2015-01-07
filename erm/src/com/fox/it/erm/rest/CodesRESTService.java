package com.fox.it.erm.rest;

import java.util.HashMap;
import java.util.List;

import javax.ejb.EJB;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.BusinessConfirmationStatus;
import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;
import com.fox.it.erm.LegalConfirmationStatus;
import com.fox.it.erm.ProductMethodOfTransmission;
import com.fox.it.erm.RefDate;
import com.fox.it.erm.comments.CommentStatus;
import com.fox.it.erm.service.CodesService;
import com.fox.it.erm.service.impl.JacksonJsonService;

@Path("/Codes")
public class CodesRESTService extends RESTService {

	@EJB
	private CodesService codesService;
	
	/**
	 * Gets all the legal confirmation status
	 * @return
	 */
	@GET
	@Path("legalConfirmationStatus")
	public List<LegalConfirmationStatus> getLegalConfirmationStatus() {
		List<LegalConfirmationStatus> status = codesService.findAllLegalConfirmationStatus(); 
		return status;
	}
	
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("legalConfirmationStatusMap")
	public Response findProductTypes() {	 
		CacheControl cacheControl = getCache();
		List<LegalConfirmationStatus> legalConfirmationStatusList = codesService.findAllLegalConfirmationStatus();
		HashMap<Long, String> legalConfirmationStatusTextMap = new HashMap<Long, String>();
		HashMap<Long, String> legalConfirmationStatusDescMap = new HashMap<Long, String>();
		for (LegalConfirmationStatus legalConfirmationStatus : legalConfirmationStatusList) {
			legalConfirmationStatusTextMap.put(legalConfirmationStatus.getConfirmationStatusId(), legalConfirmationStatus.getConfirmationClearanceMemoStatusText());		
			legalConfirmationStatusDescMap.put(legalConfirmationStatus.getConfirmationStatusId(), legalConfirmationStatus.getConfirmationStatusDescription());
		}
		String text = "erm.dbvalues.legalConfirmationStatusList="+ new JacksonJsonService().toJson(legalConfirmationStatusList) + ";\n" +
		"erm.dbvalues.legalConfirmationStatusMap="+ new JacksonJsonService().toJson(legalConfirmationStatusTextMap) + ";" +
		"erm.dbvalues.legalConfirmationDescMap="+ new JacksonJsonService().toJson(legalConfirmationStatusDescMap) + ";" +				
		"erm.dynamicJSLoadedCounter++;";
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();							
	}
	
	/**
	 * Gets all the rights consumption status
	 * @return
	 */
	@GET
	@Path("BusinessConfirmationStatus")
	public List<BusinessConfirmationStatus> getBusinessConfirmationStatus() {
		List<BusinessConfirmationStatus> status = codesService.findAllBusinessConfirmationStatus(); 
		return status;
	}
	
	/**
	 * Gets all the rights consumption status
	 * @return
	 */
	@GET
	@Path("CommentStatus")
	public List<CommentStatus> getCommentStatus() {
		List<CommentStatus> status = codesService.findAllCommentStatus(); 
		return status;
	}

	/**
	 * Returns all the dateCodes
	 * @return
	 */
	@GET
	@Path("dateCodes")
	public List<DateCode> getDateCodes() {
		return codesService.findAllDateCodes();
	}
	
	@GET
	@Path("dateStatus")
	public List<DateStatus> getDateStatus() {
		return codesService.findAllDateStatus();
	}
	
	
	@GET
	@Path("/js/dateCodesAndStatus")
	public Response getCacheableDateCodes() {
		CacheControl cacheControl = getCache();
//		List<DateCode> dateCodes = codesService.findAllDateCodes();
		List<RefDate> dateCodes = codesService.findAllRefDateCodes();
		String variable = "dateCodes";
		String dateCodesJs = getJsFromObject(variable, dateCodes,false);
		
		variable = "dateStatus";
		List<DateStatus> dateStatus=codesService.findAllDateStatus();
		String dateStatusJs = getJsFromObject(variable,dateStatus,true);
		
		String text = dateCodesJs + dateStatusJs;
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(cacheControl).build();				
	}
	

	@GET
	@Path("prodMot")
	public List<ProductMethodOfTransmission> getProductMethodOfTransmission(){
		return codesService.findAllProductMethodOfTransmission();
	}
}
