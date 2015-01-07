package com.fox.it.erm.service.impl;

import java.util.List;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.Document;

public class DocumentSearchCriteria extends SearchCriteria<Document> {

	public DocumentSearchCriteria(EntityManager em) {
		super(em, Document.class);
	}
	
	public DocumentSearchCriteria setId(Long id) {
		equal("id", id);
		return this;
	}
	
	public DocumentSearchCriteria setIds(List<Long> ids) {
		in("id", ids);
		return this;
	}
	
	public DocumentSearchCriteria setDocumentTypeId(Long documentTypeId){
		equal("documentTypeId", documentTypeId);
		return this;
	}

}