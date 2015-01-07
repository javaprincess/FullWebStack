package com.fox.it.erm.service.reports;

/**
 * Holds the report properties
 * @author AndreasM
 *
 */
public class ReportProperties {
	private String protocol;
	private String serverName;
	private String domainName;
	private String port;
	private String reportsServlet;
	private String ermReportsApp;
	
	public ReportProperties() {
	}

	public String getProtocol() {
		return protocol;
	}

	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}

	public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	public String getDomainName() {
		return domainName;
	}

	public void setDomainName(String domainName) {
		this.domainName = domainName;
	}

	public String getPort() {
		return port;
	}

	public void setPort(String port) {
		this.port = port;
	}

	public String getReportsServlet() {
		return reportsServlet;
	}

	public void setReportsServlet(String reportsServlet) {
		this.reportsServlet = reportsServlet;
	}

	public String getErmReportsApp() {
		return ermReportsApp;
	}

	public void setErmReportsApp(String ermReportsApp) {
		this.ermReportsApp = ermReportsApp;
	}
	
	

}
