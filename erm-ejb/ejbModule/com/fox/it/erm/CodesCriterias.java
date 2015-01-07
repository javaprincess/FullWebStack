package com.fox.it.erm;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.comments.CommentStatus;

public class CodesCriterias {
	public static class LegalConfirmationStatusCriteria extends SearchCriteria<LegalConfirmationStatus> {

		public LegalConfirmationStatusCriteria(EntityManager em) {
			super(em, LegalConfirmationStatus.class);
			addSort("confirmationStatusDescription");
		}
		
		public LegalConfirmationStatusCriteria setId(Long id) {
			equal("confirmationStatusId",id);
			return this;
		}
						
	}
	
	public static LegalConfirmationStatusCriteria getLegalStatusCriteria(EntityManager em) {
		return new LegalConfirmationStatusCriteria(em);
	}
	
	public static class BusinessConfirmationStatusCriteria extends SearchCriteria<BusinessConfirmationStatus> {
		public BusinessConfirmationStatusCriteria(EntityManager em) {
			super(em, BusinessConfirmationStatus.class);
			addSort("confirmationStatusDescription");
		}					
	}	
	public static BusinessConfirmationStatusCriteria getBusinessConfirmationStatusCriteria(EntityManager em) {
		return new BusinessConfirmationStatusCriteria(em);
	}
	
	public static class CommentStatusCriteria extends SearchCriteria<CommentStatus> {
		public CommentStatusCriteria(EntityManager em) {
			super(em, CommentStatus.class);
			addSort("commentStatusId");
		}					
	}	
	public static CommentStatusCriteria getCommentStatusCriteria(EntityManager em) {
		return new CommentStatusCriteria(em);
	}
	
	public static class MethodOfTransmissionCriteria extends SearchCriteria<ProductMethodOfTransmission>{
		
		public MethodOfTransmissionCriteria(EntityManager em){
			super(em, ProductMethodOfTransmission.class);
		}
	}
	
	public static MethodOfTransmissionCriteria getMethodOfTransmissionCriteria(EntityManager em){
		return new MethodOfTransmissionCriteria(em);
	}
	
}
