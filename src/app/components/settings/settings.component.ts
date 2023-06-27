import { UserManagementService } from './../../services/user-management.service';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

const THEME_KEY = 'theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {



  /* THE PLAN IS TO SAVE ALL THE SETTINGS INTO THE LOCAL STORAGE OF THE BROWSER (light/dark theme, etc.) */

  constructor(private router: Router, private userManagement: UserManagementService) {
  }


  ngOnInit(){
    this.userManagement.blockComponentIfNotLoggedIn();
  }

  logOut() {
    this.userManagement.logOut();
  }
}
