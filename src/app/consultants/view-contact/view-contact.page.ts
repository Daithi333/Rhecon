import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.page.html',
  styleUrls: ['./view-contact.page.scss'],
})
export class ViewContactPage implements OnInit, OnDestroy {
  isLoading = false;
  contact: Contact;
  contactSub: Subscription;

  constructor(private contactsService: ContactsService,
              private route: ActivatedRoute,
              private navController: NavController,
              private alertController: AlertController,
              private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('contactId')) {
        this.navController.navigateBack('/tabs/consultants');
        return;
      }
      this.isLoading = true;
      this.contactSub = this.contactsService.getContact(+paramMap.get('contactId'))
        .subscribe(contact => {
          this.contact = contact;
          this.isLoading = false;
        },
        error => {
          this.alertController.create({
            header: 'Error',
            message: 'Could not locate contact information.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/tabs/contacts']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  ngOnDestroy() {
    if (this.contactSub) {
      this.contactSub.unsubscribe();
    }
  }
}
