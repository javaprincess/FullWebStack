package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.enums.EntityType;


public class EntityAttachmentSearchCriteria extends SearchCriteria<EntityAttachment> {
	
	
	public EntityAttachmentSearchCriteria(EntityManager em) {
		super(em, EntityAttachment.class);
		addSort("createDate", false);
		addSort("id");		
	}

	public void setEntityTypeId(Long id) {
		equal("entityTypeId", id);
	}
	
	public void setEntityId(Long id) {
		equal("entityId",id);
	}
	
	public void setEntityIds(List<Long> ids) {
		in("entityId",ids);		
	}
	
	public void setAttachmentTypeId(Long id) {
		equal("attachmentTypeId",id);
	}
	
	public void setFoxVersionId(Long foxVersionId) {
		setEntityTypeId(EntityType.PRODUCT_VERSION.getId().longValue());
		setEntityId(foxVersionId);
	}
	


}
