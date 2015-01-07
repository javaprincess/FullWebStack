package com.fox.it.erm.reports;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name="")
public class Usage {

	
	//COLUMNS -- BEGIN
	@Id
	@Column(name="SRC_RPT_ID")
	@SequenceGenerator(name = "SRC_RPT_SEQ", sequenceName = "SRC_RPT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SRC_RPT_SEQ")
	private Long id;


}
