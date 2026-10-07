export function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export function getId(entity) {
  return entity?.id || entity?._id;
}

export function discountPercent(price, salePrice) {
  if (!price || !salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function effectivePrice(item) {
  return item?.salePrice > 0 && item.salePrice < item.price ? item.salePrice : item?.price || 0;
}

export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
