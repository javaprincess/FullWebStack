package com.fox.it.erm.service.comments.attachments;

@Deprecated
public interface AttachmentService {
	
	public Long save(Long entityTypeId, 
			Long entityKey, 
			Long entityCommentTypeId, 
			String fileName, 
			String userId,
			boolean isBusiness);
	

}
