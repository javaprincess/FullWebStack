package com.fox.it.erm.service;

import java.util.List;
import java.util.Map;

import javax.ejb.Local;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.copy.XProductCopySpec;
import com.fox.it.erm.jobs.Job;

@Local
public interface XProductCopyService {
	/**
	 * Validates that the target products contained on the spec object are empty for the sections to be copied.
	 * @param spec
	 * @return A map containing the products that are not empty, with the sections that are not empty
	 */
	public Map<Long,XProductSections> validateEmpty(XProductCopySpec spec,boolean isBusiness);
	
	public Job copyAsJob(XProductCopySpec spec,String userId,boolean isBusiness) throws ErmException;
	
	public Job copyAsJob(Long fromFoxVersionId,List<Long> toFoxVersionIds,List<String> sections,String userId, boolean isBusiness);
	public Job copyAsJob(Long fromFoxVersionId,List<Long> toFoxVersionIds,List<String> sections,List<Long> clearanceMemoIds,String userId, boolean isBusiness);	
}
