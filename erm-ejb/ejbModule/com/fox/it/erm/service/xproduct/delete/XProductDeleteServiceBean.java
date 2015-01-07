package com.fox.it.erm.service.xproduct.delete;



import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;


import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.jobs.XProductDeleteSpecToJobConverter;
import com.fox.it.erm.service.JobService;




@Stateless
public class XProductDeleteServiceBean implements XProductDeleteService {

	@Inject
	@EJB
	private JobService jobService;
	
	@Inject
	@EJB
	private XProductAsyncDeleteService asyncService;
	
	
	@Inject
	private XProductDeleteSpecToJobConverter converter; 

	
	public Job createJob(XProductDeleteSpec xProductDeleteSpec, String userId,boolean isBusiness) {
		Job job = converter.convert(xProductDeleteSpec, userId, isBusiness);
		jobService.create(job, userId);
		return job;
	}
	
	public void doDelete(Job job, XProductDeleteSpec spec, String userId, boolean isBusiness)  {
		asyncService.doDelete(job, spec, userId, isBusiness);		
	}
	
	@Override
	public Job deleteAsJob(XProductDeleteSpec xProductDeleteSpec, String userId, boolean isBusiness) {	
		Job job = createJob(xProductDeleteSpec, userId, isBusiness);
		doDelete(job, xProductDeleteSpec, userId, isBusiness);
		return job;
	}
	
	

}
