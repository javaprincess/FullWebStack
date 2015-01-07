package com.fox.it.erm.rest.xproduct;

import java.util.Map;

import com.fox.it.erm.copy.XProductSections;

/**
 * XProduct copy response
 * It will contain a map of non empty products if the validation did not pass or
 * a job id with the job if the validation was successful
 * @author AndreasM
 *
 */
public class XProductCopyResponse {

	private Map<Long,XProductSections> errors;
	private Long jobId;
	
	public XProductCopyResponse() {

	}

	public Map<Long, XProductSections> getErrors() {
		return errors;
	}

	public void setErrors(Map<Long, XProductSections> errors) {
		this.errors = errors;
	}

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}
	
	
	public boolean isValidationOk() {
		return errors == null || errors.isEmpty();
	}
	

}
