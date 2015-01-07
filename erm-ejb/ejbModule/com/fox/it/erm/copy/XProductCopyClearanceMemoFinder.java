package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.service.ClearanceMemoService;

public class XProductCopyClearanceMemoFinder {

	private ClearanceMemoService service;
	private ClearanceMemoBuilderForCopy builder = new ClearanceMemoBuilderForCopy();
	
	@Inject
	public XProductCopyClearanceMemoFinder(ClearanceMemoService service) {
		this.service = service;
	}
	

	
	public ClearanceMemo find(Long foxVersionId, List<Long> commentIds)  {
		ClearanceMemo clearanceMemo = service.getClearanceMemo(foxVersionId, false,false);
		if (clearanceMemo == null)
		  return null;
		clearanceMemo.copyOriginalId();
		if (commentIds==null||commentIds.isEmpty()) {
			return clearanceMemo;
		}
		clearanceMemo = builder.getClearanceMemoForCommentIds(clearanceMemo, commentIds);
		return clearanceMemo;
	}

}
