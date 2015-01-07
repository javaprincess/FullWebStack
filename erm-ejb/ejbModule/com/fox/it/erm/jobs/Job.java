package com.fox.it.erm.jobs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fox.it.erm.enums.JobStatus;
import com.fox.it.erm.jobs.Jobs.JobType;

@Entity
@Table(name="JOB")
public class Job extends JobBase{
	@Id
	@SequenceGenerator(name = "JOB_SEQ", sequenceName = "JOB_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "JOB_SEQ")
	@Column(name="JOB_ID")	
	private Long id;
	
	
	
	@Column(name="OWNER")
	private String owner;
	
	
	@Column(name="JOB_TYPE_ID")
	private Long jobTypeId;
	
	@Column(name="MESSAGE")
	private String message;

	
	@Column(name="NUM_OF_ACITONS")
	private Integer numberOfActions;

	@Column(name="NUM_OF_ACITONS_COMP")	
	private Integer numberOfActionsCompleted;
	
	
	@OneToMany(fetch=FetchType.LAZY, cascade=CascadeType.ALL,mappedBy="job")
	private List<JobAction> actions;

	
	public Job() {
	}	
	
	public Long getId() {
		return id;
	}

	
	public void setId(Long id) {
		this.id = id;
	}


	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public Long getJobTypeId() {
		return jobTypeId;
	}

	public void setJobTypeId(Long jobTypeId) {
		this.jobTypeId = jobTypeId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}


	public List<JobAction> getActions() {
		if (actions==null) {
			actions = new ArrayList<>();
		}
		return actions;
	}

	public void setActions(List<JobAction> actions) {
		this.actions = actions;
		setNumberOfActions(actions==null?0:actions.size());
	}
	
	public void clear() {
		this.actions=null;
	}

	public Integer getNumberOfActions() {
		return numberOfActions;
	}

	public void setNumberOfActions(Integer numberOfActions) {
		this.numberOfActions = numberOfActions;
	}

	public Integer getNumberOfActionsCompleted() {
		return numberOfActionsCompleted;
	}

	public void setNumberOfActionsCompleted(Integer numberOfActionsCompleted) {
		this.numberOfActionsCompleted = numberOfActionsCompleted;
	}

	public void addCompleted() {
		if (numberOfActionsCompleted==null) {
			numberOfActionsCompleted=0;
		}
		numberOfActionsCompleted+=1;
	}
	
	public double getPercentage() {
		int completed = getNumberOfActionsCompleted()==null?0:getNumberOfActionsCompleted().intValue();
		int numberOfActions = getNumberOfActions()==null?0:getNumberOfActions().intValue();
		if (numberOfActions==0L) return 100d;
		return 100 * completed/numberOfActions;
	}

	private JobType getJobType() {
		return JobType.get(jobTypeId);
	}
	
	@Override
	public void setNameFromTitle(String name) {
		if (name != null && name.length() > 180)
	      name = name.substring(0, 180);
		if (JobType.X_COPY==getJobType()) {
			setName("X copy from " + name);
		} else {	
			setName("Job from product " + name);
		}
	}
	
	public boolean isCompleted() {
		return 100 == (int)getPercentage();
	}
	
	public boolean isError() {
		boolean isEqual = isStatus(JobStatus.ERROR); 
		return isEqual;
	}
	
	private boolean isStatus(JobStatus status) {
		return status.getId().equals(getStatusId());
	}
	
	public boolean shouldRun() {
		return !isStatus(JobStatus.PAUSED) &&
			   !isStatus(JobStatus.STOPPED);
	}
	
	public void copyBasic(Job job) {
		setId(job.getId());
		setCompletedDate(job.getCompletedDate());
		setCreateDate(job.getCreateDate());
		setCreateName(job.getCreateName());
		setJobTypeId(job.getJobTypeId());
		setMessage(job.getMessage());
		setName(job.getName());
		setNumberOfActions(job.getNumberOfActions());
		setNumberOfActionsCompleted(job.getNumberOfActionsCompleted());
		setOwner(job.getOwner());
		setStartDate(job.getStartDate());
		setStatusId(job.getStatusId());
		setUpdateDate(job.getUpdateDate());
		setUpdateName(job.getUpdateName());
	}
	
	public JobAction getAction(Long toFoxVersionId) {
		for (JobAction action: getActions()) {
			if (toFoxVersionId.equals(action.getToFoxVersionId())) {
				return action;
			}
		}
		return null;
	}

}
