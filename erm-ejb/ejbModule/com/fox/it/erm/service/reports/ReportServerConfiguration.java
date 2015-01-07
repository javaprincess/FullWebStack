package com.fox.it.erm.service.reports;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ReportServerConfiguration {

	///REPORTS SERVER PARAM CONFIG INJECTION
		@Value("${protocol}")
		private String protocol;
		
		@Value("${serverName}")
		private String serverName;
		
		@Value("${domainName}")
		private String domainName;
		
		@Value("${port}")
		private String port;
		
		@Value("${reportsServlet}")
		private String reportsServlet;
		
		@Value("${ermReportsApp}")
		private String ermReportsApp;
		///REPORTS SERVER PARAM CONFIG INJECTION

		public String getProtocol() {
			return protocol;
		}

		public String getServerName() {
			return serverName;
		}

		public String getDomainName() {
			return domainName;
		}

		public String getPort() {
			return port;
		}

		public String getReportsServlet() {
			return reportsServlet;
		}

		public String getErmReportsApp() {
			return ermReportsApp;
		}

		public void setProtocol(String protocol) {
			this.protocol = protocol;
		}

		public void setServerName(String serverName) {
			this.serverName = serverName;
		}

		public void setDomainName(String domainName) {
			this.domainName = domainName;
		}

		public void setPort(String port) {
			this.port = port;
		}

		public void setReportsServlet(String reportsServlet) {
			this.reportsServlet = reportsServlet;
		}

		public void setErmReportsApp(String ermReportsApp) {
			this.ermReportsApp = ermReportsApp;
		}
}
