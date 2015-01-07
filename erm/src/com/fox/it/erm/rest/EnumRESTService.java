package com.fox.it.erm.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.EntityType;

@Path("/Enum")
public class EnumRESTService extends RESTService {
	
	private String getEntityTypeValues(String prefix) {
		StringBuilder builder = new StringBuilder();
		builder.append(prefix +"={};\n");
		for (EntityType type:EntityType.values()) {
			String value = prefix + "." + type.toString() + "=" + type.getId() + ";\n";
			builder.append(value);
		}
		return builder.toString();
	}
	
	
	private String getEntityCommentTypeValues(String prefix) {
		StringBuilder builder = new StringBuilder();
		builder.append(prefix +"={};\n");
		for (EntityCommentType type:EntityCommentType.values()) {
			String value = prefix + "." + type.toString() + "=" + type.getId() + ";\n";
			builder.append(value);
		}
		return builder.toString();
	}

	
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getEnumEntities")
	public Response getEnums() {		
		String entityTypeValues = getEntityTypeValues("erm.dbvalues.entityType");
		String entityCommentTypeValues = getEntityCommentTypeValues("erm.dbvalues.entityCommentType");
		String text = entityTypeValues + entityCommentTypeValues + 	"erm.dynamicJSLoadedCounter++;";

//		String text = "erm.dbvalues.entityType={};\n" + 				  
//		"erm.dbvalues.entityType.PRODUCT_VERSION="+ EntityType.PRODUCT_VERSION.getId() + ";\n" +
//		"erm.dbvalues.entityType.STRAND="+ EntityType.STRAND.getId() + ";\n" +
//		"erm.dbvalues.entityType.STRAND_RESTRICTION="+ EntityType.STRAND_RESTRICTION.getId() + ";\n" +
//		"erm.dbvalues.entityType.PROD_RSTRCN="+ EntityType.PROD_RSTRCN.getId() + ";\n" +
//		"erm.dbvalues.entityType.PRODUCT_GRANT="+ EntityType.PRODUCT_GRANT.getId() + ";\n" +
//		"erm.dbvalues.entityType.CONTRACT_INFO="+ EntityType.CONTRACT_INFO.getId() + ";\n" +
//		"erm.dbvalues.entityType.PRODUCT_PROMO_MTRL="+ EntityType.PRODUCT_PROMO_MTRL.getId() + ";\n" +
//		"erm.dbvalues.entityType.COMMENT="+ EntityType.COMMENT.getId() + ";\n" +		
//		"erm.dbvalues.entityCommentType={};\n" + 		
//		"erm.dbvalues.entityCommentType.PROMO_MATERIALS="+ EntityCommentType.PROMO_MATERIALS.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.CLEARANCE_MEMO="+ EntityCommentType.CLEARANCE_MEMO.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT="+ EntityCommentType.CLEARANCE_MEMO_COMMENT.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.SUBRIGHTS="+ EntityCommentType.SUBRIGHTS.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.MAY_ACQUIRE_RIGHTS="+ EntityCommentType.MAY_ACQUIRE_RIGHTS.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.PRODUCT_INFO="+ EntityCommentType.PRODUCT_INFO.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.DO_NOT_LICENSE="+ EntityCommentType.DO_NOT_LICENSE.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.RIGHT_STRAND_COMMENT="+ EntityCommentType.RIGHT_STRAND_COMMENT.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.INFO_CODE="+ EntityCommentType.INFO_CODE.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.SALES_AND_MARKETING_GNRL="+ EntityCommentType.SALES_AND_MARKETING_GNRL.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.SALES_AND_MARKETING_SPECIAL="+ EntityCommentType.SALES_AND_MARKETING_SPECIAL.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.CLEARANCE_MEMO_MAP="+ EntityCommentType.CLEARANCE_MEMO_MAP.getId() + ";\n" +
//		"erm.dbvalues.entityCommentType.CONTRACTUAL_PARTY_COMMENT="+ EntityCommentType.CONTRACTUAL_PARTY_COMMENT.getId() + ";\n" +
//		"erm.dynamicJSLoadedCounter++;";
		return Response.ok(text,MediaType.TEXT_PLAIN).cacheControl(getCache()).build();							
	}
}
