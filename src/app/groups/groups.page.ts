import { Component, OnInit } from '@angular/core';

import { Group } from './group-model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {
  isLoading = false;
  editMode = false;
  groups: Group[] = [];

  constructor() { }

  ngOnInit() {
  }

}
