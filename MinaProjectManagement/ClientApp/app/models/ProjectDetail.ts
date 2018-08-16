import { User } from "./User";
import { Project } from "./Project";
import { ProjectTask } from "./ProjectTask";
import { Team } from "./Team";

export class ProjectDetail {
    Id: number;
    Name: string;
    Tasks: ProjectTask[];
    Team: Team;
}
