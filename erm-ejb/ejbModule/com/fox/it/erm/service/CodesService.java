package com.fox.it.erm.service;

import javax.ejb.Local;

import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;
import com.fox.it.erm.LegalConfirmationStatus;



import com.fox.it.erm.BusinessConfirmationStatus;
import com.fox.it.erm.ProductMethodOfTransmission;
import com.fox.it.erm.RefDate;
import com.fox.it.erm.comments.CommentStatus;

import java.util.Date;
import java.util.List;

/**
 * Interface to get code table values.
 * @author AndreasM
 *
 */
@Local
public interface CodesService {

	List<LegalConfirmationStatus> findAllLegalConfirmationStatus();
	LegalConfirmationStatus findLegalConfirmationStatusById(Long id);
	List<DateCode> findAllDateCodes();
	List<RefDate> findAllRefDateCodes();	
	List<DateStatus> findAllDateStatus();
	List<BusinessConfirmationStatus> findAllBusinessConfirmationStatus();
	List<CommentStatus> findAllCommentStatus();		
	Date getLastChangeLegalConfirmationStatusTimestamp();
	List<ProductMethodOfTransmission> findAllProductMethodOfTransmission();	
	Date getLastModifiedDateCode();
	Date getLastModifiedDateStatus();	
	Date getLastModifiedDates();
}
