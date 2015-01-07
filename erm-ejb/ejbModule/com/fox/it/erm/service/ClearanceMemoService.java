package com.fox.it.erm.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.List;

import javax.ejb.Local;




















import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ClearanceMemoToc;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.EntityComment;

@Local
public interface ClearanceMemoService {
	
	public void create(ClearanceMemo clearanceMemo, String userId) throws ErmException;
	
	public void deleteClearanceMemo(Long foxVersionId,String userId);
	
	/**
	 * Gets the clearance memo in memory. 
	 * Note: This method is used only to build the TOC.  Text is loaded on an individual basis.
	 * @param foxVersionId
	 * @return The clearance memo from the database
	 */
	public ClearanceMemo getClearanceMemo(Long foxVersionId,boolean includeText,boolean includeMappings);
	
	public boolean hasClearanceMemo(Long foxVersionId);
	
	public EntityComment getRoot(Long foxVersionId);	

	
	public void delete(Long foxVersionId, Long commentId, String userId, boolean isBusiness);	
	
	/**
	 * Deletes a node from the clearance memo and reorders the TOC
	 * Note the parent id is needed because the child comment id can be linked to multiple parents
	 * @param foxVersionId
	 * @param childId
	 * @param userId
	 * @throws ErmException
	 */
	public void delete(Long foxVersionId,Long parentId,Long childId, String userId,boolean isBusiness) throws ErmException;
	
	/**
	 * Creates a new empty comment. Positions the comment in the TOC according to the position
	 * @param foxVersionId
	 * @param parentId
	 * @param position
	 * @return
	 * @throws ErmException
	 */
	public ClearanceMemoToc create(Long foxVersionId, Long parentId, Long position,String userId,boolean isBusiness) throws ErmException;
	
	/**
	 * Moves a node to a new position in the clearance memo.
	 * Updates the TOC accordingly
	 * Note the parent id is needed because the child comment id can be linked to multiple parents
	 * @param foxVersonId
	 * @param oldParentId
	 * @param newParentId
	 * @param oldPosition
	 * @param newPosition
	 */
	public void move(Long foxVersionId,Long oldParentId,Long commentId, Long newParentId,  Long newPosition,String userId,boolean isBusiness) throws ErmException;
	
	/**
	 * Links the comment ids. The first comment id will be the one that will keep the comment.
	 * All others will have the comment replaced.
	 * @param ids
	 */
	public void link(Long foxVersionId,List<Long> ids,String userId,boolean isBusiness) throws ErmException;
	
	/**
	 * Returns the Clearance Memo Text for a Clearance Memo Node
	 * @param commentId
	 */	
	public String getClearanceMemoText(Long commentId) throws ErmException;
	
	/**
	 * Returns the Comment for a Clearance Memo Node
	 * @param commentId
	 */	
	public Comment getClearanceMemoComment(Long commentId)  throws ErmException;
	
	/**
	 * Returns a list of Comment versions for Clearance Memo Node
	 * @param commentId
	 */	
	public List<Comment> getClearanceMemoCommentVersions(Long commentId)  throws ErmException;
	
	/**
	 * Acknowledges a Comment's Changes
	 * @param commentId
	 */	
	public void acknowledgeCommentChange(Long commentId, boolean isBusiness, String userid)  throws ErmException;
	
	/**
	 * Sets the Clearance Memo Text for a Clearance Memo Node
	 * @param commentId
	 * @param text
	 * @param userId
	 * @param isBusiness
	 */	
	public void setText(Long foxVersionId,Long commentId,String text, int commentStatus, int publicIndicator, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Save the text and creates a new version of the comment if the version flag is set to true
	 * @param commentId
	 * @param text
	 * @param version
	 * @param userId
	 * @param isBusiness
	 * @throws ErmException
	 */
	public void setText(Long foxVersionId,Long commentId, String text, int commentStatus, int publicIndicator, boolean version, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Versions the comment (ie creates a new comment with the same data and saves it as a previous comment)
	 * @param commentId
	 * @param userId
	 * @param isBusiness
	 * @throws ErmException
	 * @returns The id of the new comment
	 */
	public Long versionComment(Long commentId, String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Sets the Clearance Memo Title for a Clearance Memo Node
	 * @param commentId
	 * @param text
	 * @param userId
	 * @param isBusiness
	 */	
	public void setTitle(Long foxVersionId,Long commentId, String title,String userId, boolean isBusiness) throws ErmException;
	
	/**
	 * Gets a new clearance memo from the template.
	 * Creates all the comments from the template and the TOC.
	 * If the fox version already has a clearance memo then an exception will be thrown
	 * @param foxVersionId
	 * @return
	 * @throws ErmException
	 */
	public ClearanceMemo getNewClearanceMemoFromTemplate(Long foxVersionId,String userId,boolean isBusiness) throws ErmException;

	public String getUploadFileLocation();
	
	public String getDownloadFileLocation();
	
	/**
	 * Attaches the file document (PDF) to the clearance memo entity 
	 * @param foxVersionId
	 * @param fileName
	 * @param userId
	 * @return
	 */
//	public Long attachCMBaseline(Long foxVersionId,boolean cm,String fileName,String userId);
	
	public String getClearanceReportHTML(Long foxVersionId, boolean isClearanceMemo, boolean includeTOC, boolean printOnLoad, boolean isPDF, DocumentsUrlProvider documentsUrlProvider,String userId,boolean isFoxipediaSearch);
	
	public String generatePDF(InputStream cssStream, Long foxVersionId, DocumentsUrlProvider documentsUrlProvider,String userId,boolean isFoxipediaSearch) throws IOException, ErmException;
	
	public void generatePDFOutputStream(InputStream cssStream, OutputStream os, Long foxVersionId, boolean isClearanceMemo, DocumentsUrlProvider documentsUrlProvider,String userId, boolean isFoxipediaSearch) throws IOException;

	/**
	 * Maps a list of right strands to a comments
	 * @param strandIds
	 * @param commentIds
	 * @param userId
	 * @param isBusiness
	 */
	public List<EntityComment> mapStrands(List<Long> strandIds,List<Long> commentIds,String userId,boolean isBusiness) throws ErmException;
	
	public List<EntityComment> mapStrandRestrictions(List<Long> strandRestrictionIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException;
	
	public List<EntityComment> mapProductInfoCodes(List<Long> productInfoCodeIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException;
	
	public void unMapStrands(List<Long> strandIds,List<Long> commentIds,String userId,boolean isBusiness) throws ErmException;
	
	public void unMapStrandRestrictions(List<Long> strandRestrictionIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException;
	
	public void unMapProductInfoCodes(List<Long> productInfoCodeIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException;
	
	public void setReviewIndicator(List<ClearanceMemoToc> toc);
	
	public void setReviewIndicator(ClearanceMemoToc toc);
	
	public void copyToExistingClearanceMemo(Long toFoxVersionId,ClearanceMemo clearanceMemo,String userId) throws ErmException;	
	
	public void copyCommentContentFromClearanceMemo(ClearanceMemo clearanceMemo,String userId);
	
	public void copyIntoClearanceMemo(Long foxVersionId, EntityComment entityComment, String userId) throws ErmException;
	
	public boolean isCommentInCM(Long rootCommentId, Long commentId);

	public void deleteGrantCommentFromCM(Long foxVersionId, Long commentId, String userId);
	
	public void linkGrantCommentToCM(Long foxVersionId, Long commentId,String userId);
	
	public void linkCommentToCM(Long rootCommentId,Long commentId,String userId);

	public void updateTOCIgoreTitle(Long clearanceMemoTOCId, Boolean ignoreTitle);
	
	public List<Comment> getCommentsWithText(List<Long> ids);
}
