/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Product {
  device_id: string;
  column?: string;
  name: string;
  location: string;
  sku: string;
  quantity?: number;
  price?: number;
  coin?: number;
}

export interface PaymentFee {
  platform_sharing_revenue?: number;
  mdr_qris?: number;
}

export interface PaymentDetail {
  id?: string;
  ts?: number;
  transaction_id?: string;
  transaction_status?: string;
  transaction_time?: string;
  order_id?: string;
  issuer?: string;
  payment_detail?: any;
  ref_no?: string;
  qris_data?: string;
  ECR?: any;
  [key: string]: any;
}

export interface Payment {
  amount: number;
  method: string;
  nett: number;
  fee: PaymentFee;
  session_id?: string;
  detail: PaymentDetail | string;
}

export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Time {
  firestore_timestamp: FirestoreTimestamp;
  timestamp: number;
}

export interface TransactionDetail {
  order_id: string;
  transaction_status: string;
  refund_time?: number;
  refund_amount?: number;
  refund_reason?: string;
  refund_request_time?: number;
  dispense_code?: number;
  dispense_status?: string;
  dispense_time?: number;
}

export interface TransactionData {
  product: Product;
  payment: Payment;
  time: Time;
  detail: TransactionDetail;
}

export interface ApiResponse {
  message: string;
  data: Record<string, TransactionData>;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  productName: string;
  deviceId: string;
  paymentMethod: string;
  nettAmount: number;
  fee: number;
  orderId: string;
  rawData: TransactionData;
}
