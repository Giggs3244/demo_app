export class User {
  constructor(
    readonly name: string,
    readonly lastName: string,
    readonly photoUrl: string,
  ) {}

  get fullName(): string {
    return `${this.name} ${this.lastName}`;
  }
}
