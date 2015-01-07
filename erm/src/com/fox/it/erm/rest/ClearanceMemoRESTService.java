package com.fox.it.erm.rest;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.docx4j.openpackaging.exceptions.Docx4JException;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ClearanceMemoOutput;
import com.fox.it.erm.ClearanceMemoOutputStreamer;
import com.fox.it.erm.ClearanceMemoToc;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.cm.ClearanceMemoWordDocumentParser;
import com.fox.it.erm.cm.ClearanceReportParser;
import com.fox.it.erm.cm.HTMLMarkupProvider;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.security.FunctionPoint;
import com.fox.it.erm.security.Operation;
import com.fox.it.erm.security.Privilege;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.ClearanceMemoCreateProcessor;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.service.impl.JsonToClearanceMemoCreateObject;
import com.fox.it.erm.util.ClearanceMemoEditorCreateObject;
import com.fox.it.erm.util.FileUploadHandler;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/ClearanceMemo")
public class ClearanceMemoRESTService extends RESTService {
	
	private static final Logger logger = Logger.getLogger(ClearanceMemoRESTService.class.getName());

	@EJB
	private ClearanceMemoService clearanceMemoService;
		

	private JsonService jsonService = new JacksonJsonService();
	
	private Logger getLogger() {
		return logger;
	}
	
	private void checkClearanceMemoWrite(HttpServletRequest request) {
		checkSecurityFunctionPoint(request, new PrivFPointOper[] {
				PrivFPointOper.get(Privilege.LEGAL_DATA.getName(), FunctionPoint.CLRNCMEMO.toString(), Operation.CREATE.toString())});
	}
	
	private void checkClearanceMemoDelete(HttpServletRequest request) {
		checkSecurityFunctionPoint(request, new PrivFPointOper[] {
				PrivFPointOper.get(Privilege.LEGAL_DATA.getName(), FunctionPoint.CLRNCMEMO.toString(), Operation.DELETE.toString())});
	}
	
	
	@POST
	@Path("/map")
	public void map(@Context HttpServletRequest request, String q) throws ErmException {
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);			
			List<Long> strandIds = cm.getStrandIds();
			List<Long> commentIds = cm.getCommentIds();
			List<Long> strandRestrictionIds = cm.getStrandRestrictionIds();
			List<Long> productInfoCodes = cm.getProductInfoCodes();			
			if (strandIds.size() > 0)
			  clearanceMemoService.mapStrands(strandIds,commentIds, userId, isBusiness);
			if (strandRestrictionIds.size() > 0)
			  clearanceMemoService.mapStrandRestrictions(strandRestrictionIds, commentIds, userId, isBusiness);
			if (productInfoCodes.size() > 0)
			  clearanceMemoService.mapProductInfoCodes(productInfoCodes, commentIds, userId, isBusiness);
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception mapping strands/restrictions for user " + userId,e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/unMap")
	public void unMap(@Context HttpServletRequest request, String q) throws ErmException {
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);			
			List<Long> strandIds = cm.getStrandIds();
			List<Long> commentIds = cm.getCommentIds();
			List<Long> strandRestrictionIds = cm.getStrandRestrictionIds();
			List<Long> productInfoCodes = cm.getProductInfoCodes();
			if (strandIds.size() > 0)
			  clearanceMemoService.unMapStrands(strandIds,commentIds, userId, isBusiness);
			if (strandRestrictionIds.size() > 0)
			  clearanceMemoService.unMapStrandRestrictions(strandRestrictionIds, commentIds, userId, isBusiness);
			if (productInfoCodes.size() > 0)
			  clearanceMemoService.unMapProductInfoCodes(productInfoCodes, commentIds, userId, isBusiness);
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception mapping strands/restrictions for user " + userId,e);
			throw getValidationException(e.getMessage());
		}	
	}
	
	@POST
	@Path("/create")
	public void createNewClearanceMemo(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			//logger.log(Level.INFO, "setClearanceMemoText  q: " +  q);
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();						
			clearanceMemoService.getNewClearanceMemoFromTemplate(foxVersionId, userId, isBusiness);			
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}
	
	@POST
	@Path("/delete")
	public void deleteClearanceMemo(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoDelete(request);
		String userId = getUserId(request);
		try {			
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();						
			clearanceMemoService.deleteClearanceMemo(foxVersionId,userId);			
		} catch (Exception e) {
			logger.log(Level.SEVERE,"Exception setting text for user " + userId,e);
			//TODO change to some other exception
			throw getValidationException(e.getMessage());
		}		
	}
	
	/**
	 * Returns the clearance memo associated with a particular version id
	 * @return
	 * @throws ErmException 
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{foxVersionId: \\d+}")
	public ClearanceMemo findClearanceMemo(@PathParam("foxVersionId") Long foxVersionId) throws ErmException {
		ClearanceMemo clearanceMemo = clearanceMemoService.getClearanceMemo(foxVersionId, false,true);		
		logger.log(Level.INFO, "ClearanceMemoRESTService findClearanceMemo : " + clearanceMemo);
		return clearanceMemo;
	}
	
	/**
	 * Returns the clearance memo TOC and HTML associated with a particular version id
	 * @return
	 * @throws ErmException 
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/preview/{foxVersionId: \\d+}")
	public ClearanceMemoOutput previewClearanceMemo(@PathParam("foxVersionId") Long foxVersionId) throws ErmException {
		ClearanceMemoOutput cmOutput = null;
		try {
			boolean includeMapping = true;
			ClearanceMemoOutputStreamer cmOS = new ClearanceMemoOutputStreamer(foxVersionId, clearanceMemoService,includeMapping);
			cmOutput = cmOS.getCmOutput();
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE, "Validation exception getting previewClearanceMemo ",e);
			throw getValidationException(e.getMessage());
		}		
		return cmOutput;
	}
	
	/**
	 * Returns the clearance memo associated with a particular version id
	 * @return
	 * @throws ErmException 
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/nodecomment/{commentId: \\d+}")
	public Comment getClearanceMemoComment(@PathParam("commentId") Long commentId) throws ErmException {
		logger.log(Level.INFO, "ClearanceMemoRESTService nodetext commentId : " + commentId);
		Comment clearanceMemoComment = clearanceMemoService.getClearanceMemoComment(commentId);			
		return clearanceMemoComment;
	}
		
	/**
	 * Returns the clearance memo text and all past versions for particular comment id
	 * @return
	 * @throws ErmException 
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/nodecommentVersions/{commentId: \\d+}")
	public List<Comment> getClearanceMemoCommentVersions(@PathParam("commentId") Long commentId) throws ErmException {
		logger.log(Level.INFO, "ClearanceMemoRESTService nodetext commentId : " + commentId);
		List<Comment> clearanceMemoComment = clearanceMemoService.getClearanceMemoCommentVersions(commentId);				
		return clearanceMemoComment;
	}
	
	/**
	 * Acknowledges Comment Change for a particular comment id for either Business or Legal
	 * @return
	 * @throws ErmException 
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/acknowledgeCommentChange")
	public void acknowledgeCommentChange(@Context HttpServletRequest request, String q) throws ErmException {
		logger.log(Level.INFO, "ClearanceMemoRESTService acknowledgeCommentChange q : " + q);
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
		  JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
		  ClearanceMemoEditorCreateObject cm = converter.convert(q);
		  List<Long> commentIds = cm.getCommentIds();
		  for (Long commentId : commentIds)				
		    clearanceMemoService.acknowledgeCommentChange(commentId, isBusiness, userId);			
		} catch (ErmValidationException e) {
		  logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
		  throw getValidationException(e.getMessage());
		}		
	}
	
	@POST
	@Path("/nodecomment")
	public void setClearanceMemoText(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {			
			//logger.log(Level.INFO, "setClearanceMemoText  q: " +  q);
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			List<Long> commentIds = cm.getCommentIds();
			Long foxVersionId = cm.getFoxVersionId();
			List<String> commentTextEntries = cm.getCommentTextEntries();
			List<Boolean> showOnReportOnlyList = cm.getShowOnReportOnlyList();
			List<Boolean> createNewVersionList = cm.getCreateNewVersionList();
			List<Integer> commentStatusList = cm.getCommentStatusList();
			int index = 0;
			for (Long commentId : commentIds) {				
				clearanceMemoService.setText(foxVersionId,commentId, commentTextEntries.get(index), commentStatusList.get(index),
						showOnReportOnlyList.get(index) ? 0 : 1, createNewVersionList.get(index), userId, isBusiness);
				index++;
			}
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}
	
	@POST
	@Path("/nodetitle")
	public void setClearanceMemoTitle(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {						
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();
			List<Long> commentIds = cm.getCommentIds();			
			List<String> commentTitles = cm.getCommentTitles();
			List<Boolean> ignoreTitles = cm.getIgnoreTitles();
			List<Long> clearanceMemoTOCIds = cm.getClearanceMemoTOCIds();			
			int index = 0;
			for (Long commentId : commentIds) {
				logger.log(Level.INFO, "setClearanceMemoText setText commentId: " +  commentId + " text: " + commentTitles.get(index) + " ");
				clearanceMemoService.setTitle(foxVersionId, commentId, commentTitles.get(index), userId, isBusiness);
				clearanceMemoService.updateTOCIgoreTitle(clearanceMemoTOCIds.get(index), ignoreTitles.get(index));
				index++;
			}
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}
	
	@POST
	@Path("/createnode")
	public ClearanceMemoToc createClearanceMemoNode(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		ClearanceMemoToc clearanceMemoToc = null;
		try {						
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm  = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();
			Long parentId = cm.getParentId();
			Long position = cm.getPosition();						
			logger.log(Level.INFO, "setClearanceMemoText foxVersionId: " +  foxVersionId + " parentId: " + parentId + " position: " + position);
			clearanceMemoToc = clearanceMemoService.create(foxVersionId, parentId, position,userId,isBusiness);			
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
		return clearanceMemoToc;
	}	
	
	@POST
	@Path("/deletenode")
	public void deleteClearanceMemoNode(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		try {						
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);
			ClearanceMemoEditorCreateObject cm = converter.convert(q);			
			Long foxVersionId = cm.getFoxVersionId();
			Long childId = cm.getChildId();		
			Long parentId = cm.getParentId();

			logger.log(Level.INFO, "deleteClearanceMemoNode foxVersionId: " +  foxVersionId + " childId: " + childId);
			clearanceMemoService.delete(foxVersionId, parentId,childId, userId, isBusiness);			
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}	

	@POST
	@Path("/movenode")
	public void moveClearanceMemoNode(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);	
		try {						
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);					
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();			
			Long childId = cm.getChildId();
			Long oldParentId = cm.getOldParentId();
			Long parentId = cm.getParentId();			
			Long position = converter.convert(q).getPosition();			
			logger.log(Level.INFO, "moveClearanceMemoNode foxVersionId: " +  foxVersionId + " oldParentId: " + oldParentId + " parentId: " + parentId + " childId: " + childId + " position: " + position);
			clearanceMemoService.move(foxVersionId, oldParentId,childId, parentId, position, userId, isBusiness);			
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}	
	
	@POST
	@Path("/linknodes")
	public void linkClearanceMemoNodes(@Context HttpServletRequest request, String q) throws ErmException {
		checkClearanceMemoWrite(request);		
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);	
		try {						
			JsonToClearanceMemoCreateObject converter = new JsonToClearanceMemoCreateObject(jsonService);					
			ClearanceMemoEditorCreateObject cm = converter.convert(q);
			Long foxVersionId = cm.getFoxVersionId();			
			List<Long> commentIds = cm.getCommentIds();			
			logger.log(Level.INFO, "linkClearanceMemoNodes commentIds: " +  commentIds);
			clearanceMemoService.link(foxVersionId,commentIds, userId, isBusiness);			
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}

	
	private ClearanceMemoWordDocumentParser getParser() {
		return new ClearanceMemoWordDocumentParser(new ClearanceReportParser(new HTMLMarkupProvider()));
	}
	
	/**
	 * Uploads a new Clearance Report word document. And creates the clearance memo doc
	 * @throws ErmException
	 * @throws IOException 
	 * @throws Docx4JException 
	 */
	

	@POST
	@Path("/upload/{foxVersionId: \\d+}")
	@Consumes(MediaType.MULTIPART_FORM_DATA)	
	public void upload(@Context HttpServletRequest request,@PathParam("foxVersionId") Long foxVersionId,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) throws  ErmValidationException, ErmException, IOException, Docx4JException {
		String userId = "";
		try {
			userId = getUserId(request);		
			checkClearanceMemoWrite(request);		
			String fileName = fileDetail.getFileName();
			getLogger().info("Uploading CM file " + fileName + " by " + userId);		
			if (!FileUploadHandler.isDocx(fileName)) {
				String message = "File " + fileName + " is not a docx file. Please upload a docx file";					
				throw new ErmValidationException(message);
			}
			String path = clearanceMemoService.getUploadFileLocation();
			FileUploadHandler fileHandler = new FileUploadHandler(path);
			String filePath = fileHandler.save(foxVersionId,fileName,uploadedInputStream);
			ClearanceMemoWordDocumentParser parser = getParser();
			ClearanceMemo clearanceMemo = parser.parse(filePath);
			ClearanceMemoCreateProcessor createProcessor = new ClearanceMemoCreateProcessor(clearanceMemoService);
			createProcessor.create(foxVersionId, clearanceMemo, userId);
		} catch (ErmValidationException e) {
		  logger.log(Level.SEVERE,"Validation exception setting text for user " + userId,e);
		  throw getValidationException(e.getMessage());		
		} catch (ErmException e) {
		  logger.log(Level.SEVERE,"ErmException setting text for user " + userId,e);
		  throw getValidationException(e.getMessage());		
		} catch (IOException e) {
		  logger.log(Level.SEVERE,"IOException setting text for user " + userId,e);
		  throw getValidationException(e.getMessage());		
	    } catch (Docx4JException e) {
		  logger.log(Level.SEVERE,"Docx4JException setting text for user " + userId,e);
		  throw getValidationException(e.getMessage());		
		}				
	}	
	
}