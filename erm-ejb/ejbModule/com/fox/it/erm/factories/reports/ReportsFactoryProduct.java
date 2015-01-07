package com.fox.it.erm.factories.reports;

//ERMReport is the product of the reports factory
public abstract class ReportsFactoryProduct implements ERMReport {
	ReportsFactory factory = null;
	
	//the representation of the product produced by the factory
	//the specialized implementations of the report will call this constructor
	//and the specific factory product is a child of the factory
	//so in the protected constructor of the specific product, it
	//is going to call super so we know WHAT is being created.
	public ReportsFactoryProduct(ReportsFactory theFactory) {
		
		factory = theFactory;
		
	}
	
	public ReportsFactory getFactory() {
		return factory;
	}
	
	public String getReportType() {
		
		return factory.getReportType();
	}

}
