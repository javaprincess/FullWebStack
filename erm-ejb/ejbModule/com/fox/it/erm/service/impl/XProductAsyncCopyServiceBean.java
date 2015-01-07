package com.fox.it.erm.service.impl;

import java.util.logging.Logger;

import javax.ejb.Asynchronous;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import com.fox.it.erm.copy.XProductCopyData;
import com.fox.it.erm.copy.XProductCopyDataProvider;
import com.fox.it.erm.copy.XProductCopySpec;
import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.jobs.JobAction;
import com.fox.it.erm.service.XProductAsyncCopyService;
import com.fox.it.erm.service.XProductSingleProductCopyService;

@Stateless
public class XProductAsyncCopyServiceBean implements XProductAsyncCopyService{
	private final static Logger logger = Logger.getLogger(XProductAsyncCopyServiceBean.class.getName());
	
	@Inject
	@EJB
	private XProductSingleProductCopyService singleProductCopyService;
	

	@Inject
	private XProductCopyDataProvider dataProvider;
	
	
	public XProductAsyncCopyServiceBean() {

	}
	
	private Logger getLogger() {
		return logger;
	}

	@Override
	@Asynchronous
	@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)	
	public void doCopy(Job job, XProductCopySpec spec, String userId, boolean isBusiness)  {
		int numberOfProducts = spec.getToFoxVersionIds().size();
		getLogger().info("Starting xcopy for job " + job.getId() + " .Copying to " + numberOfProducts  + " products");
		XProductCopyData data = dataProvider.get(spec.getFromFoxVersionId(), spec.getSections(), isBusiness);
		Long jobId = job.getId();
		int i = 1;
		for (Long toFoxVersionId: spec.getToFoxVersionIds()) {
			JobAction jobAction = job.getAction(toFoxVersionId);			
			Long jobActionId = jobAction.getId();
			long t0 = System.currentTimeMillis();
			getLogger().info("Starting xcopy " + i + "/" + numberOfProducts + " job actionId: " + jobActionId);			
			singleProductCopyService.doCopySingleProduct(jobId,jobActionId,  spec.getFromFoxVersionId(), toFoxVersionId, spec.getSections(), data,userId,isBusiness);
			long t1 = System.currentTimeMillis();			
			getLogger().info("Completed xcopy " + i + "/" + numberOfProducts + " job actionId: " + jobActionId + " in " + (t1 -t0) + "ms");
			i++;
		}
		getLogger().info("Completed " + (i -1)+ " xcopy actions fro job  " + job.getId());		
	}
	
	
	

}
