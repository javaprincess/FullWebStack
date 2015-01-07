package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightRestriction;
import com.fox.it.erm.ErmRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.Language;
import com.fox.it.erm.Media;
import com.fox.it.erm.RefDate;
import com.fox.it.erm.Restriction;
import com.fox.it.erm.RestrictionType;
import com.fox.it.erm.RightRestrictionForQuery;
import com.fox.it.erm.RightStrandForQuery;
import com.fox.it.erm.Territory;
import com.fox.it.erm.comments.EntityComment;
import com.fox.it.erm.comments.EntityCommentOnly;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.EntityCommentTypeHolder;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.IdsUtil;
import com.fox.it.erm.util.JPA;
import com.fox.it.erm.util.StrandsUtil;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;


/**
 * Fetches the right strands using native SQL
 * This is for optimization purposes 
 * @author AndreasM
 *
 */
public class RightStrandSQLFinder {
	
	private static final  int IN_LIMIT = 1000;
	
	class StrandToRightStrandConverter {
		private void copyMTL(ErmProductRightStrand strand, RightStrandForQuery s) {
			Media media = new Media();
			media.setId(s.getMediaId());
			media.setMediaCd(s.getMediaCode());
			media.setName(s.getMediaName());
			strand.setMedia(media);
			
			Territory territory = new Territory();
			territory.setId(s.getTerritoryId());
			territory.setCode(s.getTerrioryCode());
			territory.setName(s.getTerritoryName());			
			strand.setTerritory(territory);
			
			
			Language language = new Language();
			language.setId(s.getLanguageId());
			language.setLanguageCode(s.getLanguageCode());
			language.setName(s.getLanguageName());
			strand.setLanguage(language);

		}
		
		private void copyDateCodes(ErmProductRightStrand strand, RightStrandForQuery s) {
			RefDate endDate = new RefDate();
			if (s.getEndDateCodeId()!=null) {
				endDate.setRefDateId(s.getEndDateCodeId());
				endDate.setDateCode(s.getEndDateCode());
				endDate.setDateCodeDescription(s.getEndDateCodeName());			
				strand.setEndDateCode(endDate);
			}
			
			RefDate startDate = new RefDate();
			if (s.getStartDateCodeId()!=null) {
				startDate.setRefDateId(s.getStartDateCodeId());
				startDate.setDateCode(s.getStartDateCode());
				startDate.setDateCodeDescription(s.getStartDateCodeName());
				strand.setStartDateCode(startDate);
			}
		}
		
		private void copyStrandSet(ErmProductRightStrand strand, RightStrandForQuery s) {
			strand.setStrandSetId(s.getStrandSetId());
			if (s.getStrandSetId()!=null) {
				ErmRightStrandSet set = new ErmRightStrandSet();
				set.setRightStrandSetId(s.getStrandSetId());
				set.setStrandSetName(s.getStrandSetName());
				strand.setStrandSet(set);
			}
		}
		
		public ErmProductRightStrand convert(RightStrandForQuery s) {
			ErmProductRightStrand strand = new ErmProductRightStrand();
			strand.copyFrom(s);
			copyMTL(strand, s);
			copyDateCodes(strand, s);
			copyStrandSet(strand, s);
			return strand;
		}
	}
	
	class RestrictionToRightRestrictionConverter {
		public ErmProductRightRestriction convert(RightRestrictionForQuery r) {
			ErmProductRightRestriction restriction = new ErmProductRightRestriction();
			restriction.setBusinessInd(r.getBusinessInd());
			restriction.setEndDate(r.getEndDate());
			restriction.setEndDateCdId(r.getEndDateCdId());
			restriction.setEndDateExprInstncId(r.getEndDateExprInstncId());
			restriction.setLegalInd(r.getLegalInd());
			restriction.setStartDate(r.getStartDate());
			restriction.setStartDateCdId(r.getStartDateCdId());
			restriction.setStartDateExprInstncId(r.getStartDateExprInstncId());
			restriction.setRightRestrictionId(r.getRightRestrictionId());
			restriction.setCreateDate(r.getCreateDate());
			restriction.setCreateName(r.getCreateName());
			restriction.setUpdateDate(r.getUpdateDate());
			restriction.setUpdateName(r.getUpdateName());
			
			if (r.getRestrictionId()!=null) {
				Restriction restrictionRef = new Restriction();
				restrictionRef.setId(r.getRestrictionId());
				restrictionRef.setCode(r.getRestrictionCode());
				restrictionRef.setDescription(r.getRestrictionName());
				if (r.getRestrictionTypeId()!=null) {
					RestrictionType restrictionType = new RestrictionType();
					restrictionType.setId(r.getRestrictionTypeId());
					restrictionType.setCode(r.getRestrictionCode());
					restrictionType.setName(r.getRestrictionTypeName());
					restrictionRef.setRestrictionType(restrictionType);
					}
			   restriction.setRestriction(restrictionRef);
			}

			
			restriction.setRestrictionCdId(r.getRestrictionId());
			restriction.setRightStrandId(r.getRightStrandId());
			
			if (r.getStartDateCdId()!=null) {
				RefDate startDate = new RefDate();
				startDate.setRefDateId(r.getStartDateCdId());
				startDate.setDateCode(r.getStartDateCode());
				startDate.setDateCodeDescription(r.getStartDateName());
				restriction.setStartDateCodeId(startDate);
			}

			if (r.getEndDateCdId()!=null) {
				RefDate endDate = new RefDate();
				endDate.setRefDateId(r.getEndDateCdId());
				endDate.setDateCode(r.getEndDateCode());
				endDate.setDateCodeDescription(r.getEndDateName());
				restriction.setEndDateCodeId(endDate);
			}

			
			
			return restriction;
		}
	}
	
	
	private static Logger logger = Logger.getLogger(RightStrandSQLFinder.class.getName());
	
	
	
	private final EntityManager em;
	
	
	private static final String restrictionsById = "select r.*,rc.RSTRCN_CD_ID,rc.RSTRCN_CD,rc.RSTRCN_DESC,rt.RSTRCN_TYP_ID ,rt.RSTRCN_TYP_CD,RT.RSTRCN_TYP_DESC,SDC.DT_CD as START_DT_CD, SDC.DT_CD_DESC as START_DT_DESC,  EDC.DT_CD as END_DT_CD, EDC.DT_CD_DESC as END_DT_DESC from  " +
			 "rght_rstrcn r, " +
			 "rstrcn_code rc, " +
			 "ref_date_cd sdc, " +
			 "ref_rstrcn_typ rt, " +
			 "ref_date_cd edc " +
			 "where  " +
			 "R.RSTRCN_CD_ID=rc.RSTRCN_CD_ID and " +
			 "SDC.DT_CD_ID (+) = R.STRT_DT_CD_ID  and " +
			 "EDC.DT_CD_ID (+) = R.END_DT_CD_ID and " +
			 "RC.RSTRCN_TYP_ID  =  RT.RSTRCN_TYP_ID (+) and   " +
			 "R.RGHT_RSTRCN_ID in "; 

	private static final String restrictionBase = "select r.*,rc.RSTRCN_CD_ID,rc.RSTRCN_CD,rc.RSTRCN_DESC,rt.RSTRCN_TYP_ID ,rt.RSTRCN_TYP_CD,RT.RSTRCN_TYP_DESC,SDC.DT_CD as START_DT_CD, SDC.DT_CD_DESC as START_DT_DESC,  EDC.DT_CD as END_DT_CD, EDC.DT_CD_DESC as END_DT_DESC from  " +
			 "rght_rstrcn r, " +
			 "rstrcn_code rc, " +
			 "ref_date_cd sdc, " +
			 "ref_rstrcn_typ rt, " +
			 "ref_date_cd edc " +
			 "where  " +
			 "R.RSTRCN_CD_ID=rc.RSTRCN_CD_ID and " +
			 "SDC.DT_CD_ID (+) = R.STRT_DT_CD_ID  and " +
			 "EDC.DT_CD_ID (+) = R.END_DT_CD_ID and " +
			 "RC.RSTRCN_TYP_ID  =  RT.RSTRCN_TYP_ID (+) and   " +
			 "R.RGHT_STRND_ID in ";
	

	
	
	private static final String restrictionSql = restrictionBase + " (select S.RGHT_STRND_ID from rght_strnd s where s.fox_version_id = ?) ";

	private static final String restrictionForGridByIdSql  = "select r.* from rght_rstrcn r where R.RGHT_RSTRCN_ID in ";
	private static final String restrictionForGridBaseSql = "select r.* from rght_rstrcn r where R.RGHT_STRND_ID in ";	
	private static final String restrictionForGridSql = restrictionForGridBaseSql + " (select S.RGHT_STRND_ID from rght_strnd s where s.fox_version_id = ?)";
 

	private static final String strandSqlByIds = "select s.*, " +
			 "M.MEDIA_CD, m.MEDIA_DESC, " +
			 "T.TRRTRY_CD,T.TRRTRY_DESC, " +
			 "L.LNGG_CD,L.LNGG_DESC, " +
			 "SS.STRND_SET_NM, " +
			 "CSS.DT_STS_CD as START_DT_STS_CD,CSS.DT_STS_DESC AS START_DT_STS_DESC,CES.DT_STS_CD as END_DT_STS_CD,CES.DT_STS_DESC AS END_DT_STS_DESC, " +
			 "sdc.DT_CD AS START_DT_CD, sdc.DT_CD_DESC AS START_DT_CD_DESC, " +
			 "edc.DT_CD AS END_DT_CD, edc.DT_CD_DESC AS END_DT_CD_DESC " +
			 "from  " +
			 "rght_strnd s, " +
			 "media m, " +
			 "trrtry t, " +
			 "lngg l, " +
			 "rght_strnd_set ss, " +
			 "ref_date_sts css, " +
			 "ref_date_sts ces, " +
			 "ref_date_cd sdc, " +
			 "ref_date_cd edc " +
			 "where  " +
			 "s.RGHT_STRND_ID in (?) and " +
			 "s.media_id = m.media_id and " +
			 "s.trrtry_id = t.trrtry_id and " +
			 "s.LNGG_ID = l.lngg_id and " +
			 "SDC.DT_CD_ID (+) = S.STRT_DT_CD_ID  and " +
			 "EDC.DT_CD_ID (+) = S.END_DT_CD_ID  and " +
			 "S.CONT_STRT_DT_STS_ID = CSS.DT_STS_ID  (+) and " +
			 "S.CONT_END_DT_STS_ID = CES.DT_STS_ID  (+) and " +
			 "S.RGHT_STRND_SET_ID = ss.RGHT_STRND_SET_ID (+) ";

	
	private static final String strandForGridSql = "select s.*,ss.* from rght_strnd s, " +
			 									   "rght_strnd_set ss " +
												   "where  " +
												   "S.RGHT_STRND_SET_ID = ss.RGHT_STRND_SET_ID (+) and " +
												   "s.fox_version_id = ?";
	
	private static final String strandsSql = "select s.*, " +
											 "M.MEDIA_CD, m.MEDIA_DESC, " +
											 "T.TRRTRY_CD,T.TRRTRY_DESC, " +
											 "L.LNGG_CD,L.LNGG_DESC, " +
											 "SS.STRND_SET_NM, " +
											 "CSS.DT_STS_CD as START_DT_STS_CD,CSS.DT_STS_DESC AS START_DT_STS_DESC,CES.DT_STS_CD as END_DT_STS_CD,CES.DT_STS_DESC AS END_DT_STS_DESC, " +
											 "sdc.DT_CD AS START_DT_CD, sdc.DT_CD_DESC AS START_DT_CD_DESC, " +
											 "edc.DT_CD AS END_DT_CD, edc.DT_CD_DESC AS END_DT_CD_DESC " +
											 "from  " +
											 "rght_strnd s, " +
											 "media m, " +
											 "trrtry t, " +
											 "lngg l, " +
											 "rght_strnd_set ss, " +
											 "ref_date_sts css, " +
											 "ref_date_sts ces, " +
											 "ref_date_cd sdc, " +
											 "ref_date_cd edc " +
											 "where  " +
											 "s.fox_version_id = ? and " +
											 "s.media_id = m.media_id and " +
											 "s.trrtry_id = t.trrtry_id and " +
											 "s.LNGG_ID = l.lngg_id and " +
											 "SDC.DT_CD_ID (+) = S.STRT_DT_CD_ID  and " +
											 "EDC.DT_CD_ID (+) = S.END_DT_CD_ID  and " +
											 "S.CONT_STRT_DT_STS_ID = CSS.DT_STS_ID  (+) and " +
											 "S.CONT_END_DT_STS_ID = CES.DT_STS_ID  (+) and " +
											 "S.RGHT_STRND_SET_ID = ss.RGHT_STRND_SET_ID (+) ";
	
	private static final String strandsCommentsSqlBase = "Select ENTTY_CMNT_ID, entty_key, ENTTY_CMNT_TYP_ID, CMNT_ID from entty_cmnt c where entty_typ_id = " + EntityType.STRAND.getId() + " and entty_key in ";
	
	private static final String restrictionsCommentsSqlBase = "Select ENTTY_CMNT_ID, entty_key, ENTTY_CMNT_TYP_ID from entty_cmnt c where entty_typ_id = " + EntityType.PROD_RSTRCN.getId() + " and entty_key in ";
	
	private static final String strandRestrictionsCommentsSqlBase = "Select ENTTY_CMNT_ID, entty_key, ENTTY_CMNT_TYP_ID,CMNT_ID from entty_cmnt c where entty_typ_id = " + EntityType.STRAND_RESTRICTION.getId() + " and entty_key in ";


	@Inject
	public RightStrandSQLFinder(EntityManager em) {
		this.em = em;
	}

	private Logger getLogger() {
		return logger;
	}
	
	
	private void setNoCacheHints(Query query) {
		JPA.setNoCacheHints(query);
	}	
	
 
	private String getIsBusinessPredicate(boolean isBusiness,String prefix) {
		String businessColumn="bsns_ind";
		String legalColumn="lgl_ind";
		if (prefix!=null) {
			businessColumn = prefix + "." + businessColumn;
			legalColumn = prefix + "." + legalColumn;
		}
		String column = legalColumn;
		if (isBusiness) {
			column=businessColumn;
		}
		return column +"=1";
	}
	
	private String getIsBusinessPredicate(boolean isBusiness) {
		return getIsBusinessPredicate(isBusiness, null);
	}
	
	
	

	private List<ErmProductRightStrand> findStrandsInBatch(List<Long> ids) {
		String idsStr  = Joiner.on(",").join(ids);	
		String sql = strandSqlByIds.replaceFirst("\\?", idsStr);
		Query q = em.createNativeQuery(sql,RightStrandForQuery.class);
		setNoCacheHints(q);		
		@SuppressWarnings(value = "unchecked")
		List<RightStrandForQuery> strands = q.getResultList();
		StrandToRightStrandConverter converter = new StrandToRightStrandConverter();
		List<ErmProductRightStrand> rightStrands = new ArrayList<>(strands.size());
		for (RightStrandForQuery s: strands) {
			rightStrands.add(converter.convert(s));
		}
		return rightStrands;
		
	}
	

	private List<ErmProductRightStrand> findStrandsOnly(List<Long> ids) {
		if (ids==null||ids.isEmpty()) {
			return new ArrayList<ErmProductRightStrand>();
		}
		if (ids.size()<=JPA.IN_LIMIT) {
			return findStrandsInBatch(ids);
		}
		
		List<ErmProductRightStrand> all = new ArrayList<>();
		List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
		for (List<Long> l: lists) {
			List<ErmProductRightStrand> strands = findStrandsInBatch(l);
			all.addAll(strands);
		}
		return all;
		
		
		
	}
	

	
	private List<ErmProductRightStrand> findStrandsOnly(Long foxVersionId) {
		long t0 = System.currentTimeMillis();
		Query q = em.createNativeQuery(strandsSql,RightStrandForQuery.class);
		
		q.setParameter(1, foxVersionId);
		setNoCacheHints(q);
		@SuppressWarnings(value = "unchecked")
		List<RightStrandForQuery> strands = q.getResultList();
		StrandToRightStrandConverter converter = new StrandToRightStrandConverter();
		List<ErmProductRightStrand> rightStrands = new ArrayList<>(strands.size());
		for (RightStrandForQuery s: strands) {
			rightStrands.add(converter.convert(s));
		}
		long t1 = System.currentTimeMillis();
		getLogger().info("Got " + rightStrands.size() + " strands only in " + (t1-t0) + "ms");
		return rightStrands;
	}
	
	private List<ErmRightStrand> findStrandsOnlyForGrid(Long foxVersionId) {
		long t0 = System.currentTimeMillis();
		Query q = em.createNativeQuery(strandForGridSql,ErmRightStrand.class);
		q.setParameter(1, foxVersionId);
		setNoCacheHints(q);
		@SuppressWarnings(value = "unchecked")
		List<ErmRightStrand> strands = q.getResultList();
		for (ErmRightStrand strand:strands) {
			strand.populateRightStrandSet();
		}
//		List<ErmRightStrand> rightStrands = new ArrayList<>(strands.size());		
		long t1 = System.currentTimeMillis();
		getLogger().info("Got " + strands.size() + " strands only in " + (t1-t0) + "ms");
		return strands;
	}
	
	
	
	
	private List<ErmProductRightRestriction> toRestrictionList(Query q) {
		@SuppressWarnings(value = "unchecked")
		List<RightRestrictionForQuery> restrictions = q.getResultList();
		RestrictionToRightRestrictionConverter converter = new RestrictionToRightRestrictionConverter();
		List<ErmProductRightRestriction> rightRestrictions = new ArrayList<>(restrictions.size());
		for (RightRestrictionForQuery r: restrictions) {
			rightRestrictions.add(converter.convert(r));
		}
		return rightRestrictions;
		
	}
	
	
	
	public List<ErmProductRightRestriction> findRestrictionsByIds(List<Long> ids) {
		if (ids ==null||ids.size()==0) {
			return new ArrayList<>();
		}		
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(ids);
		String sql = restrictionsById  + idsAsString;		
		Query q = em.createNativeQuery(sql, RightRestrictionForQuery.class);
		setNoCacheHints(q);
		getLogger().info("Getting right restrictions for with ids " + ids);
		List<ErmProductRightRestriction> restrictions = toRestrictionList(q);
		//now get the strands
		List<Long> strandIds = IdsAccumulator.getIds(restrictions, new IdProvider<ErmProductRightRestriction>() {
			@Override
			public Long getId(ErmProductRightRestriction o) {
				return o.getRightStrandId();
			}			
		});
		if (restrictions.size()>0) {
			List<ErmProductRightStrand> strands = findStrandsOnly(strandIds);
			@SuppressWarnings("unchecked")
			Map<Long,ErmProductRightStrand> map = (Map<Long,ErmProductRightStrand>) StrandsUtil.toStrandsMap(strands);
			for (ErmProductRightRestriction restriction: restrictions) {
				restriction.setErmProductRightStrand(map.get(restriction.getRightStrandId()));
			}
		}
		
		return restrictions;
		
	}
	
	private List<ErmRightRestriction> findRestrictionsByIdsInBatch(List<Long> ids) {
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(ids);		
		String sql = restrictionForGridByIdSql + idsAsString;
		Query q = em.createNativeQuery(sql, ErmRightRestriction.class);		
		@SuppressWarnings("unchecked")
		List<ErmRightRestriction> restrictions =  q.getResultList();
		return restrictions;
	}
	
	public List<ErmRightRestriction> findRestrictionsOnlyById(List<Long> ids) {
		if (ids==null||ids.isEmpty()) {
			return new ArrayList<>();
		}
		List<ErmRightRestriction> allRestrictions = new ArrayList<>();
		if (ids.size()>IN_LIMIT) {
			List<List<Long>> subLists = Lists.partition(ids, 1000);
			for (List<Long> s: subLists) {
				List<ErmRightRestriction> restictions= findRestrictionsByIdsInBatch(s);
				allRestrictions.addAll(restictions);
			}

		} else {
			allRestrictions = findRestrictionsByIdsInBatch(ids);
		}
		return allRestrictions;
	}
	
	
	public List<ErmRightRestriction> findRestrictionsForGridByStrandIds(List<Long> ids) {
		if (ids ==null||ids.size()==0) {
			return new ArrayList<>();
		}
		getLogger().info("Getting right restrictions for right strand ids " + ids);		
		long t0 = System.currentTimeMillis();
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(ids);
		String sql = restrictionForGridBaseSql  + idsAsString;		
		Query q = em.createNativeQuery(sql, ErmRightRestriction.class);
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<ErmRightRestriction> restrictions = q.getResultList();
		long t1 = System.currentTimeMillis();
		getLogger().info("Done getting " + restrictions.size() + " restrictions in " + (t1-t0) + "ms");
		return restrictions;
		
	}


	
	private List<ErmProductRightRestriction> findRestrictionsByStrandIdsInBatch(List<Long> ids) {
		getLogger().info("Getting right restrictions for right strand ids " + ids);		
		long t0 = System.currentTimeMillis();
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(ids);
		String sql = restrictionBase  + idsAsString;		
		Query q = em.createNativeQuery(sql, RightRestrictionForQuery.class);
		setNoCacheHints(q);
		List<ErmProductRightRestriction> restrictions = toRestrictionList(q);
		long t1 = System.currentTimeMillis();
		getLogger().info("Done getting " + restrictions.size() + " restrictions in " + (t1-t0) + "ms");
		return restrictions;		
		
	}
	
	public List<ErmProductRightRestriction> findRestrictionsByStrandIds(List<Long> ids) {
		if (ids ==null||ids.size()==0) {
			return new ArrayList<>();
		}
		if (ids.size()<=JPA.IN_LIMIT) {
			return findRestrictionsByStrandIdsInBatch(ids);
		}
		List<ErmProductRightRestriction> all = new ArrayList<>();
		List<List<Long>> lists = Lists.partition(ids, JPA.IN_LIMIT);
		for (List<Long> l: lists) {
			List<ErmProductRightRestriction> strands = findRestrictionsByStrandIdsInBatch(l);
			all.addAll(strands);
		}
		return all;
	}
	
	
	private List<ErmRightRestriction> findRestrictionsForGrid(List<ErmRightStrand> strands) {
		List<Long> ids = IdsAccumulator.getIds(strands, new IdProvider<ErmRightStrand>(){

			@Override
			public Long getId(ErmRightStrand o) {
				return o.getRightStrandId();
			}
			
		});
		return findRestrictionsForGridByStrandIds(ids);				
	}
	
	private List<ErmProductRightRestriction> findRestrictions(List<ErmProductRightStrand> strands) {
		List<Long> ids = StrandsUtil.getStrandIds(strands); 
		return findRestrictionsByStrandIds(ids);		
	}
	
	private List<ErmProductRightRestriction> findRestrictions(Long foxVersionId) {
		long t0 = System.currentTimeMillis();
		Query q = em.createNativeQuery(restrictionSql, RightRestrictionForQuery.class);
		setNoCacheHints(q);
		q.setParameter(1, foxVersionId);
		getLogger().info("Getting right restrictions for " + foxVersionId);
		List<ErmProductRightRestriction> restriction = toRestrictionList(q);
		long t1 = System.currentTimeMillis();
		getLogger().info("Done getting " + restriction.size() + " restrictions in " + (t1-t0) + "ms");
		return restriction;
	}
	

	private Map<Long,List<ErmRightRestriction>> toMapByStrandIdForGrid(List<ErmRightRestriction> restrictions) {
		HashMap<Long,List<ErmRightRestriction>> map = new HashMap<>(restrictions==null?0:restrictions.size());
		for (ErmRightRestriction restriction:restrictions) {
			Long rightStrandId = restriction.getRightStrandId();
			if (!map.containsKey(rightStrandId)) {
				List<ErmRightRestriction> list = new ArrayList<>();
				list.add(restriction);
				map.put(rightStrandId, list);
			} else {
				map.get(rightStrandId).add(restriction);
			}
		}
		return map;
	}
	
	
	private Map<Long,List<ErmProductRightRestriction>> toMapByStrandId(List<ErmProductRightRestriction> restrictions) {
		HashMap<Long,List<ErmProductRightRestriction>> map = new HashMap<>(restrictions==null?0:restrictions.size());
		for (ErmProductRightRestriction restriction:restrictions) {
			Long rightStrandId = restriction.getRightStrandId();
			if (!map.containsKey(rightStrandId)) {
				List<ErmProductRightRestriction> list = new ArrayList<>();
				list.add(restriction);
				map.put(rightStrandId, list);
			} else {
				map.get(rightStrandId).add(restriction);
			}
		}
		return map;
	}
	
	private void setRestrictionsForGrid(List<ErmRightStrand> strands, List<ErmRightRestriction> restrictions,boolean isBusiness) {
		Map<Long,List<ErmRightRestriction>> map = toMapByStrandIdForGrid(restrictions);
		boolean loadHasComments = true;
		List<ErmRightRestriction> allRestrictions = new ArrayList<>();
		for (ErmRightStrand strand: strands) {
			Long rightStrandId = strand.getRightStrandId();
			List<ErmRightRestriction> strandRestrictions = map.get(rightStrandId);
			if (strandRestrictions!=null && ! strandRestrictions.isEmpty()) {
				allRestrictions.addAll(strandRestrictions);
			}
			strand.setErmProductRightRestrictions(strandRestrictions);
		}
		if (loadHasComments) {
			setErmRightRestrictionHasCommentsForGrid(allRestrictions,isBusiness);
		}
	}
	
	private void setRestricitons(List<ErmProductRightStrand> strands, List<ErmProductRightRestriction> restrictions) {
		Map<Long,List<ErmProductRightRestriction>> map = toMapByStrandId(restrictions);
		boolean loadHasComments = true;
		List<ErmProductRightRestriction> allRestrictions = new ArrayList<>();
		for (ErmProductRightStrand strand: strands) {
			Long rightStrandId = strand.getRightStrandId();
			List<ErmProductRightRestriction> strandRestrictions = map.get(rightStrandId);
			if (strandRestrictions!=null && ! strandRestrictions.isEmpty()) {
				allRestrictions.addAll(strandRestrictions);
			}
			strand.setErmProductRightRestrictions(strandRestrictions);
		}
		if (loadHasComments) {
			setErmProductRightRestrictionHasComments(allRestrictions);
		}
		
	}
	
	
	private void setErmRightRestrictionHasCommentsForGrid(List<ErmRightRestriction> restrictions,boolean isBusiness) {
		if (restrictions==null||restrictions.isEmpty()) {
			return;
		}
		getLogger().info("Getting hasComments for " + (restrictions==null?0:restrictions.size()) + " restrictions ");
		List<Long> ids = IdsAccumulator.getIds(restrictions, new IdProvider<ErmRightRestriction>() {

			@Override
			public Long getId(ErmRightRestriction o) {
				return o.getRightRestrictionId();
			}
			
		});
		List<EntityComment> entityComments = findErmRightRestrictionsEntityComments(ids);		
		
		
		Map<Long,ErmRightRestriction> restrictionMap = Maps.uniqueIndex(restrictions, new Function<ErmRightRestriction,Long>() {

				@Override
				public Long apply(ErmRightRestriction restriction) {
					return restriction.getRightRestrictionId();
				}
				
		});
		
		List<Long> commentIdsMappedToRestrictions = getCommentIdsWithEntityCommentType(com.fox.it.erm.enums.EntityCommentType.INFO_CODE.getId(), entityComments);
		Set<Long> commentIdsToBeRemoved = findNonVisibleComments(commentIdsMappedToRestrictions, isBusiness);			
		entityComments = removeCommentsIds(entityComments, commentIdsToBeRemoved);
		Map<Long,EntityCommentTypeHolder> commentTypesMap = getEntityCommentTypeMapById(entityComments);		
			
			for (ErmRightRestriction restriction: restrictionMap.values()) {
				Long restrictionId = restriction.getRightRestrictionId();
//				getLogger().info("ErmProductRightRestriction restrictions restrictionId " + restrictionId);
//				getLogger().info("ErmProductRightRestriction restrictions commentTypesMap.containsKey(restrictionId) " + commentTypesMap.containsKey(restrictionId));
				if (commentTypesMap.containsKey(restrictionId)) {
					EntityCommentTypeHolder commentTypesHolder = commentTypesMap.get(restrictionId);
					if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.CLEARANCE_MEMO_MAP.getId())) {
						restriction.setMappedToClearanceMemo(true);
					}
					if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.INFO_CODE.getId())) {
						restriction.setHasComments(true);
					}				
				}
			}

		getLogger().info("Done Getting hasComments for " + (restrictions==null?0:restrictions.size()) + " restrictions");

	}
	
	
	private void setErmProductRightRestrictionHasComments(List<ErmProductRightRestriction> restrictions) {
		getLogger().info("Getting hasComments for " + (restrictions==null?0:restrictions.size()) + " restrictions ");
		if (restrictions != null) {
			List<Long> ids = StrandsUtil.getErmProductRightRestrictionIds(restrictions);
			Map<Long,ErmProductRightRestriction> restrictionMap = StrandsUtil.toErmProductRightRestrictionMap(restrictions);
			Map<Long,EntityCommentTypeHolder> commentTypesMap = findErmProuductRightRestrictionCommentTypes(ids);			
			for (ErmProductRightRestriction restriction: restrictionMap.values()) {
				Long restrictionId = restriction.getRightRestrictionId();
//				getLogger().info("ErmProductRightRestriction restrictions restrictionId " + restrictionId);
//				getLogger().info("ErmProductRightRestriction restrictions commentTypesMap.containsKey(restrictionId) " + commentTypesMap.containsKey(restrictionId));
				if (commentTypesMap.containsKey(restrictionId)) {
					EntityCommentTypeHolder commentTypesHolder = commentTypesMap.get(restrictionId);
					if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.CLEARANCE_MEMO_MAP.getId())) {
						restriction.getRestriction().setMappedToClearanceMemo(true);
					}
					if (commentTypesHolder.contains(com.fox.it.erm.enums.EntityCommentType.INFO_CODE.getId())) {
						restriction.getRestriction().setHasComments(true);
					}				
				}
			}
		}
		getLogger().info("Done Getting hasComments for " + (restrictions==null?0:restrictions.size()) + " restrictions");

	}

	
	public List<ErmProductRightStrand> findByIds(List<Long> ids) {
		List<ErmProductRightStrand> strands = findStrandsOnly(ids);
		List<ErmProductRightRestriction> restrictions = null;
		restrictions=findRestrictions(strands);
		setRestricitons(strands, restrictions);
		return strands;		
	}
	
	public List<ErmProductRightStrand> findStrandsOny(Long foxVersionId, boolean isBusiness) {
		String sql = strandsSql;
		String businessPredicate = getIsBusinessPredicate(isBusiness);
		sql += " and " + businessPredicate; 
		Query q = em.createNativeQuery(sql,RightStrandForQuery.class);
		setNoCacheHints(q);
		q.setParameter(1, foxVersionId);
		@SuppressWarnings(value = "unchecked")
		List<RightStrandForQuery> strands = q.getResultList();
		StrandToRightStrandConverter converter = new StrandToRightStrandConverter();
		List<ErmProductRightStrand> rightStrands = new ArrayList<>(strands.size());
		for (RightStrandForQuery s: strands) {
			rightStrands.add(converter.convert(s));
		}
		return rightStrands;
	}
	
	/**
	 * Fetches the right strands in 2 passes. 
	 * In the first pass it gets all the right strands with Media, Territory, Language and Strand Set
	 * In the second pass it will fetch all the restrictions
	 * Then both results are joined together
	 * @param foxVersionId
	 * @return
	 */
	public List<ErmProductRightStrand> findByProductVersionId(Long foxVersionId) {
		List<ErmProductRightStrand> strands = findStrandsOnly(foxVersionId);
		List<ErmProductRightRestriction> restrictions = null;
		if (strands.size()>=IN_LIMIT) {
			restrictions=findRestrictions(foxVersionId);
		} else {
			restrictions=findRestrictions(strands);
		}
		setRestricitons(strands, restrictions);
		return strands;		
	}
	
	public List<ErmRightStrand> findRightStrandsForGrid(Long foxVersionId,boolean isBusiness) {
		List<ErmRightStrand> strands = findStrandsOnlyForGrid(foxVersionId);
		List<ErmRightRestriction> restrictionsForGrid = null;		
		if (strands.size()>=1000) {
			restrictionsForGrid = findRestrictionsForGrid(foxVersionId);
			
		} else {
			restrictionsForGrid= findRestrictionsForGrid(strands);
		}
		setRestrictionsForGrid(strands, restrictionsForGrid,isBusiness);
		return strands;		
		
	}
	
	private List<ErmRightRestriction> findRestrictionsForGrid(Long foxVersionId) {
		long t0 = System.currentTimeMillis();
		Query q = em.createNativeQuery(restrictionForGridSql,ErmRightRestriction.class);
		setNoCacheHints(q);
		q.setHint("eclipselink.JDBC_FETCH_SIZE", "3000");
		q.setParameter(1, foxVersionId);
		getLogger().info("Getting right restrictions for " + foxVersionId);
		@SuppressWarnings("unchecked")
		List<ErmRightRestriction> restrictions = q.getResultList();
		//make sure we iterate through the restrictions
		long t1 = System.currentTimeMillis();
		getLogger().info("Done getting " + restrictions.size() + " restrictions in " + (t1-t0) + "ms");
		return restrictions;
	}
	
	
	private List<EntityComment> findRightStrandsEntityCommentsInBatch(List<Long> ids) {
		String sql = strandsCommentsSqlBase + IdsUtil.getIdsAsListInParenthesis(ids);
		Query q = em.createNativeQuery(sql, EntityComment.class);
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<EntityComment> entityComments = q.getResultList();
		return entityComments;
	}
	
	private List<EntityComment> findRestrictionsEntityCommentsInBatch(List<Long> ids) {
		String sql = restrictionsCommentsSqlBase + IdsUtil.getIdsAsListInParenthesis(ids);
		Query q = em.createNativeQuery(sql, EntityComment.class);
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<EntityComment> entityComments = q.getResultList();
		return entityComments;
	}	

	private List<EntityComment> toEntityComments(List<EntityCommentOnly> entityCommentsOnly) {
		List<EntityComment> entityComments = new ArrayList<>();
		for (EntityCommentOnly eco: entityCommentsOnly) {
			EntityComment ec = new EntityComment();
			ec.copyFrom(eco);
			entityComments.add(ec);
		}
		return entityComments;
	}
	
	private List<EntityComment> findErmRightRestrictionsEntityCommentsInBatch(List<Long> ids) {
		String sql = strandRestrictionsCommentsSqlBase + IdsUtil.getIdsAsListInParenthesis(ids);
		Query q = em.createNativeQuery(sql, EntityCommentOnly.class);
		setNoCacheHints(q);
		@SuppressWarnings("unchecked")
		List<EntityCommentOnly> entityCommentsOnly = q.getResultList();
		List<EntityComment> entityComments = toEntityComments(entityCommentsOnly);
		
		
		return entityComments;
	}	
	
	
	public Map<Long,EntityCommentTypeHolder> findRestrictionCommentTypes(List<Long> ids) {
		List<EntityComment> allEntityComments = new ArrayList<>();
		Map<Long,EntityCommentTypeHolder> map = new HashMap<>();
		if (ids==null||ids.isEmpty()) return map;
		
		if (ids.size()>IN_LIMIT) {
			//if the size of the array is larger that 1000 we need to split it in chunks of 1000 due to maximum number of ids that can exist in an in statement
			List<List<Long>> subLists = Lists.partition(ids, 1000);
			for (List<Long> s: subLists) {				
				List<EntityComment> entityComments = findRestrictionsEntityCommentsInBatch(s);
				allEntityComments.addAll(entityComments);
			}
		} else {
			allEntityComments = findRestrictionsEntityCommentsInBatch(ids);
		}
		for (EntityComment entityComment: allEntityComments) {
			Long restrictionId = entityComment.getEntityId();
			Long entityCommentTypeId = entityComment.getEntityCommentTypeId();
			EntityCommentTypeHolder entityCommentTypeHolder = null;
			if (!map.containsKey(restrictionId)) {
				entityCommentTypeHolder  = new EntityCommentTypeHolder();
				map.put(restrictionId, entityCommentTypeHolder);
			} else {
				entityCommentTypeHolder = map.get(restrictionId);
			}
			entityCommentTypeHolder.add(entityCommentTypeId);
		}
		return map;		
	}
	
	private List<EntityComment> findErmRightRestrictionsEntityComments(List<Long> ids) {
		List<EntityComment> allEntityComments = new ArrayList<>();
		if (ids==null||ids.isEmpty()) return allEntityComments;
		if (ids.size()>IN_LIMIT) {
			//if the size of the array is larger that 1000 we need to split it in chunks of 1000 due to maximum number of ids that can exist in an in statement
			List<List<Long>> subLists = Lists.partition(ids, 1000);
			for (List<Long> s: subLists) {				
				List<EntityComment> entityComments = findErmRightRestrictionsEntityCommentsInBatch(s);
				allEntityComments.addAll(entityComments);
			}
		} else {
			allEntityComments = findErmRightRestrictionsEntityCommentsInBatch(ids);
		}
		return allEntityComments;
		
		
	}
	
	public Map<Long,EntityCommentTypeHolder> findErmProuductRightRestrictionCommentTypes(List<Long> ids) {
		List<EntityComment> allEntityComments = new ArrayList<>();
		Map<Long,EntityCommentTypeHolder> map = new HashMap<>();
		if (ids==null||ids.isEmpty()) return map;
		allEntityComments = findErmRightRestrictionsEntityComments(ids);
		for (EntityComment entityComment: allEntityComments) {
			Long restrictionId = entityComment.getEntityId();
			Long entityCommentTypeId = entityComment.getEntityCommentTypeId();
			EntityCommentTypeHolder entityCommentTypeHolder = null;
			if (!map.containsKey(restrictionId)) {
				entityCommentTypeHolder  = new EntityCommentTypeHolder();
				map.put(restrictionId, entityCommentTypeHolder);
			} else {
				entityCommentTypeHolder = map.get(restrictionId);
			}
			entityCommentTypeHolder.add(entityCommentTypeId);
		}
		return map;		
	}
	
	
	public List<EntityComment> findStrandsEntityComments(List<Long> ids) {
		List<EntityComment> allEntityComments = new ArrayList<>();
		if (ids==null||ids.isEmpty()) return allEntityComments;
		if (ids.size()>IN_LIMIT) {
			//if the size of the array is larger that 1000 we need to split it in chunks of 1000 due to maximum number of ids that can exist in an in statement
			List<List<Long>> subLists = Lists.partition(ids, 1000);
			for (List<Long> s: subLists) {				
				List<EntityComment> entityComments = findRightStrandsEntityCommentsInBatch(s);
				allEntityComments.addAll(entityComments);
			}
		} else {
			allEntityComments = findRightStrandsEntityCommentsInBatch(ids);
		}
		return allEntityComments;
	}

	public Map<Long,EntityCommentTypeHolder> getEntityCommentTypeMapById(List<EntityComment> allEntityComments) {
		Map<Long,EntityCommentTypeHolder> map = new HashMap<>();
		for (EntityComment entityComment: allEntityComments) {
			Long rightStrandId = entityComment.getEntityId();
			Long entityCommentTypeId = entityComment.getEntityCommentTypeId();
			EntityCommentTypeHolder entityCommentTypeHolder = null;
			if (!map.containsKey(rightStrandId)) {
				entityCommentTypeHolder  = new EntityCommentTypeHolder();
				map.put(rightStrandId, entityCommentTypeHolder);
			} else {
				entityCommentTypeHolder = map.get(rightStrandId);
			}
			entityCommentTypeHolder.add(entityCommentTypeId);
		}
		return map;
		
	}
	
	public Map<Long,EntityCommentTypeHolder> findRightStrandCommentTypes(List<Long> ids) {
		Map<Long,EntityCommentTypeHolder> map = new HashMap<>();		
		if (ids==null||ids.isEmpty()) return map;
		List<EntityComment> allEntityComments = findStrandsEntityComments(ids);		
		
		for (EntityComment entityComment: allEntityComments) {
			Long rightStrandId = entityComment.getEntityId();
			Long entityCommentTypeId = entityComment.getEntityCommentTypeId();
			EntityCommentTypeHolder entityCommentTypeHolder = null;
			if (!map.containsKey(rightStrandId)) {
				entityCommentTypeHolder  = new EntityCommentTypeHolder();
				map.put(rightStrandId, entityCommentTypeHolder);
			} else {
				entityCommentTypeHolder = map.get(rightStrandId);
			}
			entityCommentTypeHolder.add(entityCommentTypeId);
		}
		return map;
		
	}
	
	private Set<Long> findNonVisibleCommentsInBatch(List<Long> commentIds,boolean isBusiness) {
		String idsAsString = IdsUtil.getIdsAsListInParenthesis(commentIds);
		String sql = "Select cmnt_id from cmnt where cmnt_id in " +  idsAsString +" and pub_ind = 0  and ";
		Set<Long> set = new HashSet<>();
		if (commentIds==null||commentIds.size()==0) return set;
		String businessLegalClause = null;
		if (isBusiness) {
			businessLegalClause = "bsns_ind=0";
		} else {
			businessLegalClause = "lgl_ind=0";
		}
		sql += businessLegalClause;
		Query q = em.createNativeQuery(sql);
		@SuppressWarnings("unchecked")
		List<Long> ids = q.getResultList();
		//note the ids are returned as big decimals, so we need to convert them
		for (Number id: ids) {
			set.add(new Long(id.longValue()));
		}

		return set;
	}
	
	public List<Long> getCommentIdsWithEntityCommentType(Long commentTypeId,List<EntityComment> entityComments) {
		List<Long> commentIds = new ArrayList<>();
		for (EntityComment ec: entityComments) {
			if (commentTypeId.equals(ec.getEntityCommentTypeId())) {
				commentIds.add(ec.getCommentId());
			}
		}
		return commentIds;
	}
	
	public List<EntityComment> removeCommentsIds(List<EntityComment> entityComments,final Set<Long> commentIdsToBeRemoved) {
		Predicate<EntityComment> predicate = new Predicate<EntityComment>() {

			@Override
			public boolean apply(EntityComment ec) {
				Long commentId = ec.getCommentId();
				Long cId = new Long(commentId.longValue());
				boolean shouldBeRemoved =  commentIdsToBeRemoved.contains(cId);
				return !shouldBeRemoved;
			}
			
		};
		List<EntityComment> removed = new ArrayList<>();
		Collection<EntityComment> filtered = Collections2.filter(entityComments, predicate); 
		removed.addAll(filtered);
		return removed;
	}
	
	
	
	/**
	 * Returns all the comments that are not visible by the user type. ie if the user is business and there's a legal comment that's private add that to the non visible list
	 * @param commentIds
	 * @return
	 */
	public Set<Long> findNonVisibleComments(List<Long> commentIds,boolean isBusiness) {
		if (commentIds==null||commentIds.isEmpty()) return new HashSet<>();
		if (commentIds.size()<=JPA.IN_LIMIT) return findNonVisibleCommentsInBatch(commentIds, isBusiness);
		
		Set<Long> all = new HashSet<>();
		List<List<Long>> lists = Lists.partition(commentIds, JPA.IN_LIMIT);
		for (List<Long> l: lists) {
			Set<Long> ids = findNonVisibleCommentsInBatch(l, isBusiness);
			all.addAll(ids);
		}
		return all;
	}
	
}
	