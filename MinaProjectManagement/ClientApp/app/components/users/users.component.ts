import { Component, Inject, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/User';
import { FormsModule } from '@angular/forms';
import { catchError, retry } from 'rxjs/operators';
import { AdministratorService } from '../../services/administrator.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent {

    public users: User[];
    public selectedUser: User = new User();
    private editModal: NgbModalRef;
    
    constructor(private administratorService: AdministratorService, private modalService: NgbModal) {

      
    }

    ngOnInit() {
        this.showUsers();
    }

    public openEditModal(modalTemplate: TemplateRef<any>, selectedUser: User) {

        this.selectedUser = selectedUser;
        this.editModal  = this.modalService.open(modalTemplate, { size: 'lg' });
    }

    public editUser(modalTemplate: TemplateRef<any>) {

        this.administratorService.editUser(this.selectedUser)
            .subscribe(() =>
            {
                this.editModal.close();
                this.showUsers();
            });
    }

    public showUsers() {

        this.administratorService.showUsers()
           .subscribe(users => this.users = users);
    }

}
