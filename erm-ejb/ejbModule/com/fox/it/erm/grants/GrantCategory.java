package com.fox.it.erm.grants;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_PROMO_MTRL")
public class GrantCategory extends Category implements Comparable<GrantCategory> { 
	
		//COLUMNS -- BEGIN
			@Id
			@Column(name="PROMO_MTRL_ID")
			private Long id;

			@Column(name="PROMO_MTRL_CD")
			private String code;
				
			@Column(name="PROMO_MTRL_DESC")
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
			
			@Override
			public int compareTo(GrantCategory o) {
				return id.compareTo(o.getId());
			}	

}
