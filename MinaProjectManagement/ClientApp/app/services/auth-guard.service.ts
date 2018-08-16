import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url: string = state.url;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

        if (!this.authService.isTokenExpired()) { return true; }

        this.router.navigate(['/login'], {
            queryParams: {
                return: url
            }
        });

        return false;
    }
}