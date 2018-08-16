import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {

    constructor( @Inject(AuthService) private authService: AuthService) { }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    isMember(): boolean {
        return this.authService.isMember();
    }

    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    logout(): void {

        this.authService.logout();
    }

}
