class BankAccountModel {
  name: string;
  number: string;
  bankName: string;
  bankCode: string;
  bankIban: string;
  bankSwift: string;

  constructor(data: any) {
    this.name = data.name ?? '';
    this.number = data.number ?? '';
    this.bankName = data.bankName ?? '';
    this.bankCode = data.bankCode ?? '';
    this.bankIban = data.bankIban ?? '';
    this.bankSwift = data.bankSwift ?? '';
  }

  static fromJson(json: any): BankAccountModel | undefined {
    try {
      return new BankAccountModel({
        name: json.acc_name ?? '',
        number: json.acc_number ?? '',
        bankName: json.bank_name ?? '',
        bankCode: json.bank_sort_code ?? '',
        bankIban: json.bank_iban ?? '',
        bankSwift: json.bank_swift ?? '',
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BankAccountModel};
