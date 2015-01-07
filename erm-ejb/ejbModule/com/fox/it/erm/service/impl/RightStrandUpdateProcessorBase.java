package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import com.fox.it.erm.ErmProductRestrictionBase;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmUpdatable;
import com.fox.it.erm.RightStrandBase;
import com.fox.it.erm.util.DateUtil;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandUpdateObject;


public class RightStrandUpdateProcessorBase {
	private final RestrictionObjectToRightRestrictionConverter restrictionConverter = new RestrictionObjectToRightRestrictionConverter();	
	private static final Logger logger = Logger.getLogger(RightStrandUpdateProcessorBase.class.getName());

	
	private Logger getLogger() {
		return logger;
	}
	
	public static boolean isValueDate(Long value) {
		return value!=null;
	}
	
	public static boolean isValue(Long value) {	
		//This part of the code caused a problem with date older than
		//January 1st 1970, since they have a negative value, so commented out
		//the code that check for a positive value.
		//FOR DATES use isValueDate
		return value!=null&&value.longValue()>0;
	}
	
	public static boolean isValueCode(Long value) {	
		return value!=null && value.longValue()>0;
	}
	
	protected RestrictionObjectToRightRestrictionConverter getRestrictionConverter() {
		return restrictionConverter;
	}
	
		
	private boolean isSame(Date d1,Date d2) {
		return DateUtil.isSameDate(d1, d2);
	}
	
	private boolean isSameCode(Long l1,Long l2) {
		if (l1==l2) return true;
		if (l1==null&&l2!=null) return false;
		if (l2==null&&l1!=null) return false;
		return l1.equals(l2);
	}
	

	protected boolean processDates(RightStrandBase strand, RightStrandUpdateObject update) {
		boolean changed =false;
		if(update.isExclusion() && !strand.isExclusion()){
			processExclusionStrandDate(strand);
			changed = true;
		}
		else {

			if (update.isChageStartDate()) {
				Date date = toDate(update.getStartContractualDate());
				if (!isSame(date,strand.getContractualStartDate())) {
					strand.setContractualStartDate(date);
					strand.setContractualStartDateCodeId(null);
					changed=true;
				}
			}
			if (update.isChangeEndDate()) {
				Date date = toDate(update.getEndContractualDate());
				if (!isSame(date,strand.getContractualEndDate())) {
					strand.setContractualEndDate(date);
					strand.setContractualEndDateCodeId(null);
					changed=true;
				}
			}
			
			if(update.isChangeOverrideStartDate()){
				Date date = toDate(update.getStartOverrideDate());
				if (!isSame(date,strand.getOverrideStartDate())) {
					strand.setOverrideStartDate(date);
//					strand.setContractualStartDateCodeId(null);
					changed=true;
				}
			}
//			else {
//				strand.setOverrideStartDate(null);
//				changed=true;
//			}
		
			if(update.isChangeOverrideEndDate()){
				Date date = toDate(update.getEndOverrideDate());
				if (!isSame(date,strand.getOverrideEndDate())) {					
					strand.setOverrideEndDate(date);
//					strand.setContractualEndDateCodeId(null);
					changed=true;
				}
			}
//			else {
//				strand.setOverrideEndDate(null);
//				changed=true;
//			}
			
					
			if (isValueCode(update.getStartDateCode())) {
				if (!isSameCode(update.getStartDateCode(),strand.getContractualStartDateCodeId())) {
					strand.setContractualStartDateCodeId(update.getStartDateCode());
					strand.setContractualStartDate(null);
					changed=true;			
				}
			}
			
			if (isValueCode(update.getEndDateCode())) {
				if (!isSameCode(update.getEndDateCode(),strand.getEndDateCodeId())) {
					strand.setContractualEndDateCodeId(update.getEndDateCode());
					strand.setContractualEndDate(null);
					changed=true;
				}
			}
			if (isValueCode(update.getStartDateStatus())) {
				if (!isSameCode(update.getStartDateStatus(),strand.getContractualStartDateStatusId())) {
					strand.setContractualStartDateStatusId(update.getStartDateStatus());
					changed=true;
				}
			}
			
			if (isValueCode(update.getEndDateStatus())) {
				if (!isSameCode(update.getEndDateStatus(),strand.getContractualEndDateStatusId())) {
					strand.setContractualEndDateStatusId(update.getEndDateStatus());
					changed=true;
				}
			}

			
		}
		return changed;
		
	}	
	

	/**
	 * Set all the date to null in case where a right strand is changed from an inclusion strand
	 * to an exclusion strand
	 * @param strand
	 */
	protected void processExclusionStrandDate(RightStrandBase strand) {
		if(strand != null){
			strand.setContractualStartDate(null);
			strand.setContractualStartDateCodeId(null);
			strand.setContractualStartDateExprInstncId(null);
			strand.setContractualStartDateStatusId(null);
			strand.setStartDate(null);
			strand.setStartDateCodeId(null);
			strand.setReleaseDate(null);
			strand.setOverrideStartDate(null);
			
			strand.setContractualEndDate(null);
			strand.setContractualEndDateCodeId(null);
			strand.setContractualEndDateExprInstncId(null);
			strand.setContractualEndDateStatusId(null);
			strand.setEndDate(null);
			strand.setEndDateCodeId(null);
			strand.setOverrideEndDate(null);
		}
	}

	private Date toDate(Long value) {
		if (value==null) return null;
		return new Date(value.longValue());
	}

	protected boolean processMTL(RightStrandBase strand, RightStrandUpdateObject update) {
		boolean changed = false;
		Long mediaId = update.getMediaId();
		Long territoryId = update.getTerritoryId();
		Long languageId = update.getLanguageId();
		if (mediaId!=null) {
			if (!isSameCode(mediaId, strand.getMediaId())) {
				strand.setMediaId(mediaId);
				changed=true;
			}
		}
		if (territoryId!=null) {
			if (!isSameCode(territoryId,strand.getTerritoryId())) {
				strand.setTerritoryId(territoryId);
				changed=true;
			}
		}
		if (languageId!=null) {
			if (!isSameCode(languageId,strand.getLanguageId())) {
				strand.setLanguageId(languageId);
				changed=true;
			}
		}
		return changed;
		
	}

	protected boolean processStrandSet(RightStrandBase strand, RightStrandUpdateObject update) {
		boolean changed = false;
		if (isValue(update.getStrandSetId())) {
			if (!isSameCode(update.getStrandSetId(), strand.getStrandSetId())) {
				strand.setStrandSetId(update.getStrandSetId());
				changed = true;
			}
		} else if (isDelete(update.getStrandSetId())) {
			if (strand.getStrandSetId()!=null) {
				strand.setStrandSetId(null);
				changed = true;
			}
		}
		return changed;
	}

	private boolean isDelete(Long value) {
		return value!=null&&value.longValue()<0;
	}

	protected void setUpdatedBy(ErmUpdatable updatable, Date date, String userId,
			boolean create, boolean update) {
				if (create) {
					updatable.setCreateDate(date);
					updatable.setCreateName(userId);
					update =true;
				}
				
				if (update) {
					updatable.setUpdateDate(date);
					updatable.setUpdateName(userId);
				}
			}

	protected void setBusinessLegalIndicator(ErmUpdatable updatable, boolean isBusiness) {
		if (isBusiness) {
			updatable.setBusinessInd(true);
			updatable.setLegalInd(false);
		} else {
			updatable.setBusinessInd(false);
			updatable.setLegalInd(true);			
		}
	}

	protected Set<Long> getCodeIds(List<RestrictionObject> restrictions) {
		return IdsAccumulator.getIdsSet(restrictions, new IdProvider<RestrictionObject>(){
	
			@Override
			public Long getId(RestrictionObject o) {
				return o.getRestrictionCodeId();
			}
			
		});
	}

	private boolean isSame(ErmProductRestrictionBase r1, ErmProductRestrictionBase r2,RestrictionObject update) {
		if (!isSameCode(r1.getRestrictionCdId(),r2.getRestrictionCdId())) return false;

		if (update.startDateChanged()) {		
			if (!isSame(r1.getStartDate(),r2.getStartDate())) return false;
			if (!isSameCode(r1.getStartDateCdId(),r2.getStartDateCdId())) return false;
			if (!isSameCode(r1.getStartDateExprInstncId(),r2.getStartDateExprInstncId())) return false;			
		}

		if (update.endDateChanged()) {
			if (!isSame(r1.getEndDate(),r2.getEndDate())) return false;
			if (!isSameCode(r1.getEndDateCdId(),r2.getEndDateCdId())) return false;
			if (!isSameCode(r1.getEndDateExprInstncId(),r2.getEndDateExprInstncId())) return false;			
		}
		return true;
	}
	
	/**
	 * 
	 * @param existing
	 * @param restriction
	 * @param userId
	 * @return True if the restriction changed, false otherwise
	 */
	protected boolean mergeRestriction(ErmProductRestrictionBase existing, ErmProductRightRestriction restriction,RestrictionObject update, String userId) {

		if (isSame(existing, restriction,update)) {
			getLogger().info("Strand info code with code: " + existing.getRestrictionCdId() + " did not change, no action will be performed");
			return false;
		}

		if (restriction.getRestrictionCdId()!=null && restriction.getRestrictionCdId().intValue()>0) {
			existing.setRestrictionCdId(restriction.getRestrictionCdId());
		}

		if (update.getChangeStartDate()!=null && update.getChangeStartDate().booleanValue()) {
			//TODO	compare values
			existing.setStartDate(restriction.getStartDate());
			existing.setStartDateCdId(restriction.getStartDateCdId());
			existing.setStartDateExprInstncId(restriction.getStartDateExprInstncId());
		}

		
		if (update.getChangeEndDate()!=null && update.getChangeEndDate().booleanValue()) {
			//TODO	compare values			
			existing.setEndDateCdId(restriction.getEndDateCdId());
			existing.setEndDateExprInstncId(restriction.getEndDateExprInstncId());
			existing.setEndDate(restriction.getEndDate());
		}
		
		setUpdatedBy(existing, new Date(), userId, false, true);
		return true;
	}

}
