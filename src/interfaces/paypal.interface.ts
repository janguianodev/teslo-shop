export interface PayPalOrderStatusResponse {
  create_time: Date;
  id: string;
  intent: string;
  links: Link[];
  payer: Payer;
  payment_source: PaymentSource;
  purchase_units: PurchaseUnit[];
  status: string;
  update_time: Date;
}

export interface Link {
  href: string;
  method: string;
  rel: string;
}

export interface Payer {
  address: PayerAddress;
  email_address: string;
  name: PayerName;
  payer_id: string;
}

export interface PayerAddress {
  country_code: string;
}

export interface PayerName {
  given_name: string;
  surname: string;
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Paypal {
  account_id: string;
  account_status: string;
  address: PayerAddress;
  email_address: string;
  name: PayerName;
}

export interface PurchaseUnit {
  amount: Amount;
  payee: Payee;
  payments: Payments;
  reference_id: string;
  shipping: Shipping;
  soft_descriptor: string;
  invoice_id: string;
}

export interface Amount {
  currency_code: string;
  value: string;
}

export interface Payee {
  email_address: string;
  merchant_id: string;
}

export interface Payments {
  captures: Capture[];
}

export interface Capture {
  amount: Amount;
  create_time: Date;
  final_capture: boolean;
  id: string;
  links: Link[];
  seller_protection: SellerProtection;
  seller_receivable_breakdown: SellerReceivableBreakdown;
  status: string;
  update_time: Date;
}

export interface SellerProtection {
  dispute_categories: string[];
  status: string;
}

export interface SellerReceivableBreakdown {
  exchange_rate: ExchangeRate;
  gross_amount: Amount;
  net_amount: Amount;
  paypal_fee: Amount;
  receivable_amount: Amount;
}

export interface ExchangeRate {
  source_currency: string;
  target_currency: string;
  value: string;
}

export interface Shipping {
  address: ShippingAddress;
  name: ShippingName;
}

export interface ShippingAddress {
  address_line_1: string;
  address_line_2: string;
  admin_area_1: string;
  admin_area_2: string;
  country_code: string;
  postal_code: string;
}

export interface ShippingName {
  full_name: string;
}
