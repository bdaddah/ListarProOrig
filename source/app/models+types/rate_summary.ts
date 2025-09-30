class RateSummaryModel {
  one: number;
  two: number;
  three: number;
  four: number;
  five: number;
  avg: number;
  total: number;

  constructor(data: any) {
    this.one = data.one;
    this.two = data.two;
    this.three = data.three;
    this.four = data.four;
    this.five = data.five;
    this.avg = data.avg;
    this.total = data.total;
  }

  static fromJson(json: any): RateSummaryModel | undefined {
    try {
      return new RateSummaryModel({
        one: json.rating_meta['1'] / json.rating_count || 0.0,
        two: json.rating_meta['2'] / json.rating_count || 0.0,
        three: json.rating_meta['3'] / json.rating_count || 0.0,
        four: json.rating_meta['4'] / json.rating_count || 0.0,
        five: json.rating_meta['5'] / json.rating_count || 0.0,
        avg: parseFloat(json.rating_avg) || 0.0,
        total: json.rating_count || 0,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export {RateSummaryModel};
