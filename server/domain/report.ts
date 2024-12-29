import { z } from 'zod'

export class ReportModel {
	private constructor(
		private readonly _id: string,
		private _shopName: string,
		private _name: string,
		private _place: string,
		private _rating: number,
		private _comment: string,
		private _link: string | null,
		private _imgUrl: string,
		private _dateYYYYMMDD: string,
		private _userId: string,
	) {}

	static create = (input: {
		id: string
		shopName: string
		name: string
		place: string
		rating: number
		comment: string
		link?: string | null
		imgUrl: string
		dateYYYYMMDD: string
		userId: string
	}) => {
		const {
			id,
			shopName,
			name,
			place,
			rating,
			comment,
			link,
			imgUrl,
			dateYYYYMMDD,
			userId,
		} = z
			.object({
				id: z.string(),
				shopName: z.string(),
				name: z.string(),
				place: z.string(),
				rating: z.number(),
				comment: z.string(),
				link: z.string().optional(),
				imgUrl: z.string(),
				dateYYYYMMDD: z.string().regex(/^\d{8}$/),
				userId: z.string(),
			})
			.parse(input)

		return new ReportModel(
			id,
			shopName,
			name,
			place,
			rating,
			comment,
			link ?? null,
			imgUrl,
			dateYYYYMMDD,
			userId,
		)
	}

	get id(): string {
		return this._id
	}

	get shopName(): string {
		return this._shopName
	}

	get name(): string {
		return this._name
	}

	get place(): string {
		return this._place
	}

	get rating(): number {
		return this._rating
	}

	get comment(): string {
		return this._comment
	}

	get link(): string | null {
		return this._link
	}

	get imgUrl(): string {
		return this._imgUrl
	}

	get dateYYYYMMDD(): string {
		return this._dateYYYYMMDD
	}

	get userId(): string {
		return this._userId
	}

	update = (input: {
		shopName: string
		name: string
		place: string
		rating: number
		comment: string
		link?: string | null
		imgUrl: string
		dateYYYYMMDD: string
		userId: string
	}) => {
		const {
			shopName,
			name,
			place,
			rating,
			comment,
			link,
			imgUrl,
			dateYYYYMMDD,
			userId,
		} = z
			.object({
				shopName: z.string(),
				name: z.string(),
				place: z.string(),
				rating: z.number(),
				comment: z.string(),
				link: z.string().optional(),
				imgUrl: z.string(),
				dateYYYYMMDD: z.string().regex(/^\d{8}$/),
				userId: z.string(),
			})
			.parse(input)

		this._shopName = shopName
		this._name = name
		this._place = place
		this._rating = rating
		this._comment = comment
		this._link = link ?? null
		this._imgUrl = imgUrl
		this._dateYYYYMMDD = dateYYYYMMDD
		this._userId = userId
	}
}
