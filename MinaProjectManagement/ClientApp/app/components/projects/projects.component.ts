import { Component, Inject, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Project } from '../../models/Project';
import { FormsModule } from '@angular/forms';
import { catchError, retry } from 'rxjs/operators';
import { AdministratorService } from '../../services/administrator.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {

    public projects: Project[];
    public newProject: Project = new Project();
    public selectedProject: Project = new Project();
    private editModal: NgbModalRef;
    

    constructor(private administratorService: AdministratorService, private modalService: NgbModal) {

      
    }

    ngOnInit() {
        this.showProjects();
    }

    public defineNewProject() {

        this.administratorService.addProject(this.newProject)
            .subscribe(q =>
            {
                this.showProjects();
                this.newProject = new Project()
            });
        
    }

    public openEditModal(modalTemplate: TemplateRef<any>, selectedProject: Project) {

        this.selectedProject = selectedProject;
        this.editModal  = this.modalService.open(modalTemplate, { size: 'lg' });
    }

    public editProject() {

        this.administratorService.editProject(this.selectedProject)
            .subscribe(() =>
            {
                this.showProjects();
            });

        this.editModal.close();
    }

    public showProjects() {

        this.administratorService.showProject()
            .subscribe(projects => this.projects = projects);

    }

}
