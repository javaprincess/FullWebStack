package com.fox.it.erm.grants;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import java.sql.Date;


@Entity
@Table(name="REF_GRNT_TYP")
public class GrantType {
	
	//COLUMNS -- BEGIN
	@Id
	@Column(name="GRNT_TYP_ID")
	private Long id;

	@Column(name="GRNT_TYP_CD")
	private String code;
		
	@Column(name="GRNT_TYP_DESC")
	private String description;
		
	@Column(name="CRT_DT")
	private Date createDate;
		
	@Column(name="UPD_DT") //nullable == true
	private Date updateDate;
		
	@Column(name="CRT_NM") //nullable == true
	private String createName;
		
	@Column(name="UPD_NM") //nullable == true
	private String updateName;

	//COLUMNS -- END
	
	//READ ONLY OBJECT
	public Long getId() {
		return this.id;
	}

	public String getCode() {
		return this.code;
	}

	public String getDescription() {
		return this.description;
	}

	public String getCreateName() {
		return this.createName;
	}
	
	public String getUpdateName() {
		return this.updateName;
	}
	
	public Date getCreateDate() {
		return this.createDate;
	}
	
	public Date getUpdateDate() {
		return this.updateDate;
	}

}
