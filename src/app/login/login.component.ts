import {Component, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  private auth: Auth = inject(Auth);
  errorMessage: string = '';

  constructor(private fb: FormBuilder, public router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {

    const { email, password } = this.loginForm.value;

    signInWithEmailAndPassword(this.auth, email, password).then(
      () => {
        this.router.navigate([''])
      },
      error => {
        console.error('Login failed:', error);
        this.handleLoginError(error);
      }
    );
  }

  private handleLoginError(error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'User not found. Please check your email.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Invalid password. Please try again.';
        break;
      default:
        this.errorMessage = 'Login failed. Please try again later.';
        break;
    }
  }

}
