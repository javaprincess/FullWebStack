package com.fox.it.erm.util;

import java.util.List;

public class CopyObject {
	private List<Long> ids;
	
	private List<Long> targetProductVersionIds;
	private Long fromProductVersionId;
	

	
	public CopyObject() {
	}



	public List<Long> getIds() {
		return ids;
	}



	public void setIds(List<Long> ids) {
		this.ids = ids;
	}



	public List<Long> getTargetProductVersionIds() {
		return targetProductVersionIds;
	}



	public void setTargetProductVersionIds(List<Long> targetProductVersionIds) {
		this.targetProductVersionIds = targetProductVersionIds;
	}



	public Long getFromProductVersionId() {
		return fromProductVersionId;
	}



	public void setFromProductVersionId(Long fromProductVersionId) {
		this.fromProductVersionId = fromProductVersionId;
	}
	
	

}
