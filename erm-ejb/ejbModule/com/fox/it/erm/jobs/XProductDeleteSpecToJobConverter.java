package com.fox.it.erm.jobs;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.inject.Inject;

import com.fox.it.erm.ProductVersion;
import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Jobs.JobType;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteSpec;

public class XProductDeleteSpecToJobConverter {
	private static final int maxJobName = 1800; //actual field length is 2000, just giving some extra room 
	
	private JsonService jsonService;
	
	@Inject
	@EJB
	private ProductService productService;
	
	@Inject
	public XProductDeleteSpecToJobConverter(JsonService jsonService) {
		this.jsonService = jsonService;
	}
	
	private String getName(List<Long> targets) {
		List<ProductVersion> productVersions = productService.findProductVersions(targets);
		String targetString = "";
		for (ProductVersion productVersion: productVersions) {		
			String productName = productVersion.getTitle();
			if (targetString.length() > 0 )
				targetString += ", ";
			targetString += productVersion.getFinancialProductId() + " - " + productName;			
		}
		String name =  "Delete product sections from " + targetString;
		if (name.length()>maxJobName) {
			name = name.substring(0, maxJobName);
		}
		return name;
	}

	private List<JobAction>  getJobActions(Job job,XProductDeleteSpec spec, String userId, boolean isBusiness, Date date) {
		List<JobAction> actions = new ArrayList<>();
		List<Long> ids = spec.getFoxVersionIds();
		XProductSections sections = spec.getSections();
		String json = jsonService.toJson(sections);
		for (Long foxVersionId: ids) {
			JobAction action = new JobAction();
			action.setJob(job);
			action.setSpecs(json);
			action.setFromFoxVersionId(null);
			action.setToFoxVersionId(foxVersionId);
			action.setCreateDate(date);
			action.setUpdateDate(date);
			action.setCreateName(userId);
			action.setUpdateName(userId);
			action.setCopyBusiness(isBusiness);			
			action.setCopyLegal(!isBusiness);
			action.setStatusId(JobStatus.NOT_STARTED.getId());
			actions.add(action);			
		}
		return actions;

	}
	
	public Job convert(XProductDeleteSpec spec, String userId, boolean isBusiness) {
		Job job =  new Job();
		job.setJobTypeId(JobType.X_DELETE.getId());
		job.setOwner(userId);
		Date now = new Date();
		job.setCreateDate(now);
		job.setStatusId(JobStatus.NOT_STARTED.getId());
		job.setName(getName(spec.getFoxVersionIds()));
		job.setCreateName(userId);
		job.setUpdateName(userId);
		job.setUpdateDate(now);
		List<JobAction> actions = getJobActions(job, spec,  userId, isBusiness,now);
		job.setActions(actions);
		return job;
		
	}

}
