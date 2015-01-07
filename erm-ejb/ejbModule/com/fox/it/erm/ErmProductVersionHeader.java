package com.fox.it.erm;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Class contains the attributes from ERM_PRODUCT_VERSION but WITHOUT any relationships.
 * This class is being used to determine if a product has recorded rights, or inherited rights to display indicator in the product search.
 * For any other use use ErmProductVersion
 * @author AndreasM
 * @see com.fox.it.erm.ErmProductVersion
 */
@Entity
@Table(name="ERM_PROD_VER")
public class ErmProductVersionHeader extends ErmProductVersionBase{

}
