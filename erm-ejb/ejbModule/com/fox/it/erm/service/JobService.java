package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Job;


@Local
public interface JobService {
	
	void create(Job job,String userId);
	
	void setJobActionCurrentTx(Long actionId, JobStatus status,String userId);	
	
	void setStatus(Long jobId,JobStatus status,String userId);
	void setCompleted(Long jobId,String userId);
	void stop(Long jobId,String userId);
	void resume(Long jobId,String userId);
	void start(Long jobId,String userId);
	void setError(Long id, String message,String userId);
	
	void setJobAction(Long actionId, JobStatus status,String userId);
	void setCompletedAction(Long actionId,String userId);
	void setErrorAction(Long actionId, String message,String userId);
	
	List<Job> getAllJobsByUser(String userId);
	List<Job> getNotCompletedJobs(String userId);
	List<Job> getJobsByFoxVersionIdAndType(Long foxVersionId, Long jobTypeId);
	
	void deleteJob(Long jobId,String userId);
	
	/**
	 * Returns the Job object (without the job actions)
	 * This is done for performance to provide status to the client.
	 * @param id
	 * @return
	 */
	Job getBasicJob(Long id);
	
	boolean shouldRun(Long id);
	/**
	 * Returns the Job and its actions
	 * @param id
	 * @return
	 */
	Job getJobDetails(Long id);
	
	Integer getPendingJobsCount(String userId);
		
	boolean hasPendingJobs(String userId);
	
	List<Job> getJobsCompletedBefore(Date date);
	
	void deleteJobs(List<Job> jobs);
			
	void deleteJobsCompletedBefore(Date date);	
}
