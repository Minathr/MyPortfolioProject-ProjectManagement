import { NgModule } from '@angular/core';
import { CommonModule, isPlatformServer, isPlatformBrowser  } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TeamsComponent } from './components/teams/teams.component';
import { UsersComponent } from './components/users/users.component';
import { ProjectDetailComponent } from './components/projectdetail/projectdetail.component';
import { makeDecorator } from '@angular/core/src/util/decorators';
import { AdministratorService } from './services/administrator.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthService } from './services/auth.service';
import { TeamDetailComponent } from './components/teamdetail/teamdetail.component';
import { ProjectTaskStatusPipe } from './Pipe/ProjectTaskStatus.pipe';
import { MyTaskComponent } from './components/mytask/mytask.component';
import { AuthGuardService } from './services/auth-guard.service';


export function tokenGetter(): string {

    let value = localStorage.getItem('jwt_token');

    if (value == null)
        return '';
    else
        return value;
}

@NgModule({
    declarations: [
        ProjectTaskStatusPipe,
        AppComponent,
        NavMenuComponent,
        ProjectsComponent,
        TeamsComponent,
        TeamDetailComponent,
        UsersComponent,
        SignupComponent,
        LoginComponent,
        ProjectDetailComponent,
        MyTaskComponent
    ],
    imports: [
        NgbModule.forRoot(),
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule, 
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['localhost:3001']
            }
        }),
        RouterModule.forRoot([
            { path: '', redirectTo: 'mytasks', pathMatch: 'full' },
            { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuardService]  },
            { path: 'teams', component: TeamsComponent, canActivate: [AuthGuardService] },
            { path: 'teams/:id', component: TeamDetailComponent, canActivate: [AuthGuardService]  },
            { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuardService]  },
            { path: 'mytasks', component: MyTaskComponent, canActivate: [AuthGuardService] },
            { path: 'users', component: UsersComponent, canActivate: [AuthGuardService]},
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: '**', redirectTo: 'mytasks' }
        ]
        )
    ],
    providers: [
        AdministratorService,
        AuthService,
        AuthGuardService
    ]
})
export class AppModuleShared {
}
