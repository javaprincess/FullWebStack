package com.fox.it.erm.jobs;

public interface Jobs {
	
	enum JobType {
		X_COPY(1L),
		X_DELETE(2L);
		private final Long id;
		private JobType(Long id) {
			this.id=id;
		}
		
		public Long getId() {
			return id;
		}
		
		public static final JobType get(Long id) {
			for (JobType jobType:values()) {
				if (jobType.getId().equals(id)) {
					return jobType;
				}
			}
			return null;
		}
	}

}
