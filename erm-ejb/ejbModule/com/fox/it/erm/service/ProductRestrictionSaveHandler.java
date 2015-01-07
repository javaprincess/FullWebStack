package com.fox.it.erm.service;

import java.util.List;

import com.fox.it.erm.ErmProductRestriction;

public interface ProductRestrictionSaveHandler {
	public void create(List<ErmProductRestriction> restrictions);
	public void save(List<ErmProductRestriction> restrictions);
	public void delete(List<ErmProductRestriction> restrictions);
}
