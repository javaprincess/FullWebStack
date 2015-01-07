package com.fox.it.erm.factories.reports;


import java.util.List;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.query.QueryParameters;


public interface ERMReport {

	public String getContent() throws ErmException;
	public String getHeader() throws ErmException;
	public String getFooter() throws ErmException;
	public ERMReport createReport(Long reportId, Long queryId) throws ErmException;
	public List<QueryParameters> getReportRowsList() throws ErmException;

}
