export class User {
  constructor(
    public id: number,
    public titleId: number,
    public firstName: string,
    public lastName: string,
    public userTypeId: number,
    public specialismId: number,
    public email: string,
    public password: string
  ) {}
}
