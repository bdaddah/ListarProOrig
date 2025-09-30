import {BookingStyleModel} from './booking_style';
import moment from 'moment';

export class BookingTableStyleModel extends BookingStyleModel {
  startTime: number;
  startDate: number;
  tableOptions: number[];
  selected: number[];

  constructor(data: any) {
    super(data);
    this.style = 'table';
    this.startTime = Date.now();
    this.startDate = Date.now();
    this.tableOptions = data.tableOptions ?? [];
    this.selected = [];
  }

  get params() {
    return {
      ...super.params,
      booking_style: this.style,
      start_date: moment(this.startDate).format('YYYY-MM-DD'),
      start_time: moment(this.startTime).format('hh:mm'),
      table_num: this.selected.map(item => item),
    };
  }

  validate(): string | undefined {
    const valid = super.validate();
    if (valid) {
      return valid;
    }
    if (!this.startTime) {
      return 'please_select_start_time';
    }
    if (!this.startDate) {
      return 'please_select_start_date';
    }
    if (this.selected?.length === 0) {
      return 'please_select_table';
    }
  }

  static fromJson(json: any): BookingTableStyleModel | undefined {
    try {
      return new BookingTableStyleModel({
        price: json.price ?? '',
        startTime: moment(json.start_time),
        startDate: moment(json.start_date),
        tableOptions: json.select_options,
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}
