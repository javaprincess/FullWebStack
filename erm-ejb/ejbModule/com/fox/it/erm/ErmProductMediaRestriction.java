package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name="PROD_MEDIA_RSTRCN")
public class ErmProductMediaRestriction extends ErmProductFoxVersionBase{

	@Id
	@Column(name="PROD_MEDIA_RSTRCN_ID")
	private Long productMediaRestrictionId;
	
	@Column(name="MEDIA_ID")
	private Long mediaId;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;

	public Long getProductMediaRestrictionId() {
		return productMediaRestrictionId;
	}

	public void setProductMediaRestrictionId(Long productMediaRestrictionId) {
		this.productMediaRestrictionId = productMediaRestrictionId;
	}

	public Long getMediaId() {
		return mediaId;
	}

	public void setMediaId(Long mediaId) {
		this.mediaId = mediaId;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}

	@Override
	public boolean isNew() {
		return productMediaRestrictionId==null;
	}
	
	
}
