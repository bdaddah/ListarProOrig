class BookingStyleModel {
  style: string;
  price: string;
  adult: number;
  children: number;

  constructor(data: any) {
    this.style = 'standard';
    this.price = data.price;
    this.adult = data.adult ?? 0;
    this.children = data.children ?? 0;
  }

  get params(): {[key: string]: any} {
    return {
      adult: this.adult,
      children: this.children,
    };
  }

  clone(): BookingStyleModel {
    return Object.assign(new BookingStyleModel({}), this);
  }

  validate(): string | undefined {
    if (!this.adult) {
      return 'choose_adults_message';
    }
  }
}

export {BookingStyleModel};
