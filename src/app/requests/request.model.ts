export class Request {
  constructor(
    public id: number,
    public title: string,
    public requestorId: number,
    public patientId: number,
    public consultantId: number,
    public notes: string,
    public requestActive: boolean,
    public createdOn: Date,
    public lastUpdated: Date,
  ) {}
}
