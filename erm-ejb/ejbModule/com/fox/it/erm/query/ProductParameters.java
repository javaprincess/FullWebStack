package com.fox.it.erm.query;



import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="SVD_QRY_PARAM_PROD")
public class ProductParameters {
	
	@Id
	@Column(name="QRY_ID")
	private Long queryId;
	
	@Id
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Id
	@Column(name="QRY_PARAM_PROD_ID")
	@SequenceGenerator(name = "SVD_QRY_PARAM_PROD_SEQ", sequenceName = "SVD_QRY_PARAM_PROD_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SVD_QRY_PARAM_PROD_SEQ")
	private Long queryParamProdId;
	
	@Column(name="DATA_FOUND_IND")
	private int dataFoundInd;
	
	@Column(name="CRT_NM") //nullable == true
	private String createName;
	
	@Column(name="UPD_NM") //nullable == true
	private String updateName;
	
	@Column(name="CRT_DT")
	@Temporal(value=TemporalType.TIMESTAMP)
	private Date createDate;
	
	@Column(name="UPD_DT") //nullable == true
	@Temporal(value=TemporalType.TIMESTAMP)
	private Date updateDate;

	public Long getQueryId() {
		return queryId;
	}

	public void setQueryId(Long queryId) {
		this.queryId = queryId;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Long getQueryParamProdId() {
		return queryParamProdId;
	}

	public void setQueryParamProdId(Long queryParamProdId) {
		this.queryParamProdId = queryParamProdId;
	}

	public int getDataFoundInd() {
		return dataFoundInd;
	}

	public void setDataFoundInd(int dataFoundInd) {
		this.dataFoundInd = dataFoundInd;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

}
