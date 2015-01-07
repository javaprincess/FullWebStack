package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ProductVersion;
import com.fox.it.erm.copy.XProductSections;
import com.fox.it.erm.copy.XProductCopySpec;
import com.fox.it.erm.copy.factory.EmptyProductProviderFactory;
import com.fox.it.erm.copy.factory.products.EmptyProductProvider;
import com.fox.it.erm.enums.CopySection;
import com.fox.it.erm.jobs.Job;
import com.fox.it.erm.jobs.JobAction;
import com.fox.it.erm.jobs.JobBase;
import com.fox.it.erm.jobs.XProductCopySpecToJobConverter;
import com.fox.it.erm.service.JobService;
import com.fox.it.erm.service.ProductService;
import com.fox.it.erm.service.XProductAsyncCopyService;
import com.fox.it.erm.service.XProductCopyService;
import com.fox.it.erm.service.XProductSingleProductCopyService;

@Stateless
public class XProductCopyServiceBean implements XProductCopyService {
	@Inject
	@EJB
	private JobService jobService;
	
	@Inject
	@EJB
	private ProductService productService;
	
	@Inject
	@EJB
	private XProductSingleProductCopyService singleProductCopyService;

	@Inject
	@EJB
	private XProductAsyncCopyService asyncCopyService;
	
	@Inject
	private XProductCopySpecToJobConverter converter;
	
	
//	@Inject
//	private XProductCopyDataProvider dataProvider;
	
	@Inject
	private EntityManager em;
	
	private Logger logger = Logger.getLogger(XProductCopyServiceBean.class.getName());
	
	@Override	
	public Job copyAsJob(Long fromProductId, List<Long> toFoxVersionIds,
			List<String> sections, String userId, boolean isBusiness) {
		return copyAsJob(fromProductId, toFoxVersionIds, sections, null, userId, isBusiness);
	}

	
	
	private void populateProductNames(Long fromFoxVersionId,Job job) {
		List<Long> ids = new ArrayList<>();
		ids.add(fromFoxVersionId);
		Map<Long,JobBase> map = new HashMap<>();
		map.put(fromFoxVersionId,job);
		for (JobAction action: job.getActions()) {
			Long toFoxVersionId = action.getToFoxVersionId(); 
			ids.add(toFoxVersionId);
			map.put(toFoxVersionId, action);
		}
		List<ProductVersion> productVersions = productService.findProductVersions(ids);
		for (ProductVersion productVersion: productVersions) {
			Long foxVersionId = productVersion.getFoxVersionId();
			String productName = productVersion.getTitle();
			JobBase jobBase = map.get(foxVersionId);
			jobBase.setNameFromTitle(productVersion.getFinancialProductId() + " - " + productName);
		}
	}
	
	@Override	
	public Job copyAsJob(Long fromFoxVersionId, List<Long> toFoxVersionIds,
			List<String> sections, List<Long> clearanceMemoIds, String userId,
			boolean isBusiness) {
		Job job = converter.convert(fromFoxVersionId, null, toFoxVersionIds, sections,clearanceMemoIds, userId, isBusiness);
		populateProductNames(fromFoxVersionId,job);
		jobService.create(job, userId);
		return job;
	}
	
	private void setNotEmpty(String section,Map<Long,XProductSections> notEmptyMap,Map<Long,Boolean> emptyByFoxVersionId) {
		for (Long foxVersionId:emptyByFoxVersionId.keySet()) {
			boolean isEmpty = emptyByFoxVersionId.get(foxVersionId);
			if (!isEmpty) {
				XProductSections sections = notEmptyMap.get(foxVersionId);
				if (sections==null) {
					sections = new XProductSections();
					notEmptyMap.put(foxVersionId, sections);
				} 
				sections.addSection(section);
			}
		}
	}
	
	

	public void doCopy(Job job, XProductCopySpec spec, String userId, boolean isBusiness)  {
		asyncCopyService.doCopy(job, spec, userId, isBusiness);		
	}
	
	@TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
	public Job copyAsJob(XProductCopySpec spec,String userId, boolean isBusiness) throws ErmException {
		Job job =  copyAsJob(spec.getFromFoxVersionId(), spec.getToFoxVersionIds(), spec.getSections().getSections(), userId, isBusiness);
		doCopy(job,spec,userId,isBusiness);
		return job;
	}
	
	
	public Map<Long,XProductSections> validateEmpty(XProductCopySpec spec,boolean isBusiness) {	
		XProductSections sections = spec.getSections();
		List<Long> foxVersionIds = spec.getToFoxVersionIds();
		Map<Long,XProductSections> notEmptyMap = new HashMap<>();
	
		EmptyProductProviderFactory factory = EmptyProductProviderFactory.getInstance(em);
		
		for (String section:sections.getSections()) {
			if (!(CopySection.CLEARANCE_MEMO.toString().equals(section)&&sections.hasClearanceMemoCommentIds())) {
				
				
//				EmptyProductProvider emptyProductProvider = factory.createProduct(section, em);
				EmptyProductProvider emptyProductProvider = factory.get(section);
				if (emptyProductProvider!=null) {				
					logger.info("emptyProductProvider: "  + emptyProductProvider.toString());				
					Map<Long,Boolean> empty = emptyProductProvider.getEmpty(foxVersionIds, isBusiness);				
					setNotEmpty(section, notEmptyMap, empty);
				}
			}
			
		}
		return notEmptyMap;
	}

}
