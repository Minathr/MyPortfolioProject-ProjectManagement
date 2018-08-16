import { Component, Inject, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Team } from '../../models/Team';
import { FormsModule } from '@angular/forms';
import { catchError, retry } from 'rxjs/operators';
import { AdministratorService } from '../../services/administrator.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.css']
})
export class TeamsComponent {

    public teams: Team[];
    public newTeam: Team = new Team();
    public selectedTeam: Team = new Team();
    private editModal: NgbModalRef;
    

    constructor(private administratorService: AdministratorService,
        private modalService: NgbModal) {

      
    }

    ngOnInit() {
        this.showTeams();
    }

    public defineNewTeam() {

        this.administratorService.addTeam(this.newTeam)
            .subscribe(() =>
            {
                this.showTeams();
                this.newTeam = new Team();
            });
    }

    public openEditModal(modalTemplate: TemplateRef<any>, selectedTeam: Team) {

        this.selectedTeam = selectedTeam;
        this.editModal  = this.modalService.open(modalTemplate, { size: 'lg' });
    }

    public editProject(modalTemplate: TemplateRef<any>) {

        this.administratorService.editTeam(this.selectedTeam)
            .subscribe(() =>
            {
                this.editModal.close();
                this.showTeams();
            });
        
    }

    public showTeams() {

        this.administratorService.showTeam()
            .subscribe(teams => this.teams = teams);

    }

}
