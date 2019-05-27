import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Consultant } from './consultant.model';
import { Specialism } from './specialism.enum';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultantsService {
  private _consultants = new BehaviorSubject<Consultant[]>(
    [
      new Consultant(
        1,
        'Dr',
        'Li Na',
        'Zhong',
        Specialism.Paediatrics,
        'https://ak2.picdn.net/shutterstock/videos/3707312/thumb/1.jpg',
        'Eager to lend my expertise to help the less fortunate. Available for live consultation if necessary.'

      ),
      new Consultant(
        2,
        'Dr',
        'Yousef',
        'Amari',
        Specialism.Dermatology,
        'https://image.freepik.com/free-photo/portrait-middle-eastern-doctor-standing-with-white-background_21730-11194.jpg',
        'Available for live consultation if necessary'
      ),
      new Consultant(
        3,
        'Dr',
        'Sara',
        'Hemsworth',
        Specialism.Neurology,
        'https://debatechamber.com/wp-content/uploads/2017/02/bigstock-Portrait-of-a-friendly-female-26984102-2-238x300.jpg',
        'App requests only.'
      ),
      new Consultant(
        4,
        'Dr',
        'Marcus',
        'Stevens',
        Specialism.GeneralPractice,
        'https://www.healthyplace.com/sites/default/files/uploads/2017/10/When-To-See-Your-Doctor-About-Your-Anxiety.jpg',
        'Happy to help with initial consultations and further referal if needed'
      ),
    ]
  );

  constructor() { }

  get consultants() {
    return this._consultants.asObservable();
  }

  getConsultant(id: number) {
    return this._consultants.pipe(take(1),
      map(consultants => {
        return { ...consultants.find(c => c.id === id) };
      })
    );
  }
}
