package com.fox.it.erm.reports.connection;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fox.it.erm.reports.config.WFServerConfiguration;
import com.fox.it.erm.reports.enums.SQLString;

@Service
public class ConnectionService {
	private Logger log = Logger.getLogger(ConnectionService.class);
	
	@Autowired
	private DataSource dataSource;
	
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}
	
	public void jdbcConnect(ConnectionDetails connectionDetails) {
		    
			JdbcTemplate jdbcTemplate = new JdbcTemplate((DataSource)connectionDetails.getCtx().getBean("dataSource"));
	 
			try {
				int update = jdbcTemplate.update(SQLString.INSERT.getSQLString(), new Object[] { 
					connectionDetails.getUname(), 
					connectionDetails.getToken(), 
					connectionDetails.getQid()});
				
				System.out.println("update: " + update);
			} catch (DataAccessException e) {
				System.out.println("error: " + e.getMessage());
			}
	 
		}
	
	//private void connect(String token, String targetPath, String uname, String qid, String fexFileName, HttpServletResponse httpResponse, HttpServletRequest httpRequest) {
	public void httpConnect(ConnectionDetails connectionDetails) {
			    
			      
			     HttpServletRequest httpRequest = connectionDetails.getRequest();
			     HttpServletResponse httpResponse = connectionDetails.getResponse();
			    
			      System.out.println("4: setting the request attributes");
			      System.out.println("httpRequest: " + httpRequest.getLocalName());
			      System.out.println("httpResponse..#of Headers: " + httpResponse.getHeaderNames().size());	
			      
			      System.out.println("IBToken: " + connectionDetails.getToken());
			      System.out.println("ERMQueryId: " + connectionDetails.getQid());
			      System.out.println("ERMUserId: " + connectionDetails.getUname());
			      System.out.println("FEXFileName: " +  connectionDetails.getFexFileName());
			      System.out.println("ServerConfig: " + connectionDetails.getWfServerConfig().getWfServer());
			      System.out.println("Env: " + connectionDetails.getWfServerConfig().getReportsEnv());
			     
			      
			      httpRequest.setAttribute("IBToken", connectionDetails.getToken());
			      httpRequest.setAttribute("ERMQueryId", connectionDetails.getQid());
			      httpRequest.setAttribute("ERMUserId", connectionDetails.getUname());
			      httpRequest.setAttribute("FEXFileName", connectionDetails.getFexFileName());
			      httpRequest.setAttribute("ServerConfig", connectionDetails.getWfServerConfig().getWfServer());
			      httpRequest.setAttribute("Env", connectionDetails.getWfServerConfig().getReportsEnv());
			     
			     
			      System.out.println("5: using getRequestDispatcher to do the forward to /index.jsp which will then post to WFServlet");
			     
			      try {
					httpRequest.getServletContext().getRequestDispatcher(connectionDetails.getTargetPath()).forward(httpRequest, httpResponse);
			      } catch (ServletException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			      } catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
			      }
			    
			 
		}
	
	
}
