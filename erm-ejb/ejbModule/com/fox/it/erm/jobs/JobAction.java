package com.fox.it.erm.jobs;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fox.it.erm.enums.JobStatus;



@Entity
@Table(name="JOB_ACTION")
public class JobAction extends JobBase{

	@Id
	@SequenceGenerator(name = "JOB_ACTION_SEQ", sequenceName = "JOB_ACTION_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "JOB_ACTION_SEQ")
	@Column(name="JOB_ACTION_ID")	
	private Long id;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="JOB_ID")	
	private Job job;
	
	@Column(name="JOB_ID", insertable=false,updatable=false)
	private Long jobId;
		
		
	@Column(name="FROM_FOX_VERSION_ID")
	private Long fromFoxVersionId;
	
	@Column(name="TO_FOX_VERSION_ID")
	private Long toFoxVersionId;
	
	@Column(name="SPECS")
	private String specs;
	
	@Column(name="ERROR")
	private String error;
	

	@Column(name="COPY_BUSINESS")
	private Boolean copyBusiness;
	
	@Column(name="COPY_LEGAL")
	private Boolean copyLegal;


	public void setJob(Job job){
		this.job = job;
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getJobId() {
		if (jobId==null) {
			jobId = (job!=null?job.getId():null);
		}
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}


	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	public Long getFromFoxVersionId() {
		return fromFoxVersionId;
	}

	public void setFromFoxVersionId(Long fromFoxVersionId) {
		this.fromFoxVersionId = fromFoxVersionId;
	}
	
	public String getStatus() {
		JobStatus status = JobStatus.get(getStatusId());
		if (status==null) return null;
		return status.toString();
	}
	
	public String getStatusCode() {
		JobStatus status = JobStatus.get(getStatusId());
		if (status==null) return null;
		return status.getCode();
		
	}

	public Long getToFoxVersionId() {
		return toFoxVersionId;
	}

	public void setToFoxVersionId(Long toFoxVersionId) {
		this.toFoxVersionId = toFoxVersionId;
	}

	public void setCopyBusiness(Boolean copyBusiness) {
		this.copyBusiness = copyBusiness;
	}


	public void setCopyLegal(Boolean copyLegal) {
		this.copyLegal = copyLegal;
	}
	
	
	public void copyBusinessLegal(boolean isBusiness) {
		this.copyBusiness = isBusiness;
		this.copyLegal = !isBusiness;
	}

	public boolean isCopyBusiness() {
		return Boolean.TRUE.equals(copyBusiness);
	}


	public boolean isCopyLegal() {
		return Boolean.TRUE.equals(copyLegal);
	}


	public void copyBusiness() {
		this.copyBusiness = true;
	}
	
	public void copyLegal() {
		this.copyLegal = true;
	}
	
	

	@Override
	public void setNameFromTitle(String name) {
		setName("XCopy to " + name);
		
	}
	
	
	
}
