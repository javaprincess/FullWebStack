package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.transaction.HeuristicMixedException;
import javax.transaction.HeuristicRollbackException;
import javax.transaction.NotSupportedException;
import javax.transaction.RollbackException;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.copy.XProductCopyData;
import com.fox.it.erm.copy.XProductCopyProcessorProvider;
import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.copy.XProductSectionCopyProcessor;
import com.fox.it.erm.copy.XProductSingleProductCopyProcessor;
import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.service.JobService;
import com.fox.it.erm.service.XProductSingleProductCopyService;
import com.fox.it.erm.util.ExceptionUtil;


@Stateless
@TransactionManagement(TransactionManagementType.BEAN)
public class XProductSingleProductCopyServiceBean implements
		XProductSingleProductCopyService {

	//transaction timeout in seconds for single product
	//20 min. This value seems high. But belle 4000~ strands took 9 min
	//this is so we can support 10000~ strands
	//TODO read this from property
	private int TX_TIMEOUT = 60*20;
	
	private static final Logger logger = Logger.getLogger(XProductSingleProductCopyServiceBean.class.getName());

	@Inject
	private XProductCopyProcessorProvider processorProvider;

	@Inject
	private JobService jobService;
	
	@Inject
	private DBLogger dbLogger;
	
	@Inject
	private DBContextSetter dbContextSetter;
	
	@Resource
    private UserTransaction tx;
	
	
	public XProductSingleProductCopyServiceBean() {

	}
	
	private Logger getLogger() {
		return logger;
	}

	private void markJobActionAsStarted(Long actionId,String userId) {		
		jobService.setJobAction(actionId, JobStatus.RUNNING, userId);
	}
	
	private void makrJobActionAsError(Long actionId, String userId,Exception e) {
		String message = e.getMessage();
		jobService.setErrorAction(actionId, message, userId);
	}
	
	
	private void startTx() throws NotSupportedException, SystemException {
		getLogger().info("Starting tx " + tx.toString());
		tx.setTransactionTimeout(TX_TIMEOUT);
		tx.begin();
	}
	
	private void rollback() {
		try {
			tx.rollback();
		} catch (Exception e) {
			getLogger().log(Level.SEVERE,"Exception rolling back tx",e);
			throw new RuntimeException("Error rolling back tx", e);
		}
	}
	
	private void commit() throws SecurityException, IllegalStateException, RollbackException, HeuristicMixedException, HeuristicRollbackException, SystemException {
		getLogger().info("Commiting transaction " + tx.toString());
		tx.commit();
	}
	
	@Override
//	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
	public void doCopySingleProduct(Long jobId,Long actionId,Long fromFoxVersionId,Long toFoxVersionId,XProductSections sections, XProductCopyData data,String userId, boolean isBusiness) {
		if (!jobService.shouldRun(jobId)) {
			getLogger().info("Job " + jobId + " not running, no action will be performed for action " + actionId);
			return;
		}
		try {
			startTx();
			List<XProductSectionCopyProcessor> processors = processorProvider.get(sections);
			XProductSingleProductCopyProcessor singleProductCopyProcessor = new XProductSingleProductCopyProcessor(jobService, processors,dbContextSetter,dbLogger);
			markJobActionAsStarted(actionId,userId);
			singleProductCopyProcessor.process(jobId,actionId, fromFoxVersionId, toFoxVersionId, data, userId, isBusiness);
			String logMessage = "Commited action " + actionId + " copy from " + fromFoxVersionId + " to " + toFoxVersionId; 
			dbLogger.logXCopy(logMessage, jobId, actionId,userId);
			commit();
			getLogger().info(logMessage);
		} catch (Exception e) {
			getLogger().log(Level.SEVERE,"Error processing action for job " + jobId,e);			
			rollback();
			ExceptionUtil exceptionUtil = new ExceptionUtil();
			ErmException ermException = exceptionUtil.getErmException(e);			
			makrJobActionAsError(actionId,userId,ermException);			
			throw new RuntimeException(e);
		}
	}
	
	

}
