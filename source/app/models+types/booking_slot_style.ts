import {BookingStyleModel} from './booking_style';

class BookingSlotStyleModel extends BookingStyleModel {
  constructor(data: any) {
    super(data);
    this.style = 'slot';
  }

  get params() {
    return {
      ...super.params,
      booking_style: this.style,
    };
  }

  validate(): string | undefined {
    return super.validate();
  }

  clone(): BookingStyleModel {
    return Object.assign(new BookingSlotStyleModel({}), this);
  }

  static fromJson(json: any): BookingSlotStyleModel | undefined {
    try {
      return new BookingSlotStyleModel({
        price: json.price ?? '',
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {BookingSlotStyleModel};
