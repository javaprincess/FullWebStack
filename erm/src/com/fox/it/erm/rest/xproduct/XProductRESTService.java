package com.fox.it.erm.rest.xproduct;

import java.util.HashMap;
import java.util.Map;

import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;

import com.fox.it.erm.ErmException;

import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.copy.XProductCopySpec;
import com.fox.it.erm.copy.XProductCopySpecAndSectionsObject;
import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.rest.RESTService;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.XProductCopyService;
import com.fox.it.erm.service.impl.JacksonJsonService;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteService;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteSpec;
import com.fox.it.erm.util.converters.JsonToXProductCopySpecAndSectionsCreateObject;
import com.fox.it.erm.util.converters.JsonToXProductDelete;

@Path("/XProduct")
public class XProductRESTService extends RESTService {
	
	private static final Logger logger = Logger.getLogger(XProductRESTService.class.getName());
	
	@EJB
	private XProductCopyService xProductCopyService;
	
	@EJB
	private XProductDeleteService xProductDeleteService;
	
	@Inject
	private JsonService jsonService = new JacksonJsonService();
	
	@POST
	@Path("/validate")
	public Map<Long,XProductSections> validate(@Context HttpServletRequest request, String q)  {
		boolean isBusiness = isBusiness(request);
		Map<Long,XProductSections> notEmptyMap = new HashMap<>();
		JsonToXProductCopySpecAndSectionsCreateObject converterXProductCopySpecAndSections = new JsonToXProductCopySpecAndSectionsCreateObject(jsonService);			
		XProductCopySpecAndSectionsObject xProductCopySpecAndSections  = converterXProductCopySpecAndSections.convert(q);
		XProductSections xProductCopySections = new XProductSections();
		xProductCopySections.setSections(xProductCopySpecAndSections.getSections());
		xProductCopySections.setClearanceMemoCommentIds(xProductCopySpecAndSections.getClearanceMemoCommentIds());
		
		XProductCopySpec xProductCopySpec = new XProductCopySpec();
		xProductCopySpec.setFromFoxVersionId(xProductCopySpecAndSections.getFromFoxVersionId());
		xProductCopySpec.setToFoxVersionIds(xProductCopySpecAndSections.getToFoxVersionIds());			
		xProductCopySpec.setSections(xProductCopySections);
		
		notEmptyMap = xProductCopyService.validateEmpty(xProductCopySpec, isBusiness);			
		return notEmptyMap;
	}
	
	@POST
	@Path("/copy")
	public XProductCopyResponse copy(@Context HttpServletRequest request, String q) throws ErmException {
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);
		XProductCopyResponse response = new XProductCopyResponse();
		Map<Long,XProductSections> notEmptyMap = new HashMap<>();

			JsonToXProductCopySpecAndSectionsCreateObject converterXProductCopySpecAndSections = new JsonToXProductCopySpecAndSectionsCreateObject(jsonService);			
			XProductCopySpecAndSectionsObject xProductCopySpecAndSections  = converterXProductCopySpecAndSections.convert(q);
			XProductSections xProductCopySections = new XProductSections();
			xProductCopySections.setSections(xProductCopySpecAndSections.getSections());
			xProductCopySections.setClearanceMemoCommentIds(xProductCopySpecAndSections.getClearanceMemoCommentIds());
			
			XProductCopySpec xProductCopySpec = new XProductCopySpec();
			xProductCopySpec.setFromFoxVersionId(xProductCopySpecAndSections.getFromFoxVersionId());
			xProductCopySpec.setToFoxVersionIds(xProductCopySpecAndSections.getToFoxVersionIds());			
			xProductCopySpec.setSections(xProductCopySections);
			
			notEmptyMap = xProductCopyService.validateEmpty(xProductCopySpec, isBusiness);
			logger.info("notEmptyMap: " + notEmptyMap);			
			if (notEmptyMap.size() == 0) {
			  Job job = xProductCopyService.copyAsJob(xProductCopySpec, userId, isBusiness);
			  response.setJobId(job.getId());
			} else {
				response.setErrors(notEmptyMap);
			}
		return response;
		
	}
	
	@POST
	@Path("/delete")
	public Job delete(@Context HttpServletRequest request, String q) throws ErmException {
		String userId = getUserId(request);
		boolean isBusiness = isBusiness(request);

		JsonToXProductDelete converterXProductCopySpecAndSections = new JsonToXProductDelete(jsonService);	
		XProductDeleteSpec specs = converterXProductCopySpecAndSections.convert(q);
		Job job = xProductDeleteService.deleteAsJob(specs,userId, isBusiness);
		return job;
	}
}
