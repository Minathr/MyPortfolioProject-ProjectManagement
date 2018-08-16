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
    selector: 'mytask',
    templateUrl: './mytask.component.html',
    styleUrls: ['./mytask.component.css']
})
export class MyTaskComponent {

    public tasks: ProjectTask[];
    public selectedProjectTask: ProjectTask = new ProjectTask();
    private editModal: NgbModalRef;

    constructor(private administratorService: AdministratorService
        , private modalService: NgbModal) { }

    ngOnInit() {

        this.administratorService.getMyTasks()
            .subscribe(tasks => this.tasks = tasks);
    }

    public openEditModal(modalTemplate: TemplateRef<any>, selectedProjectTask: ProjectTask) {

        this.selectedProjectTask = selectedProjectTask;
        this.editModal = this.modalService.open(modalTemplate, { size: 'lg' });
    }

    public editTask(task: ProjectTask) {

        this.administratorService.editProjectTask(task)
            .subscribe();

        this.editModal.close();
    }

}
