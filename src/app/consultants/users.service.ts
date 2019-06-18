import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { User } from './user.model';
import { Specialism } from './specialism.enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users = new BehaviorSubject<User[]>(
    [
      new User(
        1,
        'Dr',
        'Li Na',
        'Zhong',
        Specialism.Paediatrics,
        'https://ak2.picdn.net/shutterstock/videos/3707312/thumb/1.jpg',
        'Eager to lend my expertise to help the less fortunate. Available for live consultation if necessary.'

      ),
      new User(
        2,
        'Dr',
        'Yousef',
        'Amari',
        Specialism.Dermatology,
        'https://image.freepik.com/free-photo/portrait-middle-eastern-doctor-standing-with-white-background_21730-11194.jpg',
        'Available for live consultation if necessary'
      ),
      new User(
        3,
        'Dr',
        'Sara',
        'Hemsworth',
        Specialism.Neurology,
        'https://debatechamber.com/wp-content/uploads/2017/02/bigstock-Portrait-of-a-friendly-female-26984102-2-238x300.jpg',
        'App requests only.'
      ),
      new User(
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

  get users() {
    return this._users.asObservable();
  }

  getUser(id: number) {
    return this._users.pipe(take(1),
      map(users => {
        return { ...users.find(c => c.id === id) };
      })
    );
  }
}
