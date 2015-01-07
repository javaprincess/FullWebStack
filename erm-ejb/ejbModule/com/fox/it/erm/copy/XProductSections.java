package com.fox.it.erm.copy;

import java.util.ArrayList;
import java.util.List;

import com.fox.it.erm.enums.CopySection;

public class XProductSections {
	private List<Long> clearanceMemoCommentIds;
	
	private List<String> sections;
	
	
	public List<String> getSections() {
		if (sections==null) {
			sections = new ArrayList<>();
		}
		return sections;
	}
	
	public void addSection(String section) {
		getSections().add(section);
	}
	
	public void addSection(CopySection section) {
		addSection(section.toString());
	}



	public List<Long> getClearanceMemoCommentIds() {
		if (clearanceMemoCommentIds==null) {
			clearanceMemoCommentIds = new ArrayList<>();
		}
		return clearanceMemoCommentIds;
	}



	public void setClearanceMemoCommentIds(List<Long> clearanceMemoCommentIds) {
		this.clearanceMemoCommentIds = clearanceMemoCommentIds;
	}

	public void setSections(List<String> sections) {
		this.sections = sections;
	}
	
	
	public boolean hasClearanceMemoCommentIds() {
		return getClearanceMemoCommentIds().size()>0;
	}
	
	public boolean contains(CopySection section) {
		return getSections().contains(section.toString());
	}
	
	public void clear() {
		getSections().clear();
	}
	
	
	
	
	

}
