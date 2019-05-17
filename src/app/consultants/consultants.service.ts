import { Injectable } from '@angular/core';
import { Consultant } from './consultant.model';
import { Specialties } from './specialties.enum';

@Injectable({
  providedIn: 'root'
})
export class ConsultantsService {
  private consultantsList: Consultant[] = [
    new Consultant(
      1,
      'Dr',
      'Li Na',
      'Zhong',
      Specialties.Paediatrics,
      'https://ak2.picdn.net/shutterstock/videos/3707312/thumb/1.jpg',
      'Eager to lend my expertise to help the less fortunate. Available for live consultation if necessary.'

    ),
    new Consultant(
      2,
      'Dr',
      'Yousef',
      'Amari',
      Specialties.Dermatology,
      'https://image.freepik.com/free-photo/portrait-middle-eastern-doctor-standing-with-white-background_21730-11194.jpg',
      'Available for live consultation if necessary'
    ),
    new Consultant(
      3,
      'Dr',
      'Sara',
      'Hemsworth',
      Specialties.Neurology,
      'https://debatechamber.com/wp-content/uploads/2017/02/bigstock-Portrait-of-a-friendly-female-26984102-2-238x300.jpg',
      'App requests only.'
    ),
    new Consultant(
      4,
      'Dr',
      'Marcus',
      'Stevens',
      Specialties.GeneralPractice,
      'https://www.healthyplace.com/sites/default/files/uploads/2017/10/When-To-See-Your-Doctor-About-Your-Anxiety.jpg',
      'Happy to help with initial consultations and further referal if needed'
    ),
  ];

  constructor() { }

  get consultants() {
    return [...this.consultantsList];
  }

  getConsultant(id: number) {
    return { ...this.consultantsList.find(consultant => consultant.id === id) };
  }
}
