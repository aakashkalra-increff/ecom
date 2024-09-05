export interface Product {
  landingPageUrl: string;
  loyaltyPointsEnabled: boolean;
  adId: string;
  isPLA: boolean;
  skuId: string;
  product: string;
  name: string;
  rating: number;
  reviews: number;
  isFastFashion: boolean;
  futureDiscountedPrice: number;
  futureDiscountStartDate: string;
  discount: number;
  brand: string;
  searchImage: string;
  effectiveDiscountPercentageAfterTax: number;
  effectiveDiscountAmountAfterTax: number;
  buyButtonWinnerSkuId: number;
  buyButtonWinnerSellerPartnerId: number;
  relatedStylesCount: number;
  relatedStylesType: string;
  productVideos: any[];
  inventoryInfo: InventoryInfo[];
  sizes: string;
  images: Image[];
  gender: string;
  color: string;
  discountLabel: string;
  discountDisplayLabel: string;
  additionalInfo: string;
  category: string;
  mrp: number;
  price: number;
  advanceOrderTag: string;
  colorVariantAvailable: boolean;
  productimagetag: string;
  listViews: number;
  discountType: string;
  tdBxGyText: string;
  catalogDate: string;
  season: string;
  year: string;
  isPersonalised: boolean;
  eorsPicksTag: string;
  personalizedCoupon: string;
  personalizedCouponValue: number;
  productMeta: string;
  systemAttributes: SystemAttribute[];
  attributeTagsPriorityList: any[];
  preferredDeliveryTag: string;
  deliveryPromise: string;
  expressTags: any[];
  couponData: CouponData;
  productMetaData: ProductMetaData;
  mediaData: any[];
}
interface ProductMetaData {
  plaSlot: boolean;
  plaReason: string;
  plaRank: number;
}
interface CouponData {
  couponDiscount: number;
  endDate: string;
  tagLink: string;
  couponDescription: CouponDescription;
}
interface CouponDescription {
  description: string;
  couponCode: string;
  bestPrice: number;
  bestPriceText: string;
  templateInfo: TemplateInfo;
}
interface TemplateInfo {
  templateName: string;
  attributes: Attributes;
}
interface Attributes {
  couponDiscount: string;
  couponCode: string;
  bestPrice: string;
  bestPriceText: string;
}
interface SystemAttribute {
  attribute: string;
  value: string;
  metaInfo: string;
}
interface Image {
  view: string;
  src: string;
}
export interface InventoryInfo {
  skuId: number;
  label: string;
  inventory: number;
  available: boolean;
}
