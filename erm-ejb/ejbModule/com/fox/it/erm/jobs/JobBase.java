package com.fox.it.erm.jobs;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fox.it.erm.enums.JobStatus;

@MappedSuperclass
public abstract class JobBase {

	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;

	@Column(name="NAME")
	private String name;
	
	@Column(name="STATUS_ID")
	private Long statusId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="START_DT")
	private Date startDate;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="COMPLETED_DT")
	private Date completedDate;

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getStatusId() {
		return statusId;
	}

	public void setStatusId(Long statusId) {
		this.statusId = statusId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(Date completedDate) {
		this.completedDate = completedDate;
	}
	
	public abstract void setNameFromTitle(String name);
	
	public abstract Long getId();
	
	public abstract void setId(Long id);
	
	private JobStatus getJobStatus(Long statusId) {
		if (statusId==null) return null;
		JobStatus  status = JobStatus.get(statusId);
		return status;
		
	}
	
	public String getStatus() {
		JobStatus status = getJobStatus(getStatusId());
		if (status==null) return null;
		return status.toString();
	}
	
	
	
}
