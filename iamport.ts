
export interface ExtendedIamportWindow extends Window {
  IMP: IMP
}

export interface IMP {
  init: ( imp_uid: string ) => void;
  request_pay: ( params: IamportPaymentRequest, callback: ( res: IamportPaymentResponse ) => void ) => void;
}

export type IamportPaymentResponse = {
  success: true,
  imp_uid: string,
  merchant_uid: string,
  pay_method: string,
  status: string,
  name: string,
  card_name: string,
  card_quota: number,
  buyer_name: string,
  buyer_email: string,
  paid_amount: number,
  paid_at: string
  receipt_url: string,
} | {
  success: false,
  error_code: string
  error_msg: string,
}

export type IamportPaymentRequest = {
  pg: string,
  pay_method: "card" | "vbank",
  merchant_uid: string,
  name: string,
  amount: number,
  buyer_email: string,
  buyer_name: string,
  notice_url?: string,
}
