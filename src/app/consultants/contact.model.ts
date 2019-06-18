import { Specialism } from './specialism.enum';

export class Contact {
  constructor(
    public id: number,
    public title: string,
    public firstName: string,
    public lastName: string,
    public specialism: Specialism,
    public portraitUrl: string,
    public bio: string,
    public group: string[]
  ) {}
}
