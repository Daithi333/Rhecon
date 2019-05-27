import { Specialism } from './specialism.enum';

export class Consultant {
  constructor(
    public id: number,
    public title: string,
    public firstName: string,
    public lastName: string,
    public specialism: Specialism,
    public portraitUrl: string,
    public bio: string
  ) {}
}
