/** 
 * @author Tracy M. Adewunmi
 * 
 **/
package com.fox.it.erm.rest.grants;



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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.rest.RESTService;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.grants.GrantsProxy;
import com.fox.it.erm.service.grants.GrantsService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.util.converters.JsonToCommentConverter;


@Path("/grants")
public class GrantsRESTService extends RESTService {

		@EJB
		private GrantsService ermGrantsService;
		
		@EJB
		private AttachmentsService attachmentsService;
				
		@Inject
		private JsonService jsonService = new JacksonJsonService();
		
		@Inject
		private JsonToCommentConverter commentConverter = new JsonToCommentConverter(jsonService);
		
		private static final Logger logger = Logger.getLogger(GrantsRESTService.class.getName());
		
		
		/*private Logger getLogger() {
			return logger;
		}
		*/
		
		/**
		 * Main method used to retrieve all grant information
		 * This method is called REGARDLESS of the grant code
		 * there is grant information that stays the same REGARDLESS of the foxVersionId
		 * e.g. grantCode and statusCode
		 * @param foxVersionId
		 * @return
		 */
		@GET
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/{foxVersionId: \\d+}")
		public GrantsProxy findAllProductGrants(@PathParam("foxVersionId") Long foxVersionId,
				@QueryParam("grantCodeId") Long grantCodeId,
				@QueryParam("salesAndmarketing") int salesAndmarketingFlag) {
			
			logger.log(Level.INFO, "finding all grant information for grantCode: " + grantCodeId + " and foxVersionId: " + foxVersionId);
		
			GrantsProxy grants = this.ermGrantsService.findAllProductGrants(foxVersionId,
					grantCodeId,
					salesAndmarketingFlag);
			
			return grants;
		}

		@GET
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/{foxVersionId: \\d+}/{grantCodeId: \\d+}")		
		public ProductGrant findProductGrant(@PathParam("foxVersionId") Long foxVersionId, 
				@PathParam("grantCodeId") Long grantCodeId) {
			GrantsProxy grantsProxy = this.ermGrantsService.findAllCommentsForGrant(foxVersionId, grantCodeId);					
			List<ProductGrant> grants = grantsProxy.getProductGrantList();
			if (grants!=null&&!grants.isEmpty()) {
				ProductGrant grant = grants.get(0);
				List<EntityComment> comments = grantsProxy.getCommentList();
				grant.setEntityComments(comments);
				return grant;
			}
			return null;

		}

		
		@GET
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/comments/{foxVersionId: \\d+}")
		public List<EntityComment> findAllCommentsByGrantCode(@PathParam("foxVersionId") Long foxVersionId, 
				@QueryParam("grantCodeId") Long grantCodeId) {			
			logger.log(Level.INFO, "findAllCommentsByGrandCode grantCodeId : " + grantCodeId);
		
			GrantsProxy grants = this.ermGrantsService.findAllCommentsForGrant(foxVersionId, grantCodeId);
			List<EntityComment> comments = grants.getCommentList();
			return comments;
		}
		
		
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/add/status")
		public void addStatus(@Context HttpServletRequest req){
			String json = req.getParameter("q");
			String userId = getUserId(req);
			
			try {
				ermGrantsService.addGrantStatus(json, userId, isBusiness(req));
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error adding grant status with json: " + json,e);
				throw getErmException(e);
			}
		}			
			
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/save/comment/{foxVersionId: \\d+}")
		public void saveComment(@Context HttpServletRequest req,@PathParam("foxVersionId") Long foxVersionId){
			String json = "";
			String userId = getUserId(req);
			json = req.getParameter("q");
			Comment comment = commentConverter.convert(json);
			Long categoryId = req.getParameter("categoryId") != null && 
					!req.getParameter("categoryId").equalsIgnoreCase("")  ? Long.parseLong(req.getParameter("categoryId")) : 0;
			Long grantCodeId = req.getParameter("grantCodeId") != null && 
					!req.getParameter("grantCodeId").equalsIgnoreCase("") ? Long.parseLong(req.getParameter("grantCodeId")) : 0;
			try {
				if (comment == null || comment.getId() == null) {
				  ermGrantsService.addComment(userId, comment, foxVersionId, categoryId,  grantCodeId, isBusiness(req));
				} else {
				  ermGrantsService.editComment(comment, userId, foxVersionId,isBusiness(req));	
				}				
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error editing comment with json: " + json,e);
				throw getErmException(e);
			}
		}
		
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/remove/comment/{foxVersionId: \\d+}")
		public void removeComment(@Context HttpServletRequest req, @PathParam("foxVersionId") Long foxVersionId, 
				@QueryParam("categoryId") Long categoryId){
			String json = "";
			String userId = getUserId(req);
			json = req.getParameter("q");
			try {
				ermGrantsService.deleteComment(foxVersionId,json, userId, isBusiness(req));
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error deleting comment with json: " + json,e);
				throw getErmException(e);
			}
		}
		
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/remove/multiplecomments/{foxVersionId: \\d+}")
		public void removeMultipleComment(@Context HttpServletRequest req, @PathParam("foxVersionId") Long foxVersionId, 
				@QueryParam("categoryId") Long categoryId){
			String json = "";
			String userId = getUserId(req);
			json = req.getParameter("q");
			try {
				ermGrantsService.deleteMultipleComments(foxVersionId,json, userId, isBusiness(req));
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error deleting comment with json: " + json,e);
				throw getErmException(e);
			}
		}		
		
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/edit/status")
		public void editStatus(@Context HttpServletRequest req){
			String json = "";
			String userId = getUserId(req);
			json = req.getParameter("q");
			try {
				ermGrantsService.editGrantStatus(json, userId, isBusiness(req));
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error editing grant status with json: " + json,e);
				throw getErmException(e);
			}
		}
		
		
		@POST
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/grants/remove/status")
		public void removeStatus(@Context HttpServletRequest req){
			String json = "";
			String userId = getUserId(req);
			json = req.getParameter("q");
			try {
				ermGrantsService.removeGrantStatus(json, userId, isBusiness(req));
			} catch (ErmException e) {
				logger.log(Level.SEVERE,"Error removing grant status with json: " + json,e);
				throw getErmException(e);
			}
			
		
		}
		
		@GET
		@Produces(MediaType.APPLICATION_JSON)
		@Path("/codes")
		public List<GrantCode> findAllGrantCode(){
			try{
				return this.ermGrantsService.findAllGrantCode();
			}
			catch(Exception ex){
				ex.printStackTrace(System.err);
				throw getErmException(new ErmException(ex));
			}
		}
		

}
