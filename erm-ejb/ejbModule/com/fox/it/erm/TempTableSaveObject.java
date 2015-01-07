package com.fox.it.erm;

public interface TempTableSaveObject {

	void setOperation(DBOperation operation);
	void setOperation(String operation);
	void setInsert();
	void setUpdate();
	void setDelete();
	void setAdopt();
	void setSyncDate();
}
