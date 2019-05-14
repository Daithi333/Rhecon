import { Component, OnInit } from '@angular/core';
import { Consultant } from '../consultant.model';
import { ConsultantsService } from '../consultants.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-consultant',
  templateUrl: './view-consultant.page.html',
  styleUrls: ['./view-consultant.page.scss'],
})
export class ViewConsultantPage implements OnInit {
  consultant: Consultant;

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
      this.consultant = this.consultantsService.getConsultant(+paramMap.get('consultantId'));
    });
  }

}
