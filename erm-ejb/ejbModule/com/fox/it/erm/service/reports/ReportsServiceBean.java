package com.fox.it.erm.service.reports;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.query.QueryParameters;
import com.fox.it.erm.query.QueryParametersWrapper;
import com.fox.it.erm.query.SavedQuery;
import com.fox.it.erm.reports.Reports;
import com.fox.it.erm.service.impl.ServiceBase;
import com.fox.it.erm.service.query.QueryService;
import com.fox.it.erm.util.converters.JsonToQueryParametersConverter;


@Stateless
public class ReportsServiceBean extends ServiceBase implements ReportsService {

	@Inject
	private EntityManager eM;
	
	
	@Inject
	@EJB
	private QueryService queryService;
	
	
	@Inject
	private JsonToQueryParametersConverter queryParamsConverter;
	
	
//	private ApplicationContext ctx;
	
	private Logger logger = Logger.getLogger(ReportsServiceBean.class.getName());
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Reports> findAllReports() throws ErmException {
		
		logger.info("Finding all report data....");
		
		String queryStr = new String("SELECT r from Report r");
	
		return eM.createQuery(queryStr).getResultList();
	}
	
	@SuppressWarnings("unchecked")
	public MicroStrategyReportConfig getReportProperties(ReportMetaData reportMetaData) {
		//EntityManager eM = getEntityManagerFactory().createEntityManager();
		
		MicroStrategyReportConfig reportProperties = null;
		reportProperties = (MicroStrategyReportConfig) eM.createNativeQuery(
					//"SELECT REPORT_NAME, REPORT_FORMAT, SRC, EXECUTION_MODE, ENVIRON_NAME, PROJECT, MS_URL, DOCUMENT_ID from REPORTS_CONFIG where REPORT_NAME='DRR' and REPORT_FORMAT='EXCEL'", MicroStrategyReportConfig.class)
				"SELECT * from REPORTS_CONFIG where REPORT_NAME=? and REPORT_FORMAT=?", MicroStrategyReportConfig.class)	
				.setParameter(1, reportMetaData.getReportNameStr())
				.setParameter(2, reportMetaData.getReportNameType())
				.getSingleResult(); 		
		//eM.close();
	
		logger.info("reportProperties.evt: " + reportProperties.getEvt());
		logger.info("reportProperties.documentID: " + reportProperties.getDocumentID());
		logger.info("reportProperties.serverName: " + reportProperties.getServerName());
		
		return reportProperties;
	}

	@Override
	public ReportsProxy findAllReportMetadata(String userId, boolean isBusiness)
			throws ErmException {
		
		setUserInDBContext(userId, isBusiness);
		
		return new ReportsProxy(userId, eM);
	}

	//this method can be called with or WITHOUT having a queryId generated
	//for the cases where there is no queryId, that means the user HAS NOT saved this particular query
	//and is running an "ad-hoc" query and a subsequent report
	//if a queryId exists, then the user has saved the query params and is now requesting the query that
	//was just saved be executed
	public ReportMetaData submit(String json, Long reportFormat, String reportName,  String userId, boolean isBusiness)
		throws ErmException {
		logger.info("ReportsServiceBean.submit() with userId: " + userId);
		ReportMetaData  reportMetaData = new ReportMetaData();
		setUserInDBContext(userId, isBusiness);
		
		QueryParametersWrapper parameters = queryParamsConverter.convert(json);
		List<QueryParameters> parametersList = parameters.getQueryParametersList();
		SavedQuery savedQuery = parameters.getSavedQuery();
		Long savedQueryId = savedQuery.getId();
		String reportNameStr = null;
		String reportNameFormat = null;
		
		for(QueryParameters p : parametersList){
			
			logger.info("parameter Name: " + p.getName());
			logger.info("parameter Value: " + p.getValue());
			
			if("ReportName".equals(p.getName())){
				reportNameStr = p.getValue();
			}
			
			if("ReportFormat".equals(p.getName())){
				reportNameFormat = p.getValue();
			}
		}
		
		//is this an ad-hoc query or a named query?
		//if the createName is null then this is a ad-hoc query
		if (savedQueryId == -1) {
			logger.info("before ReportsServiceBean.submit() for userId: " + userId + " with queryId: " + savedQueryId);
			//save queryparams but I don't need to generate a queryHeader, so I can just call the queryService.save(..)
			savedQueryId = queryService.save(json, userId, isBusiness);
			logger.info("saved ReportsServiceBean.submit() for userId: " + userId + " with queryId: " + savedQueryId);			
		}
		reportMetaData.setReportNameFormat(reportNameFormat);
		reportMetaData.setReportNameStr(reportNameStr);
		reportMetaData.setUserName(userId);
		reportMetaData.setQueryId(savedQueryId);
		reportMetaData.setReportURL(buildReportsURL(userId, savedQueryId, reportNameStr, reportNameFormat));
		
		return reportMetaData;
	}
	
	/**
	 * 
	 * @param json
	 * @param reportFormat
	 * @param reportName
	 * @param queryId
	 * @param userId
	 * @param isBusiness
	 * @return
	 * @throws ErmException
	 */
	public ReportMetaData runQuery(String json, String userId, boolean isBusiness)
			throws ErmException {
			
			setUserInDBContext(userId, isBusiness);
			
			ReportMetaData reportMetaData = new ReportMetaData();
			QueryParametersWrapper parameters = queryParamsConverter.convert(json);
			List<QueryParameters> parametersList = parameters.getQueryParametersList();
			Long savedQueryId = new Long(-1); 
			String reportNameStr = null;
			String reportNameFormat = null;
			String reportNameType = null;
			
			for(QueryParameters p : parametersList){
				
				logger.info("parameter Name: " + p.getName());
				logger.info("parameter Value: " + p.getValue());
				
				if("ReportName".equals(p.getName())){
					reportNameStr = p.getValue();
				}
				
				if("ReportFormat".equals(p.getName())){
					reportNameFormat = p.getValue();
				}
				
				if("ReportFormat".equals(p.getName())){
					reportNameType = p.getText();
				}
			}
			
			savedQueryId = queryService.save(json, userId, isBusiness);		
			logger.info("saved ReportsServiceBean.submit() for userId: " + userId + " with queryId: " + savedQueryId);
			
			reportMetaData.setQueryId(savedQueryId);
			//reportMetaData.setReportURL(buildReportsURL(userId, savedQueryId, reportNameStr, reportNameFormat));
			//TODO: for POC...remove for SIT
		
			reportMetaData.setReportNameFormat(reportNameFormat);
			reportMetaData.setReportNameStr(reportNameStr);
			reportMetaData.setReportNameType(reportNameType);
			reportMetaData.setUserName(userId);
			//reportMetaData.setReportURL("http://localhost:7001/erm/rest/report/reportsIntegration");
			
			return reportMetaData;
	}

	public String buildReportsURL(String userId, 
			Long savedQueryId, 
			String reportNameStr, 
			String reportNameFormat) {

		@SuppressWarnings("resource")
		ApplicationContext ctx =
			    new ClassPathXmlApplicationContext(new String[] {"META-INF/applicationcontext.xml"});
		ReportServerConfiguration reportServerConfig = (ReportServerConfiguration)ctx.getBean("reportServer");
		
		////////////////PREFIX BEGIN////////////////
		StringBuilder reportURL = new StringBuilder(reportServerConfig.getProtocol());
		reportURL.append(reportServerConfig.getServerName());
		reportURL.append(".");
		reportURL.append(reportServerConfig.getDomainName());
		reportURL.append(":");
		reportURL.append(reportServerConfig.getPort());
		reportURL.append("/");
		reportURL.append(reportServerConfig.getReportsServlet());
		reportURL.append("/");
		reportURL.append(reportServerConfig.getErmReportsApp());
		reportURL.append("?");
		////////////////PREFIX END////////////////
		////////////////PARAMS START//////////////
		reportURL.append("ERMUserId=");
		reportURL.append(userId);
		reportURL.append("&ERMQueryId=");
		reportURL.append(savedQueryId);
		reportURL.append("&ERMReportFormat=");
		reportURL.append(reportNameFormat);
		reportURL.append("&ERMReportName=");
		reportURL.append(reportNameStr);
		reportURL.append("&tokenId=");
		reportURL.append(UUID.randomUUID());
		String reportURLStr = reportURL.toString();
		////////////////PARAMS END//////////////
		
		//http://ffeuscnuxap287:7001/FxpReportsSC/ermReports?ERMUserId=GHANASHYAMJ&ERMQueryId=212145732&ERMReportFormat=1&ERMReportName=RER"
		logger.info("setting the reports url to: " + reportURLStr);
		
		
		return reportURLStr;
	}
}
