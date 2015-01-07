package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.Map;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmProductGrant;
import com.fox.it.erm.ErmProductLanguageRestriction;
import com.fox.it.erm.ErmProductMediaRestriction;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductTerritoryRestriction;
import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.service.EntityCommentTypeHolder;
import com.fox.it.erm.service.ErmProductRestrictionService;
import com.fox.it.erm.util.StrandsUtil;
import com.fox.it.erm.util.UpdatableProcessor;

/**
 * 
 * @author YvesN
 *
 */
@Stateless
public class ErmProductRestrictionServiceBean extends ServiceBase implements
		ErmProductRestrictionService {

	@Inject
	private EntityManager em;
	
	

	@Override
	public List<ErmProductGrant> findErmProductGrantByErmProductVersionId(
			Long ermProductVersionId) {
		SearchCriteria<ErmProductGrant> searchCriteria = SearchCriteria.get(em, ErmProductGrant.class);
		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
		searchCriteria = searchCriteria.equal("ermProductVersion", epv);
		return searchCriteria.getResultList();
	}


	@Override
	public List<ErmProductLanguageRestriction> findErmProductLanguageRestrictionByErmProductVersionId(
			Long ermProductVersionId) {
		SearchCriteria<ErmProductLanguageRestriction> searchCriteria = SearchCriteria.get(em, ErmProductLanguageRestriction.class);
		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
		searchCriteria = searchCriteria.equal("ermProductVersion", epv);
		return searchCriteria.getResultList();
	}


	@Override
	public List<ErmProductMediaRestriction> findErmProductMediaRestrictionByErmProductVersionId(
			Long ermProductVersionId) {
		SearchCriteria<ErmProductMediaRestriction> searchCriteria = SearchCriteria.get(em, ErmProductMediaRestriction.class);
		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
		searchCriteria = searchCriteria.equal("ermProductVersion", epv);
		return searchCriteria.getResultList();
	}

	@Override
	public ErmProductRestriction findErmProductRestrictionByPrimaryKey(
			Long ermProductRestrictionId) {
		return em.find(ErmProductRestriction.class, ermProductRestrictionId);
	}

	@Override
	public List<ErmProductRestriction> findErmProductRestrictionByErmProductVersionId(
			Long ermProductVersionId) {
		ErmProductRestrictionSearchCriteria criteria = new ErmProductRestrictionSearchCriteria(em);
		boolean loadHasComments = true;
		List<ErmProductRestriction> restrictions =  criteria.setFoxVersionId(ermProductVersionId).getResultList();
		if (loadHasComments) {
			setHasComments(restrictions);
		}
		return restrictions;
	}
	
	// setHasComments flag is put at the restriction level since it's shared by product info codes and right strand restrictions
	private void setHasComments(List<ErmProductRestriction> restrictions) {
		List<Long> ids = StrandsUtil.getErmProductRestrictionIds(restrictions);
		Map<Long,ErmProductRestriction> restrictionMap = StrandsUtil.toErmProductRestrictionMap(restrictions);
		RightStrandSQLFinder finder = getFinder();
		Map<Long,EntityCommentTypeHolder> commentTypesMap = finder.findRestrictionCommentTypes(ids);
		for (ErmProductRestriction restriction: restrictionMap.values()) {
			Long restrictionId = restriction.getProductRestrictionId();
			if (commentTypesMap.containsKey(restrictionId)) {
				EntityCommentTypeHolder commentTypesHolder = commentTypesMap.get(restrictionId);
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.CLEARANCE_MEMO_MAP.getId()) && restriction.getRestriction() != null) {
					restriction.setMappedToClearanceMemo(true);
				}
				if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.INFO_CODE.getId()) && restriction.getRestriction() != null) {
					restriction.setHasComments(true);
				}				
			}
		}
	}
	
	protected RightStrandSQLFinder getFinder() {
		return new RightStrandSQLFinder(getEntityManager());
	}

	
	@Override
	public List<ErmProductRestriction> findProductRestrictionsByIds(List<Long> ids) {
		ErmProductRestrictionSearchCriteria criteria = new ErmProductRestrictionSearchCriteria(em);
		return criteria.setIds(ids).getResultList();
	}

//	@Override
//	public ErmProductTerritoryRestriction findErmProductTerritoryRestrictionByPrimaryKey(
//			Long ermProductTerritoryRestrictionId) {
//		return em.find(ErmProductTerritoryRestriction.class, ermProductTerritoryRestrictionId);
//	}

	@Override
	public List<ErmProductTerritoryRestriction> findErmProductTerritoryRestrictionByErmProductVersionId(
			Long ermProductVersionId) {
		SearchCriteria<ErmProductTerritoryRestriction> searchCriteria = SearchCriteria.get(em, ErmProductTerritoryRestriction.class);
		ErmProductVersion epv = em.find(ErmProductVersion.class, ermProductVersionId);
		searchCriteria = searchCriteria.equal("ermProductVersion", epv);
		return searchCriteria.getResultList();
	}


	@Override
	public List<ErmProductRestriction> findAllProductRestrictions(
			Long foxVersionId) {
		ErmProductRestrictionSearchCriteria serchCriteria = new ErmProductRestrictionSearchCriteria(em);
		boolean loadHasComments = true;
		List<ErmProductRestriction> restrictions =  serchCriteria.setFoxVersionId(foxVersionId).getResultList();
		if (loadHasComments) {
			setHasComments(restrictions);
		}
		return restrictions;
	}
	

	@Override	
	public List<ErmProductRestriction> findAllProductRestrictions(Long foxVersionId,boolean isBusiness) {
		@SuppressWarnings("unchecked")
		List<ErmProductRestriction> filtered = (List<ErmProductRestriction>) UpdatableProcessor.filter(findAllProductRestrictions(foxVersionId), isBusiness);
		boolean loadHasComments = true;		
		if (loadHasComments) {
			setHasComments(filtered);
		}
		return filtered; 
	}
	
	public List<ErmProductRestriction> findRestriction(Long foxVersionId, Long restrictionId, boolean isBusiness) {
		ErmProductRestrictionSearchCriteria serchCriteria = new ErmProductRestrictionSearchCriteria(em);
		return serchCriteria
				.setFoxVersionId(foxVersionId)
				.setIsBusiness(isBusiness)
				.setRestrictionId(restrictionId)
				.getResultList();
		
	}
	

}
