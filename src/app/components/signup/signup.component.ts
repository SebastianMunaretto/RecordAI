import { UserManagementService } from '../../services/user-management.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from '@angular/fire/auth';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  constructor(private auth: Auth, private router: Router, private userManagement: UserManagementService) { }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  async emailRegister() {
    const formData: { email: string | null | undefined, password: string | null | undefined } = { email: this.registerForm.value.email, password: this.registerForm.value.password }
    this.userManagement.registerWithEmail(formData);
  }

  async googleRegister() {
    this.userManagement.loginOrRegisterWithGoogle();
  }

  // switches to login page
  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }

}
