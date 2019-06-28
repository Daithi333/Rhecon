export class Profile {
  constructor(
    public id: number,
    public titleId: number,
    public firstName: string,
    public lastName: string,
    public specialismId: number,
    public portraitUrl: string,
    public bio: string
  ) {}
}
