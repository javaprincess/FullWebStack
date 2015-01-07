package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="SYSTEM_SECURITY_KEY")
public class SystemSecKey {
	@Id
	@Column(name="ID")
	private Long id;
	@Column(name="KEY")
	private String key;
	@Column(name="NAME")	
	private String name;
	@Column(name="AS_USER")	
	private String asUser;
	@Column(name="HASH")	
	private String hash;
	
	@Temporal(value=TemporalType.TIMESTAMP)	
	@Column(name="EXPIRE_DATE")
	private Date expire;
	
	public SystemSecKey() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAsUser() {
		return asUser;
	}

	public void setAsUser(String asUser) {
		this.asUser = asUser;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public Date getExpire() {
		return expire;
	}

	public void setExpire(Date expire) {
		this.expire = expire;
	}
	
	

}
