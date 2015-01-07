package com.fox.it.erm.rest;

import java.util.Date;
import java.util.List;

import javax.ejb.EJB;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.service.JobService;
import com.fox.it.erm.util.DateUtil;

/**
 * REST service to manage jobs and provide job's progress
 * @author AndreasM
 *
 */
@Path("/Jobs")
public class JobsRESTService extends RESTService{
	
	@EJB
	private JobService jobService;
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/jobs")	
	public List<Job> getAllNotCompletedJobs(@Context HttpServletRequest request) {
		String userId = getUserId(request);
		return jobService.getNotCompletedJobs(userId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/jobs/all")		
	public List<Job> getAllJobs(@Context HttpServletRequest request) {
		String userId = getUserId(request);
		return jobService.getAllJobsByUser(userId);		
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/{jobId: \\d+}")		
	public Job getJobStatus(@PathParam("jobId") Long jobId) {
		return jobService.getBasicJob(jobId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/detail/{jobId: \\d+}")		
	public Job getJobDetails(@PathParam("jobId") Long jobId) {
		return jobService.getJobDetails(jobId);
	}
	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/haspending")
	public boolean hasPendingJobs(@Context HttpServletRequest request) {
		String userId = getUserId(request);
		return jobService.hasPendingJobs(userId);		
	}
	
	@PUT
	@Path("/stop/{jobId: \\d+}")
	public void stopJob(@Context HttpServletRequest request,@PathParam("jobId") Long jobId) {
		String userId = getUserId(request);
		jobService.stop(jobId, userId);
	}
	
	@POST	
	@Path("/delete/{jobId: \\d+}")		
	public void deleteJob(@Context HttpServletRequest request,@PathParam("jobId") Long jobId) {
		String userId = getUserId(request);
		jobService.deleteJob(jobId, userId);		
	}
	
	@GET
	@Path("/cleanup")
	public void cleanUpJobs() {
		jobService.deleteJobsCompletedBefore(DateUtil.subtractDays(new Date(), 2));	
	}
	
	
}
