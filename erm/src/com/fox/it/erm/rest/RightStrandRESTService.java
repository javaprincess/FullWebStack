package com.fox.it.erm.rest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.service.RightStrandSaveService;
import com.fox.it.erm.service.RightStrandService;
import com.fox.it.erm.util.CopyStrandsResponse;
import com.fox.it.erm.util.ExceptionUtil;

@Path("/rightStrand")
public class RightStrandRESTService extends RESTService{
	
	private static final Logger logger = Logger.getLogger(RightStrandRESTService.class.getName());
	
	@EJB
	private RightStrandService rightStrandService;	
	
	@EJB
	private RightStrandSaveService rightStrandSaveService;
	
	private Logger getLogger() {
		return logger;
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public List<Long> saveRightStrands(@Context HttpServletRequest req){
		String json = "";
		String userId = getUserId(req);
		json = req.getParameter("q");
		try {
			return rightStrandSaveService.getRightStrandsFromCreateObject(json,userId, isBusiness(req));
		} catch (ErmException e) {
			logger.log(Level.SEVERE,"Error saving right strands with json: " + json,e);
			throw getErmException(e);
		}
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{foxVersionId: \\d+}")
	public List<ErmProductRightStrand> loadRightStrands(@PathParam("foxVersionId") Long foxVersionId){
//		return rightStrandService.loadRightStrands(foxVersionId);
		return rightStrandService.findAllRightStrands(foxVersionId);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/grid/{foxVersionId: \\d+}")
	public List<ErmRightStrand> findRightStrandsForGrid(@PathParam("foxVersionId") Long foxVersionId,@Context HttpServletRequest request){
		boolean isBusiness = isBusiness(request);		
//		return rightStrandService.loadRightStrands(foxVersionId);
		return rightStrandService.findAllRightStrandsForGrid(foxVersionId,isBusiness);
	}

	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/set/{foxVersionId: \\d+}")
	public List<ErmRightStrandSet> loadRightStrandSet(@PathParam("foxVersionId") Long foxVersionId){
		List<ErmRightStrandSet> list = rightStrandService.findSets(foxVersionId);
		return list;
	}
	
	
	
	@POST	// was DELETE but to had to change to get it to work correctly
	@Path("/deleterightstrand")	
	public void deleteRightStrand(@Context HttpServletRequest request, String q) {		
		String userId = "";
		try {						
			userId = getUserId(request);
			boolean isBusiness = isBusiness(request);
			rightStrandService.deleteRightStrand(userId, isBusiness, q);					
		} catch(ErmValidationException e) {			
			getLogger().log(Level.SEVERE,"Validation exception deleting right strand for user " + userId,e);
			throw getValidationException(e.getMessage());
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception deleting right strand for user " + userId,e);
			throw getValidationException(e.getMessage());
		}
	}	

	/**
	 * Update one or more right strands. This method receives a parameter in a 
	 * json format passes it along to the rightStrandService for processing.
	 * @param request
	 * @return
	 */
	@POST
	@Path("/updaterightstrand")
	public List<Long> updateRightStrand(@Context HttpServletRequest request){
		List<Long> list = new ArrayList<>();
		String jsonData = request.getParameter("q");		
		try {

			String userId = getUserId(request);
			list = rightStrandService.updateRightStrand(jsonData, userId, isBusiness(request));
		} catch (ErmException e) {
			logger.log(Level.SEVERE,"Error updating right strands with json: " + jsonData,e);
			throw getErmException(e);
		}
		
		return list;
	}
	
	@POST	
	@Path("/setbitmap/{foxVersionId}")
	@Deprecated
	public void setbitmap(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId) {		
		String userId = "";
		try {						
			userId = getUserId(request);
			getLogger().log(Level.INFO, "setbitmap: foxVersionId " + foxVersionId);
			rightStrandService.setBitmapUpdater(userId, foxVersionId);		
		} catch(Exception e) {			
			getLogger().log(Level.SEVERE,"Exception updateing bitmap for user " + userId,e);
			throw getValidationException(e.getMessage());
		}
	}
	
	@POST
	@Path("/adoptrightstrand")
	public Map<String, List<? extends Object>> adoptRightStrand(@Context HttpServletRequest request){
		Map<String, List<? extends Object>> map = new HashMap<String, List<? extends Object>>();
		String jsonData = request.getParameter("q");		
		try {

			String userId = getUserId(request);
			map = rightStrandService.adoptRightStrandAndRestrictions(jsonData, userId, isBusiness(request));
		} catch (ErmException e) {
			logger.log(Level.SEVERE,"Error updating right strands with json: " + jsonData,e);
			throw getErmException(e);
		}
		
		return map;
	}
	
	@POST
	@Path("/copyrightstrand")
	public CopyStrandsResponse copyRightStrand(@Context HttpServletRequest request){
		String jsonData = request.getParameter("q");
		try {
			String userId = getUserId(request);
			CopyStrandsResponse response  = rightStrandService.copyRightStrands(jsonData, userId, isBusiness(request));
			return response;			
		}
		catch(ErmException e){
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);			
			throw getErmException(ermException);
		}
		

	}

	private Date toDate(String str) {
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
		try {
		Date date = simpleDateFormat.parse(str);
		return date;
		} catch (ParseException e) {
			getLogger().log(Level.SEVERE,"Error parsing date " + str,e);
			throw new RuntimeException("Error parsing date " + str,e);
		} 
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/sync/{foxVersionId}")
	public List<Long> syncReleaseDate(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId, String releaseDate){		
		String userId = getUserId(request);
		try {
			String frd = releaseDate.replaceAll("\"", "");
			Date date = null;			
			if (frd!=null&&!frd.trim().isEmpty()) {
				date = toDate(frd);				
			}
			List<Long> ids = rightStrandSaveService.syncReleaseDate(foxVersionId, date, userId, this.isBusiness(request));
			return ids;
		}
		catch(ErmException e){
			getLogger().log(Level.SEVERE,"Error synching release dates for foxVersionId",e);
			throw getErmException(e);
		}		
	}
}

