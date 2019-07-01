import { Patient } from '../patients/patient.model';
import { Contact } from '../consultants/contact.model';

export class RequestWithObjects {
  constructor(
    public id: number,
    public title: string,
    public requestorId: number,
    public patient: Patient,
    public consultant: Contact,
    public notes: string,
    public active: boolean,
    public createdOn: Date,
    public updatedOn: Date,
  ) {}
}
