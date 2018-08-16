import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs/Observable';
import { SignupViewModel } from '../models/SignupViewModel';
import { Router } from '@angular/router';
import { LoginViewModel } from '../models/LoginViewModel';
import { JwtToken } from '../models/JwtToken';
import { isPlatformBrowser } from '@angular/common';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {

    private url: string = 'api/auth';

    constructor(private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string,
        private jwtHelperService: JwtHelperService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    getToken(): string {

        if (isPlatformBrowser(this.platformId)) {
            let value = localStorage.getItem('jwt_token');

            if (value == null)
                return '';
            else
                return value;
        }

        return '';
    }

    setToken(token: string): void {
        localStorage.setItem('jwt_token', token);
    }

    getTokenExpirationDate(token: string): Date {

        return this.jwtHelperService.getTokenExpirationDate(this.getToken());
    }

    isAdmin(): boolean {

        if (!this.isLoggedIn())
            return false;

        let token = this.getToken();
        let tokenPayload = this.jwtHelperService.decodeToken(token);
        return tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']=='admin'
    }

    isMember(): boolean {

        if (!this.isLoggedIn())
            return false;

        let token = this.getToken();
        let tokenPayload = this.jwtHelperService.decodeToken(token);
        return tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']=='member'
    }

    isLoggedIn(): boolean {

        return !this.isTokenExpired();
    }

    isTokenExpired(): boolean {

        let token = this.getToken();
        if (token == null || token == "undefined")
            return true;

        return this.jwtHelperService.isTokenExpired(token);
    }

    login(loginViewModel: LoginViewModel,returnUrl:string): void {

        if (!returnUrl)
            returnUrl = '/';

        this.http
            .post<JwtToken>(this.baseUrl + 'api/auth/login', loginViewModel, httpOptions)
            .subscribe(data => {
                var tokenPayload = this.jwtHelperService.decodeToken(data.Value);
                this.setToken(data.Value);
                this.router.navigateByUrl(returnUrl);
            });;

    }

    signup(signupViewModel: SignupViewModel):void {

        this.http
            .post<JwtToken>(this.baseUrl + 'api/auth/signup', signupViewModel, httpOptions)
            .subscribe(data => {
                let  tokenPayload = this.jwtHelperService.decodeToken(data.Value);
                this.setToken(data.Value);
                this.router.navigateByUrl('/');
            });
    }
    
    logout() {
        localStorage.removeItem("jwt_token");
        this.router.navigateByUrl('/login');
    }

}