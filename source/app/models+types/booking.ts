import {BookingResourceModel} from '@models+types';

class BookingModel {
  id: number;
  title: string;
  date?: number;
  status: string;
  statusColor: string;
  paymentName: string;
  payment: string;
  transactionID: string;
  total: number;
  currency: string;
  totalDisplay: number;
  billFirstName: string;
  billLastName: string;
  billPhone: string;
  billEmail: string;
  billAddress: string;
  resource: any;
  allowCancel: boolean;
  allowPayment: boolean;
  allowAccept: boolean;
  createdOn?: number;
  paidOn?: number;
  createdVia: string;
  createdBy: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.date = data.date;
    this.status = data.status;
    this.statusColor = data.statusColor;
    this.paymentName = data.paymentName;
    this.payment = data.payment;
    this.transactionID = data.transactionID;
    this.total = data.total;
    this.currency = data.currency;
    this.totalDisplay = data.totalDisplay;
    this.billFirstName = data.billFirstName;
    this.billLastName = data.billLastName;
    this.billPhone = data.billPhone;
    this.billEmail = data.billEmail;
    this.billAddress = data.billAddress;
    this.resource = data.resource;
    this.allowCancel = data.allowCancel;
    this.allowPayment = data.allowPayment;
    this.allowAccept = data.allowAccept;
    this.createdOn = data.createdOn;
    this.paidOn = data.paidOn;
    this.createdVia = data.createdVia;
    this.createdBy = data.createdBy;
  }

  static fromJson(json: any): BookingModel | undefined {
    try {
      return new BookingModel({
        id: json.booking_id ?? 0,
        title: json.title ?? '-',
        date: Date.parse(json.date),
        status: json.status_name ?? '-',
        statusColor: json.status_color ?? '-',
        paymentName: json.payment_name ?? '-',
        payment: json.payment ?? '-',
        transactionID: json.txn_id ?? '-',
        total: json.total ?? 0,
        currency: json.currency ?? '-',
        totalDisplay: json.total_display ?? 0,
        billFirstName: json.billing_first_name ?? '-',
        billLastName: json.billing_last_name ?? '-',
        billPhone: json.billing_phone ?? '-',
        billEmail: json.billing_email ?? '-',
        billAddress: json.billing_address_1 ?? '-',
        resource: json.resources?.map?.((item: any) => {
          return BookingResourceModel.fromJson(item);
        }),
        allowCancel: json.allow_cancel ?? false,
        allowPayment: json.allow_payment ?? false,
        allowAccept: json.allow_accept ?? false,
        createdOn: json.created_on ? Date.parse(json.created_on) : undefined,
        paidOn: json.paid_date ? Date.parse(json.paid_date) : undefined,
        createdVia: json.create_via ?? '-',
        createdBy: `${json.first_name} ${json.last_name}`,
      });
    } catch (error) {}
  }
}

export {BookingModel};
