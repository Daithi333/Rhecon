import { Specialties } from './specialties.enum';

export class Consultant {
  constructor(
    public id: number,
    public title: string,
    public firstName: string,
    public lastName: string,
    public specialism: Specialties,
    public portraitUrl: string,
    public bio: string
  ) {}
}
