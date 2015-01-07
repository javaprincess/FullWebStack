package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fox.it.erm.ErmUpdatable;

public class UpdatableProcessor {
	public static void setUserIdAndTypeIndicator(ErmUpdatable updatable,String userId, boolean isBusiness, boolean isLegal,Date timestamp) {
		if (updatable.isNew()) {
			updatable.setCreateName(userId);
			updatable.setCreateDate(timestamp);			
		}
		updatable.setUpdateDate(timestamp);
		updatable.setUpdateName(userId);
		updatable.setBusinessInd(isBusiness);
		updatable.setLegalInd(isLegal);		
	}
	
	public static void setUserIdAndTypeIndicator(List<? extends ErmUpdatable> list,String userId, boolean isBusiness, Date timestamp) {
		for (ErmUpdatable updatable: list) {
			setUserIdAndTypeIndicator(updatable, userId, isBusiness, !isBusiness, timestamp);
		}
	}
	
	public static List<? extends ErmUpdatable> filter(List<? extends ErmUpdatable> list,boolean isBusiness) {
		List<ErmUpdatable> filtered = new ArrayList<>();
		for (ErmUpdatable strand: list) {
			if (isBusiness && strand.isBusiness()) {
				filtered.add(strand);
			} else if (!isBusiness && strand.isLegal()) {
				filtered.add(strand);
			}
		}
		return filtered;
	}
	
}
