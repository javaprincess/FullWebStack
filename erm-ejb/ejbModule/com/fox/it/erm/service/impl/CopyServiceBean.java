package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.service.CopyService;
import com.fox.it.erm.service.RightStrandSaveService;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.RightStrandUpdateObject;

@Stateless
public class CopyServiceBean extends ServiceBase implements CopyService {
	
	private static final Logger logger = Logger.getLogger(CopyServiceBean.class.getName());
	
	@Inject
	private EntityManager em;
	
	@Inject
	private CopyStrandsProcessorTempTableHandler copyProcessor;	
	
	@Inject
	private ProductInfoCodeCopyProcessor infoCodeCopyProcessor;

	@Inject
	private CommentsService commentsService;
	
	
	private Logger getLogger() {
		return logger;
	}
	
	private CommentLinkingProcessor getCommentLinkingProcessor() {
		return new CommentLinkingProcessor(commentsService);
	}
	
	
	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)	
	public List<RightStrandSave> copyStrandsAndAddComment(Long foxVersionId, Long toFoxVersionId,List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness,RightStrandSaveService strandsService) throws ErmException {
		List<RightStrandSave> save = copyStrands(foxVersionId,toFoxVersionId,strands,update,userId, isBusiness);
		List<Long> ids = IdsUtil.getRightStrandSaveIds(save);		
		if (update.hasComment()) {
			Long commentId = update.getCommentId();
			CommentLinkingProcessor copyProcessor = getCommentLinkingProcessor();
			copyProcessor.linkCommentToStrands(commentId, ids, userId);			
		}				

		return save;
	}
	
	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
	public List<RightStrandSave> copyStrands(Long foxVersionId, Long toFoxVersionId,
			List<ErmProductRightStrand> strands,
			RightStrandUpdateObject update, String userId, boolean isBusiness) throws ErmException {
		getLogger().info("Copying strands from: " + foxVersionId + " to: " + toFoxVersionId + " with userId: " + userId + " isBusiness: " + isBusiness);
		setUserInDBContext(userId, isBusiness);
		em.flush();
		List<RightStrandSave> save = copyProcessor.copyStrands(foxVersionId, toFoxVersionId, strands, update, userId, isBusiness);
		return save;
	}

	
	public List<Long> copyInfoCodes(Long foxVersionId, Long toFoxVersionId, List<ErmProductRestriction> infoCodes, String userId, boolean isBusiness) {
		getLogger().info("Copying info codes from: " + foxVersionId + " to: " + toFoxVersionId + " with userId: " + userId + " isBusiness: " + isBusiness);		
		setUserInDBContext(userId, isBusiness);
		em.flush();
		return infoCodeCopyProcessor.copy(foxVersionId, toFoxVersionId, infoCodes, userId, isBusiness);
	}
}
