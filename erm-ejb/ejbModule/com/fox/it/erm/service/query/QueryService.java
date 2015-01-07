package com.fox.it.erm.service.query;

import java.util.List;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.query.QueryHeader;
import com.fox.it.erm.query.QueryParametersWrapper;
import com.fox.it.erm.query.SavedQuery;

@Local
public interface QueryService {
	
	public List<SavedQuery> findAllQueriesByUserId(String userId) throws ErmException;

	public QueryHeader retrieveQueryParams(String json, 
			Long foxVersionId, 
			Long reportId, 
			String userId, 
			boolean isBusiness) throws ErmException;
	
	public QueryHeader saveQueryParams(String json, 
			Long foxVersionId, 
			Long reportId, 
			String userId, 
			boolean isBusiness) throws ErmException;
	
	public Long save(String json, 
			String userId, 
			boolean isBusiness) throws ErmException;
	
	public Long generateQueryId(Long queryId, 
			String userId) throws ErmException;

	public QueryParametersWrapper retrieveQuery(Long queryId, String userId, boolean isBusiness) throws ErmException;
	
	public List<SavedQuery> findSavedQuery(@NotNull String json, String userId, boolean isBusiness) throws ErmException;
	
	public List<Long> deleteSavedQuery(@NotNull String json, String userId, boolean isBusiness);
	
	public List<Long> updateSavedQuery(@NotNull String json, String userId, boolean isBusiness) throws Exception;

	
}
