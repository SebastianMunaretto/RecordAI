import { FirebaseApp } from '@angular/fire/app';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private router: Router, private app: FirebaseApp) { }

  /*
    Redirects to login page when user is not authorized
  */
  blockComponentIfNotLoggedIn() {
    onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        this.router.navigate(['/login'])
      }
    });
  }

  /*
    User gets created through raw email and password login
  */
  async registerWithEmail(formValues: { email: string | null | undefined, password: string | null | undefined }) {
    const { email, password } = formValues;
    const auth = getAuth(this.app);
    try {
      // const credential = await createUser... can be used to get user credentials on the fly
      await createUserWithEmailAndPassword(auth, email!, password!);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }


  /*
    User gets logged in through raw email and password login
 */
  async loginWithEmail(formValues: { email: string | null | undefined, password: string | null | undefined }) {
    const { email, password } = formValues;
    const auth = getAuth(this.app);
    try {
      // uses firebase auth function
      await signInWithEmailAndPassword(auth, email!, password!);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Through one function the user can be created and also logged into the webpage
  */
  async loginOrRegisterWithGoogle() {
    const auth = getAuth(this.app);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }

  /*
    Logs out the user
  */
  async logOut() {
    const auth = getAuth(this.app);
    try {
      auth.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }

}
