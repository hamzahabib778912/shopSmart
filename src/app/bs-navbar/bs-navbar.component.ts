import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent {
  isAdmin$ = this.auth.isAdmin$;
  constructor(public auth : AuthService) {
  }

  logout(){
      this.auth.logout()
  }

}
