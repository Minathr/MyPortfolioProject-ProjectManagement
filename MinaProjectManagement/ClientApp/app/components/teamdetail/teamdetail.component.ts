import { Component, Inject, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Team } from '../../models/Team';
import { FormsModule } from '@angular/forms';
import { catchError, retry } from 'rxjs/operators';
import { AdministratorService } from '../../services/administrator.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { TeamDetail } from '../../models/TeamDetail';
import { User } from '../../models/User';
import { Project } from '../../models/Project';

@Component({
    selector: 'teamdetail',
    templateUrl: './teamdetail.component.html',
    styleUrls: ['./teamdetail.component.css']
})
export class TeamDetailComponent {

    public teamDetail: TeamDetail = new TeamDetail();
    public usersWithoutTeam: User[];
    public projectsWithoutTeam: Project[];
    private teamId: number;

    public selectedUser: User;
    public selectedProject: Project;

    private editModal: NgbModalRef;

    constructor(private administratorService: AdministratorService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {

        this.teamId = Number(this.route.snapshot.paramMap.get('id'));

        this.administratorService.getTeamDetail(this.teamId)
            .subscribe(teamDetail => this.teamDetail = teamDetail);

        this.administratorService.getUsersWithoutTeam()
            .subscribe(users => this.usersWithoutTeam = users);

        this.administratorService.getProjectsWithoutTeam()
            .subscribe(projects => this.projectsWithoutTeam = projects);
    }

    public addNewMember(user: User) {

        this.administratorService.assignNewMemberToTeam(this.teamDetail.Id, user.Id)
            .subscribe(q =>
                this.administratorService.getTeamDetail(Number(this.teamId))
                    .subscribe(teamDetail => {
                        this.teamDetail = teamDetail;
                        this.administratorService.getUsersWithoutTeam()
                            .subscribe(users => this.usersWithoutTeam = users);
                        this.administratorService.getProjectsWithoutTeam()
                            .subscribe(projects => this.projectsWithoutTeam = projects);
                    })
            );
    }

    public addNewProject(project: Project) {

        this.administratorService.assignNewProjectToTeam(this.teamDetail.Id, project.Id)
            .subscribe(q =>

                this.administratorService.getTeamDetail(Number(this.teamId))
                    .subscribe(teamDetail => {
                        this.teamDetail = teamDetail;
                        this.administratorService.getUsersWithoutTeam()
                            .subscribe(users => this.usersWithoutTeam = users);
                        this.administratorService.getProjectsWithoutTeam()
                            .subscribe(projects => this.projectsWithoutTeam = projects);
                    })
            );
    }

}
