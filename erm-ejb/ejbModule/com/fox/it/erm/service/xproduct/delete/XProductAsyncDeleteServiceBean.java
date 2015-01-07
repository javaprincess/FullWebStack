package com.fox.it.erm.service.xproduct.delete;

import javax.ejb.Asynchronous;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.jobs.JobAction;

@Stateless
public class XProductAsyncDeleteServiceBean implements
		XProductAsyncDeleteService {

	@Inject
	@EJB
	XProductSingleProductDeleteService service;
	

	public XProductAsyncDeleteServiceBean() {

	}

	@Override
	@Asynchronous
	@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)		
	public void doDelete(Job job, XProductDeleteSpec spec, String userId,
			boolean isBusiness) {
		Long jobId = job.getId();
		for (Long foxVersionId: spec.getFoxVersionIds()) {
			JobAction jobAction = job.getAction(foxVersionId);
			Long jobActionId = jobAction.getId();
			service.doDeleteSingleProduct(jobId,jobActionId, foxVersionId, spec.getSections(), userId,isBusiness);
		}		
	}

}
