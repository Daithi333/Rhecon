import { User } from '../auth/user.model';

export class Group {
  constructor(
    public id: number,
    public name: number,
    public members: User[]
  ) {}
}
