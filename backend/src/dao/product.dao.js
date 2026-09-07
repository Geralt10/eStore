import productModel from "../models/product.model.js";

export const stockOfVariant = async (productId, variantId) => {
  const product = await productModel.findOne({
    _id: productId,
    "varients._id": variantId,
  });

  if (!product) return 0;
  const variant = product.varients.id(variantId);

  return variant ? Number(variant.stock) || 0 : 0;
};