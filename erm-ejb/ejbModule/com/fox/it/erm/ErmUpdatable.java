package com.fox.it.erm;

import java.util.Date;

public interface ErmUpdatable {
	boolean isNew();
	void setCreateName(String userId);
	void setCreateDate(Date timestamp);
	void setBusinessInd(Boolean isBusiness);
	void setLegalInd(Boolean isBusiness);
	void setUpdateDate(Date updatedDate);
	void setUpdateName(String updateName);
	boolean isLegal();
	boolean isBusiness();
	String getIconType();
}
