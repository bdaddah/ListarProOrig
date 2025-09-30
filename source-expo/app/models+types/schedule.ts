class ScheduleModel {
  view?: string;
  start: string;
  end: string;

  constructor(data: any) {
    this.view = data.view;
    this.start = data.start;
    this.end = data.end;
  }

  get title() {
    if (this.view) {
      return this.view;
    }
    return `${this.start} - ${this.end}`;
  }

  static fromString(value: string): ScheduleModel {
    const arr = value.split(' - ');
    return new ScheduleModel({
      start: arr[0] ?? '00:00',
      end: arr[1] ?? '00:00',
    });
  }

  static fromJson(json: any): ScheduleModel | undefined {
    try {
      if (json.start.toString() === '0') {
        json.start = '00:00';
      }
      if (json.end.toString() === '0') {
        json.end = '00:00';
      }

      return new ScheduleModel({
        view: json.format,
        start: json.start ?? '00:00',
        end: json.end ?? '00:00',
      });
    } catch (e: any) {
      console.log(e.toString());
    }
  }
}

export {ScheduleModel};
