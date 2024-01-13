import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Auth, createUserWithEmailAndPassword, getAuth } from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  private auth: Auth = inject(Auth);

  constructor(private fb: FormBuilder, public router: Router) {
    this.signupForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!(password) || !(confirmPassword) || password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }
  onSubmit() {

    if (this.signupForm.valid) {
      const userData = this.signupForm.value;
      createUserWithEmailAndPassword(this.auth, userData.email, userData.password)
          .then((userCredential) => {
            this.router.navigate([''])
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
        }
      }

}
