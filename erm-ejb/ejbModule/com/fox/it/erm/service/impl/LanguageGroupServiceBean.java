package com.fox.it.erm.service.impl;

import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.LanguageGroup;
import com.fox.it.erm.service.LanguageGroupService;

@Stateless
public class LanguageGroupServiceBean extends ServiceBase implements LanguageGroupService {

	@Inject
	private EntityManager entityManager;
	
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.LanguageGroupService#loadAllLanguageGroupAsArray()
	 */
	@Override
	public Object loadAllLanguageGroupAsArray(){
		LanguageGroupSearchCriteria searchCriteria = new LanguageGroupSearchCriteria(entityManager);
		searchCriteria.addSort("languageGroupName");
		List<LanguageGroup> list = searchCriteria.getResultList();
		if(list != null && !list.isEmpty()){
			return list.toArray();
		}
		return new LanguageGroup[0];
	}
	
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.LanguageGroupService#findById(java.lang.Long)
	 */
	@Override
	public LanguageGroup findById(Long languageGroupId){
		
		LanguageGroupSearchCriteria searchCriteria = new LanguageGroupSearchCriteria(entityManager);
		searchCriteria.equal("languageGroupId", languageGroupId);	
		return searchCriteria.getSingleResult();
	}
}
