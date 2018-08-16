import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../models/Project';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { TeamDetail } from '../models/TeamDetail';
import { ProjectTask } from '../models/ProjectTask';
import { ProjectDetail } from '../models/ProjectDetail';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdministratorService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    showProject(): Observable<Project[]> {

        return this.http.get<Project[]>(this.baseUrl + 'api/admin/projects');
    }

    addProject(project: Project): Observable<any> {

        return this.http.post<Project>(this.baseUrl + 'api/admin/projects'
            , project, httpOptions);
    }  

    editProject(project: Project): Observable<any> {

        return this.http.put<Project>(this.baseUrl + 'api/admin/projects'
            , project, httpOptions);
    }

    showTeam(): Observable<Team[]> {

        return this.http.get<Team[]>(this.baseUrl + 'api/admin/teams');
    }

    addTeam(team: Team): Observable<any> {

        return this.http.post<Team>(this.baseUrl + 'api/admin/teams'
            , team, httpOptions)
    }

    editTeam(team: Team): Observable<any> {

        return this.http.put<Team>(this.baseUrl + 'api/admin/teams'
            , team, httpOptions);
    }

    showUsers(): Observable<User[]> {

        return this.http.get<User[]>(this.baseUrl + 'api/admin/users');
    }

    editUser(user: User): Observable<any> {

        return this.http.put<User>(this.baseUrl + 'api/admin/users'
            , user, httpOptions);
    }

    getTeamDetail(id:number): Observable<TeamDetail> {

        return this.http.get<TeamDetail>(this.baseUrl + `api/admin/teams/${id}`);
    }

    getUsersWithoutTeam(): Observable<User[]> {

        return this.http.get<User[]>(this.baseUrl + 'api/admin/users/without-team');
    }

    getProjectsWithoutTeam(): Observable<Project[]> {

        return this.http.get<Project[]>(this.baseUrl + 'api/admin/projects/without-team');
    }

    assignNewMemberToTeam(teamId: number, memberId: number): Observable<any> {

        return this.http
            .post(this.baseUrl + `api/admin/teams/${teamId}/assign/${memberId}`, {}, httpOptions);
    }

    assignNewProjectToTeam(teamId: number, projectId: number): Observable<any> {

        return this.http
            .post(this.baseUrl + `api/admin/teams/${teamId}/commit/${projectId}`, {}, httpOptions);
    }

    getTeamMembers(teamId: number): Observable<User[]> {

        return this.http
            .get<User[]>(this.baseUrl + `api/admin/teams/${teamId}/members`, httpOptions);
    }

    getProjectDetail(projectId: number): Observable<ProjectDetail> {

        return this.http
            .get<ProjectDetail>(this.baseUrl + `api/admin/projects/${projectId}`, httpOptions);
    }

    defineNewProjectTasks(projectId: number, projectTask: ProjectTask): Observable<any> {

        return this.http
            .post(this.baseUrl + `api/admin/projects/${projectId}/tasks`, projectTask, httpOptions);
    }

    editProjectTasks(projectId: number, projectTask: ProjectTask): Observable<any> {

        return this.http
            .put(this.baseUrl + `api/admin/projects/${projectId}/tasks`, projectTask, httpOptions);
    }

    editProjectTask(projectTask: ProjectTask): Observable<any> {

        return this.http
            .put(this.baseUrl + `api/member/tasks/${projectTask.Id}`, projectTask, httpOptions);
    }

    getMyTasks(): Observable<ProjectTask[]> {

        return this.http
            .get<ProjectTask[]>(this.baseUrl + `api/member/mytasks`, httpOptions);
    }
}