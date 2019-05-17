import { Component, OnInit } from '@angular/core';
import { Consultant } from './consultant.model';
import { ConsultantsService } from './consultants.service';

@Component({
  selector: 'app-consultants',
  templateUrl: './consultants.page.html',
  styleUrls: ['./consultants.page.scss'],
})
export class ConsultantsPage implements OnInit {
  consultants: Consultant[];

  constructor(private consultantsService: ConsultantsService) { }

  ngOnInit() {
    this.consultants = this.consultantsService.consultants;
  }

}
