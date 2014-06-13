package com.fox.it.erm.reports.config;

import org.springframework.beans.factory.annotation.Value;

public class WFServerConfiguration {

			
			@Value("${enableUrls}")
			private String enableUrls;
			
			@Value("${wfServer}")
			private String wfServer;
			
			@Value("${reportsEnv}")
			private String reportsEnv;
			
			public String getEnableUrls() {
				return enableUrls;
			}

			public void setEnableUrls(String enableUrls) {
				this.enableUrls = enableUrls;
			}

			public String getWfServer() {
				return wfServer;
			}

			public void setWfServer(String wfServer) {
				this.wfServer = wfServer;
			}

			public String getReportsEnv() {
				return reportsEnv;
			}

			public void setReportsEnv(String reportsEnv) {
				this.reportsEnv = reportsEnv;
			}

}
