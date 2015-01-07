package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.inject.Inject;

import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ProductDocument;
import com.fox.it.erm.Status;
import com.fox.it.erm.enums.LegalConfirmationStatusTypes;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.ErmProductVersionService;
import com.fox.it.erm.service.ProductDocumentsService;
import com.fox.it.erm.service.grants.GrantsService;
import com.google.common.base.Function;
import com.google.common.collect.Maps;


@Stateless
public class ProductDocumentsServiceBean implements ProductDocumentsService{

	@EJB
	@Inject
	private ClearanceMemoService clearanceMemoService;
	
	@EJB
	@Inject
	private ErmProductVersionService ermProductVersionService;
	
	@EJB
	@Inject
	private GrantsService grantsService;
	
	
	public ProductDocumentsServiceBean() {

	}
	
	private Long findLegalConfirmationStatus(Long foxVersionId) {
		ErmProductVersionHeader ermProductVersion = ermProductVersionService.findHeaderByFoxVersionId(foxVersionId);
		if (ermProductVersion==null) {
			return null;
		}
		return ermProductVersion.getLegalConfirmationStatusId();
	}
	
	private boolean isCMPublic(Long legalConfirmationStatus) {
		return legalConfirmationStatus!=null && !legalConfirmationStatus.equals(LegalConfirmationStatusTypes.DRAFT);
	}
	
	private Status getStatus(Long legalConfirmatonStatus) {
		LegalConfirmationStatusTypes t  = LegalConfirmationStatusTypes.get(legalConfirmatonStatus);
		if (t==null) return null;
		Status status = new Status();
		status.setId(t.getId());
		status.setName(t.getName());
		return status;
	}
	
	
	@Override
	public List<ProductDocument> getProductDocuments(Long foxVersionId,boolean clearanceMemo,List<Long> grantCodes) {
		List<ProductDocument> documents = new ArrayList<>();
		if (clearanceMemo) {
			boolean hasClearanceMemo = clearanceMemoService.hasClearanceMemo(foxVersionId);
			if (hasClearanceMemo) {
				//if it has clearance memo we need to get the status
				Long legalConfirmationStatus = findLegalConfirmationStatus(foxVersionId); 
				if (isCMPublic(legalConfirmationStatus)) {
					ProductDocument d = new ProductDocument();
					d.setStatus(getStatus(legalConfirmationStatus));
					d.setHasDocument(hasClearanceMemo);
					d.setName(ProductDocument.CM_NAME);
					d.setCode(ProductDocument.CM_CODE);
					d.setCM(true);
					documents.add(d);
				}
			}
		}
		Set<Long> grantCodeSet = new HashSet<>();
		if (grantCodes!=null && !grantCodes.isEmpty()) {
			Map<Long,GrantCode> grants = getGrantsById();
			List<ProductGrant> productGrants = grantsService.findAllPulblicGrants(foxVersionId, grantCodes);
			for (ProductGrant grant: productGrants) {
				Long grantCodeId = grant.getGrantCodeId();
				if (!grantCodeSet.contains(grantCodeId)) {
//					GrantType grantType = GrantType.get(grantCodeId);
					grantCodeSet.add(grantCodeId);
					ProductDocument d = new ProductDocument();
					d.setHasDocument(true);
					GrantCode grantCode = grants.get(grantCodeId);
					d.setCode(grantCode==null?null:grantCode.getCode());
					d.setName(grantCode==null?null:grantCode.getDescription());
					d.setGrant(true);
					d.setGrantCodeId(grantCodeId);
					documents.add(d);
				}
			}
		}
		return documents;
	}
	
	public Map<Long,GrantCode> getGrantsById() {
		List<GrantCode> grants = grantsService.findAllGrantCode();
		Map<Long,GrantCode> map = Maps.uniqueIndex(grants, new Function<GrantCode,Long>(){
			@Override
			public Long apply(GrantCode g) {
				return g.getId();
			}
			
		});
		return map;
	}
	
	
	@Override
	public Map<String,GrantCode> getGrantsByCode() {
		List<GrantCode> grants = grantsService.findAllGrantCode();
		Map<String,GrantCode> map = Maps.uniqueIndex(grants, new Function<GrantCode,String>(){
			@Override
			public String apply(GrantCode g) {
				return g.getCode();
			}
			
		});
		return map;
	}
	

}
