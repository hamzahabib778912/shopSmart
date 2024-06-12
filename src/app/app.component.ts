import { Component } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private userService: UserService, auth: AuthService, router: Router) {
    auth.user$.subscribe((user) => {
      if (user) {
        this.userService.save(user);
      }
    });
  }
}
