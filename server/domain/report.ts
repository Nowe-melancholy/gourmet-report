import { z } from 'zod';

export class ReportModel {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _rating: number,
    private _comment: string,
    private _link: string,
    private _imgUrl: string,
    private _dateYYYYMMDD: string,
    private _userId: string
  ) {}

  static create = (input: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    link: string;
    imgUrl: string;
    dateYYYYMMDD: string;
    userId: string;
  }) => {
    const { id, name, rating, comment, link, imgUrl, dateYYYYMMDD, userId } = z
      .object({
        id: z.string(),
        name: z.string(),
        rating: z.number(),
        comment: z.string(),
        link: z.string(),
        imgUrl: z.string(),
        dateYYYYMMDD: z.string().regex(/^\d{8}$/),
        userId: z.string(),
      })
      .parse(input);

    return new ReportModel(
      id,
      name,
      rating,
      comment,
      link,
      imgUrl,
      dateYYYYMMDD,
      userId
    );
  };

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rating(): number {
    return this._rating;
  }

  get comment(): string {
    return this._comment;
  }

  get link(): string {
    return this._link;
  }

  get imgUrl(): string {
    return this._imgUrl;
  }

  get dateYYYYMMDD(): string {
    return this._dateYYYYMMDD;
  }

  get userId(): string {
    return this._userId;
  }

  update = (input: {
    name: string;
    rating: number;
    comment: string;
    link: string;
    imgUrl: string;
    dateYYYYMMDD: string;
    userId: string;
  }) => {
    const { name, rating, comment, link, imgUrl, dateYYYYMMDD, userId } = z
      .object({
        name: z.string(),
        rating: z.number(),
        comment: z.string(),
        link: z.string(),
        imgUrl: z.string(),
        dateYYYYMMDD: z.string().regex(/^\d{8}$/),
        userId: z.string(),
      })
      .parse(input);

    this._name = name;
    this._rating = rating;
    this._comment = comment;
    this._link = link;
    this._imgUrl = imgUrl;
    this._dateYYYYMMDD = dateYYYYMMDD;
    this._userId = userId;
  };
}
