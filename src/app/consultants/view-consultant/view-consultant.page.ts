import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Consultant } from '../consultant.model';
import { ConsultantsService } from '../consultants.service';

@Component({
  selector: 'app-view-consultant',
  templateUrl: './view-consultant.page.html',
  styleUrls: ['./view-consultant.page.scss'],
})
export class ViewConsultantPage implements OnInit, OnDestroy {
  consultant: Consultant;
  consultantSub: Subscription;

  constructor(private consultantsService: ConsultantsService,
              private route: ActivatedRoute,
              private navController: NavController) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('consultantId')) {
        this.navController.navigateBack('/tabs/consultants');
        return;
      }
      this.consultantSub = this.consultantsService.getConsultant(+paramMap.get('consultantId'))
        .subscribe(consultant => {
          this.consultant = consultant;
        });
    });
  }

  ngOnDestroy() {
    if (this.consultantSub) {
      this.consultantSub.unsubscribe();
    }
  }
}
