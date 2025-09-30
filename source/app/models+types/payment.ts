import {BankAccountModel} from './bank_account';
import {PaymentMethodModel} from './payment_method';

class PaymentModel {
  use: boolean;
  term: string;
  method: PaymentMethodModel | null;
  listMethod: PaymentMethodModel[];
  listAccount: BankAccountModel[];
  urlSuccess: string;
  urlCancel: string;

  constructor(data: any) {
    this.use = data.use ?? false;
    this.term = data.term ?? '';
    this.method = data.method ?? null;
    this.listMethod = data.listMethod ?? [];
    this.listAccount = data.listAccount ?? [];
    this.urlSuccess = data.urlSuccess;
    this.urlCancel = data.urlCancel;
  }

  validate(): string | undefined {
    if (!this.method) {
      return 'please_select_payment_method';
    }
  }

  static fromJson(json: any): PaymentModel | undefined {
    try {
      const listMethod = json.list?.map((item: any) => {
        return PaymentMethodModel.fromJson(item);
      });
      return new PaymentModel({
        use: json.use ?? false,
        term: json.term_condition_page ?? '',
        method: json.use ? listMethod[0] : null,
        listMethod,
        listAccount: json.bank_account_list?.map((item: any) => {
          return BankAccountModel.fromJson(item);
        }),
        urlSuccess: json.url_success,
        urlCancel: json.url_cancel,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {PaymentModel};
