package com.fox.it.erm.grants;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fox.it.erm.ErmUpdatable;

@Entity
@Table(name="PROD_PROMO_MTRL")
public class ProductPromoMaterial implements ErmUpdatable{
			
			//COLUMNS -- BEGIN
			@Id
			@SequenceGenerator(name = "PROD_PROMO_MTRL_SEQ", sequenceName = "PROD_PROMO_MTRL_SEQ",allocationSize=1)
			@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROD_PROMO_MTRL_SEQ")	
			@Column(name="PROD_PROMO_MTRL_ID")
			private Long id;
					
			@Column(name="FOX_VERSION_ID")
			private Long foxVersionId;
					
			@Column(name="PROMO_MTRL_ID")
			private Long promotionalMaterialId;
						
			@Column(name="CRT_DT")
			private Date createDate;
						
			@Column(name="UPD_DT") //nullable == true
			private Date updateDate;
						
			@Column(name="CRT_NM") //nullable == true
			private String createName;
						
			@Column(name="UPD_NM") //nullable == true
			private String updateName;
			
			//COLUMNS -- END

			public Long getId() {
				return id;
			}

			public void setId(Long id) {
				this.id = id;
			}

			public Long getFoxVersionId() {
				return foxVersionId;
			}

			public void setFoxVersionId(Long foxVersionId) {
				this.foxVersionId = foxVersionId;
			}

			public Long getPromotionalMaterialId() {
				return promotionalMaterialId;
			}

			public void setPromotionalMaterialId(Long promotionalMaterialId) {
				this.promotionalMaterialId = promotionalMaterialId;
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

			@Override
			public boolean isNew() {
				return id==null;
			}

			@Override
			public void setCreateDate(java.util.Date date) {
				if (date==null) {
					this.createDate = null;
				} else {
					this.createDate = new java.sql.Date(date.getTime());
				}
				
			}

			@Override
			public void setBusinessInd(Boolean isBusiness) {
				//do nothing				
			}

			@Override
			public void setLegalInd(Boolean isBusiness) {
				//do nothing				
			}

			@Override
			public void setUpdateDate(java.util.Date date) {
				if (date==null) {
					this.updateDate = null;
				} else {
					this.updateDate = new java.sql.Date(date.getTime());
				}				
			}

			@Override
			public boolean isLegal() {
				return true;
			}

			@Override
			public boolean isBusiness() {
				return false;
			}

			@Override
			public String getIconType() {
				// TODO Auto-generated method stub
				return null;
			}

			//COLUMNS -- END

}
