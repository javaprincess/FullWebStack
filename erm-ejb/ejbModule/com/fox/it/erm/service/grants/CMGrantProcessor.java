package com.fox.it.erm.service.grants;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.ProductGrantComment;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.util.JPA;
import com.google.common.collect.Collections2;


/**
 * Class responsible for handling interaction between CM and grants
 * @author AndreasM
 *
 */
public class CMGrantProcessor {
	private static final Logger logger = Logger.getLogger(CMGrantProcessor.class.getName());
	
	private final EntityManager em;
	private ShouldAppearInCMPredicate shouldAppearInCM = new ShouldAppearInCMPredicate();	

	private static final String GRANTS_COMMENTS_SQL = "SELECT prod_grnt_id|| '-'||entty_cmnt_id as id,  PG.prod_grnt_id,pg.fox_version_id,grnt_cd_id ,EC.entty_cmnt_id,ec.cmnt_id,ec.entty_key,ec.entty_typ_id,entty_cmnt_typ_id, C.CMNT_SHRT_DESC " +  
													  "FROM PROD_GRNT PG,ENTTY_CMNT EC,CMNT C " +
													  "WHERE  " +
													  "FOX_VERSION_ID =? AND " +
													  "GRNT_CD_ID IN (2,7,14,15,16) AND " +
													  "EC.ENTTY_KEY = PG.PROD_GRNT_ID AND " +
													  "EC.ENTTY_TYP_ID=5 AND " +
													  "C.CMNT_ID = EC.CMNT_ID "+
													  "order by PG.GRNT_CD_ID";
	

	private static final String GRANTS_COMMENT_ID_SQL = "Select EC.* " +  
														"FROM PROD_GRNT PG,ENTTY_CMNT EC " +
														"WHERE  " +
														"FOX_VERSION_ID =? AND " +
														"EC.CMNT_ID=? AND " +
														"GRNT_CD_ID IN (14,15,16) AND " +
														"EC.ENTTY_KEY = PG.PROD_GRNT_ID AND " +
														"EC.ENTTY_TYP_ID=5 ";
	
	
	@Inject
	public CMGrantProcessor(EntityManager em) {
		this.em = em;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	private List<ProductGrantComment> filterByShouldShowInCM(List<ProductGrantComment> comment) {
		List<ProductGrantComment> filtered = new ArrayList<>();
		filtered.addAll(Collections2.filter(comment, shouldAppearInCM));
		return filtered;
	}
	
	/**
	 * Finds all the grant comments that should be in CM
	 * @param foxVersionId
	 * @return
	 */
	public List<ProductGrantComment> findAllCommentsShouldAppearInCM(Long foxVersionId) {
		Query query = em.createNativeQuery(GRANTS_COMMENTS_SQL, ProductGrantComment.class);
		query.setParameter(1, foxVersionId);
		JPA.setNoCacheHints(query);
		@SuppressWarnings("unchecked")
		List<ProductGrantComment> comments=  filterByShouldShowInCM(query.getResultList());
		return comments;
	}
	
	public void setDoNotShowInCM(EntityComment ec,String userId) {
		if (!EntityCommentType.SALES_AND_MARKETING_GNRL.getId().equals(ec.getEntityTypeId())) {
			ec.setEntityCommentTypeId(EntityCommentType.SALES_AND_MARKETING_GNRL.getId());
			em.flush();
		}
	}
	
	/**
	 * Makes the necessary updates in the grant comment structure when a comment is deleted from CM
	 * @param foxVersionId
	 * @param commentId
	 * @param userId
	 */
	public void updateGrantDelteCommentFromCM(Long foxVersionId, Long commentId, String userId) {
		Query query = em.createNativeQuery(GRANTS_COMMENT_ID_SQL, EntityComment.class);
		query.setParameter(1, foxVersionId);
		query.setParameter(2, commentId);		
		JPA.setNoCacheHints(query);
		@SuppressWarnings("unchecked")
		List<EntityComment> comments=  query.getResultList();
		if (comments==null||comments.isEmpty()) {
			getLogger().info("updateGrantDelteCommentFromCM Comment " + commentId + " for foxVersionId " + foxVersionId + " is not a sales & mktng grant. No action will be performed");
			return;
		}
		for (EntityComment ec: comments) {
			getLogger().info("updateGrantDelteCommentFromCM Comment " + commentId + " for foxVersionId " + foxVersionId + "  a sales & mktng grant. Updatin entity comment type to not show in CM");			
			setDoNotShowInCM(ec,userId);
		}
			
		
	}
	

}
