package com.fox.it.erm.service;

import javax.ejb.Local;

import com.fox.it.erm.copy.XProductCopyData;
import com.fox.it.erm.copy.XProductSections;

@Local
public interface XProductSingleProductCopyService {

	public void doCopySingleProduct(Long jobId,Long actionId,Long fromFoxVersionId,Long toFoxVersionId,XProductSections sections, XProductCopyData data,String userId, boolean isBusiness);	
}
