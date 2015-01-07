package com.fox.it.erm.copy.factory.products;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;



//MADE this an abstract class instead of an interface
//public interface EmptyProductProvider {
//	Map<Long,Boolean> getEmpty(List<Long> foxVersionIds, boolean isBusiness);
//}

public abstract class EmptyProductProvider {
	
	public abstract Map<Long,Boolean> getEmpty(List<Long> foxVersionIds, boolean isBusiness);

	public abstract EntityManager getEntityManager();
//	
//	public abstract void setEntityManager(EntityManager eM);
	
	protected EntityManager eM;
}