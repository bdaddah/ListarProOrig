class PaginationModel {
  page: number;
  maxPage: number;
  perPage: number;
  total: number;

  constructor(data: any) {
    this.page = data.page;
    this.maxPage = data.maxPage;
    this.perPage = data.perPage;
    this.total = data.total;
  }

  static fromJson(json: any): PaginationModel | undefined {
    try {
      return new PaginationModel({
        page: json.page ?? 1,
        maxPage: json.max_page ?? 1,
        perPage: json.per_page ?? 1,
        total: json.total ?? 1,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }

  get allowMore(): boolean {
    return this.page < this.maxPage;
  }
}

export {PaginationModel};
