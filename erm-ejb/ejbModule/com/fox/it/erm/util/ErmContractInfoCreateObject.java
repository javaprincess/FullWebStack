package com.fox.it.erm.util;

import java.util.List;

import com.fox.it.erm.ErmContractInfo;

public class ErmContractInfoCreateObject {
	private List<ErmContractInfo> ermContractInfoList;
	private Long foxVersionId;	
	private ErmContractInfo ermContractInfo;
		
	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public List<ErmContractInfo> getErmContractInfoList() {
		return ermContractInfoList;
	}

	public void setErmContractInfoList(List<ErmContractInfo> ermContractInfoList) {
		this.ermContractInfoList = ermContractInfoList;
	}

	public ErmContractInfo getErmContractInfo() {
		return ermContractInfo;
	}

	public void setErmContractInfo(ErmContractInfo ermContractInfo) {
		this.ermContractInfo = ermContractInfo;
	}

}
