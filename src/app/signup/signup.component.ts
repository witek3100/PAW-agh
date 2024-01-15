import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Auth, createUserWithEmailAndPassword, getAuth, updateProfile } from "@angular/fire/auth";
import {Router} from "@angular/router";
import firebase from "firebase/compat";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CartItem} from "../cart-item.model";
import {UserData} from "../user.model";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  private auth: Auth = inject(Auth);
  errorMessage: string = '';

  constructor(private db: AngularFirestore, private fb: FormBuilder, public router: Router) {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: [this.passwordMatchValidator]
    })
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!(password) || !(confirmPassword) || password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  async onSubmit() {
    const userData = this.signupForm.value;

    if (this.signupForm.valid) {

      createUserWithEmailAndPassword(this.auth, userData.email, userData.password)
        .then((userCredential) => {

          this.db.collection('Users').doc(userCredential.user.uid).set({
            'FirstName': userData.first_name,
            'LastName': userData.last_name,
            'IsVerified': true,
            'IsManager': false,
            'IsAdmin': false
          })

          this.router.navigate(['']);

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error)
          this.handleSignUpError(error);
        });

    }
  }


  private handleSignUpError(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'This email address is assigned to another account.';
        break;
      case 'nickname-in-use':
        this.errorMessage = 'This nickname is assigned to another account'
        break;
    }
  }

}
