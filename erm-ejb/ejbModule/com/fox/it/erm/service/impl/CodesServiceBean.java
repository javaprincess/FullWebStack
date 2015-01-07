package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.BusinessConfirmationStatus;
import com.fox.it.erm.CodesCriterias;
import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;
import com.fox.it.erm.LegalConfirmationStatus;
import com.fox.it.erm.ProductMethodOfTransmission;
import com.fox.it.erm.RefDate;
import com.fox.it.erm.comments.CommentStatus;
import com.fox.it.erm.service.CodesService;

@Stateless
public class CodesServiceBean extends ServiceBase implements CodesService {

	@Inject
	private EntityManager em;
	
	private static Date cacheLegalConfirmationStatusTimestamp;	
	private static List<LegalConfirmationStatus> legalConfirmationStatusList;
	
	private List<CommentStatus> commentStatus;
	
	public Date getLastChangeLegalConfirmationStatusTimestamp() {
		return getLastModified("ref_lgl_conf_sts");
	}
	
	public Date getLastModifiedDateCode() {
		return getLastModified("ref_date_cd");		
	}
	
	public Date getLastModifiedDateStatus() {
		return getLastModified("ref_date_sts");		
	}
	
	public Date getLastModifiedDates() {
		Date dateCodes = getLastModifiedDateCode();
		Date dateStatus =  getLastModifiedDateStatus();
		if (dateCodes.compareTo(dateStatus)<=0) {
			return dateStatus;
		}
		return dateCodes;
	}
	
	protected boolean shouldReloadLegalConfirmationStatusList() {
		if (legalConfirmationStatusList==null||cacheLegalConfirmationStatusTimestamp==null) return true;
		Date lastChangeTimestamp = getLastChangeLegalConfirmationStatusTimestamp();
		if (cacheLegalConfirmationStatusTimestamp.compareTo(lastChangeTimestamp)<=0)			
			return true;
		return false;
	}	
	
	@Override
	public List<LegalConfirmationStatus> findAllLegalConfirmationStatus() {
	  if (shouldReloadLegalConfirmationStatusList()) {
		legalConfirmationStatusList = CodesCriterias.getLegalStatusCriteria(em).getResultList();
		Date date = new Date();
		cacheLegalConfirmationStatusTimestamp = date;
	  } 
	  return legalConfirmationStatusList;
	}
	
	@Override
	public LegalConfirmationStatus findLegalConfirmationStatusById(Long id) {	
		return CodesCriterias.getLegalStatusCriteria(em).setId(id).getSingleResult();
	}
	
	@Override
	public List<BusinessConfirmationStatus> findAllBusinessConfirmationStatus() {
		List<BusinessConfirmationStatus> BusinessConfirmationStatus = CodesCriterias.getBusinessConfirmationStatusCriteria(em).getResultList();
		return BusinessConfirmationStatus;
	}
	
	@Override
	public List<CommentStatus> findAllCommentStatus() {
		if (commentStatus==null||shouldRefreshCache()) {
			commentStatus = CodesCriterias.getCommentStatusCriteria(em).getResultList();
		}
		
		return commentStatus;
	}
	
	
	@Override
	public List<DateCode> findAllDateCodes() {
		return DateSearchCriterias.getDateCodeCriteria(em).getResultList();
	}
	
	/**
	 * Had to create this method to maintain compatibility with the grid.
	 * We have Date and RefDate which represent the same entity. We should only have one.
	 * TODO remove one 
	 *  
	 * AMV
	 * @return
	 */
	public List<RefDate> findAllRefDateCodes() {
		List<DateCode> dateCodes = findAllDateCodes();
		List<RefDate> refDateCodes  = new ArrayList<>();
		for (DateCode dateCode: dateCodes){
			RefDate refDate = new RefDate();
			refDate.setDateCode(dateCode.getCode());
			refDate.setDateCodeDescription(dateCode.getDescription());
			refDate.setRefDateId(dateCode.getId());
			refDateCodes.add(refDate);
		}
		return refDateCodes;
	}
	
	@Override
	public List<DateStatus> findAllDateStatus() {
		return DateSearchCriterias.getDateStatusCriteria(em).getResultList();
	}
	
	public List<ProductMethodOfTransmission> findAllProductMethodOfTransmission(){
		return CodesCriterias.getMethodOfTransmissionCriteria(em).getResultList();
	}
}
