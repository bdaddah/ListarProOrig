class BookingResourceModel {
  id: number;
  name: string;
  quantity: number;
  total: number;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.quantity = data.quantity;
    this.total = data.total;
  }

  static fromJson(json: any): BookingResourceModel | undefined {
    try {
      return new BookingResourceModel({
        id: json.id ?? 0,
        name: json.name ?? '',
        quantity: json.qty ?? 0,
        total: json.total ?? 0,
      });
    } catch (e: any) {
      console.error(e.message);
    }
  }
}

export {BookingResourceModel};
