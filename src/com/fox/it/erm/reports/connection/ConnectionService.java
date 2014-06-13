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
	
	/*@Deprecated
	public void connect(String token, String uname, Long qid) {
		Connection connection = null;
		Statement statement = null;
		StringBuilder queryString = null;
		String connectionURL = null;
		int updateQuery = 0;
		
		try {
			
				
				//FIX ME...NEED A SPRINGBEAN HERE
				connectionURL = 
						"jdbc:oracle:thin:@FFEUSCNUXDB80.foxinc.com:1521:EDMD1";  
				
				log.info("connectionURL: " + connectionURL);
				
				Class.forName("oracle.jdbc.driver.OracleDriver");  
				
				connection = DriverManager.getConnection
						(connectionURL, "WFSYS", "Wf5y5_dev");
				//FIX ME...NEED A SPRINGBEAN HERE
				
				statement = connection.createStatement(); 
				
				queryString = new StringBuilder();
				//queryString.append("insert into WF_SECURITY_SSO_AUTH (IBUSER, IBTOKEN, LOGIN_DATE, QUERY_ID) values (");
				queryString.append("insert into WF_SECURITY_SSO_AUTH (IBUSER, IBTOKEN, QUERY_ID) values (");
				queryString.append("'");
				queryString.append(uname);
				queryString.append("' , '");
				queryString.append(token);
				queryString.append("', ");
				queryString.append(qid);
				queryString.append(")");
				
				
				log.info("queryString: " + queryString.toString());
				
				updateQuery = statement.executeUpdate(queryString.toString());  
	
				if (updateQuery != 0) 
					log.info("table is created successfully and " + updateQuery + " row is inserted.");
	
				connection.commit();
				statement.close();
				connection.close();
	
				
		} catch (ClassNotFoundException cNFE) {
			log.info("no suitable driver error: " + cNFE.getMessage());
		} catch (Exception e) {
			log.info("error: " + e.getMessage());
		} 
	}
	*/
}
