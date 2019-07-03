export class Comment {
  constructor(
    public id: number,
    public requestId: number,
    public authorId: number,
    public comment: string,
    public createdOn: Date
  ) {}
}
