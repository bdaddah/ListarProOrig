import moment, {Moment} from 'moment';

class ClaimModel {
  id: number;
  title: string;
  status: string;
  address: string;
  statusColor: string;
  priceDisplay: string;
  date: Moment | null;
  dueDate: Moment | null;
  paymentName?: string;
  payment?: string;
  transactionID?: string;
  total?: number;
  currency?: string;
  totalDisplay?: string;
  billFirstName?: string;
  billLastName?: string;
  billPhone?: string;
  billEmail?: string;
  billAddress?: string;
  allowCancel?: boolean;
  allowPayment?: boolean;
  allowAccept?: boolean;
  createdOn?: Moment | null;
  paidOn?: Moment | null;
  createdVia?: string;
  createdBy?: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.status = data.status;
    this.address = data.address;
    this.statusColor = data.statusColor;
    this.priceDisplay = data.priceDisplay;
    this.date = data.date;
    this.dueDate = data.dueDate;
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
    this.allowCancel = data.allowCancel;
    this.allowPayment = data.allowPayment;
    this.allowAccept = data.allowAccept;
    this.createdOn = data.createdOn;
    this.paidOn = data.paidOn;
    this.createdVia = data.createdVia;
    this.createdBy = data.createdBy;
  }

  static fromJson(json: any): ClaimModel | undefined {
    try {
      return new ClaimModel({
        id: json.claim_id ?? 0,
        title: json.title ?? '-',
        status: json.status_name ?? '-',
        address: json.address ?? '',
        statusColor: json.status_color,
        priceDisplay: json.total_display ?? '-',
        date: json.date ? moment(json.date) : null,
        dueDate: json.due_date ? moment(json.due_date) : null,
        paymentName: json.payment_name ?? '-',
        payment: json.payment ?? '-',
        transactionID: json.txn_id ?? '-',
        total: json.total ?? 0,
        currency: json.currency ?? '-',
        totalDisplay: json.total_display ?? '-',
        billFirstName: json.billing_first_name ?? '-',
        billLastName: json.billing_last_name ?? '-',
        billPhone: json.billing_phone ?? '-',
        billEmail: json.billing_email ?? '-',
        billAddress: json.billing_address_1 ?? '-',
        allowCancel: json.allow_cancel ?? false,
        allowPayment: json.allow_payment ?? false,
        allowAccept: json.allow_accept ?? false,
        createdOn: json.created_on
          ? moment(json.created_on, 'MMM YY, YYYY hh:mm a')
          : undefined,
        paidOn: json.paid_date
          ? moment(json.paid_date, 'MMM YY, YYYY hh:mm a')
          : null,
        createdVia: json.create_via ?? '-',
        createdBy: `${json.first_name ?? json.billing_first_name} ${
          json.last_name ?? json.billing_last_name
        }`,
      });
    } catch (error: any) {
      console.log(error.toString());
    }
  }
}

export {ClaimModel};
