import { Contact } from '../consultants/contact.model';

export class Group {
  constructor(
    public id: number,
    public groupName: string,
    public imageUrl: string,
    public isAdmin: boolean,
    public members: Contact[]
  ) {}
}
