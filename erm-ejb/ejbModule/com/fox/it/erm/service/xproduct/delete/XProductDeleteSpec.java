package com.fox.it.erm.service.xproduct.delete;
import java.util.ArrayList;
/**
 * Holds the rules/requirements on what needs
 * to be deleted
 * @author tracyade
 */
import java.util.List;

import com.fox.it.erm.copy.XProductSections;

public class XProductDeleteSpec {

	
	private List<Long> foxVersionIds;
	private XProductSections sections;
	
	public XProductDeleteSpec() {

	}


	public List<Long> getFoxVersionIds() {
		if (foxVersionIds==null) {
			foxVersionIds = new ArrayList<>();
		}
		return foxVersionIds;
	}

	public void setFoxVersionIds(List<Long> foxVersionIdDeleteList) {
		this.foxVersionIds = foxVersionIdDeleteList;
	}


	public XProductSections getSections() {
		return sections;
	}


	public void setSections(XProductSections sections) {
		this.sections = sections;
	}
	
	

	
	

}
