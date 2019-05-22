import { Consultant } from '../consultants/consultant.model';
import { Patient } from '../patients/patient.model';

export class Request {
  constructor(
    public id: number,
    public title: string,
    public requestorId: number,
    public consultant: Consultant,
    public patient: Patient,
    public notes: string,
    public requestActive: boolean,
    public createdOn: Date,
    public lastUpdated: Date,
  ) {}
}
