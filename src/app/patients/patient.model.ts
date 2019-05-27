export class Patient {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public dob: Date,
    public potraitUrl: string,
    public notes: string,
    public userId: number
  ) {}
}
