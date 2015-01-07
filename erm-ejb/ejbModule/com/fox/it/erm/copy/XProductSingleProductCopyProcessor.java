package com.fox.it.erm.copy;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.service.JobService;
import com.fox.it.erm.service.impl.DBContextSetter;
import com.fox.it.erm.service.impl.DBLogger;

public class XProductSingleProductCopyProcessor {
	private final Logger logger = Logger.getLogger(XProductSingleProductCopyProcessor.class.getName());
	private final JobService jobService;	
	private final List<XProductSectionCopyProcessor> copySectionProcessors;
	private final DBContextSetter dbContextSetter;
	private final DBLogger dbLogger;
	public XProductSingleProductCopyProcessor(JobService jobService,List<XProductSectionCopyProcessor> copySectionProcessors,DBContextSetter dbContextSetter,DBLogger dbLogger) {
		this.jobService = jobService;
		this.copySectionProcessors = copySectionProcessors;
		this.dbContextSetter = dbContextSetter;
		this.dbLogger = dbLogger;
	}

	private Logger getLogger() {
		return logger;
	}
	
	private void markAsCompleted(Long actionId, String userId) {
		getLogger().info("Completed job action " + actionId + " for user" + userId + " setting status as completed");		
		//jobService.setCompletedAction(actionId, userId);
		//actionId, JobStatus.COMPLETED,userId
		jobService.setJobActionCurrentTx(actionId, JobStatus.COMPLETED, userId);
	}
	
	
	public void process(Long jobId,Long actionId,Long fromFoxVersionId,Long toFoxVersionId, XProductCopyData data,String userId,boolean isBusiness) {
		String logMessage = "Starting copy action " + actionId + " copying from " + fromFoxVersionId + " to " + toFoxVersionId; 
		dbLogger.logXCopy(logMessage, jobId, actionId,userId);
		getLogger().info(logMessage); 
		dbContextSetter.set(userId, isBusiness);
		try {
			for (XProductSectionCopyProcessor processor: copySectionProcessors) {
				processor.copy(fromFoxVersionId, toFoxVersionId, data, userId, isBusiness);
				dbLogger.logXCopy("Completed action " + actionId, jobId, actionId,userId);
			}
			markAsCompleted(actionId, userId);
		} catch (Exception e) {
			String message = "Error copying data from action: " + actionId + " fromFoxVersionId: " + fromFoxVersionId + " toFoxVersionId: " + toFoxVersionId + " as user " + userId + ".";			
			getLogger().log(Level.SEVERE,message,e);
			throw new RuntimeException(message,e);
		}
	}

}
