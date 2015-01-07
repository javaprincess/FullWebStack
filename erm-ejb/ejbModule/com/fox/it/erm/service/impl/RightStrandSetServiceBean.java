package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.service.RightStrandSetService;


@Stateless
public class RightStrandSetServiceBean extends ServiceBase implements RightStrandSetService{

	@Inject
	private EntityManager em;
	
	
	@Override
	public ErmRightStrandSet createSet(Long foxVersionId,String name,String description,String userId) {
		ErmRightStrandSet strandSet = new ErmRightStrandSet();
		Date d = new Date();
		strandSet.setCreateDate(d);
		strandSet.setCreateName(userId);
		strandSet.setUpdateDate(d);
		strandSet.setUpdateName(userId);
		strandSet.setStrandSetName(name);
		strandSet.setStrandSetDescription(description);
		strandSet.setFoxVersionId(foxVersionId);
		em.persist(strandSet);
		return strandSet;
	}
	
	@Override
	public ErmRightStrandSet findStrandSet(Long foxVersionId, String name) {
		SearchCriteria<ErmRightStrandSet> sc = SearchCriteria.get(em, ErmRightStrandSet.class);
		sc.equal("strandSetName", name);
		sc.equal("foxVersionId", foxVersionId);
		//this should return single result set.
		//however there's the possibulity of duplicates so is better to get the list and then the first element
		List<ErmRightStrandSet> strandSet = sc.getResultList();
		if (strandSet==null||strandSet.size()==0) {
			return null;
		}
		return strandSet.get(0);
	}
	
	@Override
	public ErmRightStrandSet findById(Long strandSetId) {
		SearchCriteria<ErmRightStrandSet> sc = SearchCriteria.get(em, ErmRightStrandSet.class);
		sc.equal("rightStrandSetId",strandSetId);
		List<ErmRightStrandSet> strandSet = sc.getResultList();
		if (strandSet==null||strandSet.size()==0) {
			return null;
		}
		return strandSet.get(0);		
	}
	
	@Override
	public ErmRightStrandSet copyToProduct(Long strandSetId, Long foxVersionId,String userId) {
		ErmRightStrandSet rightStrandSet = findById(strandSetId);
		if (rightStrandSet!=null) {
			ErmRightStrandSet copy = new ErmRightStrandSet();
			copy.setFoxVersionId(foxVersionId);
			copy.setStrandSetDescription(rightStrandSet.getStrandSetDescription());
			copy.setStrandSetName(rightStrandSet.getStrandSetName());
			Date now = new Date();
			copy.setCreateDate(now);
			copy.setUpdateDate(now);
			copy.setCreateName(userId);
			copy.setUpdateName(userId);
			em.persist(copy);
			return copy;
		}
		return null;
	}
	


}
