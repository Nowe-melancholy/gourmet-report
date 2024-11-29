export class User {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string
  ) {}

  static create = ({
    id,
    name,
    email,
  }: {
    id: string;
    name: string;
    email: string;
  }) => {
    return new User(id, name, email);
  };

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }
}
