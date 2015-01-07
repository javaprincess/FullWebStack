package com.fox.it.erm.enums;

public enum PromoMaterialType {
	
	FEATURE_PROMO(1),
	FEATURETT(2),
	MUSIC_VIDEO(3),
	OUTTAKES(4),
	BEHIND_THE_SCENES(5),
	MAKING_OF(6),
	TRANSFER_UPDATES(7),
	SPECIALS(8),
	SPECIAL_FEATURE_MATERIAL(184);
	
	private final Integer id;
	
	private PromoMaterialType(Integer id) {
		this.id = id;
	}
	
	
	public Integer getId() {
		return id;
	}

}
