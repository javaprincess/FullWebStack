package com.fox.it.erm.service.query;



import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.query.ProductParameters;
import com.fox.it.erm.query.QueryHeader;
import com.fox.it.erm.query.QueryParameters;
import com.fox.it.erm.query.QueryParametersWrapper;
import com.fox.it.erm.query.QuerySearchCriteria;
import com.fox.it.erm.query.QuerySearchObject;
import com.fox.it.erm.query.SavedQuery;
import com.fox.it.erm.reports.Reports;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.service.impl.JsonToDeleteSavedQueryObjectConverter;
import com.fox.it.erm.service.impl.ServiceBase;
import com.fox.it.erm.user.ERMUserRole;
import com.fox.it.erm.util.DeleteSavedQueryObject;
import com.fox.it.erm.util.converters.JsonToQueryParametersConverter;
import com.fox.it.erm.util.converters.JsonToSavedQueryConverter;

@Stateless
public class QueryServiceBean extends ServiceBase implements QueryService {

	@Inject
	EntityManager eM;
	
	@Inject
	JsonToQueryParametersConverter queryParamsConverter;
	
	@Inject
	JsonToSavedQueryConverter savedQueryConverter;
	
	
	private JsonToQuerySearchObjectConverter querySearchObjectConverter = new JsonToQuerySearchObjectConverter(new JacksonJsonService());
	private JsonToDeleteSavedQueryObjectConverter deleteSavedQueryObjectConverter = new JsonToDeleteSavedQueryObjectConverter(new JacksonJsonService()); 
	
	private Logger logger = Logger.getLogger(QueryServiceBean.class.getName());
	
	private final int MAX_QUERYNAME_SIZE = 100;
	
	@SuppressWarnings("unchecked")
	@Override
	public List<SavedQuery> findAllQueriesByUserId(String userId)
			throws ErmException {
		
		
		logger.info("finding all the saved queries for: " + userId);
		
		
		return eM.createQuery(
				"SELECT q from SavedQuery q where q.name like :userId")
				.setParameter("userId", userId)
				.getResultList();
	}
	
	@SuppressWarnings("unchecked")
	@Override
	//called from reports home page
	public QueryHeader retrieveQueryParams(String json, Long foxVersionId,
			Long reportId, String userId, boolean isBusiness)
			throws ErmException {
		
		setUserInDBContext(userId, isBusiness);

		 
		logger.info("finding the source (reportName)  to be used for: " + reportId);
		
	QueryHeader queryHeader = new QueryHeader();
		
		logger.info("finding fullName for userId: " + userId);
		
		 List<ERMUserRole> userRole = eM.createQuery(
					"SELECT u from ERMUserRole u where upper(u.loginId) = :userId")
					.setParameter("userId", userId.toUpperCase())
//					.setParameter("userId", userId)
					.getResultList();
		 
		 queryHeader.setUserFullName(userRole.get(0).getFullName());

		 
		logger.info("finding the source (reportName) to be used for: " + reportId);
		
		Reports theReport = eM.find(Reports.class, reportId);
		
		queryHeader.setReportName(theReport.getDescription());
		
		//store the queryId in QueryHeader.setQueryId()
		 //queryHeader.setQueryId(generateQueryId(reportId, userId));
		queryHeader.setQueryId(new Long(-1));
		
		 return queryHeader;
	}

	@SuppressWarnings("unchecked")
	@Override
	//called from save query params page
	public QueryHeader saveQueryParams(String json, Long foxVersionId,
			Long reportId, String userId, boolean isBusiness)
			throws ErmException {
		
		setUserInDBContext(userId, isBusiness);
		
		QueryHeader queryHeader = new QueryHeader();
		
		logger.info("finding fullName for userId: " + userId);
		
		//TODO why user role, if any we should get it from user table
		 List<ERMUserRole> userRole = eM.createQuery(
					"SELECT u from ERMUserRole u where upper(u.loginId) = :userId")
					.setParameter("userId", userId.toUpperCase())
//					.setParameter("userId", userId)
					.getResultList();
		 
		 queryHeader.setUserFullName(userRole.get(0).getFullName());
		 
		logger.info("finding the source (reportName) to be used for: " + reportId);
		
		Reports theReport = eM.find(Reports.class, reportId);
		
		queryHeader.setReportName(theReport.getDescription());
		
		//store the queryId in QueryHeader.setQueryId()
		 queryHeader.setQueryId(generateQueryId(reportId, userId));
		
		 return queryHeader;
	}

	@Override
	//called from save query dialog
	public Long save(String json, String userId,
			boolean isBusiness) throws ErmException {
		
		setUserInDBContext(userId, isBusiness);
		 
		logger.info("QueryServiceBean.save() userId: " + userId + " json: " + json);
		
		//PROBLEMO!!!! HOW DOES THE JSON GET SEPARATED OUT TO SPECIFIC PARAM objects for DB insertion??????
		//Answer:  the WRAPPER does it for you by generating a list of QueryParemeter objects
		//then you can insert each object as a row in the SVD_QRY_PARAM tbl
		 QueryParametersWrapper parameters = queryParamsConverter.convert(json);
		 
		 List<QueryParameters> parametersList = parameters.getQueryParametersList();
		 SavedQuery savedQuery = parameters.getSavedQuery();
		 Long queryId = savedQuery.getId();
		 logger.info("QueryServiceBean userId: " + userId + " queryId: " + queryId + " json: " + json);		 
		 List<ProductParameters> productParametersList = parameters.getProductParametersList();
		 
		 //BUG 20703
		 String queryName = savedQuery.getName();
		 logger.info("queryName: " + queryName);
		 if (queryName.length() > MAX_QUERYNAME_SIZE)
			 throw new ErmException("Your query name exceeds the maximum size of 100 characters.  Please rename your query; the current size is: " + queryName.length());
		//BUG 20703
		 
		 try {
	
			//update the savedQuery to svd_qry
			 savedQuery.setUpdateName(userId);
			 savedQuery.setUpdateDate(new Date(Calendar.getInstance().getTimeInMillis()));
			 savedQuery.setCreateName(userId);
			 savedQuery.setCreateDate(new Date(Calendar.getInstance().getTimeInMillis()));
			 if(queryId == -1){
				 savedQuery.setId(null);
				 eM.persist(savedQuery);
				 eM.flush();
				 queryId = savedQuery.getId();
				 logger.info("Persisted queryId " + queryId + " for user: " + userId);
			 }
			 else {
				 eM.merge(savedQuery);
			 }
			 
			 Date date = new Date(Calendar.getInstance().getTimeInMillis());
			//create relations
			 //eM.persist(parameterInfo);
			 //I'm not sure if the json set back for a query that has 0 product parameters gets null or
			 //just doesn't exist....
			 //TODO: integration testing
			 if ((productParametersList != null) && (productParametersList.size() > 0)) 
				 for(ProductParameters param : productParametersList){
					 param.setQueryId(queryId);
					 param.setCreateDate(date);
					 param.setUpdateDate(date);
					 param.setCreateName(userId);
					 param.setUpdateName(userId);
					 
					 eM.persist(param);
				 }
					 
				

			//save each object as a row in svd_qry_param
			 for(QueryParameters param : parametersList){
				 param.setCreateName(userId);
				 param.setUpdateName(userId);
				 param.setQueryId(queryId);
				 param.setCreateDate(date);
				 param.setUpdateDate(date);
				 param.setQueryId(queryId);
				 if("ProductSelected".equals(param.getName())){
					 param.setValue(queryId.toString());
				 }
				 eM.persist(param);
			 }
				 
		 } catch (Exception e) {
			 throw new ErmException("something really bad happend while trying to persist to the saved query params or updating the svd_qry table: " +  json,e);
		 }
		
		logger.info("QueryServiceBean.save() returning " + queryId + " from userId: " + userId);
		return queryId;
	}
	
	@SuppressWarnings({ "unchecked"})
	public Long generateQueryId(Long reportId, String userId) throws ErmException {
		 SavedQuery savedQuery = new SavedQuery();
		 savedQuery.setSourceReportId(reportId);
		 savedQuery.setCreateName(userId);
		
		 
		 logger.info("reportId: " + reportId);
		 logger.info("userId: " + userId);
		 
		 List<SavedQuery> query = null;
		 
		 try {
			 //save to svd_qry -- generates queryId
			 eM.flush();
			 eM.persist(savedQuery);
			
			 
			 //get the queryId..queryId is the PK and I need to find the PK's value
			 //gets the most recent queryId saved by this user
			 query = eM.createQuery(
						"SELECT r from SavedQuery r where r.createName = :createName order by r.id desc")
						.setParameter("createName", userId)
						.getResultList();
			 
		 } catch (Exception e) {
			 throw new ErmException("something really bad happend while trying to persist to the saved query model. here is the reportId: " + reportId, e);
		 }
		 
		 if (query.size() > 0 ) 
			 return query.get(0).getId();
		 else
			 return -1L;  //no query results....this should not happen and if it does it is a bug.
				 
	}

	@SuppressWarnings("unchecked")
	@Override
	public QueryParametersWrapper retrieveQuery(Long queryId, String userId, boolean isBusiness) throws ErmException {
		setUserInDBContext(userId, isBusiness);
		
		QueryParametersWrapper queryParamWrapper = new QueryParametersWrapper();
		
		List<QueryParameters> queryParametersList = null;
		List<ProductParameters> productParametersList = null;
	
		
		try {
			logger.log(Level.INFO, "STARTING TO RETRIEVE QUERY PARAMETERS...");
			//get the query parameters
			//TODO either use native sql or use SearchCriteria
			 queryParametersList = eM.createQuery(
						"SELECT q from QueryParameters q where q.queryId = :queryId order by q.queryId desc")
						.setParameter("queryId", queryId)
						.getResultList();
			 
			 queryParamWrapper.setQueryParametersList(queryParametersList);
			 logger.log(Level.INFO, "Retrieved QUERY PARAMETER LIST...");
			 
			//get the product parameters
			 productParametersList = (List<ProductParameters>) eM.createQuery(
						"SELECT p from ProductParameters p where p.queryId = :queryId order by p.queryId desc")
						.setParameter("queryId", queryId)
						.getResultList();
			 
			 queryParamWrapper.setProductParametersList(productParametersList);
			 logger.log(Level.INFO, "Retrieved QUERY PRODUCT PARAMETER LIST...");
			 
			//get and set the saved query
			 queryParamWrapper.setSavedQuery(eM.find(SavedQuery.class, queryId));
			 logger.log(Level.INFO, "Retrieved SAVED QUERY...");
		} catch (Exception e) {
			e.printStackTrace();
			throw new ErmException("something bad happened while trying to retrieve the query with queryId:" + queryId, e);
		}
		
		return queryParamWrapper;
	}
	
	/**
	 * 
	 * @param qso
	 * @return
	 * @throws ErmException
	 */
	public List<SavedQuery> findSavedQueries(@NotNull QuerySearchObject qso, String userId) throws ErmException{
		try {
			QuerySearchObjectToQuerySearchCriteriaConverter converter = new QuerySearchObjectToQuerySearchCriteriaConverter();
			QuerySearchCriteria qsc = new QuerySearchCriteria(eM);
			converter.convert(qso, qsc, userId, true);			
			//qsc.addSort("name", true);
			//qsc.addSort("createDate", true);
			List<SavedQuery> otherUsersSavedQueries = qsc.getResultList();
			qso.setPublicFlag(null);
			qso.setCreateName(userId);
			qsc.getPredicates().clear();
			converter.convert(qso, qsc, userId, false);
			List<SavedQuery> userSavedQueries = qsc.getResultList();
			if(otherUsersSavedQueries != null){
				if(userSavedQueries !=  null && userSavedQueries.size() > 0){
					otherUsersSavedQueries.addAll(userSavedQueries);
				}
			}
			else if(userSavedQueries != null && userSavedQueries.size() > 0){
				otherUsersSavedQueries = userSavedQueries;
			}
			else {
				otherUsersSavedQueries = new ArrayList<SavedQuery>();
			}
			Collections.sort(otherUsersSavedQueries, new Comparator<SavedQuery>(){
				@Override
				public int compare(SavedQuery o1, SavedQuery o2) {
					if(o1 != null && o2 != null){
						String n1 = o1.getName();
						String n2 = o2.getName();
						if(n1 != null && n2 != null){
							return n1.compareToIgnoreCase(n2);
						}
					}
					return 0;
				}
				
			});
			return otherUsersSavedQueries;
		}
		catch(Exception ex){
			ex.printStackTrace();
			throw new ErmException(" Problem processing query search : ", ex);
		}		
	}
	
	/**
	 * 
	 * @param json
	 * @return
	 * @throws ErmException
	 */
	public List<SavedQuery> findSavedQuery(@NotNull String json, String userId, boolean isBusiness) throws ErmException{
		this.setUserInDBContext(userId, isBusiness);
		QuerySearchObject qso = querySearchObjectConverter.convert(json);
		return findSavedQueries(qso, userId);
	}
	
	/**
	 * 
	 * @param json
	 * @param userId
	 * @return
	 */
	public List<Long> deleteSavedQuery(@NotNull String json, String userId, boolean isBusiness){
		this.setUserInDBContext(userId, isBusiness);
		DeleteSavedQueryObject dsqo = this.deleteSavedQueryObjectConverter.convert(json);
		return deleteSavedQuery(dsqo, userId);
	}
	
	/**
	 * 
	 * @param dsqo
	 * @param userId
	 * @return
	 */
	public List<Long> deleteSavedQuery(DeleteSavedQueryObject dsqo, String userId){
		List<Long> deletedIds = new ArrayList<Long>();
		if(dsqo != null){
			List<Long> queryIds = dsqo.getQueryIds();
			if(queryIds != null && queryIds.size() > 0){
				QuerySearchCriteria qsc = new QuerySearchCriteria(eM);
				qsc.setQueryIdsPredicate(queryIds);
				qsc.setExactMatchCreatedByPredicate(userId);
				List<SavedQuery> list = qsc.getResultList();
				String productParameterDeleteStatement = " delete from ProductParameters where queryId = :queryId";
				String queryParameterDeleteStatement = " delete from QueryParameters where queryId = :queryId";
				String savedQueryDeleteStatement = " delete from SavedQuery where id = :queryId";
				for(SavedQuery sq : list){
					Long queryId = sq.getId();
					Query productParameterQuery = eM.createQuery(productParameterDeleteStatement);
					productParameterQuery.setParameter("queryId", queryId);
					productParameterQuery.executeUpdate();
					
					Query queryParameterQuery = eM.createQuery(queryParameterDeleteStatement);
					queryParameterQuery.setParameter("queryId", queryId);
					queryParameterQuery.executeUpdate();
					
					Query savedQueryQuery = eM.createQuery(savedQueryDeleteStatement);
					savedQueryQuery.setParameter("queryId", queryId);
					savedQueryQuery.executeUpdate();
					
					deletedIds.add(queryId);
				}
			}
		}
		return deletedIds;
	}
	
	/**
	 * 
	 */
	public List<Long> updateSavedQuery(@NotNull String json, String userId, boolean isBusiness) throws Exception{
		this.setUserInDBContext(userId, isBusiness);
		
		QueryParametersWrapper parameters = queryParamsConverter.convert(json);
		return updateSavedQuery(parameters, userId);
	}
	
	/**
	 * 
	 * @param parameters
	 * @param userId
	 * @return
	 */
	public List<Long> updateSavedQuery(@NotNull QueryParametersWrapper parameters, String userId) throws Exception{
		List<Long> ids = new ArrayList<Long>();
		List<QueryParameters> parametersList = parameters.getQueryParametersList();
		 SavedQuery savedQuery = parameters.getSavedQuery();
		 List<ProductParameters> productParametersList = parameters.getProductParametersList();
		 SavedQuery storedQuery = eM.find(SavedQuery.class, savedQuery.getId());
		 if(storedQuery.getCreateName().equals(userId)){
			 String productParameterDeleteStatement = " delete from ProductParameters where queryId = :queryId";
			 String queryParameterDeleteStatement = " delete from QueryParameters where queryId = :queryId";
			 Long queryId = storedQuery.getId();
			 
			 //We delete all product parameters if any and all parameters query 
			 //that belong to this saved query. We will replace those values with
			 //the new ones coming from the new query parameter wrapper
			 Query productParameterQuery = eM.createQuery(productParameterDeleteStatement);
			 productParameterQuery.setParameter("queryId", queryId);
			 productParameterQuery.executeUpdate();
			
			 Query queryParameterQuery = eM.createQuery(queryParameterDeleteStatement);
			 queryParameterQuery.setParameter("queryId", queryId);
			 queryParameterQuery.executeUpdate();
			 
			 if ((productParametersList != null) && (productParametersList.size() > 0)){
				 for(ProductParameters param : productParametersList){
					 param.setCreateDate(new Date(Calendar.getInstance().getTimeInMillis()));
					 param.setUpdateDate(new Date(Calendar.getInstance().getTimeInMillis()));
					 param.setCreateName(userId);
					 param.setUpdateName(userId);
					 eM.persist(param);
				 }
			 }
			 
			 for(QueryParameters param : parametersList){
				 param.setCreateDate(new Date(Calendar.getInstance().getTimeInMillis()));
				 param.setUpdateDate(new Date(Calendar.getInstance().getTimeInMillis()));
				 eM.persist(param);
			 }
			 
			 storedQuery.setPrsnlTag(savedQuery.getPrsnlTag());
			 storedQuery.setPublicFlag(savedQuery.getPublicFlag());
			 storedQuery.setQueryComment(savedQuery.getQueryComment());
			 storedQuery.setName(savedQuery.getName());
			 storedQuery.setUpdateDate(new Date(Calendar.getInstance().getTimeInMillis()));
			 
			 eM.merge(storedQuery);
			 ids.add(savedQuery.getId());				 
		 }
		 else {
			 //Extra check to make sure that the user is not updating a query belonging to someone else
			 //Throw an exception
			 throw new Exception("Illegal update. You cannot update a query created by the following user : "+storedQuery.getCreateName());
		 }
		return ids;
	}
	
	

}
