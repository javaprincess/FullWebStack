package com.fox.it.erm;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;


@Entity
@Table(name="EDM_GLOBAL_TITLE_GRP_VW")
public class FoxipediaProductGroup {
	@Id
	@Column(name="TITLE_GRP_ID")
	private Long id;
	
	@Column(name="TITLE_GRP_CD")
	private String code;
	
	@Column(name="TITLE_GRP_DESC")
	private String description;
	
	@Transient
	private String filterResults = "";
	
	@ManyToMany(fetch=FetchType.EAGER)
	@JoinTable(
			name="EDM_GLOBAL_TITLE_GRP_TITLE_VW",
			joinColumns={@JoinColumn(name="TITLE_GRP_ID",referencedColumnName="TITLE_GRP_ID",insertable=false,updatable=false)},
			inverseJoinColumns={@JoinColumn(name="FOX_ID",referencedColumnName="FOX_ID",insertable=false,updatable=false)}
			)
	private List<Product> products;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public String getFilterResults() {
		return filterResults;
	}

	public void setFilterResults(String filterResults) {
		this.filterResults = filterResults;
	}
			
}
