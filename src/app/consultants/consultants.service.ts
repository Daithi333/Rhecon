import { Injectable } from '@angular/core';
import { Consultant } from './consultant.model';

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
      'Paediatrics',
      'https://ak2.picdn.net/shutterstock/videos/3707312/thumb/1.jpg'
    ),
    new Consultant(
      2,
      'Dr',
      'Yousef',
      'Amari',
      'Dermatology',
      'https://image.freepik.com/free-photo/portrait-middle-eastern-doctor-standing-with-white-background_21730-11194.jpg'
    ),
    new Consultant(
      3,
      'Dr',
      'Sara',
      'Hemsworth',
      'Neurology',
      'https://debatechamber.com/wp-content/uploads/2017/02/bigstock-Portrait-of-a-friendly-female-26984102-2-238x300.jpg'
    ),
    new Consultant(
      4,
      'Dr',
      'Marcus',
      'Stevens',
      'General Practice',
      'https://www.healthyplace.com/sites/default/files/uploads/2017/10/When-To-See-Your-Doctor-About-Your-Anxiety.jpg'
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
