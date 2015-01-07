package com.fox.it.erm.service.impl;

import javax.inject.Inject;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.service.ClearanceMemoService;

public class ClearanceMemoCreateProcessor {


	private final ClearanceMemoService service;
	
	@Inject
	public ClearanceMemoCreateProcessor(ClearanceMemoService service) {
		this.service = service;
	}

	public void create(Long foxVersionId, ClearanceMemo clearanceMemo,String userId) throws ErmException {
		clearanceMemo.setFoxVersionId(foxVersionId);
		clearanceMemo.validate();
		service.create(clearanceMemo, userId);

	}
}
