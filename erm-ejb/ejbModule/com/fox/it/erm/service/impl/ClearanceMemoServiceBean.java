package com.fox.it.erm.service.impl;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ClearanceMemoNode;
import com.fox.it.erm.ClearanceMemoOutput;
import com.fox.it.erm.ClearanceMemoOutputStreamer;
import com.fox.it.erm.ClearanceMemoToc;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmContractualPartyType;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmParty;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.LegalConfirmationStatus;
import com.fox.it.erm.ProductBase;
import com.fox.it.erm.ProductGrantComment;
import com.fox.it.erm.ProductHeaderOnly;
import com.fox.it.erm.ProductVersionHeader;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.comments.CommentStatus;
import com.fox.it.erm.comments.CommentVersion;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.enums.LegalConfirmationStatusTypes;
import com.fox.it.erm.service.AttachmentUrlProvider;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.CodesService;
import com.fox.it.erm.service.ContractualPartyService;
import com.fox.it.erm.service.DocumentsUrlProvider;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.ProductVersionSaveService;
import com.fox.it.erm.service.PropertiesService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.comments.CustomHTMLCleaner;
import com.fox.it.erm.service.grants.CMGrantProcessor;
import com.fox.it.erm.util.BusinessLegal;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.PDFRender;
import com.fox.it.erm.util.UpdatableProcessor;
import com.fox.it.erm.util.Visitor;

@Stateless
public class ClearanceMemoServiceBean extends ServiceBase implements ClearanceMemoService{
	static final long CLEARANCE_MEMO_ENTITY_COMMENT_TYPE_ID =11L;
	private static final long CLEARANCE_MEMO_TEMPLATE_TYPE_ID =7L;
	private static final long CLEARANCE_MEMO_COMMENT_TYPE_ID =1L;
	private static final String UPLOAD_DIR_PATH_PROPERTY_NAME="upload.path";
	private static final String DOWNLOAD_DIR_PATH_PROPERTY_NAME="download.path";
	private static final String CLEARANCE_MEMO_ROOT_TITLE="Clearance Memo";
	
	public static final String ROOT_COPY_TITLE = "Copied Nodes";
	
	private static final String DELETE_CM_TOC_SQL = "delete  clrnc_memo_toc where clrnc_memo_toc_id in ( " +
		    										"select clrnc_memo_toc_id From clrnc_memo_toc toc " +
		    										"start with prnt_cmnt_id=? " +
		    										"connect by nocycle prior " +
		    										"chld_cmnt_id= prnt_cmnt_id)";
	
	private static final String CMNT_VERSION_SQL = "select * from CMNT_VER where curr_cmnt_id = ? order by cmnt_ver_id desc";
	
	
	private static final String CM_TOC_SQL = "select toc.* From clrnc_memo_toc toc " +
											 "start with prnt_cmnt_id=? " +
											 "connect by nocycle prior " +
											 "chld_cmnt_id= prnt_cmnt_id order by prnt_cmnt_id,chld_seq";
	
	private static final String CM_EXISTS_TOC_SQL = "select 1 From clrnc_memo_toc toc " +
													"where chld_cmnt_id = ? " +
													"start with prnt_cmnt_id=? " +
													"connect by nocycle prior " +
													"chld_cmnt_id= prnt_cmnt_id order by prnt_cmnt_id,chld_seq";
	
	private static final String CM_TOC_ROW_SQL = "select toc.* From clrnc_memo_toc toc " +
													"where chld_cmnt_id = ? " +
													"start with prnt_cmnt_id=? " +
													"connect by nocycle prior " +
													"chld_cmnt_id= prnt_cmnt_id order by prnt_cmnt_id,chld_seq";

	
	private static final String ACKNOWLEDGE_CMNT_BUSINESS = "update CMNT_VER set BSNS_REVIEW_IND = 1, upd_nm = ? where curr_cmnt_id = ?";
	
	private static final String ACKNOWLEDGE_CMNT_LEGAL = "update CMNT_VER set LGL_REVIEW_IND = 1, upd_nm = ? where curr_cmnt_id = ?";
	
	private static final String UPDATE_IGNORE_TITLE_TOC = "update clrnc_memo_toc set IGNR_CMNT_SHRT_DESC_IND = ? where CLRNC_MEMO_TOC_ID=?";	
	
	private static final String SHIFT_UP_SQL = "update clrnc_memo_toc set chld_seq=chld_seq-1 where prnt_cmnt_id=? and chld_seq>?";
	
	private static final String SHIFT_DOWN_SQL = "update clrnc_memo_toc set chld_seq=chld_seq+1 where prnt_cmnt_id=? and chld_seq>=?";	

	private static final String memorandumText = "This memorandum does not include obligations under United States guild agreements " + 
			"which may affect Fox's rights to exploit this property, such as the director's editing rights under the DGA Agreement. Please contact " + 
			"Labor Relations if you have any questions regarding such obligations.";
	
	private Logger logger = Logger.getLogger(ClearanceMemoServiceBean.class.getName());
	
	private boolean isBusiness=false;
	
	@Inject
	private PDFRender pdfRenderService;	
	
	@Inject
	@EJB
	private CommentsService commentsService;
	
	@Inject
	@EJB
	private AttachmentsService attachmentsService;
	
	@Inject
	@EJB
	private ErmProductVersionService ermProductVersionService;
	
	@Inject
	@EJB
	private ProductVersionSaveService productVersionSaveService;
		
	@Inject
	@EJB
	private ProductService productService;
	
	@EJB
	@Inject
	private ContractualPartyService contractualPartyService;
	
	@EJB
	@Inject
	private PropertiesService propertiesService;
	
	
	@Inject
	@EJB
	private CodesService codesService;
	
	@Inject
	private CMGrantProcessor grantProcessor;
	
	private ExtractNumberProcessor exrtactNumberProcessor = new ExtractNumberProcessor();
	
	@Inject
	private EntityManager em;
	
	private Long getEntityCommentTypeId() {
		return CLEARANCE_MEMO_ENTITY_COMMENT_TYPE_ID;
	}
	
	private Long getClearanceMemoCommentTypeId() {
		return CLEARANCE_MEMO_COMMENT_TYPE_ID;
	}
	
	protected Logger getLogger() {
		return logger;
	}
	
	public void updateTOCIgoreTitle(Long clearanceMemoTOCId, Boolean ignoreTitle) {						
		getLogger().info("Updating ignore title in ClearanceMemo TOC for id: " + clearanceMemoTOCId);
		Query query = em.createNativeQuery(UPDATE_IGNORE_TITLE_TOC);
		query.setParameter(1, ignoreTitle);
		query.setParameter(2, clearanceMemoTOCId);
		query.executeUpdate();		
	}
	private ClearanceMemoToc saveToc(Long parentId, Long childId,Long childSequence,String userId,Boolean ignoreTitle) {
		ClearanceMemoToc toc = new ClearanceMemoToc();
		toc.setParentCommentId(parentId);
		toc.setChildCommentId(childId);
		toc.setCreateName(userId);
		toc.setChildSequece(childSequence);
		toc.setIgnoreTitle(ignoreTitle);
		Date now = new Date();
		toc.setCreateDate(now);
		toc.setUpdateDate(now);
		em.persist(toc);
		return toc;		
	}

	
		
	private ClearanceMemoToc saveToc(Long parentId, Long childId,Long childSequence,String userId) {
		Boolean ignoreTitle = null;
		return saveToc(parentId,childId,childSequence,userId,ignoreTitle);
	}
	
	private Comment saveClearanceMemoNodeAsComment(ClearanceMemoNode node,String userId)  {
		Comment comment = new Comment();
		comment.setShortDescription(node.getTitle());
		comment.setLongDescription(node.getText());
		comment.setCommentTypeId(getClearanceMemoCommentTypeId());
		if (!node.isShowPublic()) {
			comment.setPublicInd(0);
		}
		comment = commentsService.saveComment(comment, userId, isBusiness);
		return comment;
	}
	
	public void saveClearanceMemoNode(Long foxVersionId,ClearanceMemoNode node,String userId,Long parentId) throws ErmException{
		Long commentId = null;
		if (node.getId()!=null) {
			//if the node already has a commment id don't generate a new one
			commentId = node.getId();
		} else {
			Comment comment = saveClearanceMemoNodeAsComment(node, userId);
			commentId = comment.getId();
			
		}
		node.setId(commentId);
		saveToc(parentId, commentId,node.getChildSequence(), userId,node.isIgnoreTitle());		
		for (ClearanceMemoNode child: node.getChildren()) {
			saveClearanceMemoNode(foxVersionId, child, userId,commentId);
		}		
	}
	
	/**
	 * Sets the Clearance Memo indicator in Erm Product version
	 * @return
	 */
	private void updateHasClearanceMemoInProductVersion(Long foxVersionId,boolean hasClearanceMemo,String userId) {
		ermProductVersionService.findOrCreateNewProductVersion(foxVersionId, userId);		
		String sql = "update ERM_PROD_VER set CLRNC_MEMO_IND = ? WHERE FOX_VERSION_ID = ?";
		Query q =  em.createNativeQuery(sql);		
		q.setParameter(1, hasClearanceMemo ? 1 : 0);
		q.setParameter(2, foxVersionId);
		q.executeUpdate();
		em.flush();
	}
	
	private Comment getRootComment() {
		Comment comment = new Comment();
		comment.setShortDescription(CLEARANCE_MEMO_ROOT_TITLE);
		comment.setCommentTypeId(getClearanceMemoCommentTypeId());
		return comment; 
	}

	private EntityComment createRootNodeEntityComment(Long foxVersionId, String userId) throws ErmException {
		return commentsService.addCommentToProductVersion(foxVersionId, getEntityCommentTypeId(), getRootComment(), userId, isBusiness);
	}
	
	private Comment createRootNode(Long foxVersionId, String userId) throws ErmException {
		EntityComment entityComment = createRootNodeEntityComment(foxVersionId, userId); 
		return entityComment.getComment();
	}
	
	@Override
	public void create(ClearanceMemo clearanceMemo, String userId) throws ErmValidationException,ErmException{
		Long foxVersionId = clearanceMemo.getFoxVersionId();
		//first validate that there is not a root node already
		EntityComment existingRoot = getRoot(foxVersionId);
		if (existingRoot!=null) {
			updateHasClearanceMemoInProductVersion(foxVersionId, true, "");					
			throw new ErmValidationException("A clearance memo exists for product " + foxVersionId + ". Please refresh this page and delete the clearance memo before creating a new one");
		}
		clearanceMemo.setChildSequence();
		Comment root = createRootNode(foxVersionId, userId);
		clearanceMemo.setRootNodeId(root.getId());
		for (ClearanceMemoNode node: clearanceMemo.getNodes()) {
			saveClearanceMemoNode(foxVersionId,node,userId,root.getId());
		}
		updateHasClearanceMemoInProductVersion(foxVersionId,true,userId);
		productVersionSaveService.updateLegalConfirmationStatus(foxVersionId, userId, LegalConfirmationStatusTypes.DRAFT.getId());
	}
		
	@Override
	public boolean hasClearanceMemo(Long foxVersionId) {	
		return getRootOnly(foxVersionId)!=null;
	}
	
	private EntityComment getRootOnly(Long foxVersionId) {
		EntityCommentOnlySearchCriteria criteria = new EntityCommentOnlySearchCriteria(em);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setCommentTypeId(getEntityCommentTypeId());
		List<EntityCommentOnly> comments = criteria.getResultList();
		if (comments==null||comments.isEmpty()) return null;
		if (comments.size()>1) {
			throw new RuntimeException("Multiple clearance memo root nodes for foxVersionId " + foxVersionId + " . Please contact IT support");
		}
		EntityCommentOnly comment =  comments.get(0);
		EntityComment entityComment = new EntityComment();
		entityComment.copyFrom(comment);
		return entityComment;
	}
	
	@Override
	public EntityComment getRoot(Long foxVersionId) {
		EntityCommentSearchCriteria criteria = new EntityCommentSearchCriteria(em);
		criteria.setFoxVersionId(foxVersionId);
		criteria.setCommentTypeId(getEntityCommentTypeId());
		List<EntityComment> comments = criteria.getResultList();
		if (comments==null||comments.isEmpty()) return null;
		if (comments.size()>1) {
			throw new RuntimeException("Multiple clearance memo root nodes for foxVersionId " + foxVersionId + " . Please contact IT support");
		}
		return comments.get(0);		
	}

	
	private void clearConfirmationStatus(Long foxVersionId,String userId)  {
		productVersionSaveService.updateLegalConfirmationStatus(foxVersionId,userId,null);
	}
 
	
	@Override
	public void deleteClearanceMemo(Long foxVersionId,String userId){
		getLogger().info("Deleting clearance memo for " + foxVersionId);
		EntityComment root = getRoot(foxVersionId);
		if (root!=null) {
			Long commentId = root.getCommentId();
			em.remove(root);
			String sql = DELETE_CM_TOC_SQL;
			Query q =  em.createNativeQuery(sql);
			q.setParameter(1, commentId);
			q.executeUpdate();			
			em.flush();
		}
		updateHasClearanceMemoInProductVersion(foxVersionId, false, "");		
		commentsService.unMapAll(foxVersionId);
		clearConfirmationStatus(foxVersionId,userId);		
	}

	
	
	/**
	 * Builds the clearance memos structure.
	 * Assumes the List is sorted by parent id and child sequence
	 * @param toc
	 */
	private ClearanceMemo buildClearanceMemo(Long foxVersionId, List<ClearanceMemoToc> toc, List<Comment> comments, boolean includeText,boolean includeMappings) {
		List<Long> commentIds = new LinkedList<Long>();
		for (Comment comment : comments) {
		  commentIds.add(comment.getId());
		}
		HashMap<Long,BusinessLegal> reviewedByBusinessLegal = new HashMap<>();
		HashMap<Long, Boolean> reviewedByLegalMap = new HashMap<>();
		HashMap<Long, Boolean> reviewedByBusinessMap = new HashMap<>();
 		HashMap<Long, List<Long>> mappedRightStrandsMap = new HashMap<>(); 		
		HashMap<Long, List<Long>> mappedRightStrandRestrictionsMap = new HashMap<>();
		HashMap<Long, List<Long>> mappedProductInfoCodesMap = new HashMap<>();
		
		if (includeMappings) {
			reviewedByBusinessLegal = commentsService.getReviewedByBusiessLegalMapForCommentIds(commentIds);
			for (Long id: reviewedByBusinessLegal.keySet()) {
				BusinessLegal bl = reviewedByBusinessLegal.get(id);
				reviewedByBusinessMap.put(id,bl.isBusiness());
				reviewedByLegalMap.put(id, bl.isLegal());
			}				
			List<Long> entityTypeIds = new ArrayList<Long>();
			entityTypeIds.add(EntityType.STRAND.getId());
			entityTypeIds.add(EntityType.STRAND_RESTRICTION.getId());
			entityTypeIds.add(EntityType.PROD_RSTRCN.getId());	 			 	
	 		List<EntityComment> entityComments = commentsService.getCommentMapComments(entityTypeIds, commentIds,  EntityCommentType.CLEARANCE_MEMO_MAP.getId());	 		
	 		commentsService.getCommentMapComments(mappedRightStrandsMap, EntityType.STRAND.getId(), entityComments);
	 		commentsService.getCommentMapComments(mappedRightStrandRestrictionsMap, EntityType.STRAND_RESTRICTION.getId(), entityComments);
	 		commentsService.getCommentMapComments(mappedProductInfoCodesMap, EntityType.PROD_RSTRCN.getId(), entityComments);	 		
		}
		Map<Long,List<EntityAttachment>> attachments = commentsService.getAttachmentsComments(commentIds);
		ClearanceMemoBuilder builder = new ClearanceMemoBuilder(toc, comments, attachments,includeText, mappedRightStrandsMap, mappedRightStrandRestrictionsMap, mappedProductInfoCodesMap, reviewedByLegalMap, reviewedByBusinessMap);
		ClearanceMemo clearanceMemo = builder.buildClearanceMemo(commentsService);
		clearanceMemo.setFoxVersionId(foxVersionId);
		return clearanceMemo;		
	}
	

	@SuppressWarnings("unchecked")
	private List<ClearanceMemoToc> getToc(Long rootCommentId) {
		Query q = em.createNativeQuery(CM_TOC_SQL, ClearanceMemoToc.class);
		setNoCacheHints(q);					
		q.setParameter(1, rootCommentId);
		return q.getResultList();
	}
	
	private ClearanceMemo buildClearanceMemoFromRootComment(Long foxVersionId,Long rootCommentId, boolean includeText,boolean includeMappings)  {
		boolean includeReviewIndicator = true;
		List<ClearanceMemoToc> toc = getToc(rootCommentId);
		List<Long> commentIds = IdsAccumulator.getIds(toc, new IdProvider<ClearanceMemoToc>() {
			@Override
			public Long getId(ClearanceMemoToc o) {
				return o.getChildCommentId();
			}
		});
		List<Comment> comments = commentsService.findComments(commentIds);
		//AMV 4/1/2014
		if (includeText) {
			for (Comment comment:comments) {							
				//get the long description to make sure is fetched				
				String longDescription = comment.getLongDescription();			
				comment.setLongDescription(CustomHTMLCleaner.CleanHTML(longDescription));					
			}
		}
		// set review  indicator
		if (includeReviewIndicator) {			
			setReviewIndicator(toc);
		}
//		for (ClearanceMemoToc tocItem : toc) {
//		  setReviewIndicator(tocItem);
//		}
		return buildClearanceMemo(foxVersionId, toc, comments, includeText,includeMappings);		
	}
	
	@Override
	public ClearanceMemo getClearanceMemo(Long foxVersionId,boolean includeText,boolean includeMappings)  {
		EntityComment root = getRootOnly(foxVersionId);
		if (root!=null) {
			ClearanceMemo clearanceMemo = buildClearanceMemoFromRootComment(foxVersionId, root.getCommentId(), includeText,includeMappings);
			clearanceMemo.setEntityComment(root);
			return clearanceMemo;
		}
		return null;
	}
	
	
	private void validateSecurity(String userId,boolean isBusiness) throws ErmValidationException {
		if (isBusiness) {
			throw new ErmValidationException("User " + userId + " is business user. Cannot make Clearance Memo changes");
		}
	}
	
	public void deleteMappingsForNode (Long commentId, String userId) {
		List<Long> commentIds = new ArrayList<Long>();
		commentIds.add(commentId);		
		List<EntityComment> comments = commentsService.findEntityCommentsForCommentIds(EntityType.STRAND.getId(), commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId());		
		commentsService.deleteEntityComments(comments, userId);
		comments = commentsService.findEntityCommentsForCommentIds(EntityType.STRAND_RESTRICTION.getId(), commentIds,  EntityCommentType.CLEARANCE_MEMO_MAP.getId());
		commentsService.deleteEntityComments(comments, userId);
		comments = commentsService.findEntityCommentsForCommentIds(EntityType.PROD_RSTRCN.getId(), commentIds,  EntityCommentType.CLEARANCE_MEMO_MAP.getId());
		commentsService.deleteEntityComments(comments, userId);
	}

	
	private void doDelete(Long foxVersionId,Long commentId, String userId, boolean isBusiness) {
		EntityComment entityComment = getRootOnly(foxVersionId);
		if (entityComment==null) {
			getLogger().log(Level.SEVERE,"Attempted to delete comment " + commentId + " from CM  for product " + foxVersionId + " but prduct doesn't have CM. No action will be performed");
			return;
		}
		//first find the CM row
		getLogger().info("Deleting commentId " + commentId + " from product " + foxVersionId);
		Query q = em.createNativeQuery(CM_TOC_ROW_SQL,ClearanceMemoToc.class);
		Long rootCommentId= entityComment.getCommentId();
		q.setParameter(1, commentId);
		q.setParameter(2, rootCommentId);
		
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<ClearanceMemoToc> tocList= (List<ClearanceMemoToc>) q.getResultList();
		if (tocList==null||tocList.isEmpty()) return;
		for (ClearanceMemoToc toc: tocList) {
			delete(foxVersionId,toc,userId);
		}		
	}
	
	private void updateGrantDeletedComment(Long foxVersionId, Long commentId,String userId)  {
		grantProcessor.updateGrantDelteCommentFromCM(foxVersionId, commentId, userId);
	}
	
	@Override
	public void delete(Long foxVersionId, Long commentId, String userId, boolean isBusiness) {
		doDelete(foxVersionId,commentId,userId,isBusiness);
	}
	
	private void delete(Long foxVersionId,ClearanceMemoToc toc, String userId) {
		if (toc!=null) {
			Long position = toc.getChildSequece();
			Long parentId = toc.getParentCommentId();
			shiftUp(parentId, position);
			em.remove(toc);
			em.flush();
			logger.info("delete mappings for node " + toc.getChildCommentId());
			deleteMappingsForNode(toc.getChildCommentId(), userId);
			updateChangeToClearanceMemo(foxVersionId,userId);
			//process delete grant
			updateGrantDeletedComment(foxVersionId,toc.getChildCommentId(),userId);			
		}
		
	}
	
	@Override
	public void delete(Long foxVersionId,Long parentId,Long childId, String userId,boolean isBusiness) throws ErmException {
		validateSecurity(userId, isBusiness);
		setUserInDBContext(userId, isBusiness);
		ClearanceMemoToc toc =  findByParentChildId(parentId,childId);
		delete(foxVersionId,toc,userId);
	}
	
		
	private void setCreate(ClearanceMemoToc toc,String userId,Date timestamp) {
		toc.setCreateName(userId);
		toc.setUpdateName(userId);
		toc.setCreateDate(timestamp);
		toc.setUpdateDate(timestamp);
	}

	private void setUpdate(ClearanceMemoToc toc,String userId,Date timestamp) {
		toc.setUpdateName(userId);
		toc.setUpdateDate(timestamp);
	}
	
	
	@Override
	public ClearanceMemoToc create(Long foxVersionId, Long parentId, Long position,String userId,boolean isBusiness) throws ErmException {
		validateSecurity(userId, isBusiness);
		setUserInDBContext(userId, isBusiness);
		Comment comment = new Comment();		
		comment.setCommentTypeId(getClearanceMemoCommentTypeId());
		Date now = new Date();				
		UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness,now);
		comment = commentsService.saveComment(comment, userId, isBusiness);
		versionComment(comment.getId(), userId, isBusiness);
		shiftDown(parentId, position);
		Long id = comment.getId();
		ClearanceMemoToc toc = new ClearanceMemoToc();
		toc.setChildCommentId(id);
		toc.setParentCommentId(parentId);
		toc.setChildSequece(position);
		setCreate(toc, userId, now);
		setUpdate(toc, userId, now);
		em.persist(toc);
		em.flush();
		return toc;
	}
	
	private void shiftUp(long parentId, long position) {
		getLogger().info("Shifting up ClearanceMemo TOC for parentId: " + parentId);
		Query query = em.createNativeQuery(SHIFT_UP_SQL);
		query.setParameter(1, parentId);
		query.setParameter(2, position);
		int updated = query.executeUpdate();
		getLogger().info("Shifted up " + updated + " TOC nodes");
	}
	
	
	private void shiftDown(long parentId, long position) {
		getLogger().info("Shifting down ClearanceMemo TOC for parentId: " + parentId);		
		Query query = em.createNativeQuery(SHIFT_DOWN_SQL);
		query.setParameter(1, parentId);
		query.setParameter(2, position);
		int updated = query.executeUpdate();
		getLogger().info("Shifted down " + updated + " TOC nodes");		
	}
	

	
	private ClearanceMemoToc findByParentChildId(Long parentId,Long childId) {
		ClearanceMemoTocSearchCriteria criteria = new ClearanceMemoTocSearchCriteria(em);
		criteria.setChildId(childId);
		criteria.setParentId(parentId);
		return criteria.getSingleResult();		
	}
	
	/**
	 * Gets the maximum sequence numnber of the cildren of parentId then increments by 1
	 * @param parentId
	 * @return
	 */
	private Long getNextSequence(Long parentId) {
		String sql = "select max(chld_seq) from clrnc_memo_toc where prnt_cmnt_Id = ?";
		Query q = em.createNativeQuery(sql);		
		q.setParameter(1, parentId);
		Number max = (Number)q.getSingleResult();
		if (max==null) return 1L;
		return max.longValue() +1;
	}

	@Override
	public void move(Long foxVersionId,Long oldParentId,Long commentId,Long newParentId, Long newPosition,String userId,boolean isBusiness) throws ErmException{
		validateSecurity(userId, isBusiness);
		setUserInDBContext(userId, isBusiness);
		//get the elements from the old parent id 
		//and reorder		                        
		ClearanceMemoToc node = findByParentChildId(oldParentId,commentId);
		if (node!=null) {
			Long oldPosition = node.getChildSequece();
			if (oldParentId.equals(newParentId)) {
				boolean isUp = oldPosition>newPosition;
				if (isUp) {
					shiftDown(newParentId,newPosition);
					em.flush();
					node.setChildSequece(newPosition);
					em.flush();
					shiftUp(newParentId,oldPosition);
					em.flush();
				} else {
					shiftUp(newParentId,oldPosition);
					em.flush();
					shiftDown(newParentId,newPosition);
					em.flush();
					node.setChildSequece(newPosition);
					em.flush();					
					
				}
				
			} else {
				shiftUp(oldParentId, oldPosition);			
				//get the elements from the new parent id
				//and reorder
				shiftDown(newParentId,newPosition);
				node.setParentCommentId(newParentId);
				node.setChildSequece(newPosition);
			}
			updateChangeToClearanceMemo(foxVersionId,userId);			
			em.flush();
		}
	}
	
		
	@Override
	public void link(Long foxVersionId,List<Long> ids,String userId,boolean isBusiness) throws ErmException {
		if (ids==null||ids.size()==0) {
			getLogger().log(Level.SEVERE,"ClearanceMemoServiceBean.link received empty ids list");
			return;
		}
		validateSecurity(userId, isBusiness);
		setUserInDBContext(userId, isBusiness);
		//find the table of contents for all the ids
		//then update all the ids for all of them
		ClearanceMemoTocSearchCriteria criteria = new ClearanceMemoTocSearchCriteria(em);
		List<ClearanceMemoToc> toc = criteria.setChildIds(ids).getResultList();
		Long fromCommentId = ids.get(0);
		for (ClearanceMemoToc t : toc) {
			if (!t.getChildCommentId().equals(fromCommentId)) {
				logger.info("Changing link comment [ " +  t.getParentCommentId() +", " + t.getChildCommentId() + "] to id : " + fromCommentId);
				t.setChildCommentId(fromCommentId);
			}
		}
		updateChangeToClearanceMemo(foxVersionId,userId);		
		em.flush();
	}
	
	@Override
	public Comment getClearanceMemoComment(Long commentId) {
      Comment comment = commentsService.findCommentWithText(commentId);
      if (comment==null) return null;	  
	  String longDescription = comment.getLongDescription() != null ? comment.getLongDescription() : "";
	  comment.setLongDescription(CustomHTMLCleaner.CleanHTML(longDescription));		 
	  return comment;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Comment> getClearanceMemoCommentVersions(Long commentId) {
	  //logger.info("Inside ClearanceMemoServiceBean getClearanceMemoText " + commentId);
	  List<Comment> commentList = new LinkedList<Comment>();
	  try {	  
		  Comment originalComment = (Comment)commentsService.findCommentById(commentId);
		  originalComment.getLongDescription();
		  Comment comment = (Comment) originalComment.clone();	  		  		 
		  comment.setLongDescription(CustomHTMLCleaner.CleanHTML(comment.getLongDescription() != null ? comment.getLongDescription() : ""));
		  commentList.add(comment);	  
		  Query q = em.createNativeQuery(CMNT_VERSION_SQL, CommentVersion.class);
		  setNoCacheHints(q);
		  q.setParameter(1, commentId);
		  List<CommentVersion> commentVersionList = q.getResultList();
		  List<Long> commentIds = IdsAccumulator.getIds(commentVersionList, new IdProvider<CommentVersion>() {
				@Override
				public Long getId(CommentVersion o) {
					return o.getPreviousCommentId();
				}
		  });		  
		  List<Comment> prevCommentList = commentsService.findCommentsWithText(commentIds);
		  Collections.reverse(prevCommentList);
		  for (Comment prevComment : prevCommentList) {			
			Comment clonedPrevComment = (Comment) prevComment.clone();
			clonedPrevComment.setLongDescription(CustomHTMLCleaner.CleanHTML(clonedPrevComment.getLongDescription() != null ? clonedPrevComment.getLongDescription() : ""));
		    commentList.add(clonedPrevComment);
		  }
	  } catch (Exception e) {	  
	  }
	  return commentList;
	}	
	
	public void acknowledgeCommentChange(Long commentId, boolean isBusiness, String userId) {
	  Query q;
	  if (isBusiness)
	    q = em.createNativeQuery(ACKNOWLEDGE_CMNT_BUSINESS);
	  else
		q = em.createNativeQuery(ACKNOWLEDGE_CMNT_LEGAL);	  
	  q.setParameter(1, userId);	  
	  q.setParameter(2, commentId);
	  int updated = q.executeUpdate();	  
	  getLogger().info("Acknowledged status of " + updated + " comments");
	  em.flush();
	}
		
	public String getClearanceMemoText(Long commentId) {
	 String text = commentsService.getText(commentId);
	 if (text==null) text = "";
	 return text;
	}
	
	@Override
	public void setText(Long foxVersionId,Long commentId, String text, int commentStatus, int publicIndicator, String userId, boolean isBusiness) throws ErmException {
	  commentsService.setText(commentId, text, commentStatus, publicIndicator, userId, isBusiness);
	  updateChangeToClearanceMemo(foxVersionId,userId);
	}		
	@Override
	public void setTitle(Long foxVersionId,Long commentId, String title,String userId, boolean isBusiness) throws ErmException {
	  commentsService.setTitle(commentId, title, userId, isBusiness);
	  updateChangeToClearanceMemo(foxVersionId,userId);	  
	}
	
	
	
	private Long getTemplateCommentId() {
		CommentSearchCriteria criteria = new CommentSearchCriteria(em);
		Comment comment = criteria.setCommentTypeId(CLEARANCE_MEMO_TEMPLATE_TYPE_ID).getSingleResult();
		return comment.getId();
	}
	
	/**
	 * Verifies if a new clearance memo can be created. If there's an existing clearance memo comment a ValidationException will be thrown
	 * @throws ErmValidationException
	 */
	private void validateCreateNew(Long foxVersionId) throws ErmValidationException {
		EntityComment root = getRoot(foxVersionId);
		if (root!=null) {
			updateHasClearanceMemoInProductVersion(foxVersionId, true, "");
			throw new ErmValidationException("A clearance memo exists for product " + foxVersionId + ". Please refresh this page and delete the clearance memo before creating a new one");
		}
	}
 
	
	/**
	 * Sets the updated by and timestamp on the clearance memo
	 * The implementation update the EntityComment attached to the clearance memo
	 * @param userId
	 */
	private void updateChangeToClearanceMemo(Long foxVersionId,String userId) {
		EntityComment root = getRoot(foxVersionId);
		Date now = new Date();
		root.setUpdateName(userId);
		root.setUpdateDate(now);		
	}
	
	private void appendGrants(List<ProductGrantComment> comments,ClearanceMemo cm) {
		for (ProductGrantComment comment: comments) {
			ClearanceMemoNode node = new ClearanceMemoNode();
			node.setId(comment.getCommentId());
			cm.getNodes().add(node);
		}

	}
	
	private void appendGrantSectionsForNewCM(Long foxVersionId,ClearanceMemo cm) {
		//get all the comments from the grants that should appear on CM
		List<ProductGrantComment> comments = grantProcessor.findAllCommentsShouldAppearInCM(foxVersionId);
		if (comments==null||comments.isEmpty()) return;
		//now append the comments at the end
		appendGrants(comments, cm);
	}
	
	@Override
	public ClearanceMemo getNewClearanceMemoFromTemplate(Long foxVersionId,String userId,boolean isBusiness) throws ErmException {
		validateSecurity(userId, isBusiness);		
		setUserInDBContext(userId, isBusiness);
		validateCreateNew(foxVersionId);
		Long templateRootCommentId = getTemplateCommentId();
		if (templateRootCommentId!=null) {
			ClearanceMemo clearanceMemo = buildClearanceMemoFromRootComment(foxVersionId, templateRootCommentId, false,false);
			clearanceMemo.clearIds();
			appendGrantSectionsForNewCM(foxVersionId, clearanceMemo);			
			//now that we have the template, save it
			create(clearanceMemo, userId);
			return clearanceMemo;
		}
		productVersionSaveService.updateLegalConfirmationStatus(foxVersionId, userId, LegalConfirmationStatusTypes.DRAFT.getId());
		return null;
	}
	
	@Override
	public String getUploadFileLocation() {
		return propertiesService.getValue(UPLOAD_DIR_PATH_PROPERTY_NAME);
	}
	
	
	@Override
	public void setReviewIndicator(List<ClearanceMemoToc> toc) {
		List<Long> commentIds = IdsAccumulator.getIds(toc, new IdProvider<ClearanceMemoToc>() {

			@Override
			public Long getId(ClearanceMemoToc o) {
				return o.getChildCommentId();
			}
		});
		if (toc==null||toc.isEmpty()) return;
		CommentVersionSearchCriteria criteria = new CommentVersionSearchCriteria(em);
		//comments are sorted in ascending order the last one (latest one) will win
		List<CommentVersion> commentVersions =criteria.setCommentIds(commentIds).getResultList();
		Map<Long,CommentVersion> commentVersionsByCommentId = new HashMap<>();
		for (CommentVersion cv: commentVersions) {
			Long currentCommentId = cv.getCurrentCommentId();
			commentVersionsByCommentId.put(currentCommentId, cv);
		}
		//now iterate through the TOC entries
		for (ClearanceMemoToc t: toc) {
			Long commentId = t.getChildCommentId();
			CommentVersion cv = commentVersionsByCommentId.get(commentId);
			if (cv!=null) {
				  t.setReviewedByLegal(cv.isReviewedByLegal());
				  t.setReviewedByBusiness(cv.isReviewedByBusiness());				
			}
		}				
	}
	
	
	@Override
	@Deprecated
	public void setReviewIndicator(ClearanceMemoToc toc) {		 
		Query q = em.createNativeQuery(CMNT_VERSION_SQL, CommentVersion.class);						
		q.setParameter(1, toc.getChildCommentId());
		@SuppressWarnings("unchecked")
		List<CommentVersion> commentVersionList = q.getResultList();		
		//logger.info("commentVersionList size " + commentVersionList.size() + " for id: " + toc.getChildCommentId());
		for (CommentVersion commentVersion : commentVersionList) {		  
		  toc.setReviewedByLegal(commentVersion.isReviewedByLegal());
		  toc.setReviewedByBusiness(commentVersion.isReviewedByBusiness());
		  break;
		}
	}
	
	@Override
	public Long versionComment(Long commentId, String userId, boolean isBusiness) throws ErmException {
		Long newCommentId =  commentsService.copy(commentId, userId, isBusiness);
		CommentVersion commentVersion = new CommentVersion();
		commentVersion.setCurrentCommentId(commentId);
		commentVersion.setPreviousCommentId(newCommentId);
		Date now = new Date();
		commentVersion.setCreateDate(now);
		commentVersion.setUpdateDate(now);
		commentVersion.setCreateName(userId);
		commentVersion.setUpdateName(userId);
		commentVersion.setReviewedByBusiness(false);
		commentVersion.setReviewedByLegal(false);
		em.persist(commentVersion);		
		return newCommentId;
	}
	
	@Override
	public void setText(Long foxVersionId,Long commentId, String text, int commentStatus, int publicIndicator, boolean version, String userId, boolean isBusiness) throws ErmException {
	  if (version) 
		versionComment(commentId, userId, isBusiness);
	  setText(foxVersionId,commentId, text, commentStatus, publicIndicator, userId, isBusiness);	  
	}
	
	
	@Override
	public String getDownloadFileLocation() {
		return propertiesService.getValue(DOWNLOAD_DIR_PATH_PROPERTY_NAME);
	}

	public String computeTOCLevelClass(String previousPosition) {		
		String[] splitTreePosition = previousPosition.split("\\.");
		if (splitTreePosition.length == 1)
		  return("header");		
		if (splitTreePosition.length == 2)
		  return("subHeader");
		if (splitTreePosition.length == 3)
		  return("paragraph");
		else
		  return("subParagraph");
	}
	public String computeTOCLevel(Long childSequence, Integer level, String previousPosition) {
	  if (level > 1)
		return previousPosition + "." + childSequence;
	  else
		return childSequence.toString();  
	}
	
	@Override
	public boolean isCommentInCM(Long rootCommentId, Long commentId) {
		if (rootCommentId.equals(commentId)) return true;
		Query q = em.createNativeQuery(CM_EXISTS_TOC_SQL);
		q.setParameter(1, commentId);
		q.setParameter(2, rootCommentId);		
		List<?> list = q.getResultList();
		if (list==null||list.isEmpty()) return false;		
		return true;
	}
	
	@Override
	public void deleteGrantCommentFromCM(Long foxVersionId, Long commentId, String userId) {
		delete(foxVersionId,commentId,userId,true);
	}
	
	@Override
	public void linkCommentToCM(Long rootCommentId,Long commentId,String userId) {
		Long parentCommentId = rootCommentId;
		//TODO refine where to place the comment.
		//maybe pass the grant type and if the parent section does not exist. Create it?
		//for now just append it at the end
		Long sequence = getNextSequence(parentCommentId);
		saveToc(parentCommentId, commentId,sequence, userId);		
	}
	
	public void linkGrantCommentToCM(Long foxVersionId, Long commentId,String userId) {	
		EntityComment rootEntityComment = getRootOnly(foxVersionId);
		if (rootEntityComment==null) {
			getLogger().info("Attempted to add comment to CM, but product " + foxVersionId + " does not have CM. No action will be performed");
			return;
		}
		Long rootCommentId = rootEntityComment.getCommentId();
		boolean isCommentInCM = isCommentInCM(rootCommentId, commentId);
		if (isCommentInCM) {
			getLogger().info("Attempted to add comment to CM but comment " + commentId + " is already present for product " + foxVersionId);
			return;
		}
		linkCommentToCM(rootCommentId, commentId, userId);
		
	}
	 
	
	//TODO move this to its own class
	public void setClearanceReportHeader(StringBuilder stringBuilder, ProductBase product, 
			ClearanceMemo clearanceMemo,
			ErmProductVersion ermProductVersion, List<ErmContractInfo> ermContractInfoList, HashMap<Long, String> foxEntitiesMap, 
			HashMap<Long, String> contractualPartiesMap, HashMap<Long, String> contractualPartyTypesMap) {
	  SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yyyy");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">IRD</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");	  
	  stringBuilder.append(product.getProductionYear() != null ? product.getProductionYear() : "");
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Title</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  stringBuilder.append(product.getTitle());
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Made For</span></div>\n");	  
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  //changed to original media description
	  stringBuilder.append(product.getOriginalMediaDesc()==null?"":product.getOriginalMediaDesc());
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Type</span></div>\n");	  
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  //changed from product type code to product type desc
	  stringBuilder.append(product.getProductTypeDesc());
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Fox Produced</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  stringBuilder.append(ermProductVersion != null && ermProductVersion.getFoxProducedInd() != null ? ermProductVersion.getFoxProducedInd() == 1 ? "Yes" : "No" : "");
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Prepared By</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");	  
	  stringBuilder.append(clearanceMemo != null && clearanceMemo.getEntityComment() != null  ? clearanceMemo.getEntityComment().getCreateName() : "");	  	  
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Last Reviewed</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");	  
	  if (clearanceMemo != null && clearanceMemo.getEntityComment() != null)
	    stringBuilder.append(sdf.format(clearanceMemo.getEntityComment().getUpdateDate()));	  
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Fox Entity</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");	  
	  LinkedList<Long> foxEntities = new LinkedList<Long>();
	  for (ErmContractInfo ermContractInfo : ermContractInfoList ) {
	    if (!foxEntities.contains(ermContractInfo.getFoxEntityPartyId()))	       
	      foxEntities.push(ermContractInfo.getFoxEntityPartyId());	         	  
	  }	 
	  int foxEntityCount = 0;
	  for (Long foxEntity : foxEntities) {
		if (foxEntityCount > 0)
		  stringBuilder.append(", ");
		foxEntityCount++;		  
	    stringBuilder.append(foxEntitiesMap.get(foxEntity));
	  }
	  stringBuilder.append("</div>\n");
	  stringBuilder.append("<BR/><BR/>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Contractual Party</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  for (ErmContractInfo ermContractInfo : ermContractInfoList ) {
		  try {
			  if (ermContractInfo.getContractualPartyTypeId() != null) {
				Long contractualPartyId = ermContractInfo.getContractualPartyId();
				if (!contractualPartiesMap.containsKey(contractualPartyId)) {
					getLogger().log(Level.SEVERE,"Contractual party not found in map id: " + contractualPartyId);
				}
				String name = contractualPartiesMap.get(contractualPartyId);				  
			    stringBuilder.append(name);
			    stringBuilder.append(" -- "); 
			    stringBuilder.append(contractualPartyTypesMap.get(ermContractInfo.getContractualPartyTypeId()));
			    stringBuilder.append(" -- "); 
			    stringBuilder.append(ermContractInfo.getContractDate() != null ? sdf.format(ermContractInfo.getContractDate()) : "");
			    stringBuilder.append("<BR/>");
			  }
		  } catch(Exception e) {
			  logger.info("Exception processing date " + ermContractInfo.getContractDate());
		  }
	  }	   
	  stringBuilder.append("</div>\n");		
	  stringBuilder.append("<BR/><BR/>\n");
	  stringBuilder.append("<div class=\"tocHeader\"><span class=\"underline\">Contract Information</span></div>\n");
	  stringBuilder.append("<div class=\"tocSubHeader\">");
	  stringBuilder.append("</div>\n");		
	}
	  
	public void outputPreviewTOC(StringBuilder stringBuilder, ClearanceMemoNode node, String previousPosition, HashMap<Long, String> commentStatusMap, boolean isClearanceMemo) {	  
	  previousPosition = computeTOCLevel(node.getChildSequence(), node.getLevel(), previousPosition);
	  if (isClearanceMemo) {
		if (node.isShowPublic()) {
			StringBuilder nodeTitle = new StringBuilder();	
			String[] splitTreePosition = previousPosition.split("\\.");
			if (splitTreePosition.length > 1)
			  for (int i = 0; i < splitTreePosition.length; i++)    		
			    nodeTitle.append("&nbsp;&nbsp;");
			if (node.getTitle() != null)
			  nodeTitle.append(node.getTitle());
			stringBuilder.append("<li style=\"display: block; clear: both;\" onClick=\"hilightClearanceSection(" + node.getId() + ")\">\n");
			stringBuilder.append(nodeTitle.toString());
		    stringBuilder.append("\n</li>\n");
		}
	  } else {
	    stringBuilder.append("<div class=\"tocPosition\">\n");
	    stringBuilder.append(previousPosition);
	    stringBuilder.append("\n</div>\n");
	    stringBuilder.append("<div class=\"tocTitle\">\n");
	    if (node.getTitle() != null)			  
	      stringBuilder.append(node.getTitle());
	    stringBuilder.append("\n</div>");
	    stringBuilder.append("<div class=\"tocItemStatus\">\n");
	    stringBuilder.append(node.getCommentStatus() != null && node.getCommentStatus() > 0 ? commentStatusMap.get(new Long(node.getCommentStatus())) : "");
	    stringBuilder.append("\n</div>");
	    stringBuilder.append("\n<br/>\n");
	  }
	  if (node.getChildren() != null)
		for (ClearanceMemoNode childnode : node.getChildren())
		  outputPreviewTOC(stringBuilder, childnode, previousPosition, commentStatusMap, isClearanceMemo);
	}
	public void loadPreviewTOC(StringBuilder stringBuilder, ClearanceMemo clearanceMemoTOC, HashMap<Long, String> commentStatusMap, boolean isClearanceMemo) {
      if (clearanceMemoTOC != null) {
        for (ClearanceMemoNode node : clearanceMemoTOC.getNodes())
          outputPreviewTOC(stringBuilder, node, "", commentStatusMap, isClearanceMemo);
      }
	}		
	
 
	private String replaceExtractNumber(String content,boolean isClearanceMemo) {
	  return exrtactNumberProcessor.replaceExtractNumber(content, isClearanceMemo);
	}
	
	private String getAttachementsHTML(ClearanceMemoNode node,AttachmentUrlProvider attachmentUrlProvider) {
	  StringBuilder stringBuilder = new StringBuilder();
	  if (node.getAttachments() != null && node.getAttachments().size() > 0) {		  
		    stringBuilder.append("<div class=\"contentAttachments\">");
		    List<EntityAttachment> attachments = node.getAttachments();
		    for (int i = 0; i < attachments.size(); i++) {
		      EntityAttachment attachment = attachments.get(i);
		      String url = attachmentUrlProvider.get(attachment);
		      stringBuilder.append("<a href=\"" + url + "\" target=\"_blank\">");
			  stringBuilder.append(attachment.getAttachmentName());
		      stringBuilder.append("</a>");
		      stringBuilder.append("<br/>");
		    }
		    stringBuilder.append("\n</div>");	
		  }			  
	  return stringBuilder.toString();	
	}
	
	private boolean shouldShowNode(boolean isClearanceMemo,ClearanceMemoNode node) {
		return !isClearanceMemo || (isClearanceMemo && node.isShowPublic());
	}
	
	private boolean shouldShowTitle(ClearanceMemoNode node) {
		return !node.isIgnoreTitle();
	}
	
	private String getTitleHTML(ClearanceMemoNode node) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("<div class=\"contentTitle\"><span class=\"underline\">");
	    if (node.getTitle() != null && !node.getTitle().equalsIgnoreCase("")) {
		  stringBuilder.append(node.getTitle());
        }
	    stringBuilder.append("</span></div>\n");
	    return stringBuilder.toString();		
	}
	
	private void outputPreviewDataTables(StringBuilder stringBuilder, ClearanceMemoNode node, String previousPosition, HashMap<Long, String>  clearanceMemoData,  AttachmentUrlProvider attachmentUrlProvider) {
		  boolean isClearanceMemo = false;
		  previousPosition = computeTOCLevel(node.getChildSequence(), node.getLevel(), previousPosition);
		  if (shouldShowNode(isClearanceMemo, node)) {
			  stringBuilder.append("<tr class=\"contentRow\">");	 
		  	  stringBuilder.append("<td  class=\"contentPosition\">");
			  stringBuilder.append(previousPosition);
		  	  stringBuilder.append("</td>");			    

		  	  stringBuilder.append("<td class=\"clearanceReportContent\">");
			  if (shouldShowTitle(node)) {
				String titleHTML = getTitleHTML(node);
				stringBuilder.append(titleHTML);
			  }		  	  	 
			  stringBuilder.append("<div class=\"" + computeTOCLevelClass(previousPosition) + "Content" + (node.isIgnoreTitle() ? " contentNoTitle" : "") + "\">\n");
			  String content = clearanceMemoData.get(node.getId()) != null ? clearanceMemoData.get(node.getId()) : "";
			  content = replaceExtractNumber(content, isClearanceMemo);
			  if (!content.isEmpty()) {
				  stringBuilder.append(content);
			  }
			  String attachementsHTML = getAttachementsHTML(node, attachmentUrlProvider);
			  if (!attachementsHTML.isEmpty()) {
				  stringBuilder.append(attachementsHTML);
			  }
			  stringBuilder.append("\n</div>\n");
			  stringBuilder.append("</td>");
			  stringBuilder.append("</tr>");			  		  		  		 
		  }

		  if (node.getChildren() != null)
		    for (ClearanceMemoNode childnode : node.getChildren()) {
			  outputPreviewDataTables(stringBuilder, childnode, previousPosition, clearanceMemoData,  attachmentUrlProvider);
		    }
		
	}
	
	private void outputPreviewData(StringBuilder stringBuilder, ClearanceMemoNode node, String previousPosition, HashMap<Long, String>  clearanceMemoData, boolean isClearanceMemo,  AttachmentUrlProvider attachmentUrlProvider) {
	  previousPosition = computeTOCLevel(node.getChildSequence(), node.getLevel(), previousPosition);
	  if (shouldShowNode(isClearanceMemo, node)) {
		  stringBuilder.append("<div id=\"");
		  stringBuilder.append(node.getId());	  
	  	  stringBuilder.append("\"");
		  stringBuilder.append(" class=\"");
		  stringBuilder.append(computeTOCLevelClass(previousPosition));	  
	  	  stringBuilder.append("\">\n");	 
	  	  if (!isClearanceMemo) {
		    stringBuilder.append("<div class=\"contentPosition\">\n");
		    stringBuilder.append(previousPosition);
		    stringBuilder.append("\n</div>\n");
	  	  }	  	  	  	    	  		  
		  if (shouldShowTitle(node)) {
			String titleHTML = getTitleHTML(node);
			stringBuilder.append(titleHTML);
		  }		  	  	 
		  stringBuilder.append("<div class=\"" + computeTOCLevelClass(previousPosition) + "Content" + (node.isIgnoreTitle() ? " contentNoTitle" : "") + "\">\n");
		  String content = clearanceMemoData.get(node.getId()) != null ? clearanceMemoData.get(node.getId()) : "";
		  content = replaceExtractNumber(content, isClearanceMemo);
		  if (!content.isEmpty()) {
			  stringBuilder.append(content);
		  }
		  String attachementsHTML = getAttachementsHTML(node, attachmentUrlProvider);
		  if (!attachementsHTML.isEmpty()) {
			  stringBuilder.append(attachementsHTML);
		  }
		  stringBuilder.append("\n</div>\n");
		  stringBuilder.append("<br/>");		  
		  stringBuilder.append("\n</div>\n");		  		 
	  }
	  
	  if (node.getChildren() != null)
	    for (ClearanceMemoNode childnode : node.getChildren()) {
		  outputPreviewData(stringBuilder, childnode, previousPosition, clearanceMemoData, isClearanceMemo, attachmentUrlProvider);
	    }
	}
	
	private String getCMContent(ClearanceMemo clearanceMemoTOC, HashMap<Long, String> clearanceMemoData, boolean isClearanceMemo,  AttachmentUrlProvider attachmentUrlProvider) {
		StringBuilder stringBuilder = new StringBuilder();
   	    if (clearanceMemoTOC != null && clearanceMemoTOC.getNodes() != null) {	    
		        for (ClearanceMemoNode node : clearanceMemoTOC.getNodes()) {
		          outputPreviewData(stringBuilder, node, "", clearanceMemoData, isClearanceMemo,  attachmentUrlProvider);
		        }
		}
   	    return stringBuilder.toString();		
	}
	
	private String getCRPdfContent(ClearanceMemo clearanceMemoTOC, HashMap<Long, String> clearanceMemoData, boolean isClearanceMemo,  AttachmentUrlProvider attachmentUrlProvider) {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append("<table>");
   	    if (clearanceMemoTOC != null && clearanceMemoTOC.getNodes() != null) {	    
	        for (ClearanceMemoNode node : clearanceMemoTOC.getNodes()) {
	          outputPreviewDataTables(stringBuilder, node, "", clearanceMemoData,  attachmentUrlProvider);
	        }
   	    }		
		stringBuilder.append("</table>");		
		return stringBuilder.toString();
	}
	
	
	private void loadPreviewData(StringBuilder stringBuilder, ClearanceMemo clearanceMemoTOC, HashMap<Long, String> clearanceMemoData, boolean isClearanceMemo,  boolean isPDF,AttachmentUrlProvider attachmentUrlProvider) {
		String content = null;
		if (!isClearanceMemo && isPDF) {
			content = getCRPdfContent(clearanceMemoTOC, clearanceMemoData, isClearanceMemo, attachmentUrlProvider);
		} else {
			content = getCMContent(clearanceMemoTOC, clearanceMemoData, isClearanceMemo, attachmentUrlProvider);
		}
		stringBuilder.append(content);
	}
	  
	@Override
	public String getClearanceReportHTML(Long foxVersionId, boolean isClearanceMemo, boolean includeTOC, boolean printOnLoad, boolean isPDF, DocumentsUrlProvider documentsUrlProvider,String userId,boolean isFoxipediaSearch) {
		StringBuilder stringBuilder = new StringBuilder();		
		try {
			//set the foxipedia context if is in foxipedia
			if (isFoxipediaSearch) {
				setUserInDBAndFoxipediaContext(userId,null,isFoxipediaSearch);				
			} else {
				clearContext();
			}
			ProductVersionHeader version = productService.findProductVersionHeaderById(foxVersionId);
			ErmProductVersion emrProductVersion = ermProductVersionService.findById(foxVersionId);
			if(emrProductVersion == null)
			  emrProductVersion = new ErmProductVersion();		
			ProductHeaderOnly product = null;
			if (version != null) {
			  Long foxId = version.getFoxId();
			  product = productService.findProductHeaderOnlyById(foxId);

			}
			boolean includeMapping = false;
			ClearanceMemo clearanceMemo = getClearanceMemo(foxVersionId, false,includeMapping);
			List<CommentStatus> commentStatusList = codesService.findAllCommentStatus();
			HashMap<Long, String> commentStatusMap = new HashMap<Long, String>();
			for (CommentStatus commentStatus : commentStatusList) {
			  commentStatusMap.put(commentStatus.getCommentStatusId(), commentStatus.getCommentStatusDescription());
			}
			ClearanceMemoOutputStreamer cmOS = null;
			ClearanceMemoOutput cmOutput = null;
	
			stringBuilder.append("<!DOCTYPE html>\n");			  
			stringBuilder.append("<html>\n");
			stringBuilder.append("<head>\n");
			if (!isPDF) {
			  stringBuilder.append("<meta charset=\"utf-8\"/>\n");
			  stringBuilder.append("<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"/>\n");
			}
			if (!isPDF) {
				if (isClearanceMemo) {
			      if (includeTOC) {		
				    stringBuilder.append("<link rel=\"stylesheet\" href=\"/erm/css/clearance-memo-toc.css\"/>\n");
				    stringBuilder.append("<link rel=\"stylesheet\" media=\"screen\" href=\"/erm/font-awesome/css/font-awesome.min.css\"/>\n");
				    stringBuilder.append("<script src=\"/erm/js/paths.js\"></script>\n");
				    stringBuilder.append("<script src=\"/erm/js/jquery.min.js\"></script>\n");
				    stringBuilder.append("<script src=\"/erm/js/clearance-memo-toc.js?_=" + System.currentTimeMillis() + "\"></script>  \n");
				    stringBuilder.append("<script type=\"text/javascript\">");
					stringBuilder.append("var foxVersionId = " + foxVersionId + ";\n");
					stringBuilder.append("$(function() {\n");
					stringBuilder.append("setupToolbarButtons();\n");			      
					stringBuilder.append("});");
				    stringBuilder.append("</script>");
			      } else {			    	
			    	stringBuilder.append("<link rel=\"stylesheet\" href=\"/erm/css/clearance-memo-html.css\"/>\n");
			      }
				} else {
				  stringBuilder.append("<link rel=\"stylesheet\" href=\"/erm/css/clearance-report-html.css\"/>\n");		
				}
				if (printOnLoad) {
				  stringBuilder.append("<script type=\"text/javascript\">");
//				  stringBuilder.append("window.print();");
				  stringBuilder.append("</script>"); 
				}							
			}
			
			try {
			  cmOS = new ClearanceMemoOutputStreamer(foxVersionId,clearanceMemo, this);
			  cmOutput = cmOS.getCmOutput();				
			} catch (ErmException e) {
			  e.printStackTrace();
			}
			
			stringBuilder.append("</head>\n");
			stringBuilder.append("<body>\n");
			if (isClearanceMemo && includeTOC) {							  							
			  stringBuilder.append("<div class=\"toolBarButton\">\n");
			  String isFoxipediaSearchAttr = "";
			  if (isFoxipediaSearch) {
				  isFoxipediaSearchAttr = "is-foxipedia-search='true'";
			  }			  
			  stringBuilder.append("<a href=\"#\" title=\"Print\" id=\"print-clearance-memo\" " + isFoxipediaSearchAttr + "><span class=\"icon-print\"> </span><span>Print</span></a>\n");
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<div class=\"toolBarButton\" style=\"left: 10%;\">\n");
			  stringBuilder.append("<a href=\"#\" title=\"PDF\" id=\"download-clearance-memo\" " + isFoxipediaSearchAttr + "><span class=\"icon-book\"> </span><span>PDF</span></a>\n");
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<div class=\"ermSideClearanceTOC\">\n");
			  stringBuilder.append("<ul class=\"ermSideClearanceTOCSelectArea\">\n");
//			  loadPreviewTOC(stringBuilder, cmOutput.getClearanceMemoTOC(), commentStatusMap, isClearanceMemo);
			  loadPreviewTOC(stringBuilder, clearanceMemo, commentStatusMap, isClearanceMemo);
			  stringBuilder.append("</ul>\n");
			  stringBuilder.append("</div>\n");
			}
			stringBuilder.append("<div class=\"memoPreviewContent\">\n");			
			if (isClearanceMemo) {
			  stringBuilder.append("<p class=\"legalClearanceTitle\" align=\"center\" style=\"text-align: center;\">All Media Distribution Rights</p>\n");
			  stringBuilder.append("<p class=\"legalClearanceTitle\" align=\"center\" style=\"text-align: center;\">");
			  stringBuilder.append(product.getTitle() != null ? product.getTitle().toUpperCase() : "");
			  stringBuilder.append("  ");
			  stringBuilder.append(product.getProductionYear() != null ? "(" + product.getProductionYear() + ")" : "");
			  stringBuilder.append("</p>\n");
			} else {
			  //CR
			  stringBuilder.append("<div class=\"memoPreviewFoxLogo\">\n");
			  String logoUrl = documentsUrlProvider.getLogoUrl();
			  stringBuilder.append("<img class=\"memoPreviewFoxLogoImg\" width=\"86\" height=\"60\" src=\"" + logoUrl +"\" alt=\"20th Century Fox\"/>\n");		
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<div class=\"legalClearanceTitle\">Legal Rights Clearance Report</div><BR/>\n");			
			  stringBuilder.append("<div class=\"twentiethCenturyFoxTitleFont\">TWENTIETH CENTURY FOX</div><BR/>\n");
			  stringBuilder.append("<span class=\"twentiethCenturyFoxSubTitleFont\">A UNIT OF TWENTIETH CENTURY FOX FILM CORPORATION</span><BR/><BR/>\n");
			}
			stringBuilder.append("<p class=\"memoPreviewContentPrivileged\" align=\"center\" style=\"text-align: center;\"><span class=\"underline\">\n");
			stringBuilder.append("PRIVILEGED AND CONFIDENTIAL<br/>SUBJECT TO ATTORNEY-CLIENT AND ATTORNEY WORK PRODUCT PRIVILEGES<br/>DO NOT DUPLICATE - DO NOT CIRCULATE</span></p>\n");
			stringBuilder.append("\n<BR/><BR/>\n");
			if (isClearanceMemo) {			  
			  stringBuilder.append("<div class=\"memorandumText\">\n");
			  stringBuilder.append(memorandumText);
			  stringBuilder.append("</div><BR/>\n");
			}
			logger.log(Level.SEVERE, " emrProductVersion.getLegalConfirmationStatusId() " + emrProductVersion.getLegalConfirmationStatusId());
			if (isClearanceMemo && emrProductVersion.getLegalConfirmationStatusId() != null) {
			  stringBuilder.append("<div class=\"confirmationStatus\">");
			  LegalConfirmationStatus legalConfirmationStatus = codesService.findLegalConfirmationStatusById(emrProductVersion.getLegalConfirmationStatusId());
			  stringBuilder.append(legalConfirmationStatus.getConfirmationClearanceMemoStatusText() != null ? legalConfirmationStatus.getConfirmationClearanceMemoStatusText() : "");
			  
			  stringBuilder.append("</div>\n");
			}
			if (!isClearanceMemo) {
			    //moved from section from top, code was only needed when clearance report
				List<ErmParty> contractualParties = contractualPartyService.findAllContractualParties();
				HashMap<Long, String> contractualPartiesMap = new HashMap<Long, String>();
				for (ErmParty contractualParty : contractualParties) {
					//AMV changed from contractual party organization name to display name
					contractualPartiesMap.put(contractualParty.getPartyId(), contractualParty.getDisplayName());
				}		
				
				List<ErmContractualPartyType> contractualPartyTypes = contractualPartyService.findAllContractualPartyTypes();
				HashMap<Long, String> contractualPartyTypesMap = new HashMap<Long, String>();
				for (ErmContractualPartyType contractualPartyType : contractualPartyTypes) {
					contractualPartyTypesMap.put(contractualPartyType.getContractualPartyTypeId(), contractualPartyType.getContractualPartyTypeDesc());
				}
				List<ErmContractInfo> ermContractInfoList = contractualPartyService.findErmContractsByFoxVersionID(foxVersionId);
				
				List<ErmParty> foxEntities = contractualPartyService.findAllFoxEntities();
				HashMap<Long, String> foxEntitiesMap = new HashMap<Long, String>();
				for (ErmParty foxEntity : foxEntities) {
				  //AMV changed from organizationName to displayName
				  foxEntitiesMap.put(foxEntity.getPartyId(), foxEntity.getDisplayName());
				}
				
				
			  stringBuilder.append("<div class=\"clearanceReportHeader\">");
			  setClearanceReportHeader(stringBuilder, product, clearanceMemo, emrProductVersion, ermContractInfoList, foxEntitiesMap, contractualPartiesMap, contractualPartyTypesMap);
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<div class=\"clearanceReportContentTOC\">");			
			  loadPreviewTOC(stringBuilder, clearanceMemo, commentStatusMap, isClearanceMemo);
			  stringBuilder.append("</div>\n");
			  stringBuilder.append("<br/>\n");
			  stringBuilder.append("<p class=\"pageBreak\"></p>\n");			  			  
		 }
			stringBuilder.append("<div class=\"clearanceReportContent\">");
			//main content of CM
		    loadPreviewData(stringBuilder, clearanceMemo, cmOutput.getClearanceMemoData(), isClearanceMemo,isPDF, documentsUrlProvider);
		    stringBuilder.append("</div>\n");		
			stringBuilder.append("</div>\n");
			stringBuilder.append("</body>\n");
			stringBuilder.append("</html>\n");
		} catch(Exception e) {
			logger.log(Level.SEVERE, "Exception getting HTML for Clearance Memo %o", e);
		}
		return stringBuilder.toString();
	}
	
	@Override
	public String generatePDF(InputStream cssStream, Long foxVersionId, DocumentsUrlProvider documentsUrlProvider,String userId, boolean isFoxipediaSearch) throws IOException, ErmException {
		 if (isFoxipediaSearch) {
			setUserInDBAndFoxipediaContext(userId,null,isFoxipediaSearch);				
		 } else { 		
			 clearContext();
		 }
		 String generatedPDFFile = "";	  
		 String fileName = "clearance_report";	      
		 String clearanceMemoHTML = getClearanceReportHTML(foxVersionId, false, false, false, true, documentsUrlProvider,userId,isFoxipediaSearch);
		 String formatedstring = clearanceMemoHTML; 	  
		 InputStream clearanceMemoHTMLStream = new ByteArrayInputStream(formatedstring.getBytes());	     
		 String path = getDownloadFileLocation();
		 generatedPDFFile = pdfRenderService.createPDF(path, clearanceMemoHTMLStream, cssStream, fileName, foxVersionId, "", false, "");
		 return generatedPDFFile;
	}
	
	@Override
	public void generatePDFOutputStream(InputStream cssStream, OutputStream os, Long foxVersionId, boolean isClearanceMemo, DocumentsUrlProvider documentsUrlProvider,String userId, boolean isFoxipediaSearch) throws IOException {
	  try {
		  String clearanceMemoHTML = getClearanceReportHTML(foxVersionId, isClearanceMemo, false, false, true,  documentsUrlProvider,userId,isFoxipediaSearch);
		  String formatedstring = clearanceMemoHTML;
		  formatedstring = formatedstring
				  			.replaceAll("& ", "&amp; ")
				  			.replaceAll("(?i)\\<pre>", "\\<pre>\\<pre>")
				  			.replaceAll("(?i)\\</pre>", "\\</pre>\\</pre>")
				  			.replaceAll("        ", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		  InputStream clearanceMemoHTMLStream = new ByteArrayInputStream(formatedstring.getBytes());
		  String fullyQualifiedURL = documentsUrlProvider.getDocumentFullyQualifiedURL();
	      pdfRenderService.writePdfToOutputStream(os, clearanceMemoHTMLStream, cssStream, "Clearance Memo", isClearanceMemo, fullyQualifiedURL); 
	  } catch (Exception e) {
		logger.log(Level.SEVERE, "DocumentException creating PDF	: " + e.getLocalizedMessage(),e);
	  }
	}
	
	public List<EntityComment> mapStrands(List<Long> strandIds,List<Long> commentIds,String userId,boolean isBusiness) throws ErmException {
		List<EntityComment> entityComments = commentsService.map(EntityType.STRAND.getId(), strandIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);
		return entityComments;
	}
	
	public List<EntityComment> mapStrandRestrictions(List<Long> strandRestrictionIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException{
		List<EntityComment> entityComments = commentsService.map(EntityType.STRAND_RESTRICTION.getId(), strandRestrictionIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);
		return entityComments;
	}
	
	public List<EntityComment> mapProductInfoCodes(List<Long> productInfoCodeIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException{
		List<EntityComment> entityComments = commentsService.map(EntityType.PROD_RSTRCN.getId(), productInfoCodeIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);
		return entityComments;	
	}	
	
	public void unMapStrands(List<Long> strandIds,List<Long> commentIds,String userId,boolean isBusiness) throws ErmException {	
		commentsService.unMap(EntityType.STRAND.getId(), strandIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);
	}
	
	public void unMapStrandRestrictions(List<Long> strandRestrictionIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException {	
		commentsService.unMap(EntityType.STRAND_RESTRICTION.getId(), strandRestrictionIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);		
	}
	
	public void unMapProductInfoCodes(List<Long> productInfoCodeIds,List<Long> commentIds, String userId, boolean isBusiness) throws ErmException{
		commentsService.unMap(EntityType.PROD_RSTRCN.getId(), productInfoCodeIds, commentIds, EntityCommentType.CLEARANCE_MEMO_MAP.getId(), userId, isBusiness);		
	}
	
	private String getRootCopyNodeTitle() {
		return ROOT_COPY_TITLE;
	}
	
	public void copyIntoClearanceMemo (Long foxVersionId, EntityComment entityComment, String userId) throws ErmException {
		EntityComment rootEntityComment = getRoot(foxVersionId);
		logger.log(Level.SEVERE, "found rootEntityComment: " + rootEntityComment.getId());
		Long sequence = getNextSequence(rootEntityComment.getCommentId());
		createNodeFromComment(foxVersionId, rootEntityComment.getCommentId(), entityComment, sequence, userId);
	}
	
	private void createNodeFromComment(Long foxVersionId, Long rootEntityCommentId, EntityComment entityComment, Long sequence,String userId) throws ErmException {
		ClearanceMemoNode node = new ClearanceMemoNode(entityComment.getComment().getShortDescription());
		node.setText(entityComment.getComment().getLongDescription());
		Comment comment = saveClearanceMemoNodeAsComment(node, userId);		
		List<EntityAttachment> attachments = attachmentsService.findEntityAttachments(EntityType.COMMENT.getId().longValue(), entityComment.getCommentId(), EntityAttachmentType.COMMENT.getId());
		logger.log(Level.SEVERE, "found attachments: " + (attachments != null ? attachments.size() : 0));
		if (attachments != null) {		
		  for (EntityAttachment attachment : attachments) {
			Long copiedDocumentId = attachmentsService.copy(attachment.getDocumentId(), userId, false);					
			attachmentsService.createNewEntityAttachmentFromCopiedDoc(attachment.getEntityTypeId(), attachment, copiedDocumentId, comment.getId(), userId, false);
		  }
		}
		saveToc(rootEntityCommentId, comment.getId(), sequence, userId);
	}
	
	private Comment createRootCopyNode(Long foxVersionId,Long rootEntityCommentId,Long sequence,String userId) throws ErmException {
		ClearanceMemoNode node = new ClearanceMemoNode(getRootCopyNodeTitle());
		Comment comment =  saveClearanceMemoNodeAsComment(node, userId);
		saveToc(rootEntityCommentId, comment.getId(),sequence, userId);
		return comment;

	}
	
	public void copyToExistingClearanceMemo(Long toFoxVersionId,ClearanceMemo clearanceMemo,String userId) throws ErmException{
		clearanceMemo.copyOriginalId();
		clearanceMemo.clearIds();
		clearanceMemo.setChildSequence();		
		EntityComment rootEntityComment = getRoot(toFoxVersionId);
		Comment root = null;
		if (rootEntityComment!=null) {
			Long sequence = getNextSequence(rootEntityComment.getCommentId());
			root = createRootCopyNode(toFoxVersionId, rootEntityComment.getCommentId(), sequence,userId);
		} else {
			rootEntityComment = createRootNodeEntityComment(toFoxVersionId, userId);
			root = rootEntityComment.getComment();
			updateHasClearanceMemoInProductVersion(toFoxVersionId,true,userId);			
		}
		for (ClearanceMemoNode node: clearanceMemo.getNodes()) {
			saveClearanceMemoNode(toFoxVersionId,node,userId,root.getId());
		}
		copyCommentContentFromClearanceMemo(clearanceMemo,userId);
	}
	
	/**
	 * Copies the text from the clearance memo comments from the original comments to the new comments.
	 * When first copying the clearance memo. Only the comment shell is created (along with TOC).
	 * Then the text is copied. This is done to prevent loading all the text in memory
	 * @param clearanceMemo
	 */
	public void copyCommentContentFromClearanceMemo(ClearanceMemo clearanceMemo,final String userId) {
		for (ClearanceMemoNode node: clearanceMemo.getNodes()) {
			node.walkWithRoot(new Visitor<ClearanceMemoNode>() {

				@Override
				public void visit(ClearanceMemoNode o) {
					commentsService.copyComment(o.getOriginalCommentId(), o.getId(),userId);
				}
				
			});
		}
	}
	
	@Override
	public List<Comment> getCommentsWithText(List<Long> ids) {
		return commentsService.findCommentsWithText(ids);
	}
	
	
		
}
