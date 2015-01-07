package com.fox.it.erm.service.comments;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ejb.Local;

import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.util.BusinessLegal;



/**
 * Retrieves and saves the comments for an entity
 * @author AndreasM
 *
 */
@Local
public interface CommentsService {
	
	public static final Integer COMMENT_SUBJECT_DEFAULT_LENGTH = 30;
	
	/**
	 * Finds all the comments for a product version and a product grant.
	 * @param foxVersionId
	 * @return
	 */
	 List<EntityComment> findEntityCommentsForProductVersion(Long foxVersionId);
	 
	 EntityComment findEntityCommentById(Long id);
	 
	 List<EntityComment> findEntityCommentsForRightStrands(String[] productInfoCodeIdsArray, String[] rightStrandIdsArray, String[] rightStrandRestrictionIdsArray,boolean isBusiness, boolean canViewPrivateComments);
	 
	 List<EntityComment> findEntityComments(Long entityTypeId, Long entityKey,Long entityCommentTypeId);
	 
	 List<EntityComment> findEntityCommentsForProductVersionByCommentCategory(Long foxVersionId,Long entityCommentCatergoryId);	 	 
	 
	 List<EntityComment> findEntityComments(Long entityTypeId,List<Long> ids,  Long entityCommentTypeId);
	 
	 List<EntityComment> findEntityCommentsToCopy(Long foxVersionId,boolean isBusiness);	 
	 
	 public void generatePDFOutputStream(InputStream cssStream, OutputStream os, Long foxVersionId, Long grantCodeId, String qualifiedURLPrefix, String fullyQualifiedURL) throws IOException;
		 	 
	 String getCommentsHTML(Long foxVersionId, Long grantCodeId, boolean printOnLoad, boolean isPDF, String qualifiedURLPrefix, String fullyQualifiedURL);
	 
	 List<Comment> findCommentsWithText(List<Long> ids);
		 	 
	 List<Comment> findComments(List<Long> ids);
	 
	 Comment findCommentById(Long id);
	 
	 Comment findCommentWithText(Long id);
	 
	 EntityComment findBlankEntityCommentByCommentId(Long commentId);	 
	 
	 List<EntityComment> findEntityCommentsForProductVersion(Long foxVersionId,Long entityCommentTypeId);
	 
	 List<EntityComment> findEntityCommentsForCommentIds(Long entityTypeId, List<Long> commentIds, Long entityCommentTypeId);
	 
	 List<EntityComment> findEntityCommentsByIdsAndCommentType(List<Long> entityTypeIds, List<Long> commentIds, Long entityCommentTypeId);
	 
	 List<EntityComment> getCommentMapComments(List<Long> entityTypeIds, List<Long> commentIds, Long entityCommentTypeId);
	 
	 void getCommentMapComments(HashMap<Long, List<Long>> entityCommentMap, Long entityTypeId, List<EntityComment> comments);
	 
	 HashMap<Long, List<Long>> getCommentMapForEntityIds(Long entityTypeId, List<Long> commentIds, Long entityCommentTypeId);
	 
	 HashMap<Long,BusinessLegal> getReviewedByBusiessLegalMapForCommentIds(List<Long> commentIds);	 
	 
	 HashMap<Long, Boolean> getReviewedByLegalMapForCommentIds(List<Long> commentIds);

	 HashMap<Long, Boolean> getReviewedByBusinessMapForCommentIds(List<Long> commentIds);
	 
	 Comment saveComment(Comment comment,String userId, boolean isBusiness);
	 
	 void linkCommentToEntities(Long commentId, Long entityTypeId,Long entityCommentTypeId,List<Long> ids,String userId);	 
	 
	 void linkCommentToEntities(Comment comment,Long entityTypeId,Long entityCommentTypeId,List<Long> ids,String userId); 
	 
	 Long getMaxEntityCommentSeq(Long entityTypeId, Long entityKey,Long entityCommentTypeId);
	 
	 EntityComment addCommentToRightStrand(Long rightStrandId,Long commentTypeId,Comment comment, String userId, boolean isBusiness) throws ErmException;
	 
	 EntityComment addCommentToRightStrand(Long rightStrandId,Comment comment, String userId, boolean isBusiness) throws ErmException;	 
	 
	 EntityComment addCommentToProductInfoCode(Long productRestrictionId,Long commentTypeId,Comment comment, String userId, boolean isBusiness) throws ErmException;
	 
	 EntityComment addCommentToProductInfoCode(Long productRestrictionId,Comment comment, String userId, boolean isBusiness) throws ErmException; 
	 
	 EntityComment addCommentToProductVersion(Long foxVersionId, Long entityCommentTypeId,Comment comment,String userId,boolean isBusiness);
	 
	 EntityComment addNewComment(Long entityTypeId,Long entityKey,Long entityCommentTypeId,Comment comment,String userId,boolean isBusiness) throws ErmException;
	
	 EntityComment saveEntityComment(EntityComment entityComment);
	 
	 public Long addNewStrandComment(String[] productInfoCodeIdsArray, String[] rightStrandIdsArray, String[] rightStrandRestrictionIdsArray, Comment comment,String userId, boolean isBusiness) throws ErmException; 
	 	 
	 String getText(Long commentId);
	 
	 void setTitle(Long commentId, String title,String userId,boolean isBusiness) throws ErmException;
	 
	 void setText(Long commentId,String text, int commentStatus, int publicIndicator, String userId, boolean isBusiness) throws ErmException;
	 
	 public Long copy(Long commentId,String userId, boolean isBusiness) throws ErmException;
		
	 public Long addComment(String comment, String userId, Long entityTypeId, Long entityKey, Long commentTypeId, boolean isBusiness) throws ErmException;		 
	 
	 public Long addStrandComment(String comment, String userId, String[] productInfoCodeIdsArray, String[] rightStrandIdsArray, String[] rightStrandRestrictionIdsArray, boolean isBusiness) throws ErmException;
	 
	 public List<EntityComment> map(Long entityType,List<Long> ids,List<Long> commentIds, Long entityCommentTypeId,String userId, boolean isBusiness);
	 	 
	 public void unMapAll(Long foxVersionId);
	 
	 public void unMap(Long entityType,List<Long> ids,List<Long> commentIds, Long entityCommentTypeId, String userId, boolean isBusiness);
	 
	 /**
	  * Clones the entity comment with its comment and assigns it to a new entity described by the entity key.
	  * This functionality will be used for copy.
	  * @param entityComments
	  * @return
	  */
	 public List<EntityComment> cloneWithComments(Long entityTypeId, List<Long> entityKeys,List<EntityComment> entityComments,String userId, boolean isBusiness);	 

	 public void copyComment(Long fromCommentId,Long toCommentId,String userId);
	 
	 public void deleteEntityComments(List<EntityComment> comments,String userId);	 
	 
	 public void deleteHeaderComments(Long foxVersionId,String userId, boolean isBusiness);
	 
	 public List<EntityAttachment> getAttachmentsComments(Long commentid);
	 
	 public Map<Long,List<EntityAttachment>> getAttachmentsComments(List<Long> ids);	 
	 
	 public List<EntityComment> findEntityComments(Long entityTypeId, Long entityKey,Long entityCommentTypeId,boolean loadComments);
	 
	 public CommentCount getCommentCount(Long foxVersionId,boolean isBusiness, boolean canViewPrivate);
	 
	 public Long getStrandCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivate);
	 
	 public Long getStrandRestrictionsCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivate);
	 
	 public Long getProductRestrictionsCommentCount(Long foxVersionId, boolean isBusiness, boolean canViewPrivate);
	 
	 public Long getProductRestrictionsCommentCountForStrand(Long strandId, boolean isBusiness, boolean canViewPrivate);
	 public Long getStrandCommentCountByStrandId(Long strandId, boolean isBusiness, boolean canViewPrivate);
	 public Long getStrandRestrictionCommentCountByStrandRestrictionId(Long strandRestrictionId, boolean isBusiness, boolean canViewPrivate);
	 public Long getStrandRestrictionCommentCountByStrandId(Long strandId, boolean isBusiness, boolean canViewPrivate);
	 
	 public Long cloneComment(Long commentId,String userId);
	 
}


