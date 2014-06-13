package com.fox.it.erm.reports;

import java.io.IOException;
import java.util.Calendar;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.fox.it.erm.reports.config.WFServerConfiguration;
import com.fox.it.erm.reports.connection.ConnectionDetails;
import com.fox.it.erm.reports.connection.ConnectionService;
import com.fox.it.erm.reports.factory.ERMReport;
import com.fox.it.erm.reports.factory.ERMReportFactory;


@WebServlet(name="ERMReportsProxyService", urlPatterns = {"/reports"})
public class ERMReportsProxyService extends HttpServlet {
	
	@Autowired
	ConnectionService connectionService;

	Logger log = Logger.getLogger(ERMReportsProxyService.class);

	private static final long serialVersionUID = 1L;
	private WFServerConfiguration wfServerConfig = null;
	
	private ApplicationContext ctx;
	
	private List<ERMReport> ermReportList = null;
	
	public void init() {
		ctx = new ClassPathXmlApplicationContext(new String[] {"WEB-INF/config-servlet.xml", "WEB-INF/reports-servlet.xml"});
		wfServerConfig = (WFServerConfiguration)ctx.getBean("WFServer");
		ERMReportFactory.setContext(ctx);
		ERMReportFactory.register();
		ermReportList = ERMReportFactory.getErmReportList();
		
	} 
	
	public void destroy() {
		ctx = null;
	}

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ERMReportsProxyService() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		log.info("doGet");
		processRequest(request, response);
		}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		 
		log.info("doPost");
		 processRequest(request, response);
		
		
	}

	protected String processRequest(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		//ConnectionService connectionHandler = new ConnectionService();
		
		response.setContentType("text/html;charset=UTF-8");
	
		String qid;
		String uname;
		int reportFormat;
		String reportName;
		String token = null;
		String shortName =  null;
		ERMReport ermReport = null;

		
		
		try {
			
				
			qid = request.getParameter("ERMQueryId");
			uname = request.getParameter("ERMUserId");
			reportFormat = Integer.parseInt(request
					.getParameter("ERMReportFormat"));
			reportName = request.getParameter("ERMReportName");
			token = request.getParameter("tokenId").replace("-", "");

			System.out.println("-------------------STARTING TO PROCESS REQUEST FOR REPPORT: " + Calendar.getInstance().getTime() + "--------------");
			
			shortName = new StringBuilder(reportName).append(reportFormat).toString();
			System.out.println("configured short name: " + shortName);
			
			System.out.println("number of reports configured in the system: " + ermReportList.size());
			
			ermReport = findReportBean(shortName);
			
			System.out.println("1: inserting token, uname and queryId into WF_SECURITY_SSO_AUTH DB");
			
			ConnectionDetails connectionDetails = new ConnectionDetails();
			connectionDetails.setCtx(ctx);
			connectionDetails.setQid(new Long(qid));
			connectionDetails.setToken(token);
			connectionDetails.setUname(uname);
			connectionDetails.setWfServerConfig(wfServerConfig);
			
			
			System.out.println("2: setting forward url to /index.jsp");
			connectionDetails.setTargetPath(new String("/index.jsp"));
			System.out.println("securityController targetPath: " + connectionDetails.getTargetPath());
			
			connectionDetails.setFexFileName(ermReport.getFexFileName());
			connectionDetails.setRequest(request);
			connectionDetails.setResponse(response);
			
			System.out.println("ERMQueryId   " + qid);
			System.out.println("ERMUserId   " + uname);
			System.out.println("token: " + token);
			System.out.println("username: " + uname);
			System.out.println("queryId: " + qid);
			System.out.println("fexFileName: " + ermReport.getFexFileName());
			System.out.println("shortName: " + shortName);
			
			connectionService = new ConnectionService();
			connectionService.jdbcConnect(connectionDetails);
			connectionService.httpConnect(connectionDetails);

				
		} catch (Exception ex) {

			System.out.println("error message: " + ex.getMessage());


		} finally {

			System.out.println("-------------------REQUEST FOR REPORT IS COMPLETE: " + Calendar.getInstance().getTime() + "--------------");

		}

		return "success";

	}


	private ERMReport findReportBean(String shortName) {
		
		ERMReport ermReport = null;
		
		for (ERMReport theReport: ermReportList) 
			if (theReport.getShortName().equals(shortName)) 
				return theReport;
		
		return ermReport;
	}
	

}
