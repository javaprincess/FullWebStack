package com.fox.it.erm.rest.comments;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.docx4j.openpackaging.exceptions.Docx4JException;

import com.fox.it.erm.Document;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.Privilege;
import com.fox.it.erm.User;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.rest.RESTService;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.comments.CommentCount;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.grants.GrantsService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.util.FileUploadHandler;
import com.fox.it.erm.util.converters.JsonToArrayConverter;
import com.fox.it.erm.util.converters.JsonToCommentConverter;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/Comments")
public class CommentsRESTService extends RESTService {	
	
	@EJB
	private CommentsService commentService;
	
	@EJB
	private GrantsService ermGrantsService;
	
	@Inject
	private JsonService jsonService = new JacksonJsonService();
		
	@Inject
	private JsonToCommentConverter commentConverter = new JsonToCommentConverter(jsonService);
	
	@Inject
	private JsonToArrayConverter stringArrayConverter = new JsonToArrayConverter(jsonService);
	
	@EJB
	private AttachmentsService attachmentsService;
	
	@EJB
	private ClearanceMemoService clearanceMemoService;		
	
	private static final Logger logger = Logger.getLogger(CommentsRESTService.class.getName());
	
	
	
	/**
	 * Returns the comments associated with a particular version id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{foxVersionId: \\d+}")
	public List<EntityComment> findComments(@PathParam("foxVersionId") Long foxVersionId) {
		List<EntityComment> comments = commentService.findEntityCommentsForProductVersion(foxVersionId);		
		return comments;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/comment/{commentId: \\d+}")
	public EntityComment findCommentById(@PathParam("commentId") Long commentId) {
		return commentService.findBlankEntityCommentByCommentId(commentId);
	}
	
	/**
	 * Returns the comments associated with a particular version id
	 * @return
	 */
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("findCommentsForRightStrands")
	public List<EntityComment> findCommentsForRightStrands(@Context HttpServletRequest req) {
		boolean isBusiness = isBusiness(req);
		boolean canViewPrivateComments = canViewPrivateComments(req);
		String productInfoCodeIds = req.getParameter("productInfoCodeIds");		 
		String rightStrandIds = req.getParameter("rightStrandIds");
		String rightStrandRestrictionIds = req.getParameter("rightStrandRestrictionIds");
		String[] productInfoCodeIdsArray = stringArrayConverter.convert(productInfoCodeIds);
		String[] rightStrandIdsArray = stringArrayConverter.convert(rightStrandIds);
		String[] rightStrandRestrictionIdsArray = stringArrayConverter.convert(rightStrandRestrictionIds);
		List<EntityComment> comments = commentService.findEntityCommentsForRightStrands(productInfoCodeIdsArray, rightStrandIdsArray, rightStrandRestrictionIdsArray,isBusiness,canViewPrivateComments);		
		return comments;
	}
	
	@POST			
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/saveRightStrandComments")
	public Comment saveRightStrandComments(@Context HttpServletRequest req) {
		String json = "";
		String userId = getUserId(req);
		json = req.getParameter("q");
		String productInfoCodeIds = req.getParameter("productInfoCodeIds");		 
		String rightStrandIds = req.getParameter("rightStrandIds");
		String rightStrandRestrictionIds = req.getParameter("rightStrandRestrictionIds");		
		try {			
		  Comment comment = commentConverter.convert(json);
		  logger.log(Level.SEVERE,"productInfoCodeIds : " + stringArrayConverter.convert(productInfoCodeIds));
		  logger.log(Level.SEVERE,"rightStrandIds : " + stringArrayConverter.convert(rightStrandIds));
		  String[] productInfoCodeIdsArray = stringArrayConverter.convert(productInfoCodeIds);
		  String[] rightStrandIdsArray = stringArrayConverter.convert(rightStrandIds);
		  String[] rightStrandRestrictionIdsArray = stringArrayConverter.convert(rightStrandRestrictionIds);		  		  
		  if (comment == null || comment.getId() == null) {
			Long commentId = commentService.addStrandComment(json, userId, productInfoCodeIdsArray, rightStrandIdsArray, rightStrandRestrictionIdsArray, isBusiness(req));
			comment.setId(commentId);
		  } else {	    
			comment = commentService.saveComment(comment, userId, isBusiness(req));	  	
		  }
		  return comment;
		} catch (ErmException e) {
		  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
		  throw getErmException(e);
		}
	}
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/saveContractualComment/{contractInfoId: \\d+}")
	public Long saveContractualComment(@Context HttpServletRequest req,  @PathParam("contractInfoId") Long contractInfoId) {
		String json = "";
		String userId = getUserId(req);
		json = req.getParameter("q");
		Long commentId = null;
		try {			
		  Comment comment = commentConverter.convert(json);
		  logger.log(Level.SEVERE,"contractInfoId : " + contractInfoId);
		  logger.log(Level.SEVERE,"comment.getId() : " + comment.getId());
		  if (comment == null || comment.getId() == null) {
			commentId = commentService.addComment(json, userId, EntityType.CONTRACT_INFO.getId(), contractInfoId, EntityCommentType.CONTRACTUAL_PARTY_COMMENT.getId(), isBusiness(req));
		  } else {								    
			comment = commentService.saveComment(comment, userId, isBusiness(req));
			commentId = comment.getId();
		  }
		  return commentId;
		} catch (ErmException e) {
		  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
		  throw getErmException(e);
		}
	}
			
	/**
	 * Returns the clearance memo comments associated with a particular version id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/findProductComments/{foxVersionId: \\d+}")
	public List<EntityComment> findProductComments(@PathParam("foxVersionId") Long foxVersionId) {
		boolean loadComments = true;
		List<EntityComment> comments = commentService.findEntityComments(EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.PRODUCT_INFO.getId(),loadComments);
		for (EntityComment comment : comments) {
		  comment.setCommentExpanded(true); 	
		}
		return comments;
	}
	
	private boolean canViewPrivateComments(HttpServletRequest request) {
		String FUNCTION_POINT = "PRVCOMMNT";
		String BUSINESS_DATA = "ERM Business Data";
		String LEGAL_DATA = "ERM Legal Data";
		User user = getUser(request);
		if (user==null) return false;
		List<Privilege> privileges = user.getPrivileges();
		for (Privilege privilege: privileges) {
			if (FUNCTION_POINT.equals(privilege.getFunctionPointName())) {
				String p = privilege.getPrivilegeName();
				if (privilege.isRead() && (BUSINESS_DATA.equals(p)||LEGAL_DATA.equals(p))) {
					return true;
				}
			}
		}
		return false;
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/commentCount/{foxVersionId: \\d+}")
	public CommentCount getCommentCount(@Context HttpServletRequest request,@PathParam("foxVersionId") Long foxVersionId) {
		boolean isBusiness = isBusiness(request);
		boolean canViewPrivateComments = canViewPrivateComments(request);
		return commentService.getCommentCount(foxVersionId, isBusiness, canViewPrivateComments);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/commentCount/strand/{strandId: \\d+}")	
	public Long getCommentCountForStrand(@Context HttpServletRequest request,@PathParam("strandId") Long strandId) {
		boolean isBusiness = isBusiness(request);
		boolean canViewPrivateComments = canViewPrivateComments(request);
		return commentService.getStrandCommentCountByStrandId(strandId, isBusiness, canViewPrivateComments);
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/commentCount/strandRestriction/{strandRestrictionId: \\d+}")		
	public Long getCommentConuntForStrandRestriction(@Context HttpServletRequest request,@PathParam("strandRestrictionId") Long strandRestrictionId) {
		boolean isBusiness = isBusiness(request);
		boolean canViewPrivateComments = canViewPrivateComments(request);
		return commentService.getStrandRestrictionCommentCountByStrandRestrictionId(strandRestrictionId, isBusiness, canViewPrivateComments);		
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/commentCount/strand/strandRestriction/{strandId: \\d+}")		
	public Long getCommentConuntForStrandRestrictionsByStrandId(@Context HttpServletRequest request,@PathParam("strandId") Long strandId) {
		boolean isBusiness = isBusiness(request);
		boolean canViewPrivateComments = canViewPrivateComments(request);
		return commentService.getStrandRestrictionCommentCountByStrandId(strandId, isBusiness, canViewPrivateComments);
	}
	
	
	/**
	 * Returns the clearance memo comments associated with a particular version id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/findClearanceMemoComments/{foxVersionId: \\d+}")
	public List<EntityComment> findClearanceMemoComments(@PathParam("foxVersionId") Long foxVersionId) {
		boolean loadComments = true;		
		List<EntityComment> comments = commentService.findEntityComments(EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.CLEARANCE_MEMO_COMMENT.getId(),loadComments);
		return comments;
	}
	
	
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/saveProductComment/{foxVersionId: \\d+}")
	public void saveProductComment(@Context HttpServletRequest req,  @PathParam("foxVersionId") Long foxVersionId) {
		String json = "";
		String userId = getUserId(req);
		boolean isBusiness = isBusiness(req);
		json = req.getParameter("q");
		try {			
		  Comment comment = commentConverter.convert(json);
		  logger.log(Level.SEVERE,"foxVersionId : " + foxVersionId);
		  logger.log(Level.SEVERE,"comment.getId() : " + comment.getId());
		  if (comment == null || comment.getId() == null)
			commentService.addComment(json, userId, EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.PRODUCT_INFO.getId(), isBusiness);			
		  else								    
			commentService.saveComment(comment, userId, isBusiness);
		} catch (ErmException e) {
		  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
		  throw getErmException(e);
		}
	}
	
	
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/saveClearanceMemoComment/{foxVersionId: \\d+}")
	public void saveClearanceMemoComment(@Context HttpServletRequest req,  @PathParam("foxVersionId") Long foxVersionId) {
		String json = "";
		String userId = getUserId(req);
		json = req.getParameter("q");
		try {			
		  Comment comment = commentConverter.convert(json);
		  logger.log(Level.SEVERE,"foxVersionId : " + foxVersionId);
		  logger.log(Level.SEVERE,"comment.getId() : " + comment.getId());
		  if (comment == null || comment.getId() == null)
			commentService.addComment(json, userId, EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.CLEARANCE_MEMO_COMMENT.getId(), isBusiness(req));			
		  else								    
			commentService.saveComment(comment, userId, isBusiness(req));
		} catch (ErmException e) {
		  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
		  throw getErmException(e);
		}
	}
	
	
	/**
	 * Uploads an attachment and associates it with a comment id
	 * @throws ErmException
	 * @throws IOException 
	 * @throws Docx4JException 
	 */
	@POST
	@Path("/attach")
	@Consumes(MediaType.MULTIPART_FORM_DATA)	
	public Response uploadAttachment(@Context HttpServletRequest request, 
			@FormDataParam("foxVersionId") Long foxVersionId,
			@FormDataParam("entityKey") Long entityKey,
			@FormDataParam("q") String json,
			@FormDataParam("entityTypeId") Long entityTypeId,
			@FormDataParam("commentId") Long commentId,
			@FormDataParam("categoryId") Long categoryId,
			@FormDataParam("entityCommentId") Long entityCommentId,			
			@FormDataParam("grantCodeId") Long grantCodeId,
			@FormDataParam("productInfoCodeIds") String productInfoCodeIds,
			@FormDataParam("rightStrandIds") String rightStrandIds,
			@FormDataParam("rightStrandRestrictionIds") String rightStrandRestrictionIds,
			@FormDataParam("fileName") String fileName,			
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) throws ErmException, IOException, Docx4JException {
		logger.log(Level.SEVERE, "inside attach commentId " + commentId);
		logger.log(Level.SEVERE, "inside attach foxVersionId " + foxVersionId);
		logger.log(Level.SEVERE, "inside attach json " + json);
		logger.log(Level.SEVERE, "inside attach entityTypeId " + entityTypeId);
		logger.log(Level.SEVERE, "inside attach categoryId " + categoryId);
		logger.log(Level.SEVERE, "inside attach fileName " + fileName);		
		boolean isBusiness = isBusiness(request);
		String userId = getUserId(request);
		String fileUploadLocation = "";
		if (commentId == 0) {			
			try {
			  if (entityTypeId == EntityType.PRODUCT_GRANT.getId() || entityTypeId == EntityType.PRODUCT_PROMO_MTRL.getId() ) {
			    commentId = ermGrantsService.addComment(json, userId,foxVersionId, categoryId, grantCodeId, isBusiness);
			  } else if (entityTypeId == EntityType.CONTRACT_INFO.getId()) {
				commentId = commentService.addComment(json, userId, EntityType.CONTRACT_INFO.getId(), entityKey, EntityCommentType.CONTRACTUAL_PARTY_COMMENT.getId(), isBusiness);
			  } else if (entityTypeId == EntityType.PRODUCT_VERSION.getId() && categoryId == EntityCommentType.CLEARANCE_MEMO_COMMENT.getId()) {
				commentId = commentService.addComment(json, userId, EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.CLEARANCE_MEMO_COMMENT.getId(), isBusiness);
			  } else if (entityTypeId == EntityType.PRODUCT_VERSION.getId() && categoryId == EntityCommentType.PRODUCT_INFO.getId()) {
				commentId = commentService.addComment(json, userId, EntityType.PRODUCT_VERSION.getId(), foxVersionId, EntityCommentType.PRODUCT_INFO.getId(), isBusiness);				
			  } else if (entityTypeId == EntityType.STRAND.getId()) {
				//String productInfoCodeIds = request.getParameter("productInfoCodeIds");
				logger.log(Level.SEVERE, "inside attach productInfoCodeIds " + productInfoCodeIds);
				//String rightStrandIds = request.getParameter("rightStrandIds");
				logger.log(Level.SEVERE, "inside attach rightStrandIds " + rightStrandIds);
				//String rightStrandRestrictionIds = request.getParameter("rightStrandRestrictionIds");
				logger.log(Level.SEVERE, "inside attach rightStrandRestrictionIds " + rightStrandRestrictionIds);
				String[] productInfoCodeIdsArray = productInfoCodeIds != null ? stringArrayConverter.convert(productInfoCodeIds) : null;
				String[] rightStrandIdsArray = rightStrandIds != null ? stringArrayConverter.convert(rightStrandIds) : null;
				String[] rightStrandRestrictionIdsArray = rightStrandRestrictionIds != null ? stringArrayConverter.convert(rightStrandRestrictionIds) : null;
				commentId = commentService.addStrandComment(json, userId, productInfoCodeIdsArray, rightStrandIdsArray, rightStrandRestrictionIdsArray, isBusiness(request));
			  }
			} catch (ErmException e) {
			  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
			  throw getErmException(e);
			}
		}
		if (commentId != null && commentId > 0) {
			try {				
				logger.log(Level.SEVERE,"fileName " + fileName);
				String path = attachmentsService.getUploadFileLocation();
				FileUploadHandler fileHandler = new FileUploadHandler(path);
				String filePath = fileHandler.save(commentId,fileName,uploadedInputStream);
				Document document = new Document();
				logger.log(Level.SEVERE,"fileName 1: " + fileName);
				if (fileName != null && fileName.indexOf("\\") > -1) {
					String[] fileNameSplit = fileName.split("\\\\");
					fileName = fileNameSplit[fileNameSplit.length-1];
					document.setDocumentName(fileName);
				}
				logger.log(Level.SEVERE,"fileName 2: " + fileName);
			    document.setDocumentName(fileName);
				document.setDocumentTypeId(FileUploadHandler.getDocumentContentTypeFromExtension(FileUploadHandler.getExtension(fileName))); 						
				attachmentsService.addNewDocument(EntityType.COMMENT.getId(), commentId, EntityAttachmentType.COMMENT.getId(), document, filePath, userId, isBusiness);			
				fileUploadLocation = attachmentsService.getUploadFileLocation();
				// check if entityCommentId is passed, if so, update category
//AMV commented this out, this was setting the categor incorrectly and i don't see why is needed
//				if (entityCommentId > 0) {
//				  EntityComment entityComment = commentService.findEntityCommentById(entityCommentId);
//				  entityComment.setEntityCommentTypeId(categoryId);			
//				  commentService.saveEntityComment(entityComment);
//				}
			} catch (Exception e) {			
		      logger.log(Level.SEVERE,"Error uploading attachment ", e);
			} finally {						
			  uploadedInputStream.close();
			  File f = new File(fileUploadLocation);
			  delete(f, fileUploadLocation);
			}
		}
		return Response.ok(commentId).build();
	}
	
	void delete(File f, String fileUploadLocation) throws IOException {
	  if (f.isDirectory()) {
	    for (File c : f.listFiles())
	      delete(c, fileUploadLocation);
	  }
	  logger.log(Level.SEVERE,"Deleting f.getAbsolutePath() : " + f.getAbsolutePath().replaceAll("\\\\", "/") + " file name " + fileUploadLocation);
	  if (f.exists() && !f.getAbsolutePath().replaceAll("\\\\", "/").equalsIgnoreCase(fileUploadLocation)) {	  
	    if (!f.delete())
	      logger.log(Level.SEVERE, "Failed to delete file: "  + f);
	  }
	}
	
	@POST	
	@Path("/copyCommentToCM/{foxVersionId: \\d+}")	
	public void copyCommentToCM(@Context HttpServletRequest req,  @PathParam("foxVersionId") Long foxVersionId) {
		logger.info("Inside copyCommentToCM");
		String json = "";
		String userId = getUserId(req);		
		logger.info("copyCommentToCM : req " + req);
		if ( (req.getParameter("commentId") != null && Long.parseLong(req.getParameter("commentId")) > 0) 
				&& (req.getParameter("entityTypeId") != null && Long.parseLong(req.getParameter("entityTypeId")) > 0)
				&& (req.getParameter("entityCommentTypeId") != null && Long.parseLong(req.getParameter("entityCommentTypeId")) > 0)) {
			try {
			  Long commentId = Long.parseLong(req.getParameter("commentId"));
			  Long entityTypeId = Long.parseLong(req.getParameter("entityTypeId"));
			  Long entityCommentTypeId = Long.parseLong(req.getParameter("entityCommentTypeId"));
			  logger.info("foxVersionId : " + foxVersionId);
			  logger.info("comment id : " + commentId);
			  logger.info("entityTypeId : " + entityTypeId);
			  logger.info("entityCommentTypeId : " + entityCommentTypeId);
			  List<Long> commentIds = new ArrayList<Long>();
			  commentIds.add(commentId);		  
			  List<EntityComment> comments = commentService.findEntityCommentsForCommentIds(entityTypeId, commentIds, entityCommentTypeId);
			  logger.log(Level.SEVERE, "found : " + (comments != null ? comments.size() : "0") + " entity comments");
			  for (EntityComment entityComment : comments) {
				  logger.log(Level.SEVERE, "entityComment.getComment().getId(): " + entityComment.getComment().getId().longValue() + " commentId: " + commentId.longValue());
				  if (entityComment.getComment().getId().longValue() == commentId.longValue()) {
					logger.log(Level.SEVERE, "found comment to copy into clearance memo entity id: " + entityComment.getId());
					clearanceMemoService.copyIntoClearanceMemo(foxVersionId, entityComment, userId);			    
				    break;
				  }
			  }
			} catch (ErmException e) {
			  logger.log(Level.SEVERE,"Error adding comment with json: " + json,e);
			  throw getErmException(e);
			}
		}
	}
	
	
	@POST
	@Path("/deleteAttachment/{documentId: \\d+}")
	public void deleteAttachment(@Context HttpServletRequest request, @PathParam("documentId") Long documentId) throws ErmException {
		String userId = getUserId(request);
		try {									
			attachmentsService.deleteAttachment(documentId);		
		} catch (ErmValidationException e) {
			logger.log(Level.SEVERE,"Validation exception deleting attachment for user " + userId,e);
			throw getValidationException(e.getMessage());
		}		
	}
	
	/**
	 * Get's an attachment
	 * @return
	 */
	@GET  	
	@Path("/getAttachment/{documentId: \\d+}/{filename}")
	public Response getAttachment(@PathParam("documentId") final Long documentId) 
			throws ServletException, IOException {		
		Document doc = attachmentsService.findDocumentById(documentId);		
		if (doc==null) {
			String message = "Attempted to get attachment for documentId " + documentId + " but not found";
			logger.log(Level.SEVERE,message);
			throw getValidationException(message);
			
		}
		String documentOutputType = attachmentsService.getDocumentOuputType(doc.getDocumentTypeId());
		StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(OutputStream os) throws IOException,
			WebApplicationException {
				try {				  					
				  attachmentsService.getDocumentContent(documentId, os);
				} catch (SQLException e) {
				  e.printStackTrace();
				  logger.log(Level.SEVERE,"Error generating baseline pdf: ",e);
				  throw getValidationException(e.getMessage());
				}							
			}
		};			 
		return Response.ok(stream).type(documentOutputType).build();				
	} 	
}
