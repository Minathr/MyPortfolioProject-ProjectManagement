import { Component, Inject, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Project } from '../../models/Project';
import { FormsModule } from '@angular/forms';
import { catchError, retry } from 'rxjs/operators';
import { AdministratorService } from '../../services/administrator.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/User';
import { ProjectDetail } from '../../models/ProjectDetail';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectTask } from '../../models/ProjectTask';

@Component({
    selector: 'project-detail',
    templateUrl: './projectdetail.component.html',
    styleUrls: ['./projectdetail.component.css']
})
export class ProjectDetailComponent {

    public projectDetail: ProjectDetail = new ProjectDetail();
    public selectedProjectTask: ProjectTask = new ProjectTask();
    public teamMembers:User[];
    private projectId: number;
    private editModal: NgbModalRef;

    constructor(private administratorService: AdministratorService,
        private route: ActivatedRoute,
        private router: Router, private modalService: NgbModal) { }

    ngOnInit() {

        this.projectId = Number(this.route.snapshot.paramMap.get('id'));

        this.administratorService.getProjectDetail(this.projectId)
            .subscribe(projectDetail =>
            {
                this.projectDetail = projectDetail

                this.administratorService.getTeamMembers(this.projectDetail.Id)
                    .subscribe(users => this.teamMembers = users);
            });
    }

    public addNewTask(task: ProjectTask) {

        this.administratorService.defineNewProjectTasks(this.projectDetail.Id, task)
            .subscribe(q =>
                this.administratorService.getProjectDetail(this.projectId)
                    .subscribe(projectDetail => {
                        this.projectDetail = projectDetail
                        this.selectedProjectTask = new ProjectTask();
                        this.administratorService.getTeamMembers(this.projectDetail.Id)
                            .subscribe(users => this.teamMembers = users);
                    })
            );
    }

    public openEditModal(modalTemplate: TemplateRef<any>, selectedProjectTask: ProjectTask) {

        this.selectedProjectTask = selectedProjectTask;
        this.editModal = this.modalService.open(modalTemplate, { size: 'lg' });
    }

    public editTask(task: ProjectTask) {

        this.administratorService.editProjectTasks(this.projectDetail.Id, task)
            .subscribe(q =>
                this.administratorService.getProjectDetail(this.projectId)
                    .subscribe(projectDetail => {
                        this.projectDetail = projectDetail
                        this.editModal.close(); 
                    })
            );
    }

}
