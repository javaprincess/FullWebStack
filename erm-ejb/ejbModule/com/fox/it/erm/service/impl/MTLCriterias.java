package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.Language;
import com.fox.it.erm.LanguageHierarchy;
import com.fox.it.erm.Media;
import com.fox.it.erm.MediaHierarchy;
import com.fox.it.erm.Territory;
import com.fox.it.erm.TerritoryHierarchy;

public class MTLCriterias {
	public static class MediaSearchCriteria extends SearchCriteria<Media> {

		public MediaSearchCriteria(EntityManager em) {
			super(em, Media.class);

		}		
		public MediaSearchCriteria setActive() {
			equal("activeFlag","Y");
			return this;
		}
	}
	
	

	public static class TerritorySearchCriteria extends SearchCriteria<Territory> {

		public TerritorySearchCriteria(EntityManager em) {
			super(em, Territory.class);			
		}
		
		public TerritorySearchCriteria setActive() {
			equal("activeFlag","Y");
			return this;
		}
		
	}
	
	public static class TerritoryHierarchySerchCriteria extends SearchCriteria<TerritoryHierarchy> {

		public TerritoryHierarchySerchCriteria(EntityManager em) {
			super(em, TerritoryHierarchy.class);
		}
		
		public TerritoryHierarchySerchCriteria setActive() {
			equal("activeFlag","Y");
			return this;
		}
		
		
	}
	
	public static class LanguageSearchCriteria extends SearchCriteria<Language> {

		public LanguageSearchCriteria(EntityManager em) {
			super(em, Language.class);			
		}
		
		public void setActive() {
			equal("activeFlag","Y");
		}
		
	}
	
	public static class LanguageHierarchySerchCriteria extends SearchCriteria<LanguageHierarchy> {

		public LanguageHierarchySerchCriteria(EntityManager em) {
			super(em, LanguageHierarchy.class);
		}
		
		public LanguageHierarchySerchCriteria setActive() {
			equal("activeFlag","Y");
			return this;
		}
		
		
	}
	
	
	public static MediaSearchCriteria getMediaSearchCriteria(EntityManager em) {
		return new MediaSearchCriteria(em);
	}
	
	
	public static class MediaHierarchySerchCriteria extends SearchCriteria<MediaHierarchy> {

		public MediaHierarchySerchCriteria(EntityManager em) {
			super(em, MediaHierarchy.class);
		}
		
		public MediaHierarchySerchCriteria setActive() {
			equal("activeFlag","Y");
			return this;
		}
		
		
	}
	
	
	public static TerritorySearchCriteria getTerritorySearchCriteria(EntityManager em) {
		return new TerritorySearchCriteria(em);
	}
	
	public static TerritoryHierarchySerchCriteria getTerritoryHierarchySearchCriteria(EntityManager em) {
		return new TerritoryHierarchySerchCriteria(em);
	}
	
	public static LanguageSearchCriteria getLanguageSearchCriteria(EntityManager em) {
		return new LanguageSearchCriteria(em);
	}
	
	public static LanguageHierarchySerchCriteria getLanguageHierarchySearchCriteria(EntityManager em) {
		return new LanguageHierarchySerchCriteria(em);
	}
	
	public static MediaHierarchySerchCriteria getMediaHierarchySearchCriteria(EntityManager em) {
		return new MediaHierarchySerchCriteria(em);
	}
	
}
