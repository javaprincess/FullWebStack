package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;


@Entity
@Table(name="EDM_GLOBAL_TITLE_HIERARCHY_VW")
public class ProductHierarchy {
	@Id
	@Column(name="TITLE_HIER_ID")
	private Long id;
	
	
	@Column(name="CHILD_FOX_ID")
	private Long childFoxId;

	@Transient
	private ProductHeader childProduct;
	
	@Column(name="CHILD_FOX_VERSION_ID")
	private Long childFoxVersionId;
	
	@Column(name="PARENT_FOX_ID")
	private Long parentFoxId;
	
	@Column(name="PARENT_FOX_VERSION_ID")
	private Long parentFoxVersionId;

	@Column(name="HIERARCHY_CODE")
	private String hierarchyCode;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getChildFoxId() {
		return childFoxId;
	}

	public void setChildFoxId(Long childFoxId) {
		this.childFoxId = childFoxId;
	}
	
	

	public ProductHeader getChildProduct() {
		return childProduct;
	}

	public void setChildProduct(ProductHeader childProduct) {
		this.childProduct = childProduct;
	}

	public Long getChildFoxVersionId() {
		return childFoxVersionId;
	}

	public void setChildFoxVersionId(Long childFoxVersionId) {
		this.childFoxVersionId = childFoxVersionId;
	}

	public Long getParentFoxId() {
		return parentFoxId;
	}

	public void setParentFoxId(Long parentFoxId) {
		this.parentFoxId = parentFoxId;
	}

	public Long getParentFoxVersionId() {
		return parentFoxVersionId;
	}

	public void setParentFoxVersionId(Long parentFoxVersionId) {
		this.parentFoxVersionId = parentFoxVersionId;
	}

	public String getHierarchyCode() {
		return hierarchyCode;
	}

	public void setHierarchyCode(String hierarchyCode) {
		this.hierarchyCode = hierarchyCode;
	}
	
	

	
}
