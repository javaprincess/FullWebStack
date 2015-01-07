package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.util.IdsAccumulator;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandUpdateObject;

/**
 * Updates a single right strand with the content of the RightStrandUpdateObject
 * @author AndreasM
 *
 */
public class RightStrandUpdateProcessor extends RightStrandUpdateProcessorBase{
	
	class MTLChanged {
		public MTLChanged() {
		}
		boolean changed = false;
	}

	private final EntityManager em;
	
	
	
	@Inject
	public RightStrandUpdateProcessor(EntityManager em) {
		this.em=em;
	}

	
	private boolean processInclusionExclusion(ErmProductRightStrand strand, RightStrandUpdateObject update, boolean isBusiness) {
		boolean changed = false;
		if (update.isExclusion() && !strand.isExclusion()) {
			strand.setExcludeFlag(Boolean.TRUE);
			//We remove all restrictions if any since this is becoming a exclusion strand
			List<ErmProductRightRestriction> restrictions = strand.getErmProductRightRestrictions();
			
			//We use a CopyOnWriteArrayList to avoid possible concurrent modification exceptions
			CopyOnWriteArrayList<ErmProductRightRestriction> list = new CopyOnWriteArrayList<ErmProductRightRestriction>();
			list.addAll(restrictions);
			if(restrictions != null && restrictions.size() > 0){
				removeRestrictionsFromStrand(strand, list, isBusiness);
			}
		}
		if (update.isInclusion() && !strand.isInclusion()) {
			strand.setExcludeFlag(Boolean.FALSE);
		}
		
		return changed;
		
	}
	
	private ErmProductRightRestriction getRestriction(ErmProductRightStrand rightStrand, Long restrictionCodeId) {
		for (ErmProductRightRestriction restriction: rightStrand.getErmProductRightRestrictions()) {
			if (restrictionCodeId.equals(restriction.getRestrictionCdId())) {
				return restriction;
			}
		}
		return null;
	}
	
	
	
	private void addOrUpdateRestrictionsForSingleStrand(ErmProductRightStrand strand,List<RestrictionObject> restrictions,String userId,boolean isBusiness) {
		for (RestrictionObject restriction: restrictions) {
			//check if the restriction is already present.
			//if it is, update otherwise add
			ErmProductRightRestriction existing = getRestriction(strand, restriction.getRestrictionCodeId());
			ErmProductRightRestriction rightRestriction = getRestrictionConverter().convert(restriction);
			setUpdatedBy(rightRestriction, new Date(), userId, true, true);
			if (existing==null) {
				this.setBusinessLegalIndicator(rightRestriction, isBusiness);
				rightRestriction.setErmProductRightStrand(strand);
				strand.getErmProductRightRestrictions().add(rightRestriction);
			} else {
				mergeRestriction(strand,existing,rightRestriction,restriction,userId,isBusiness);
			}
		}		
	}
	
	
	private void unlink(ErmProductRightRestriction restriction, boolean isBusiness) {
		if (isBusiness) {
			restriction.setBusinessInd(null);
		} else {
			restriction.setLegalInd(null);
		}
	}
	
	private void mergeRestriction(ErmProductRightStrand strand,ErmProductRightRestriction existing,ErmProductRightRestriction restriction, RestrictionObject restrictionObject,String userId,boolean isBusiness) {
		if (existing.isShared()) {
			//unlink the strand
			unlink(restriction, isBusiness);
			//add a new strand
			strand.getErmProductRightRestrictions().add(restriction);
		} else {
			mergeRestriction(existing, restriction,restrictionObject, userId);
		}
	}

	
	private void addRestrictions(ErmProductRightStrand strand,List<RestrictionObject> restrictions, String userId,boolean isBusiness) {
		RightRestrictionComparator comparator = new RightRestrictionComparator();
		Date date = new Date();
		for (RestrictionObject restriction: restrictions) {
			//check if the restriction is already present.
			//if it is, update otherwise add
			ErmProductRightRestriction existing = getRestriction(strand, restriction.getRestrictionCodeId());
			ErmProductRightRestriction rightRestriction = getRestrictionConverter().convert(restriction);
			setUpdatedBy(rightRestriction, date, userId, true, true);
			setBusinessLegalIndicator(rightRestriction, isBusiness);
			if (!(existing!=null&&comparator.equal(existing,rightRestriction))) {
				rightRestriction.setErmProductRightStrand(strand);
				strand.getErmProductRightRestrictions().add(rightRestriction);
			}
		}		
	}
	
	private void removeFromList(List<ErmProductRightRestriction> restrictions,ErmProductRightRestriction restriction) {
		restrictions.remove(restriction);
	}
	
	private void removeRestrictionsFromStrand(ErmProductRightStrand strand, List<ErmProductRightRestriction> restrictions,boolean isBusiness) {
		//if is shared unlink
		List<ErmProductRightRestriction> strandRestrictions = strand.getErmProductRightRestrictions();
		for (ErmProductRightRestriction restriction: restrictions) {
			if (restriction.isShared()) {
				unlink(restriction, isBusiness);
			} else {
				em.remove(restriction);
				removeFromList(strandRestrictions, restriction);
			}
		}
		
	}
	
	private void removeRestrictions(ErmProductRightStrand strand,List<RestrictionObject> restrictions,boolean isBusiness) {
		if (restrictions==null||restrictions.size()==0) return;
		Set<Long> ids = getCodeIds(restrictions);
		List<ErmProductRightRestriction> restrictionsToRemove = new ArrayList<>();
		for (ErmProductRightRestriction restriction: strand.getErmProductRightRestrictions()) {
			Long restrictionCodeId = restriction.getRestrictionCdId();
			if (ids.contains(restrictionCodeId)) {
				restrictionsToRemove.add(restriction);
			}
		}
		removeRestrictionsFromStrand(strand,restrictionsToRemove,isBusiness);
	}
	
	private void removeRestrictionsNotPresentInUpdate(ErmProductRightStrand strand, RightStrandUpdateObject update,boolean isBusiness) {
		Set<Long> restrictionCodesInUpdateObject = IdsAccumulator.getIdsSet(update.getRestrictionsToAdd(), new IdProvider<RestrictionObject>() {

			@Override
			public Long getId(RestrictionObject o) {
				return o.getRestrictionCodeId();
			}
			
		});
		List<ErmProductRightRestriction> restrictionsToRemove = new ArrayList<>();
		for (ErmProductRightRestriction restriction: strand.getErmProductRightRestrictions()) {
			Long restrictionCodeId = restriction.getRestrictionCdId();
			if (!restrictionCodesInUpdateObject.contains(restrictionCodeId)) {
				restrictionsToRemove.add(restriction);
			}
		}
		removeRestrictionsFromStrand(strand, restrictionsToRemove,isBusiness);
	}
	
	
	/**
	 * Update the restrictions for a single strand update
	 * Update the content on new restrictions. 
	 * Delete any restrictions that are not present in the update object
	 * @param strand
	 * @param update
	 */
	private void mergeRestrictions(ErmProductRightStrand strand, RightStrandUpdateObject update,String userId,boolean isBusiness) {
		removeRestrictionsNotPresentInUpdate(strand, update,isBusiness);
		addOrUpdateRestrictionsForSingleStrand(strand, update.getRestrictionsToAdd(),userId,isBusiness);
		
	}
	
	public ErmProductRightStrand update(ErmProductRightStrand strand, RightStrandUpdateObject update,String userId,boolean isBusiness,MTLChanged mtlChanged) throws Exception{
		boolean isSingleStrandUpdate = update.isSinlgeStrandUpdate();
		boolean changed = false;
		changed = processDates(strand, update)||changed;
		changed = processInclusionExclusion(strand,update, isBusiness)||changed;
		boolean isMtlChanged = processMTL(strand, update);
		changed= changed||isMtlChanged;
		if (isMtlChanged) {
			mtlChanged.changed=true;
		}
		
		changed = processStrandSet(strand,update)||changed;
		setUpdatedBy(strand, new Date(), userId, false, true);
		//if is single strand update
		//we need to update the existing restrictions
		//also if there are restrictions that are in the strand but not present in the update object
		//we need to remove them
		if (isSingleStrandUpdate) {
			mergeRestrictions(strand, update,userId,isBusiness);
		} else 	if (update.getRestrictionsToAdd()!=null&&update.getRestrictionsToAdd().size()>0) {
			addRestrictions(strand,update.getRestrictionsToAdd(),userId,isBusiness);
		}
		
		if (update.getRestrictionsToRemove()!=null&&update.getRestrictionsToRemove().size()>0) {
			removeRestrictions(strand,update.getRestrictionsToRemove(),isBusiness);
		}
				
		ErmProductRightStrand merged = em.merge(strand);
		return merged;
	}

	/**
	 * 
	 * @param strands
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	public List<ErmProductRightStrand> adoptRightStrand(List<ErmProductRightStrand> strands, String userId, boolean isBusiness){
		List<ErmProductRightStrand> adopted = new ArrayList<>();
		
		if(strands != null && strands.size() > 0){
			
			Calendar c = Calendar.getInstance();
			
			for(ErmProductRightStrand r : strands){				
				if(isBusiness){
					r.setBusinessInd(true);						
				}
				else {
					r.setLegalInd(true);
				}	
				r.setUpdateDate(c.getTime());
				r.setUpdateName(userId);
				
				
				adopted.add(r);
			}
		}
		
		return adopted;
	}

	/**
	 * 
	 * @param restrictions
	 * @param userId
	 * @param isBusiness
	 * @return
	 */
	public List<ErmProductRightRestriction> adoptRestrictions(List<ErmProductRightRestriction> restrictions, String userId, boolean isBusiness){
		
		List<ErmProductRightRestriction> ermRestrictions = new ArrayList<ErmProductRightRestriction>();
		
		if(restrictions != null && restrictions.size() > 0){
			
			Calendar c = Calendar.getInstance();
			for(ErmProductRightRestriction e : restrictions){
				if(isBusiness){
					e.setBusinessInd(true);
				}
				else {
					e.setLegalInd(true);
				}
				e.setUpdateDate(c.getTime());
				e.setUpdateName(userId);
				
				ermRestrictions.add(em.merge(e));
			}
		}
		return ermRestrictions;
	}

}
