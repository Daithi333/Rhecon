import { Patient } from '../patients/patient.model';
import { User } from '../consultants/user.model';

export class RequestWithPatientAndConsultant {
  constructor(
    public id: number,
    public title: string,
    public requestorId: number,
    public patient: Patient,
    public consultant: User,
    public notes: string,
    public active: boolean,
    public createdOn: Date,
    public updatedOn: Date,
  ) {}
}
