package com.fox.it.erm;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.service.ClearanceMemoService;

public class ClearanceMemoOutputStreamer {
	
	
	private ClearanceMemoOutput cmOutput;
	
	private void addToClearanceMemoData(ClearanceMemoService clearanceMemoService, HashMap<Long, String> clearanceMemoData, ClearanceMemoNode node, int level) throws ErmException{
	  for (ClearanceMemoNode nodeChild : node.getChildren()) {
		addToClearanceMemoData(clearanceMemoService, clearanceMemoData, nodeChild, (level+1));
	  }
	}
	
	public void addToClearanceMemoData(ClearanceMemoService clearanceMemoService, HashMap<Long, String> clearanceMemoData, ClearanceMemoNode node) throws ErmException {
	  addToClearanceMemoData(clearanceMemoService, clearanceMemoData, node, 0);
	}
	
	private void getIds(List<ClearanceMemoNode> nodes,List<Long> accumulator) {
		for (ClearanceMemoNode node: nodes) {
			accumulator.add(node.getId());
			List<ClearanceMemoNode> children = node.getChildren();
			if (children!=null && !children.isEmpty()) {
				getIds(children,accumulator);
			}
		}
	}
	
	public ClearanceMemoOutput getClearanceMemoOutput(ClearanceMemo clearanceMemo,ClearanceMemoService clearanceMemoService) throws ErmException{
		ClearanceMemoOutput clearanceMemoOutput = new ClearanceMemoOutput();
		clearanceMemoOutput.setClearanceMemoTOC(clearanceMemo);		
		HashMap<Long, String> clearanceMemoData = new HashMap<Long, String>();
		if (clearanceMemoOutput != null && clearanceMemoOutput.getClearanceMemoTOC() != null) {

		  List<ClearanceMemoNode> nodes = clearanceMemoOutput.getClearanceMemoTOC().getNodes();
		  
		  
		  List<Long> ids = new ArrayList<>();
		  getIds(nodes,ids);
		  List<Comment> comments = clearanceMemoService.getCommentsWithText(ids);
		  for (Comment comment: comments) {
			  String text = comment.getLongDescription();
			  if (text==null) text="";
			  clearanceMemoData.put(comment.getId(), text);
			  
		  }

		  clearanceMemoOutput.setClearanceMemoData(clearanceMemoData);


		}
		return clearanceMemoOutput;
		
	}
	
	public ClearanceMemoOutput getClearanceMemoOutput(Long foxVersionId, ClearanceMemoService clearanceMemoService,boolean includeMapping) throws ErmException {		
		ClearanceMemo clearanceMemo = clearanceMemoService.getClearanceMemo(foxVersionId, false,includeMapping);
		return getClearanceMemoOutput(clearanceMemo, clearanceMemoService);
	}
	
	public ClearanceMemoOutputStreamer(Long foxVersionId, ClearanceMemoService clearanceMemoService,boolean includeMapping) throws ErmException {
	  ClearanceMemoOutput cmOutput = getClearanceMemoOutput(foxVersionId,clearanceMemoService,includeMapping);
	  setCmOutput(cmOutput);
	}
	
	public ClearanceMemoOutputStreamer(Long foxVersionId, ClearanceMemo clearanceMemo, ClearanceMemoService clearanceMemoService) throws ErmException {
		  ClearanceMemoOutput cmOutput = getClearanceMemoOutput(clearanceMemo,clearanceMemoService);
		  setCmOutput(cmOutput);
	}
	
	public ClearanceMemoOutput getCmOutput() {
		return cmOutput;
	}

	public void setCmOutput(ClearanceMemoOutput cmOutput) {
		this.cmOutput = cmOutput;
	}	
	
	
		
}
