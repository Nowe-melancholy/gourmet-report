export class Report {
  constructor(
    private readonly _id: string,
    private _name: string,
    private _rating: number,
    private _link: string,
    private _imgUrl: string,
    private _dateYYMMDD: string
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rating(): number {
    return this._rating;
  }

  get link(): string {
    return this._link;
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  get dateYYMMDD(): string {
    return this._dateYYMMDD;
  }
}
