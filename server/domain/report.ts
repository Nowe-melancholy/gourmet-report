export class ReportModel {
  constructor(
    private _self: {
      readonly id: string;
      name: string;
      rating: number;
      comment: string;
      link: string;
      imgUrl: string;
      dateYYYYMMDD: string;
      userId: string;
    }
  ) {}

  get id(): string {
    return this._self.id;
  }

  get name(): string {
    return this._self.name;
  }

  get rating(): number {
    return this._self.rating;
  }

  get comment(): string {
    return this._self.comment;
  }

  get link(): string {
    return this._self.link;
  }

  get imgUrl(): string {
    return this._self.imgUrl;
  }

  get dateYYYYMMDD(): string {
    return this._self.dateYYYYMMDD;
  }

  get userId(): string {
    return this._self.userId;
  }
}
