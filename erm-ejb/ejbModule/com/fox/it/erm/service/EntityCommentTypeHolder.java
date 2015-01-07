package com.fox.it.erm.service;

import java.util.HashSet;
import java.util.Set;

/**
 * Clas to hold the entity type comments that an entity is associated with
 * @author AndreasM
 *
 */
public class EntityCommentTypeHolder {

	private Set<Long> types = new HashSet<>();
	
	public EntityCommentTypeHolder() {
	}
	
	public void add(Long typeId) {
		if (!types.contains(typeId)) {
			types.add(typeId);
		}
	}
	
	public boolean isEmpty() {
		return types.isEmpty();
	}
	
	public boolean contains(Long entityCommentTypeId) {
		return types.contains(entityCommentTypeId);
	}
}
