package com.fox.it.erm.enums;

public enum JobStatus {
 COMPLETED(1L),
 NOT_STARTED(0L),
 PAUSED(2L),
 ERROR(3L),
 RUNNING(4L),
 STOPPED(5L);

 private final Long id;
 
 private JobStatus(Long id) {
	 this.id = id;
 }
 
 public Long getId() {
	 return id;
 }
 
 public String getCode() {
	 return this.toString().substring(0, 1);
 }
 

 
 public static JobStatus get(Long id) {
	 if (id==null) return null;
	 for (JobStatus status: values()) {
		 if (id.equals(status.getId())) {
			 return status;
		 }
	 }
	 return null;
 }
}
