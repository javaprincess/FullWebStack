package com.fox.it.erm.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;



import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.service.RightStrandSetService;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandCreateObject;
import com.fox.it.erm.util.StringUtil;
import com.google.common.base.Strings;

/**
 * Converts a RightStrandCreateObject as received from the client to a right strnad.
 * The right strand will have restrictions if the right strand object have them.
 * @author AndreasM
 *
 */
public class RightStrandObjectToRightStrandConverter  extends RightStrandObjectConverterBase{
	private static final Logger logger = Logger.getLogger(RightStrandObjectToRightStrandConverter.class.getName());
	private final EntityManager em;
	private final RightStrandSetService rightStrandSetService;
	private final RestrictionObjectToRightRestrictionConverter restrictionConverter = new RestrictionObjectToRightRestrictionConverter();
	
	
	@Inject
	public RightStrandObjectToRightStrandConverter(EntityManager em,RightStrandSetService rightStrandSetService) {
		this.em = em;
		this.rightStrandSetService = rightStrandSetService;		
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	/**
	 * 
	 * @param rightStrands
	 * @param strandSetName
	 * @param strandSetId
	 * @param foxVersionId
	 */
	private void addStrandSet(List<ErmProductRightStrand> rightStrands, String strandSetName, Long strandSetId, Long foxVersionId,String userId){
		
		if(rightStrands !=  null && !rightStrands.isEmpty()){
			ErmRightStrandSet strandSet = null;
			if(strandSetId != null && strandSetId > 0){
				strandSet = em.find(ErmRightStrandSet.class, strandSetId);				
			}
			else if(!Strings.isNullOrEmpty(strandSetName)){
				strandSet = rightStrandSetService.findStrandSet(foxVersionId,strandSetName);
				if(strandSet == null){
					String description = null;
					strandSet = rightStrandSetService.createSet(foxVersionId, strandSetName, description,userId);					
				}
			}
			if(strandSet != null){
				for(ErmProductRightStrand e : rightStrands){
					e.setStrandSet(strandSet);
					e.setStrandSetId(strandSet.getRightStrandSetId());
				}
			}
		}
	}
	
	
	private Date toDate(String s){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		if(!StringUtil.isEmptyOrWhitespace(s)){
			try {
				Date d = sdf.parse(s);
				return d;
			}
			catch(Exception e){
				getLogger().log(Level.SEVERE, "Error parsing date " + s,e);				
			}
			
		}
		return null;
		
	}
	
	/**
	 * 
	 * @param r
	 * @param userId
	 * @return
	 */
	public List<ErmProductRightStrand> buildRightStrand(RightStrandCreateObject r,String userId){
		
		List<ErmProductRightStrand> list = new ArrayList<ErmProductRightStrand>();
		if(r != null){
			Long[] media = r.getMedia();
			Long[] languages = r.getLanguages();
			Long[] territories = r.getTerritories();			
			//TODO create date util to handle this. 
			//ensure that is consistent across the app
//			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			
			for(int l = 0; l < media.length; l++){
				
				for(int k = 0; k < languages.length; k++){
					
					for(int j = 0; j < territories.length; j++){
						
						ErmProductRightStrand epr = new ErmProductRightStrand();
						
						epr.setMediaId(media[l]);
						epr.setLanguageId(languages[k]);						
						epr.setTerritoryId(territories[j]);
						
						String scd = r.getStartContractualDate();
						if(!StringUtil.isEmptyOrWhitespace(scd)){
							Date d = toDate(scd);
							epr.setContractualStartDate(d);
						}
						
						//TODO change this to use ids instead of reference to object
						//Change to Long instead of primitive and compare to primitive instead of 0 
						if(isValue(r.getStartDateCode())){
							epr.setContractualStartDateCodeId(r.getStartDateCode());
						}
						
						if(isValue(r.getStartDateStatus())){
							epr.setContractualStartDateStatusId(r.getStartDateStatus());
						}
						
						String ecd = r.getEndContractualDate();
						if(!StringUtil.isEmptyOrWhitespace(ecd)){
							Date d = toDate(ecd);
							epr.setContractualEndDate(d);
						}
						
						String overrideStartDate = r.getStartOverrideDate();
						if (!StringUtil.isEmptyOrWhitespace(overrideStartDate)) {
							Date d = toDate(overrideStartDate);
							epr.setOverrideStartDate(d);
						}
						
						String overrideEndDate = r.getEndOverrideDate();
						if (!StringUtil.isEmptyOrWhitespace(overrideEndDate)) {
							Date d = toDate(overrideEndDate);
							epr.setOverrideEndDate(d);
						}
						

						if(isValue(r.getEndDateCode())){
							epr.setContractualEndDateCodeId(r.getEndDateCode());
						}
						
						if(isValue(r.getEndDateStatus())){
							epr.setContractualEndDateStatusId(r.getEndDateStatus());
						}
						
						if(r.isExclusion()){
							epr.setExcludeFlag(true);
						}
						else{
							epr.setExcludeFlag(false);
						}
						
						epr.setFoxVersionId(r.getFoxVersionId());
						list.add(epr);
					}					
				}
			}
			if(!list.isEmpty()){
				addStrandSet(list, r.getStrandSetName(), r.getStrandSetId(), r.getFoxVersionId(),userId);
				addRestrictions(list, r.getRestrictions());
			}
		}
		return list;
	}

	private void addRestrictions(List<ErmProductRightStrand> strands,
			List<RestrictionObject> restrictions) {
		if (restrictions==null||restrictions.isEmpty()) return;		
		for (ErmProductRightStrand strand:strands) {
			for (RestrictionObject restriction: restrictions) {
				ErmProductRightRestriction rightRestriction = restrictionConverter.convert(restriction);
				rightRestriction.setErmProductRightStrand(strand);
				strand.getErmProductRightRestrictions().add(rightRestriction);
			}
		}
	}


}
