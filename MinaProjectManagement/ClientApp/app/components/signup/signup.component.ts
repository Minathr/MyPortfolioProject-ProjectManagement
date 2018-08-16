import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { SignupViewModel } from "../../models/SignupViewModel";

@Component({
    selector: 'signup',
    templateUrl: './signup.component.html'
    })
export class SignupComponent {

    private signupViewModel: SignupViewModel = new SignupViewModel();
    form: FormGroup;

    constructor(private fb: FormBuilder,
        private authService: AuthService) {

        this.form = this.fb.group({
            email: ['', Validators.required],
            name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    signup() {

        this.authService.signup(this.signupViewModel);
    }
}
