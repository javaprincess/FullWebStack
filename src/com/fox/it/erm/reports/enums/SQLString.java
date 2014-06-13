package com.fox.it.erm.reports.enums;

public enum SQLString {
	
		INSERT("insert into WF_SECURITY_SSO_AUTH (IBUSER, IBTOKEN, QUERY_ID) values (?, ?, ?)");
		
		private final String queryString;
		
		private SQLString(String queryString) {
			this.queryString = queryString;
		}
		
		public String getSQLString() {
			return queryString;
		}
	

}
