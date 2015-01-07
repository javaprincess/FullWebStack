package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.RightStrandRestrictionSave;
import com.fox.it.erm.RightStrandSave;


public class StrandRestrictionCommentProvider {

	public StrandRestrictionCommentProvider() {

	}
	
	/**
	 * Returns a map from a comment timestamp id to a list of strand restriction ids.
	 * 
	 * @return
	 */
	public Map<Long,List<Long>> getCommentTimestampIdToRightRestrictionIds(List<RightStrandSave> strands) {
		Map<Long,List<Long>> map = new HashMap<>();
		Map<Long,Long> comments = new HashMap<>();
		
		Map<Long,List<Long>> commentToRestrictionIdsMap = new HashMap<>();
		for (RightStrandSave s: strands) {
			if (s.getRightRestrictions()!=null) { 
				for (RightStrandRestrictionSave r: s.getRightRestrictions()) {
					if (r.hasComment()) {
						Long timestampId = r.getCommentTimestamp();
						if (timestampId!=null) {
							if (!comments.containsKey(timestampId)) {
								Long commentId = r.getCommentId();
								comments.put(timestampId, commentId);
							}
							List<Long> ids = new ArrayList<>();
							if (!map.containsKey(timestampId)) {
								map.put(timestampId, ids);
							} else {
								ids = map.get(timestampId);
							}
							ids.add(r.getRightRestrictionId());							
						}
					}
				}
			}
		}
		for (Long id: comments.keySet()) {
			Long commentId = comments.get(id);
			List<Long> restrictionIds = map.get(id);
			commentToRestrictionIdsMap.put(commentId, restrictionIds);
		}
		
		return commentToRestrictionIdsMap;
	}
	

}
