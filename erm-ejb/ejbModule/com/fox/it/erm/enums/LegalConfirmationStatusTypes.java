package com.fox.it.erm.enums;

public enum LegalConfirmationStatusTypes {
 CONFIRMED(1L),
 PENDING(2L),
 PROCESSING(3L),
 DRAFT(4L),
 PRELIMINARY(100L);

 private final Long id;
 
 private LegalConfirmationStatusTypes(Long id) {
	 this.id = id;
 }
 
 public String getName() {
	 return toString();
 }
 
 public Long getId() {
	 return id;
 }
 
 public static LegalConfirmationStatusTypes get(Long id) {
	 for (LegalConfirmationStatusTypes t: values()) {
		 if (t.getId().equals(id)) {
			 return t;
		 }
	 }
	 return null;
 }
 
}
