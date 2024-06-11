import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm;


  constructor(private fb: FormBuilder,private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
   }

  ngOnInit(): void {}

  async onSubmit() {
    const email = this.loginForm?.get('email')?.value.trim();
    const password = this.loginForm?.get('password')?.value;
    this.auth.loginCredentials(email, password);
    this.router.navigate(['/'])
  }

  login(){
      this.auth.login()
  }

}
