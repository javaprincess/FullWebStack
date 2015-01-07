package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.DBOperation;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmUpdatable;
import com.fox.it.erm.RightStrandRestrictionSave;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.service.RightStrandSaveHandler;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.util.DateUtil;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandUpdateObject;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class RightStrandTempTableSaveHandler extends TempTableSaveHandlerBase implements RightStrandSaveHandler {

	
	@Inject
	public RightStrandTempTableSaveHandler(EntityManager em,CommentsService commentsService) {
		super(em,commentsService);
	}
	
	private List<Long> createRightRestrictionSaveObjects(List<RightStrandRestrictionSave> saveObjects) {
		List<Long> ids = new ArrayList<>();
		EntityManager em = getEntityManager();
		for (RightStrandRestrictionSave s: saveObjects) {
			em.persist(s);
			em.flush();
			ids.add(s.getRightRestrictionId());
		}
//		em.flush();
		return ids;
	}
	
	
	public void createRightRestrictions(List<ErmProductRightRestriction> restrictions) {
		List<RightStrandRestrictionSave> save = getRightStrandRestrictionSaveObjects(restrictions);
		setOperation(save,DBOperation.INSERT);
	}
	
	private void setOperatioInStrands(List<RightStrandSave> strands,DBOperation operation) {
		for (RightStrandSave s: strands) {
			setOperation(s, operation);
			for (RightStrandRestrictionSave r : s.getRightRestrictions()) {
				setOperation(r, operation);
			}
		}
	}
	
	@Override
	public List<RightStrandSave> create(List<ErmProductRightStrand> strands) {
		boolean updateRestrictions = false;		
		List<RightStrandSave> save = getRightStrandSaveObjects(strands,true);
		for (RightStrandSave s:save) {
			if (s.getRightRestrictions()!=null && s.getRightRestrictions().size()>0) {
				updateRestrictions=true;
				break;
			}
		}
		setOperatioInStrands(save, DBOperation.INSERT); 
		save = createSaveObjects(save);
//		List<Long> ids = getIds(save);
		setUpdateRightStrands();
		if (updateRestrictions) {
			setUpdateRestrictions();
		}
		return save;
	}
	
	private void setReleaseDate(List<RightStrandSave> strands, Date releaseDate) {
		for (RightStrandSave s: strands) {
			if (s.isInclusion()) {
				s.setReleaseDate(releaseDate);
			} else {
				s.setReleaseDate(null);
			}
		}
	}

	private List<RightStrandSave> processUpdate(List<RightStrandSave> strands,RightStrandUpdateObject update,String userId,boolean isBusiness) throws Exception{
		boolean changed = false;
		boolean restrictionsChanged = false;
		if (strands==null||strands.isEmpty()) {
			return new ArrayList<>();
		}
		
		List<RightStrandSave> saved = new ArrayList<>();
		
		if (isChangeFromExclusionToInclusion(update,strands)) {
			Long foxVersionId = strands.get(0).getFoxVersionId();
			Date releaseDate = getReleaseDate(foxVersionId);
			setReleaseDate(strands, releaseDate);
		}
		
		for (RightStrandSave strand: strands) {
			if (strand.getRightStrandId()!=null) {
				saved.add(strand);
			}
			boolean strandChanged =  update(strand,update,userId,isBusiness);
			changed = changed||strandChanged;
			List<RightStrandRestrictionSave> restrictions = strand.getChangedRestrictions();
			//this needs to be before saving the strands because if the restrictions did not change, we need to clear them from the strand
			if (restrictions.size()>0) {
				restrictionsChanged = true;
			}
			if (strandChanged) {
				strand.clearRestrictions();				
//				if (!restrictionsChanged) {
//					strand.clearRestrictions();
//				}
				createSaveObject(strand);
			}
			if (restrictions.size()>0) {
				createRightRestrictionSaveObjects(restrictions);
				//AMV 11/20/2014
				//Comments are not saving if the strand changed
				strand.setRightRestrictions(restrictions);
				restrictionsChanged = true;
			}
			
		}
		
		if (changed && restrictionsChanged) {
			//if the strand changed and the restrictions changed 
			//we need to process the restrictions first
			setUpdateRestrictions();
			setUpdateRightStrands();			
		} else {
			if (changed) {			
				setUpdateRightStrands();
			}	
			if (restrictionsChanged) {
				setUpdateRestrictions();
			}
		}
		return saved;

	}

	private boolean update(RightStrandRestrictionSave s,RestrictionObject update,String userId) {
		ErmProductRightRestriction rightRestriction = getRestrictionConverter().convert(update);
		setUpdatedBy(rightRestriction, new Date(), userId, true, true);	
		boolean changed = mergeRestriction(s, rightRestriction,update, userId);	
		return changed;		
	}
	
	private List<RightStrandRestrictionSave> getUpdateRestrictionSave(List<ErmProductRightRestriction> restrictions,List<RestrictionObject> restrictionsToUpdate,String userId) {
		Map<Long,RestrictionObject> updateMap = Maps.uniqueIndex(restrictionsToUpdate, new Function<RestrictionObject,Long>() {

			@Override
			public Long apply(RestrictionObject r) {
				return r.getRestrictionId();
			}
			
		});
		List<RightStrandRestrictionSave> save = new ArrayList<>();
		for (ErmProductRightRestriction restriction: restrictions) {
			RightStrandRestrictionSave s = new RightStrandRestrictionSave();
			s.copyFrom(restriction);
			s.setOperation(DBOperation.UPDATE);
			RestrictionObject r = updateMap.get(s.getRightRestrictionId());
			//only add the info code if it has changed
			if (r.hasChanged()) {
				boolean changed = update(s,r,userId);
				if (changed) {
					save.add(s);
				}
			}
			
		}
		return save;
	}
	
	@Override
	public List<Long> updateStarndRestritctions(List<ErmProductRightRestriction> restrictions,List<RestrictionObject> restrictionsUpdate, String userId,boolean isBusiness) {
		List<RightStrandRestrictionSave> saveRestrictions = getUpdateRestrictionSave(restrictions,restrictionsUpdate,userId);
		List<Long> ids = createRightRestrictionSaveObjects(saveRestrictions);
		setUpdateRestrictions();		
		return ids;
	}
	
	@Override
	public List<RightStrandSave> update(List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId,boolean isBusiness) throws Exception{
		List<RightStrandSave> save = getRightStrandSaveObjects(strands,true);
		save = processUpdate(save, update,userId,isBusiness);
		return save;
	}
	

	private void setFirstReleaseDate(Date date,RightStrandSave save) {
		save.setReleaseDate(date);
	}
	

	
	public List<Long> updateReleaseDate(Date date, List<ErmProductRightStrand> strands) {
		List<RightStrandSave> saveStrands = getRightStrandSaveObjects(strands,false);
		List<Long> ids = new ArrayList<>();		
		for (RightStrandSave save:saveStrands){
			//only sync dates for business inclusions
			if (!save.isExclusion()&&save.isBusiness()) {
				if (!DateUtil.isSameDate(date, save.getReleaseDate() )) {
					save.setSyncDate();
					setFirstReleaseDate(date, save);
					ids.add(save.getRightStrandId());
					createSaveObject(save);
				}
			}
		}

		setUpdateRightStrands();
		return ids;
	}
	
	
	private List<RightStrandRestrictionSave> getEmptyRightRestrictionSaveWithIds(List<Long> ids) {
		List<RightStrandRestrictionSave> restrictions = new ArrayList<>();
		for (Long id: ids) {
			RightStrandRestrictionSave restriction = new RightStrandRestrictionSave();
			restriction.setRightRestrictionId(id);
			restrictions.add(restriction);
		}
		return restrictions;
	}
	

	
	@Override
	public List<Long> delete(Long foxVersionId,List<Long> ids) {
		return deleteRightStrands(foxVersionId, ids);
	}
	
	@Override
	public List<Long> deleteRightRestrictions(List<Long> restrictionIds) {
		List<RightStrandRestrictionSave> save = getEmptyRightRestrictionSaveWithIds(restrictionIds);
		setOperation(save, DBOperation.DELETE);
		createRightRestrictionSaveObjects(save);
		setUpdateRestrictions();		
		return restrictionIds;
	}
	
	private void adopt(ErmUpdatable updatabale, boolean isBusiness) {
		if (isBusiness) {
			updatabale.setBusinessInd(true);
		} else {
			updatabale.setLegalInd(true);
		}
		
	}
	
	@Override
	public List<Long> adoptRightStrand(List<ErmProductRightStrand> strands,
			String userId, boolean isBusiness) {
		List<RightStrandSave> save = getRightStrandSaveObjects(strands,true);
		Date now = new Date();
		boolean adoptedRestrictions = false;
		List<Long> ids = new ArrayList<>();
		for (RightStrandSave strand:save) {
			ids.add(strand.getRightStrandId());
			setUpdatedBy(strand, now, userId, false, true);
			adopt(strand,isBusiness);
			strand.setAdopt();
			for (RightStrandRestrictionSave restriction:strand.getRightRestrictions()) {
				setUpdatedBy(restriction, now, userId, true, true);
				adopt(restriction,isBusiness);
				restriction.setAdopt();
				adoptedRestrictions = true;
			}
		}
		createSaveObjects(save);
		setUpdateRightStrands();
		if (adoptedRestrictions) {
			setUpdateRestrictions();
		}
		return ids;
	}
	
	public List<Long> adoptRightRestrictions(List<ErmProductRightRestriction> restrictions, String userId,boolean isBusiness) {
		List<RightStrandRestrictionSave> save = getRightStrandRestrictionSaveObjects(restrictions);
		Date now = new Date();
		boolean adoptedRestrictions = false;
		List<Long> ids = new ArrayList<>();
		for (RightStrandRestrictionSave restriction:save) {
			setUpdatedBy(restriction, now, userId, true, true);
			adopt(restriction,isBusiness);
			restriction.setAdopt();
			adoptedRestrictions = true;
			ids.add(restriction.getRightRestrictionId());
		}
		createRightRestrictionSaveObjects(save);
		if (adoptedRestrictions) {
			setUpdateRestrictions();
		}
		return ids;
	}


}
