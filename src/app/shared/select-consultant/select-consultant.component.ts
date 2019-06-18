import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Contact } from '../../consultants/contact.model';
import { ContactsService } from '../../consultants/contacts.service';
import { Specialism } from 'src/app/consultants/specialism.enum';

@Component({
  selector: 'app-select-consultant',
  templateUrl: './select-consultant.component.html',
  styleUrls: ['./select-consultant.component.scss'],
})
export class SelectConsultantComponent implements OnInit, OnDestroy {
  consultants: Contact[];
  isLoading = false;
  private contactsSub: Subscription;

  constructor(private modalController: ModalController, private contactsService: ContactsService) { }

  ngOnInit() {
    this.contactsSub = this.contactsService.contacts
      .subscribe(consultants => {
        this.consultants = consultants.filter(c => c.specialism !== Specialism.CommunityHealthcare);
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.contactsService.fetchContacts().subscribe(() => {
      this.isLoading = false;
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'consultantSelect');
  }

  onConsultantSelect(selectedConsultant: Contact) {
    this.modalController.dismiss(selectedConsultant, 'cancel', 'consultantSelect');
  }

  ngOnDestroy() {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }
  }

}
