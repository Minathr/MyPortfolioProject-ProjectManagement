import { User } from "./User";
import { Project } from "./Project";

export class ProjectTask {
    Id: number;
    Name: string;
    Description: string;
    DueDateTime: Date;
    Project: Project;
    ProjectTaskStatus: number;
    Assignee: User;
}
