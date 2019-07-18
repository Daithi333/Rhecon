import { Contact } from '../consultants/contact.model';

export class GroupSearch {
  constructor(
    public id: number,
    public groupName: string,
    public imageUrl: string,
    public admin: Contact
  ) {}
}
