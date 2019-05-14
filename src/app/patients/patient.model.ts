export class Patient {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public dob: string,
    public gender: string,
    public potraitUrl: string
  ) {}
}
