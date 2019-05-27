import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Consultant } from './consultant.model';
import { ConsultantsService } from './consultants.service';

@Component({
  selector: 'app-consultants',
  templateUrl: './consultants.page.html',
  styleUrls: ['./consultants.page.scss'],
})
export class ConsultantsPage implements OnInit, OnDestroy {
  consultants: Consultant[];
  consultantsSub: Subscription;

  constructor(private consultantsService: ConsultantsService) { }

  ngOnInit() {
    this.consultantsSub = this.consultantsService.consultants.subscribe(consultants => {
      this.consultants = consultants;
    });
  }

  ngOnDestroy() {
    if (this.consultantsSub) {
      this.consultantsSub.unsubscribe();
    }
  }

}
