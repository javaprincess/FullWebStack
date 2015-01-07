package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;

import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.comments.CommentsService;

public class XProductCopyComments implements XProductSectionCopyProcessor {

	private CommentsService commentsService;
	
	public XProductCopyComments(CommentsService commentsService) {
		this.commentsService = commentsService;
	}
	
	private void copy(Long fromFoxVersionId,Long toFoxVersionId, List<EntityComment> entityComments,String userId, boolean isBusiness) {
		List<Long> entityKeys = new ArrayList<>();
		entityKeys.add(toFoxVersionId);
		commentsService.cloneWithComments(EntityType.PRODUCT_VERSION.getId(), entityKeys, entityComments, userId, isBusiness);
	}

	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness) {
		copy(fromFoxVersionId, toFoxVersionId, data.getComments(), userId, isBusiness);
	}

}
