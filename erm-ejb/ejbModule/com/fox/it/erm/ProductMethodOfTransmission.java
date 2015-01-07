package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="PROD_MOT")
public class ProductMethodOfTransmission {

	@Id
	@Column(name="PROD_MOT_ID")
	private Long productMethodOfTransmissonId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Temporal(value=TemporalType.DATE)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;
	
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Column(name="MEDIA_ID")
	private Long mediaId;
	
	
	public Long getProductMethodOfTransmissonId() {
		return productMethodOfTransmissonId;
	}
	public void setProductMethodOfTransmissonId(Long productMethodOfTransmissonId) {
		this.productMethodOfTransmissonId = productMethodOfTransmissonId;
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
	public void setCreateName(String createName) {
		this.createName = createName;
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
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public Long getMediaId() {
		return mediaId;
	}
	public void setMediaId(Long mediaId) {
		this.mediaId = mediaId;
	}
	
	
}
