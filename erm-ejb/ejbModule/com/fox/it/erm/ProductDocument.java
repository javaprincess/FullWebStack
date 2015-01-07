package com.fox.it.erm;


/**
 * Holder for all the documents that a product has
 * @author AndreasM
 *
 */
public class ProductDocument {
	public static final String CM_NAME = "Clearance Memo";
	public static final String CM_CODE = "CM";
	private String name;
	private String code;
	private boolean isGrant;
	private Long grantCodeId;
	private boolean isCM;
	private boolean hasDocument;
	private String url;
	private Status status;
 
	
	public ProductDocument() {

	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getCode() {
		return code;
	}


	public void setCode(String code) {
		this.code = code;
	}


	public boolean isHasDocument() {
		return hasDocument;
	}
	
	


	public Long getGrantCodeId() {
		return grantCodeId;
	}


	public void setGrantCodeId(Long grantCodeId) {
		this.grantCodeId = grantCodeId;
	}


	public void setHasDocument(boolean hasDocument) {
		this.hasDocument = hasDocument;
	}


	public String getUrl() {
		return url;
	}


	public void setUrl(String url) {
		this.url = url;
	}


	public Status getStatus() {
		return status;
	}


	public void setStatus(Status status) {
		this.status = status;
	}


	public boolean isGrant() {
		return isGrant;
	}

	public void setGrant(boolean isGrant) {
		this.isGrant = isGrant;
	}


	public boolean isCM() {
		return isCM;
	}
	

	public void setCM(boolean isCM) {
		this.isCM = isCM;
	}
	

}
