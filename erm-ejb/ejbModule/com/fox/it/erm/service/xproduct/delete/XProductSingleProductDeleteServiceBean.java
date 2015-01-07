package com.fox.it.erm.service.xproduct.delete;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.service.JobService;
import com.fox.it.erm.service.impl.DBContextSetter;
import com.fox.it.erm.util.ExceptionUtil;

@Stateless
public class XProductSingleProductDeleteServiceBean implements XProductSingleProductDeleteService{
	
	private static final Logger logger = Logger.getLogger(XProductSingleProductDeleteServiceBean.class.getName());
	
	@Inject
	private JobService jobService;
	
	@Inject
	private XProductDeleteProcessorProvider processorProvider;
	
	@Inject
	private DBContextSetter dbContextSetter;
	

	public XProductSingleProductDeleteServiceBean() {
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	private void markAsError(Long actionId, String message,String userId) {
		jobService.setErrorAction(actionId, message, userId);
	}
	
	private void markAsCompleted(Long actionId, String userId) {
		getLogger().info("Completed job action " + actionId + " for user" + userId + " setting status as completed");		
		jobService.setCompletedAction(actionId, userId);
	}
	
	private void markJobActionAsStarted(Long actionId,String userId) {		
		jobService.setJobAction(actionId, JobStatus.RUNNING, userId);
	}
	
	
	private void doDelete(Long actionId,Long foxVersionId, XProductSections sections, String userId, boolean isBusiness,List<XProductSectionDeleteProcessor> processors) {
		getLogger().info("Starting delete action " + actionId + " deletng " + foxVersionId);		
		dbContextSetter.set(userId, isBusiness);
		try {
			markJobActionAsStarted(actionId, userId);
			for (XProductSectionDeleteProcessor processor: processors) {
				processor.delete(foxVersionId, userId, isBusiness);
			}
			getLogger().info("Completed delete action " + actionId + " deletng " + foxVersionId);			
			markAsCompleted(actionId, userId);			
		} catch (Exception e) {
			String message = "Error deleting data from action: " + actionId + " foxVersionId: " + foxVersionId + " as user " + userId + ".";			
			getLogger().log(Level.SEVERE,message,e);			
			String exceptionMessage = ExceptionUtil.getMesage(e);
			markAsError(actionId, exceptionMessage, userId);			
		}
		
	}
	
	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)	
	public void doDeleteSingleProduct(Long jobId, Long actionId,Long foxVersionId,XProductSections sections, String userId, boolean isBusiness) {
		if (!jobService.shouldRun(jobId)) {
			getLogger().info("Job " + jobId + " not running, no action will be performed for action " + actionId);
			return;
		}		
		List<XProductSectionDeleteProcessor> processors = processorProvider.get(sections);
		doDelete(actionId,foxVersionId,sections,userId,isBusiness,processors);
	}

}
