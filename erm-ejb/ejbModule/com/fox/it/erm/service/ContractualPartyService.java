package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.ErmAccessType;
import com.fox.it.erm.ErmContactType;
import com.fox.it.erm.ErmContractInfo;
import com.fox.it.erm.ErmContractualPartyType;
import com.fox.it.erm.ErmCountry;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmOrganizationType;
import com.fox.it.erm.ErmParty;
import com.fox.it.erm.ErmPartyType;
import com.fox.it.erm.ErmProductContact;
import com.fox.it.erm.ErmValidationException;

@Local
public interface ContractualPartyService {
	public List<ErmParty> findAllContractualParties();
	public List<ErmParty> findAllFoxEntities();
	public List<ErmParty> findAllContacts(Long foxVersionId);
	public List<ErmParty> findAllContacts();
	public List<ErmParty> findAllContatsAssociatedWithProducts();
	public List<ErmParty> searchContacts(Long foxVersionId, ErmParty ermParty);	
	public ErmParty findContact(Long partyId);
	public List<ErmProductContact> findAllContactsForProduct(Long foxVersionId);
	public Date getLastChangeContractualPartiesTimestamp();
	public Date getLastChangeContractualPartyTypesTimestamp();	
	public Date getLastChangeContactTypesTimestamp();
	public Date getLastChangeAccessTypesTimestamp();
	public List<ErmContractualPartyType> findAllContractualPartyTypes();
	public List<ErmPartyType> findAllPartyTypes();
	public List<ErmContactType> findAllContactTypes();
	public List<ErmAccessType> findAllAccessTypes();
	public List<ErmOrganizationType> findAllOrganizationTypes();
	public List<ErmCountry> loadCountries();	
	public List<ErmContractInfo> findErmContractsByFoxVersionID(Long foxVersionId);	
	public void deleteErmContract(Long contractInfoId, String userId, Boolean isBusiness) throws ErmValidationException, ErmException;
	public void deleteErmProductContact(Long productContactId, String userId, Boolean isBusiness) throws ErmValidationException, ErmException;
	public void saveErmContractsByFoxVersionID(Long foxVersionId, String userId, Boolean isBusiness, List<ErmContractInfo> ermContractInfoList) throws ErmValidationException, ErmException;
	public void saveContact(ErmParty party, String userId, Boolean isBusiness) throws ErmValidationException, ErmException;	
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId) throws ErmValidationException, ErmException;
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId,Long accessTypeId) throws ErmValidationException, ErmException;	
	public void assignContactToProduct(Long foxVersionId, String userId, Boolean isBusiness, Long partyId,Long accessTypeId, Long contactTypeId) throws ErmValidationException, ErmException;	
	public void switchContactType(Long productContactId, String userId, Boolean isBusiness, Long contactTypeId) throws ErmValidationException, ErmException;
	public void switchAccessType(Long productContactId, String userId, Boolean isBusiness, Long accessTypeId) throws ErmValidationException, ErmException;	
}
