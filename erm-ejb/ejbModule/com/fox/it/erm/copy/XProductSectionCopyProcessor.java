package com.fox.it.erm.copy;

import com.fox.it.erm.ErmException;

public interface XProductSectionCopyProcessor {

	public void copy(Long fromFoxVersionId,Long toFoxVersionId,XProductCopyData data,String userId, boolean isBusiness) throws ErmException;
}
