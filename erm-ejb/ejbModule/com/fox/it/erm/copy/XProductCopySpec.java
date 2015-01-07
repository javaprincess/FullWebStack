package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;

public class XProductCopySpec {

	private Long fromFoxVersionId;
	private List<Long> toFoxVersionIds;
	private XProductSections sections;
	
	public XProductCopySpec() {

	}

	public Long getFromFoxVersionId() {
		return fromFoxVersionId;
	}

	public void setFromFoxVersionId(Long fromFoxVersionId) {
		this.fromFoxVersionId = fromFoxVersionId;
	}

	public List<Long> getToFoxVersionIds() {
		if (toFoxVersionIds==null) {
			toFoxVersionIds = new ArrayList<>();
		}
		return toFoxVersionIds;
	}

	public void setToFoxVersionIds(List<Long> toFoxVersionIds) {
		this.toFoxVersionIds = toFoxVersionIds;
	}

	public XProductSections getSections() {
		return sections;
	}

	public void setSections(XProductSections sections) {
		this.sections = sections;
	}
	
	

}
