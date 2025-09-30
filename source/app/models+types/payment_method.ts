class PaymentMethodModel {
  id: string;
  title?: string;
  description?: string;
  instruction?: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.instruction = data.instruction;
  }

  static fromJson(json: any): PaymentMethodModel | undefined {
    try {
      return new PaymentMethodModel({
        id: json.method,
        title: json.title,
        description: json.desc,
        instruction: json.instruction,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {PaymentMethodModel};
