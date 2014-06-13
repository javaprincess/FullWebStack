package com.fox.it.erm.reports.enums;

public enum FileType {
	
		EXCEL(1L),
		PDF(2L),
		HTML(3L);
		
		private final Long id;
		
		private FileType(Long id) {
			this.id = id;
		}
		
		public Long getId() {
			return id;
		}
	

}
