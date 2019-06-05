import { Patient } from '../patients/patient.model';
import { Consultant } from '../consultants/consultant.model';

export class RequestWithPatientAndConsultant {
  constructor(
    public id: number,
    public title: string,
    public requestorId: number,
    public patient: Patient,
    public consultant: Consultant,
    public notes: string,
    public requestActive: boolean,
    public createdOn: Date,
    public lastUpdated: Date,
  ) {}
}
