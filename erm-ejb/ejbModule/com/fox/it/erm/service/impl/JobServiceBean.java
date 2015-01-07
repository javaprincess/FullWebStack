package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.jobs.JobAction;
import com.fox.it.erm.service.JobService;



@Stateless
public class JobServiceBean extends ServiceBase implements JobService {

	private static final Logger logger = Logger.getLogger(JobServiceBean.class.getName());
	
	@Inject
	private EntityManager em;


	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
	public void create(Job job,String userId) {
		em.persist(job);		
	}
	

	private Logger getLogger() {
		return logger;
	}
	
	@Override
	public void setStatus(Long jobId, JobStatus status,String userId) {
		setStatus(findJob(jobId),status.getId(),userId);
	}

	@Override
	public void setCompleted(Long jobId,String userId) {
		setStatus(jobId,JobStatus.COMPLETED,userId);

	}

	@Override
	public void stop(Long jobId,String userId) {
		setStatus(jobId,JobStatus.STOPPED,userId);
	}

	@Override
	public void resume(Long jobId,String userId) {
		setStatus(jobId,JobStatus.NOT_STARTED,userId);

	}

	@Override
	public void start(Long jobId,String userId) {
		setStatus(jobId,JobStatus.NOT_STARTED,userId);
	}

	private Job findJob(Long jobId) {
		return em.find(Job.class, jobId);	
	}
	
	@Override
	public boolean shouldRun(Long id) {
		Job job = findJob(id);
		if (job==null) return false;
		return job.shouldRun();
	}
	
	private JobAction findJobAction(Long jobActionId) {
		JobActionSearchCriteria criteria = new JobActionSearchCriteria(em);
		criteria.setId(jobActionId);
		return criteria.getSingleResult();
	}
	
	private void setStatus(Job job, Long statusId,String userId) {
		job.setStatusId(statusId);
		job.setUpdateDate(new Date());
	}
	
	@Override
	public void setError(Long id, String message,String userId) {
		Job job = findJob(id);
		setStatus(job,JobStatus.ERROR.getId(),userId);
		job.setMessage(message);
	}
	
	@Override
	public void setJobActionCurrentTx(Long actionId, JobStatus status,String userId) {
		setJobAction(actionId, status, userId);
	}

	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)	
	public void setJobAction(Long actionId, JobStatus status,String userId) {
		JobAction action = findJobAction(actionId);
		if (action==null) {
			getLogger().log(Level.SEVERE,"Unable to find actionId: " + actionId);
			return;
		}
		setStatus(action, status);
	}
	
	private void setStatus(JobAction action, JobStatus status) {
		if (status==JobStatus.RUNNING) {
			action.setStartDate(new Date());
		}
		if (status==JobStatus.COMPLETED) {
			action.setCompletedDate(new Date());
		}
		action.setStatusId(status.getId());
		action.setUpdateDate(new Date());
		Long jobId = action.getJobId();
		updateJobStatus(jobId, status);
	}
	

	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)	
	public void setCompletedAction(Long actionId,String userId) {
		setJobAction(actionId, JobStatus.COMPLETED,userId);
	}

	@Override
	@TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
	public void setErrorAction(Long actionId, String message,String userId) {
		JobAction action = findJobAction(actionId);
		action.setError(message);		
		setStatus(action, JobStatus.ERROR);
		em.flush();
	}
	
	private JobStatus computeNewStatus(List<JobAction> actions) {
		boolean hasError = false;
		boolean completed = true;

		for (JobAction action: actions) {
			JobStatus currentJobStatus = JobStatus.get(action.getStatusId());			
			if (currentJobStatus==JobStatus.ERROR) {
				hasError =true;
				completed=false;
				break;
			}
			if (currentJobStatus==JobStatus.COMPLETED) {
				completed=true && completed;
			} else {
				completed=false;
			}
		
		}
		if (completed) return JobStatus.COMPLETED;
		if (hasError) return JobStatus.ERROR;
		return JobStatus.RUNNING;
	}
	
	private void updateJobStatus(Long jobId,JobStatus actionJobStatus) {
		Job job = findJob(jobId);
		if (actionJobStatus==JobStatus.COMPLETED) {
			Integer actionsCompleted = job.getNumberOfActionsCompleted();
			if (actionsCompleted==null) { 
				actionsCompleted = 1;
			} else {
				actionsCompleted = actionsCompleted +1;
			}
			job.setNumberOfActionsCompleted(actionsCompleted);
			if (actionsCompleted==job.getNumberOfActions()) {
				getLogger().info("Job " + job.getId() + " completed!!");
				job.setCompletedDate(new Date());
				job.setStatusId(JobStatus.COMPLETED.getId());
				em.flush();
				return;
			}
		}
		JobStatus currentJobStatus = JobStatus.get(job.getStatusId());
		if (currentJobStatus==actionJobStatus) {
			return;
		}
		if (actionJobStatus==JobStatus.RUNNING && job.getStartDate()==null) {
			job.setStartDate(new Date());
		}
		List<JobAction> actions = job.getActions();
		JobStatus status = computeNewStatus(actions);
		job.setStatusId(status.getId());
		if (status==JobStatus.COMPLETED) {
			job.setCompletedDate(new Date());
		}
	}


	private JobSearchCriteria getCriteria() {
		return new JobSearchCriteria(em);
	}

	@Override
	public List<Job> getAllJobsByUser(String userId) {		
		JobSearchCriteria criteria = getCriteria();
		criteria.setOwner(userId); 		
		criteria.addSort("createDate");
		return criteria.getResultList();
	}


	@Override
	public List<Job> getNotCompletedJobs(String userId) {
		JobSearchCriteria criteria = getCriteria();
		criteria.setOwner(userId); 
		criteria.setNotCompleted();
		criteria.addSort("createDate");
		return criteria.getResultList();
	}


	@Override
	public Job getBasicJob(Long id) {
		Job job = getCriteria().setId(id).getSingleResult();
		if (job==null) {
			getLogger().log(Level.SEVERE,"Job id " + id + " is not in db");
			return null;
		}
		Job copy = new Job();
		copy.copyBasic(job);
		return copy;
	}



	@Override
	public Job getJobDetails(Long id) {
		Job job = getCriteria().setId(id).getSingleResult();
		if (job!=null) {
			job.getActions().size();
		}
		return job;

	}
	
	@Override
	public 	Integer getPendingJobsCount(String userId) {
		List<Job> jobs = getNotCompletedJobs(userId);
		return jobs.size();
	}
		
	@Override	                
	public 	boolean hasPendingJobs(String userId) {
		List<Job> jobs = getNotCompletedJobs(userId);
		return jobs.size()>0;
	}
	



	@Override
	public void deleteJob(Long jobId, String userId) {
		getLogger().info("Deleting job " + jobId + " by user " + userId);
		Job job = em.find(Job.class,jobId);
		em.remove(job);		
	}



	@Override
	public List<Job> getJobsByFoxVersionIdAndType(Long foxVersionId,Long jobTypeId) {
		String ql = "Select j from Job j where j.jobTypeId=:jobTypeId and exists (select a from JobAction a where a.fromFoxVersionId=:foxVersionId and a.jobId = j.id)";
		TypedQuery<Job> q = em.createQuery(ql, Job.class);
		q.setParameter("jobTypeId", jobTypeId);
		q.setParameter("foxVersionId", foxVersionId);
		return q.getResultList();		
	}

	@Override
	public List<Job> getJobsCompletedBefore(Date date) {
		if (date==null) return new ArrayList<>();
		JobSearchCriteria criteria = new JobSearchCriteria(em);
		criteria.setStatus(JobStatus.COMPLETED.getId());
		criteria.completedBefore(date);
		return criteria.getResultList();
	}
	
	@Override
	public void deleteJobs(List<Job> jobs) {	
		if (jobs==null||jobs.isEmpty()) return;
		for (Job job: jobs) {
			deleteJob(job.getId(),"erm_cleanup");
		}
	}

	@Override
	public void deleteJobsCompletedBefore(Date date) {
		deleteJobs(getJobsCompletedBefore(date));
	}
 


}
