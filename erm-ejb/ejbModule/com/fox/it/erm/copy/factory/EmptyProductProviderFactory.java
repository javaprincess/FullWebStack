package com.fox.it.erm.copy.factory;


import javax.inject.Inject;
import javax.persistence.EntityManager;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.fox.it.erm.copy.factory.products.EmptyClearanceMemoProvider;
import com.fox.it.erm.copy.factory.products.EmptyCommentProvider;
import com.fox.it.erm.copy.factory.products.EmptyInfoCodesProvider;
import com.fox.it.erm.copy.factory.products.EmptyProductProvider;
import com.fox.it.erm.copy.factory.products.EmptySalesAndMarketingProvider;
import com.fox.it.erm.copy.factory.products.EmptyStrandsProvider;
import com.fox.it.erm.copy.factory.products.EmptySubrightsProvider;
import com.fox.it.erm.enums.CopySection;


//I changed this object be a singleton.
//the purpose of the factory is to create products.  
//we only need one factory within the JVM
public class EmptyProductProviderFactory {
	
	
	
	
	private EmptyProductProvider emptyProductProvider;
	
	private static ApplicationContext ctx = new ClassPathXmlApplicationContext(new String[] {"META-INF/applicationcontext.xml"});
	
	private EntityManager em;
	
	protected EmptyProductProviderFactory() {
		
	}
	
	@Inject
	protected EmptyProductProviderFactory(EntityManager em) {
		this.em = em;
	}
	
	//Singleton implementation
	public static EmptyProductProviderFactory getInstance(EntityManager em) {		
			return new EmptyProductProviderFactory(em);
	}

	public EmptyProductProvider getEmptyProductProvider() {
		return emptyProductProvider;
	}
	
	public void setEmptyProductProvider(EmptyProductProvider emptyProductProvider) {
		this.emptyProductProvider = emptyProductProvider;
	}
	
	public EmptyProductProvider createProduct(String section, EntityManager eM) {	
		
		//Each bean needs the eM for its query'ing purposes
		setEntityManager(eM);
		
		//all products are registered as SpringBeans in the applicationcontext.xml file
		//so all we have to do is get the bean by the section name per the 
		//bean's id in the applicationcontext.xml file
		return (EmptyProductProvider) ctx.getBean(section);
	}
	
	private void setEntityManager(EntityManager eM) {
		this.em = eM;
	}
	
	public EntityManager getEntityManager() {
		
		return this.em;
	}
	

	public EmptyProductProvider get(CopySection section) {
		if (section==null) return null;
		EmptyProductProvider emptyProductProvider = null;
		switch (section) {
		case STRANDS:
			emptyProductProvider = new EmptyStrandsProvider(em);
			break;
		case INFO_CODES:
			emptyProductProvider = new EmptyInfoCodesProvider(em);
			break;
		case CLEARANCE_MEMO:
			emptyProductProvider = new EmptyClearanceMemoProvider(em);
			break;
		case COMMENTS:
			emptyProductProvider = new EmptyCommentProvider(em);
			break;
		case SUBRIGHTS:
			emptyProductProvider = new EmptySubrightsProvider(em);
			break;
		case SALES_AND_MARKETING:
			emptyProductProvider = new EmptySalesAndMarketingProvider(em);
			break;
		}
		return emptyProductProvider;
	} 
	
	
	public EmptyProductProvider get(String section) {
		return get(CopySection.valueOf(section));
	} 

	

		

}
