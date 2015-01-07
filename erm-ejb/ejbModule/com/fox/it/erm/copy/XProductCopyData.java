package com.fox.it.erm.copy;

import java.util.List;

import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.comments.EntityComment;

/**
 * Container for all the data to be copied in the XProduct copy functionality.
 * The intent for this class is to contain all the data to be copied, so that it doesn't need to be re queried
 * for each target product
 * @author AndreasM
 *
 */
public class XProductCopyData {

	private List<ErmProductRightStrand> strands;
	private ClearanceMemo clearanceMemo;
	private List<Long> clearanceMemoNodeIds;
	private List<ErmProductRestriction> restrictions;
	private List<EntityComment> comments;
	private List<EntityComment> subrights;
	private List<EntityComment> salesAndMarketing;
	private List<ErmProductContact> contacts;
	private List<ErmContractInfo> cotracts;
	
	public XProductCopyData() {
	}

	public List<ErmProductRightStrand> getStrands() {
		return strands;
	}

	public void setStrands(List<ErmProductRightStrand> strands) {
		this.strands = strands;
	}

	public ClearanceMemo getClearanceMemo() {
		return clearanceMemo;
	}

	public void setClearanceMemo(ClearanceMemo clearanceMemo) {
		this.clearanceMemo = clearanceMemo;
	}

	public List<Long> getClearanceMemoNodeIds() {
		return clearanceMemoNodeIds;
	}

	public void setClearanceMemoNodeIds(List<Long> clearanceMemoNodeIds) {
		this.clearanceMemoNodeIds = clearanceMemoNodeIds;
	}

	public List<ErmProductRestriction> getRestrictions() {
		return restrictions;
	}

	public void setRestrictions(List<ErmProductRestriction> restrictions) {
		this.restrictions = restrictions;
	}

	public List<EntityComment> getComments() {
		return comments;
	}

	public void setComments(List<EntityComment> comments) {
		this.comments = comments;
	}

	public List<EntityComment> getSubrights() {
		return subrights;
	}

	public void setSubrights(List<EntityComment> subrights) {
		this.subrights = subrights;
	}

	public List<EntityComment> getSalesAndMarketing() {
		return salesAndMarketing;
	}

	public void setSalesAndMarketing(List<EntityComment> salesAndMarketing) {
		this.salesAndMarketing = salesAndMarketing;
	}

	public List<ErmProductContact> getContacts() {
		return contacts;
	}

	public void setContacts(List<ErmProductContact> contacts) {
		this.contacts = contacts;
	}

	public List<ErmContractInfo> getCotracts() {
		return cotracts;
	}

	public void setCotracts(List<ErmContractInfo> cotracts) {
		this.cotracts = cotracts;
	}

	
}
