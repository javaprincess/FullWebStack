package com.fox.it.erm;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fox.it.erm.util.Counter;
import com.fox.it.erm.util.Visitor;

public class ClearanceMemoNode {
	
	
	private static final int MAX_TITLE_SECTION_SIZE=200;
	
	private Logger logger = Logger.getLogger(ClearanceMemoNode.class.getName());	
	
	private Long id;
	private Long tocID;
	private String title;
	private String text;
	private Long childSequence;
	private ClearanceMemoNode parent;
	private boolean linked;
	private boolean ignoreTitle;
	private boolean reviewedByBusiness;
	private boolean reviewedByLegal;
	private List<Long> mappedRightStrands;
	private List<Long> mappedRightStrandRestrictions;
	private List<Long> mappedProductInfoCodes;
	private boolean showPublic;
	private Integer commentStatus;
	private List<EntityAttachment> attachments;
	
	private boolean deleted;
	
	//used to store the comment id 
	//when coping CM to another product the id will be replaced with
	//the new comment for the target product. We need a reference to the original comment
	//so that we can copy the text of the original comment to the new comment
	private Long originalCommentId;
	
	//Note this field is only used for Word Parsing
	//do not use
	private int level;
	
	
	@JsonProperty("nodes")
	private List<ClearanceMemoNode> children;
	
	public ClearanceMemoNode() {
		
	}
	
	
	
	public Long getId() {
		return id;
	}



	public void setId(Long id) {
		this.id = id;
	}	

	public Long getTocID() {
		return tocID;
	}

	public void setTocID(Long tocID) {
		this.tocID = tocID;
	}

	public Integer getCommentStatus() {
		return commentStatus;
	}

	public void setCommentStatus(Integer commentStatus) {
		this.commentStatus = commentStatus;
	}



	public ClearanceMemoNode(String title) {
		this.title = title;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	public void appendText(String text) {
		if (this.text==null) {
			this.text = text;
		} else {
			this.text = this.text+ text;
		}
		
	}

	public List<ClearanceMemoNode> getChildren() {
		if (children==null) {
			children= new ArrayList<>();
		}
		return children;
	}

	public void setChildren(List<ClearanceMemoNode> children) {
		this.children = children;
	}
	
	public ClearanceMemoNode addChild(ClearanceMemoNode child) {
		child.setParent(this);
		int childLevel = (getLevel()==null?0:getLevel())+1;
		child.setLevel(childLevel);
		getChildren().add(child);		
		
		//logger.info("the title of the child being added (object param): " + child.title);
		
		return child;
	}
	
	public ClearanceMemoNode addChild(String title) {
		ClearanceMemoNode node = new ClearanceMemoNode(title);
		
		//logger.info("the title of the node being added (string param): " + node.title);
		
		return addChild(node);
	}

	@JsonIgnore
	public ClearanceMemoNode getParent() {
		return parent;
	}

	public void setParent(ClearanceMemoNode parent) {
		this.parent = parent;
	}
	
 
	public boolean isRoot() {
		return parent==null;
	}



	public Long getChildSequence() {
		return childSequence;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}	

	public boolean isLinked() {
		return linked;
	}
	
	public void setLinked(boolean linked) {
		this.linked = linked;
	}				
	
	public boolean isIgnoreTitle() {
		return ignoreTitle;
	}

	public void setIgnoreTitle(boolean ignoreTitle) {
		this.ignoreTitle = ignoreTitle;
	}

	public boolean isReviewedByBusiness() {
		return reviewedByBusiness;
	}

	public void setReviewedByBusiness(boolean reviewedByBusiness) {
		this.reviewedByBusiness = reviewedByBusiness;
	}

	public boolean isReviewedByLegal() {
		return reviewedByLegal;
	}

	public void setReviewedByLegal(boolean reviewedByLegal) {
		this.reviewedByLegal = reviewedByLegal;
	}

	public List<Long> getMappedRightStrands() {
		return mappedRightStrands;
	}
	
	public void setMappedRightStrands(List<Long> mappedRightStrands) {
		this.mappedRightStrands = mappedRightStrands;
	}
	
	

	public List<Long> getMappedRightStrandRestrictions() {
		return mappedRightStrandRestrictions;
	}



	public void setMappedRightStrandRestrictions(
			List<Long> mappedRightStrandRestrictions) {
		this.mappedRightStrandRestrictions = mappedRightStrandRestrictions;
	}



	public List<Long> getMappedProductInfoCodes() {
		return mappedProductInfoCodes;
	}



	public void setMappedProductInfoCodes(List<Long> mappedProductInfoCodes) {
		this.mappedProductInfoCodes = mappedProductInfoCodes;
	}



	public boolean isShowPublic() {
		return showPublic;
	}

	public void setShowPublic(boolean showPublic) {
		this.showPublic = showPublic;
	}	

	public List<EntityAttachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<EntityAttachment> attachments) {
		this.attachments = attachments;
	}

	public void setChildSequence(Long childSequence) {
		this.childSequence = childSequence;
	}
	
	protected void clearCommentIds() {
		setId(null);
		for (ClearanceMemoNode node: getChildren()) {
			node.clearCommentIds();
		}
	}
	
	public ClearanceMemoNode findByTitle(String title) {
		logger.info("number of children in this node: " + getChildren().size());
		logger.info("title to search for: " + title);
		
		if (title!=null && title.equals(getTitle())) {
			return this;
		}
		if (getChildren().size()==0) {
			return null;
		}
		for (ClearanceMemoNode node: getChildren()) {
			
			ClearanceMemoNode found = node.findByTitle(title);
			if (found!=null) {
				logger.info("found the title");
				return found;
			}
		}
		return null;
		
	}
	
	public void walkChildren(Visitor<ClearanceMemoNode> visitor) {
		for (ClearanceMemoNode node: getChildren()) {
			visitor.visit(node);
			node.walk(visitor);
		}		
	}
	
	public void walkWithRoot(Visitor<ClearanceMemoNode> visitor) {
		//AMV added 12/31/2013
		visitor.visit(this);
		for (ClearanceMemoNode node: getChildren()) {
//			visitor.visit(node);
			node.walkWithRoot(visitor);
		}
		
	}
	
	public void walk(Visitor<ClearanceMemoNode> visitor) {
		walkChildren(visitor);
	}
	
	private String toHTML(String str) {
		str = stripLastBr(str);
		return str;
	}
	
	private String stripLastBr(String str) {
	  String br = "<br>";
	  String brNL = "<br>\n";
	  String end = null;
	  if (str!=null) {
		  if (str.endsWith(br)) {
			  end = br;
		  }
		  if (str.endsWith(brNL)) {
			  end = br;
		  }
		  if (end!=null) {
			  return str.substring(0, str.length()-end.length()-1);
		  }
	  }
	  return str;	
	}
	
	public void convertToHTML() {
		setTitle(toHTML(title));
		setText(toHTML(text));
	}
	
	private String validateTitleLenght() {
		String message = null;
		if (title!=null&&title.length()>MAX_TITLE_SECTION_SIZE) {
			String titleText = title.substring(0, 50) + " ...";
			String parentSection = getParent()==null ? ". Section has no parent section" : " Parent Section is " + getParent().getTitle(); 
			message = "Section title: \n <br>" + titleText + ". Exceeds maximum length.\n<br>" + parentSection ;
		}
		return message;
		
	}
	
	public void walkCopyOriginalId() {
		walkWithRoot(new Visitor<ClearanceMemoNode>() {

			@Override
			public void visit(ClearanceMemoNode o) {
				o.copyToOriginalIdIfEmpty();
			}
			
		});
	}
	
	/**
	 * Validates the ClearanceMemo
	 * If the length exceeds the filed length for title, throws an exception
	 * @throws ErmValidationException
	 */
	public void validate() throws ErmValidationException {
		final List<String> exceptions = new ArrayList<>();
		walk(new Visitor<ClearanceMemoNode>() {

			@Override
			public void visit(ClearanceMemoNode o) {
				
				//logger.info("visiting during validation");
				
				String message = o.validateTitleLenght();
				if (message!=null){
					exceptions.add(message);
				}
			}
		
		});
		if (!exceptions.isEmpty()) {
			throw new ErmValidationException(exceptions.get(0));
		}
		
	}
	
		
	
	public void setLinkIndicator(final HashMap<Long, Boolean> commentIdMatch) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {
		  //logger.info("visiting while setting the link indicator");
			
		  if (commentIdMatch.get(o.getId()) == null) {
		   commentIdMatch.put(o.getId(), true);				  
		  } else {
		    //logger.info("setLinkIndicator: commentIdMatch: " + commentIdMatch + " set linked to true ");
		    o.setLinked(true);
		  }
		}
	  };	 
	  this.walk(linkVisitor);		
	}
	
	public void setReviewedByLegalIndicator(final HashMap<Long, Boolean> reviewedByLegalMap) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {
		  o.setReviewedByLegal(reviewedByLegalMap.get(o.getId()) != null ? reviewedByLegalMap.get(o.getId()) : true);
		}
	  };	 
	  this.walkWithRoot(linkVisitor);		
	}
	
	public void setReviewedByBusinessIndicator(final HashMap<Long, Boolean> reviewedByBusinessMap) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {
		  o.setReviewedByBusiness(reviewedByBusinessMap.get(o.getId()) != null ? reviewedByBusinessMap.get(o.getId()) : true);		  
		}
	  };	 
	  this.walkWithRoot(linkVisitor);		
	}
	
	public void setMappedRightStrandsForNode(final HashMap<Long, List<Long>> mappedRightStrandsMap) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {		  
		  o.setMappedRightStrands(mappedRightStrandsMap.get(o.getId()));		  
		}
	  };	 
	  this.walkWithRoot(linkVisitor);		
	}
	
	public void setMappedRightStrandRestrictionsForNode(final HashMap<Long, List<Long>> mappedRightStrandRestrictions) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {		  
		  o.setMappedRightStrandRestrictions(mappedRightStrandRestrictions.get(o.getId()));		  
		}
	  };	 
	  this.walkWithRoot(linkVisitor);		
	}
	
	public void setMappedProductInfoCodesForNode(final HashMap<Long, List<Long>> mappedProductInfoCodes) {	  
	  Visitor<ClearanceMemoNode> linkVisitor = new Visitor<ClearanceMemoNode>() {		  		
		@Override		
		public void visit(ClearanceMemoNode o) {		  
		  o.setMappedProductInfoCodes(mappedProductInfoCodes.get(o.getId()));		  
		}
	  };	 
	  this.walkWithRoot(linkVisitor);		
	}
	
	public void setChildSequence(ClearanceMemoNode node, long index) {      
	  node.setChildSequence(index++);
	  //System.err.println(node.getTitle() + " seq: " + node.getChildSequence());
	  long childIndex = 1;
	  for (ClearanceMemoNode childNode : node.getChildren()) {		  		  
	    setChildSequence(childNode, childIndex++);
	  }		
	}	
	public void setChildSequence() {
	  long index = 1;
	  for (ClearanceMemoNode node: getChildren())		  		  
		 setChildSequence(node, index++);	  
	}	
	
	private String pad(int spaces) { 
		String s = "";
		for (int i =0;i<level;i++) {
			s+=" ";
		}
		return s;
	}
	
	private String pad(int level, String s) {
		return pad(level*2) + s;
	}
	private void print(int level){
		if (title!=null) {
			System.out.println(pad(level,title));
		}
		if (text!=null) {
			System.out.println(pad(level,"\"" + text + "\""));
		}
		for (ClearanceMemoNode node: getChildren()) {
			node.print(level+1);
		}
	}
	
	public void print() {
		print(0);
	}


	/**
	 * Auxiliary field used fox XCopy
	 * @return
	 */
	public Long getOriginalCommentId() {
		return originalCommentId;
	}
	
	


	public boolean isDeleted() {
		return deleted;
	}
	

	public ClearanceMemoNode findById(Long id) {
		if (id.equals(getId())) return this;
		for (ClearanceMemoNode node: getChildren()) {
			ClearanceMemoNode match = node.findById(id);
			if (match!=null) return match;
		}
		return null;
	}


	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
	
	
	@JsonIgnore
	public ClearanceMemoNode getFirstNotDeletedAncestor() {
		ClearanceMemoNode parent = getParent(); 
		if (parent==null||parent.isRoot()) { 
			return null; 
		}
		if (!parent.isDeleted()) {
			return parent;
		}
		return parent.getFirstNotDeletedAncestor();
	}



	/**
	 * Auxiliary field used fox XCopy
	 * @param originalCommentId
	 */
	public void setOriginalCommentId(Long originalCommentId) {
		this.originalCommentId = originalCommentId;
	}
	
	public void copyToOriginalId() {
		setOriginalCommentId(getId());
	}
	
	public void copyToOriginalIdIfEmpty() {
		if (getOriginalCommentId()==null) {
			copyToOriginalId();
		}
	}
	
	public void copyContent(ClearanceMemoNode node) {
		setTitle(node.getTitle());
		setText(node.getText());
		setOriginalCommentId(node.getOriginalCommentId());
		setShowPublic(node.isShowPublic());
		setIgnoreTitle(node.isIgnoreTitle());
	}
	
	
	public long getNumberOfNodes() {
		final Counter counter = new Counter();
		Visitor<ClearanceMemoNode> visitor = new Visitor<ClearanceMemoNode>() {

			@Override
			public void visit(ClearanceMemoNode o) {
				counter.count();
			}
			
		};
		walkWithRoot(visitor);
		return counter.get();
	}

}
