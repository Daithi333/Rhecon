export class Request {
  constructor(
    public id: number,
    public title: string,
    public requesterId: number,
    public patientId: number,
    public consultantId: number,
    public notes: string,
    public active: boolean,
    public createdOn: Date,
    public updatedOn: Date
  ) {}
}
