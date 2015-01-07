package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.Media;
import com.fox.it.erm.MediaHierarchy;
import com.fox.it.erm.service.MediaService;
import com.fox.it.erm.util.ErmNodeAlt;

@Stateless
public class MediaServiceBean extends MTLService<Media,MediaHierarchy> implements MediaService{

	@Inject
	private EntityManager em;
	
	@Override
	public List<Media> get() {
		return findAll();
	}

	@Override
	public List<Media> findAll() {
		return MTLCriterias.getMediaSearchCriteria(em).setActive().getResultList(); 
	}
	
	@Override
	public List<Media> findAllIncludeInactive() {
		return MTLCriterias.getMediaSearchCriteria(em).getResultList(); 		
	}

	@Override
	protected EntityManager getEntityManager() {
		return em;
	}

	@Override
	public Date getLastModifiedTimestamp() {
		return getLastModified("media");
	}

	@Override
	public Date getHierarchyLastModifiedTimestamp() {
		return getLastModified("MEDIA_HIER");
	}

	


	@Override
	public List<Media> getElements() {
		return get();
	}

	private List<MediaHierarchy> findAllMediaHierarchy() {
		return MTLCriterias.getMediaHierarchySearchCriteria(em).setActive().getResultList();
	}
	
	
	@Override
	public List<MediaHierarchy> getHierarchy() {
		return findAllMediaHierarchy();
	}
	
	@Override
	public List<ErmNodeAlt> getMediaTreeAlt() {
		return constructTreeAlt();
	}

	@Override
	public List<ErmNodeAlt> loadMediaTreeAlt() {
		return constructTreeAlt();
	}
	

}
