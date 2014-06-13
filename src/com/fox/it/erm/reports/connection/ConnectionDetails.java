package com.fox.it.erm.reports.connection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;

import com.fox.it.erm.reports.config.WFServerConfiguration;

public class ConnectionDetails {
	
	private String token;
	private String uname;
	private Long qid; 
	private String targetPath;
	private HttpServletResponse response;
	private HttpServletRequest request;
	private String fexFileName;
	private WFServerConfiguration wFServerConfig;
	
	private ApplicationContext ctx;
	
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public String getUname() {
		return uname;
	}
	public void setUname(String uname) {
		this.uname = uname;
	}
	public Long getQid() {
		return qid;
	}
	public void setQid(Long qid) {
		this.qid = qid;
	}
	public ApplicationContext getCtx() {
		return ctx;
	}
	public void setCtx(ApplicationContext ctx) {
		this.ctx = ctx;
	}
	public String getTargetPath() {
		return targetPath;
	}
	public void setTargetPath(String targetPath) {
		this.targetPath = targetPath;
	}
	public HttpServletResponse getResponse() {
		return response;
	}
	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
	public HttpServletRequest getRequest() {
		return request;
	}
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
	public String getFexFileName() {
		return fexFileName;
	}
	public void setFexFileName(String fexFileName) {
		this.fexFileName = fexFileName;
	}
	public WFServerConfiguration getWfServerConfig() {
		return wFServerConfig;
	}
	public void setWfServerConfig(WFServerConfiguration wFServerConfig) {
		this.wFServerConfig = wFServerConfig;
	}
	
	

}
