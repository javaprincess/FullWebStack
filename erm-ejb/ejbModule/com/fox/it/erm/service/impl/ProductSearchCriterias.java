package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;


import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.validation.constraints.NotNull;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.FoxipediaProductGroup;
import com.fox.it.erm.Product;
import com.fox.it.erm.ProductType;
import com.fox.it.erm.ProductVersion;



public class ProductSearchCriterias {
	


	public static class ProductTypeSearchCriteria extends SearchCriteria<ProductType> {
		public ProductTypeSearchCriteria(EntityManager em) {
			super(em, ProductType.class);
			addSort("name");
		}		
	}
	
	
	public static class ErmProductVersionHeaderSearchCriteria extends SearchCriteria<ErmProductVersionHeader> {
		
		public ErmProductVersionHeaderSearchCriteria(EntityManager em) {
				super(em, ErmProductVersionHeader.class);
		}
		
		public ErmProductVersionHeaderSearchCriteria setId(Long foxVersionId) {
			equal("foxVersionId", foxVersionId);
			return this;
		}
		
		public ErmProductVersionHeaderSearchCriteria setIds(List<Long> ids) {
			Predicate predicate = getPredicateBulder().in("foxVersionId", ids);
			add(predicate);
			return this;			
		}		
	}
	
	public static class FoxipediaGroupSearchCriteria extends SearchCriteria<FoxipediaProductGroup> {

		public FoxipediaGroupSearchCriteria(EntityManager em) {
			super(em, FoxipediaProductGroup.class);
			addSort("description");
		}
		
		public void setName(String name) {
			setName(name, SearchCriterias.CONTAINS);
		}
		
		public void setName(String name,String wildcardType) {
			if (wildcardType.equalsIgnoreCase("S")) {
			  String q = SearchCriterias.toStartsWith(name);
			  likeUpper("description", q);
			} else {
			  String q = SearchCriterias.toContains(name);			
			  likeUpper("description", q);
			}
		}
		
	}
	
	public static class ProductSearchCriteria extends SearchCriteria<Product> {
		private  String strandsQuery;
		
		public String getStrandsQuery() {
			return strandsQuery;
		}

		public void setStrandsQuery(String strandsQuery) {
			this.strandsQuery = strandsQuery;
		}

		public ProductSearchCriteria(EntityManager em) {
			super(em, Product.class);
		}
		
		public ProductSearchCriteria setTitle(@NotNull String title) {
			return setTitle(title,false);
		}

		public ProductSearchCriteria setTitle(@NotNull String title,boolean searchAliases) {
			return setTitle(title,searchAliases,SearchCriterias.CONTAINS);
		}
		
		public ProductSearchCriteria setTitle(@NotNull String title,boolean searchAliases, String wildcardType) { 
			title = SearchCriterias.toWildcardType(title, wildcardType);
			Predicate predicate = null;
			if (searchAliases) {
				predicate = getTitleOrAliasPredicate(title);
			} else {
				predicate = getTitlePredicate(title);
			}
			add(predicate);
			return this;
		}
		

		private Predicate getCodeLikePredicate(String q) {
			q = SearchCriterias.toStartsWith(q);
			return getPredicateBulder().like("financialProductId", q.toUpperCase());
		}
		
		
		@SuppressWarnings("unused")
		private Predicate getCodeEqualsPredicate(String q) { 
			return getPredicateBulder().equal("financialProductId", q.toUpperCase());
		}
		
		private Predicate getCodePredicate(String q) {
			return getCodeLikePredicate(q);
		}
		
		private Predicate getTitlePredicate(String title) {
			 //logger.log(Level.SEVERE, "getTitlePredicate: title - " + title);
			 return getPredicateBulder().likeUpper("title", title);	
		}
		
		private Predicate getAliasPredicate(String title) {
			CriteriaBuilder builder = builder();
			Predicate aliasPredicate = builder.like(builder.upper(from().join("productVersions",JoinType.LEFT).join("aliases",JoinType.LEFT).<String>get("alias")),title.toUpperCase());
			return aliasPredicate;
		}						
 
		private Predicate getTitleOrAliasPredicate(String title) {
			Predicate titlePredicate = getTitlePredicate(title);
			Predicate aliasPredicate = getAliasPredicate(title);
			return getPredicateBulder().or(titlePredicate,aliasPredicate);
		}
		
		public ProductSearchCriteria setTitleOrAliasOrFinancialProductId(@NotNull String q) {
			String title = SearchCriterias.toStartsWith(q);
			Predicate titlePredicate = getTitleOrAliasPredicate(title);
			Predicate codePredicate = getCodePredicate(q);
			Predicate predicate = getPredicateBulder().or(titlePredicate,codePredicate);
			add(predicate);
			return this;
		}
		
		
		public ProductSearchCriteria setTitleOrFinancialProductId(@NotNull String q) {
			return setTitleOrFinancialProductId(q,false);
		}
		
		public ProductSearchCriteria setTitleOrFinancialProductId(@NotNull String q,boolean searchAliases) {
			return setTitleOrFinancialProductId(q,searchAliases,SearchCriterias.CONTAINS);
		}
		
		public ProductSearchCriteria setTitleOrFinancialProductId(@NotNull String q,boolean searchAliases, String wildcardType) {			
			String title = null;
			title = SearchCriterias.toWildcardType(q, wildcardType);
			
			Predicate titlePredicate = null;
			if (searchAliases) {
				titlePredicate = getTitleOrAliasPredicate(title);
			} else {
				titlePredicate = getTitlePredicate(title);
			}	
			Predicate codePredicate = getCodePredicate(q);
			Predicate predicate = getPredicateBulder().or(titlePredicate,codePredicate);
			
			add(predicate);
			return this;
		}
		
		public ProductSearchCriteria setFinancialProductId(@NotNull String financialProductId) {
			Predicate predicate = getPredicateBulder().equal("financialProductId",financialProductId);
			add(predicate);
			return this;
		}

		
		public ProductSearchCriteria setProdYearFrom(@NotNull Integer year) {
			Predicate predicate = getPredicateBulder().ge("productionYear", year);
			add(predicate);
			return this;
		}
		
		
		public ProductSearchCriteria setProdYearTo(@NotNull Integer year) {
			Predicate predicate = getPredicateBulder().le("productionYear", year);
			add(predicate);
			return this;
		}
		

		public ProductSearchCriteria setReleaseDateFrom(@NotNull Date date) {
			Predicate predicate = getPredicateBulder().ge("releaseDate", new java.sql.Date(date.getTime()));
			add(predicate);
			return this;
		}
		
		
		public ProductSearchCriteria setReleaseDateTo(@NotNull Date date) {
			Predicate predicate = getPredicateBulder().le("releaseDate", new java.sql.Date(date.getTime()));
			add(predicate);
			return this;
		}
		
		
		public void setNativeSQL(String sql) {
			 setNativeSQL(sql, null);
			
		}
		
		public ProductSearchCriteria setProductTypes(@NotNull List<String> productTypes) {
			Predicate predicate = getPredicateBulder().in("productTypeCode", productTypes);
			add(predicate);
			return this;
		}
		
		public ProductSearchCriteria setFoxIds(@NotNull List<Long> foxIds){
			Predicate predicate = this.getPredicateBulder().in("foxId", foxIds);
			this.add(predicate);
			return this;
		}
		
		public ProductSearchCriteria setFoxId(@NotNull Long foxId){
			Predicate predicate = this.getPredicateBulder().equal("foxId", foxId);
			this.add(predicate);
			return this;
		}
	}
	
	public static class ProductVersionSearchCriteria extends SearchCriteria<ProductVersion> {
		
		private  String strandsQuery;
		
		public String getStrandsQuery() {
			return strandsQuery;
		}

		public void setStrandsQuery(String strandsQuery) {
			this.strandsQuery = strandsQuery;
		}

		
		public ProductVersionSearchCriteria(EntityManager em) {
			super(em, ProductVersion.class);
		}

		public ProductVersionSearchCriteria setFoxProductId(@NotNull Long foxProductId) {
			Predicate predicate = getPredicateBulder().equal("foxId", foxProductId);
			add(predicate);
			return this;
		}
		
		public ProductVersionSearchCriteria excludeDefault() {
			Predicate predicate = getPredicateBulder().ne("versionTypeCode", "DFLT");
			add(predicate);
			return this;
		}
				
		
		public ProductVersionSearchCriteria setFoxProductIds(@NotNull List<Long> foxProductIds) {
			Predicate predicate = getPredicateBulder().in("foxId", foxProductIds);
			add(predicate);
			return this;
		
		}
		
		public ProductVersionSearchCriteria setFoxVersionId(Long foxVersionId) {
			equal("foxVersionId", foxVersionId);
			return this;
		}
		
		public ProductVersionSearchCriteria setFoxVersionIds(@NotNull List<Long> foxVersionIds) {
			Predicate predicate = getPredicateBulder().in("foxVersionId", foxVersionIds);
			add(predicate);
			return this;			
		}
	}
	
	public static ProductSearchCriteria getProductSearchCriteria(EntityManager em) {
		return new ProductSearchCriterias.ProductSearchCriteria(em);
	}
	
	public static ProductVersionSearchCriteria getProductVersionSearchCriteira(EntityManager em) {
		return new ProductVersionSearchCriteria(em);
	}
	
	public static ProductTypeSearchCriteria getProductTypeSearchCriteria(EntityManager em) {
		return new ProductTypeSearchCriteria(em);
	}
	
	public static FoxipediaGroupSearchCriteria getFoxipediaGroupSearchCriteria(EntityManager em) {
		return new FoxipediaGroupSearchCriteria(em);
	}
	
	public static ErmProductVersionHeaderSearchCriteria getErmProductVersionSearchCriteria(EntityManager em) {
		return new ErmProductVersionHeaderSearchCriteria(em);
	}
	
	public static ErmProductRestrictionSearchCriteria getErmProductRestrictionSearchCriteria(EntityManager em) {
		return new ErmProductRestrictionSearchCriteria(em);
	}	
	
	
}
