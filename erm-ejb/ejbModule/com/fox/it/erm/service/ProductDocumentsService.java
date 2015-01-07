package com.fox.it.erm.service;

import java.util.List;
import java.util.Map;

import javax.ejb.Local;

import com.fox.it.erm.ProductDocument;
import com.fox.it.erm.grants.GrantCode;

@Local
public interface ProductDocumentsService {

	public List<ProductDocument> getProductDocuments(Long foxVersionId,boolean clearanceMemo,List<Long> grantCodes);
	public Map<String,GrantCode> getGrantsByCode();	
}
