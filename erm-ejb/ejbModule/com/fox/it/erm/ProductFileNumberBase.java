package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.SequenceGenerator;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@MappedSuperclass
public class ProductFileNumberBase {

	@Id
	@SequenceGenerator(name = "PROD_FILE_NO_SEQ", sequenceName = "PROD_FILE_NO_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROD_FILE_NO_SEQ")
	@Column(name="PROD_FILE_NO_ID")
	private Long productFileNumberId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;

	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Column(name="FILE_NO")
	private String fileNumber;
	
	@Column(name="FILE_NO_TYP_ID")
	private Long fileNumberTypeId;
	
	public ProductFileNumberBase() {
	}
	
	public Long getProductFileNumberId() {
		return productFileNumberId;
	}

	public void setProductFileNumberId(Long productFileNumberId) {
		this.productFileNumberId = productFileNumberId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createDateName) {
		this.createName = createDateName;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}

	

	public String getFileNumber() {				
	  return fileNumber;		
	}

	public void setFileNumber(String fileNumber) {
		this.fileNumber = fileNumber;
	}

	public Long getFileNumberTypeId() {
		return fileNumberTypeId;
	}

	public void setFileNumberTypeId(Long fileNumberTypeId) {
		this.fileNumberTypeId = fileNumberTypeId;
	}
	
	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	
	
	public void copyFromBase(ProductFileNumberBase b) {
		setCreateDate(b.getCreateDate());
		setCreateName(b.getCreateName());
		setFileNumber(b.getFileNumber());
		setFileNumberTypeId(b.getFileNumberTypeId());
		setFoxVersionId(b.getFoxVersionId());
		setProductFileNumberId(b.getProductFileNumberId());
		setUpdateDate(b.getUpdateDate());
		setUpdateName(b.getUpdateName());
	}

}
