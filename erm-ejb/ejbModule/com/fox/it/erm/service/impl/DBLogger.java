package com.fox.it.erm.service.impl;

import java.util.Date;

import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.DBErrorLog;

public class DBLogger {
	private final EntityManager em;
	
	@Inject
	public DBLogger(EntityManager em) {
		this.em = em;
	}
	
	public void log(String programName,String objectName,String errorCode,String description,Integer severity,String userId) {
		DBErrorLog log = new DBErrorLog();
		log.setProgramName(programName);
		log.setObjectName(objectName);
		log.setErrorCode(errorCode);
		log.setErrorDescription(description);
		log.setSeverity(severity);
		log.setCreateName(userId);
		log.setCreateDate(new Date());
		log(log);
	}
	
	public void log(DBErrorLog errorLog) {
		em.persist(errorLog);
		em.flush();
	}
	
	public void logXCopy(String message,Long jobId,Long actionId,String userId) {
		String objectName = jobId==null?"":jobId.toString();
		String errorCode = actionId==null?null:actionId.toString();
		log("XCopy",objectName,errorCode, message, null, userId);
	}
	
//	public void logXCopy(String message,Long jobId,Long actionId) {
//		logXCopy(message,jobId,actionId,"erm");
//	}
	

}
