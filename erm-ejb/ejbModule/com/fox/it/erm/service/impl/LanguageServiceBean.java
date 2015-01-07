package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.Language;
import com.fox.it.erm.LanguageHierarchy;
import com.fox.it.erm.service.LanguageService;
import com.fox.it.erm.util.ErmNodeAlt;

@Stateless
public class LanguageServiceBean extends MTLService<Language,LanguageHierarchy> implements LanguageService {

	@Inject
	private EntityManager em;
	
	@Override
	public List<Language> get() {
		return findAll();
	}

	@Override
	public List<Language> findAll() {
		return MTLCriterias.getLanguageSearchCriteria(em).getResultList();
	}

	@Override
	protected EntityManager getEntityManager() {
		return em;
	}

	@Override
	public Date getLastModifiedTimestamp() {
		return getLastModified("lngg");	
	}

	@Override
	public Date getHierarchyLastModifiedTimestamp() {
		return getLastModified("LNGG_HIER");	
	}

	@Override
	public List<Language> getElements() {
		return get();
	}
	
	private List<LanguageHierarchy> findAllLanguageHierarchy() {
		return MTLCriterias.getLanguageHierarchySearchCriteria(em).setActive().getResultList();
	}
	

	@Override
	public List<LanguageHierarchy> getHierarchy() {
		return findAllLanguageHierarchy();
	}

	
	
	@Override
	public List<ErmNodeAlt> getLanguageTreeAlt() {
		return constructTreeAlt();
	}

	@Override
	public List<ErmNodeAlt> loadLanguageTreeAlt() {
		return constructTreeAlt();
	}

}
