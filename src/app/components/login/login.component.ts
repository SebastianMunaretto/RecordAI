import { UserManagementService } from './../../services/user-management.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {


  // User management is the main service used in this component
  constructor(private auth: Auth, private router: Router, private userManagement: UserManagementService) {
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  emailLogin() {
    const formData: { email: string | null | undefined, password: string | null | undefined } = { email: this.loginForm.value.email, password: this.loginForm.value.password }
    this.userManagement.loginWithEmail(formData);
  }

  googleLogin() {
    this.userManagement.loginOrRegisterWithGoogle();
  }

  // switch to register page
  redirectToRegisterPage() {
    this.router.navigate(['/register']);
  }

}
