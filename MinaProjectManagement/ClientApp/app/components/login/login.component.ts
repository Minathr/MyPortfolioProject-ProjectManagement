import { Component } from "@angular/core";
import { FormGroup, ReactiveFormsModule , FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LoginViewModel } from "../../models/LoginViewModel";

@Component({
    selector: 'login',
    templateUrl: './login.component.html'
    })
export class LoginComponent {
    private loginViewModel: LoginViewModel = new LoginViewModel();
    form: FormGroup;
    returnUrl: string = '';

    constructor(private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute) {

        this.form = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => this.returnUrl = params['return']);
    }

    login() {
        this.authService.login(this.loginViewModel, this.returnUrl);
    }
}
