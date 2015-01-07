package com.fox.it.erm.jobs;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Jobs.JobType;

public class XProductCopySpecToJobConverter {

	 
	private List<JobAction> getJobActions(Job job, 
			Long foxVersionId,
			List<Long> toFoxVersionIds,
			List<String> sections,
			List<Long> clearanceMemoCommentIds,
			String userId, 
			boolean isBusiness,
			Date date) {
		List<JobAction> actions = new ArrayList<>();
		XProductSections copySpec = new XProductSections();
		copySpec.setClearanceMemoCommentIds(clearanceMemoCommentIds);
		copySpec.setSections(sections);
		for (Long toFoxVersionId: toFoxVersionIds) {
			JobAction action = new JobAction();
			action.setJob(job);
			action.setFromFoxVersionId(foxVersionId);
			action.setToFoxVersionId(toFoxVersionId);
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
	
	
	public Job convert(Long foxVersionId, 
			String name,
			List<Long> toFoxVersionIds,
			List<String> sections,
			List<Long> clearanceMemoCommentIds,
			String userId, 
			boolean isBusiness) {
		Job job =  new Job();
		job.setJobTypeId(JobType.X_COPY.getId());
		job.setOwner(userId);
		Date now = new Date();
		job.setCreateDate(now);
		job.setStatusId(JobStatus.NOT_STARTED.getId());
		job.setName(name);
		job.setCreateName(userId);
		job.setUpdateName(userId);
		job.setUpdateDate(now);
		List<JobAction> actions = getJobActions(job, 
				foxVersionId, 
				toFoxVersionIds, 
				sections, 
				clearanceMemoCommentIds, 
				userId, 
				isBusiness,
				now);
		job.setActions(actions);
		return job;
	}
	
	
}
