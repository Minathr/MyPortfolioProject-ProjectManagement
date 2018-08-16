import { User } from "./User";
import { Project } from "./Project";

export class TeamDetail {
    Id: number;
    Name: string;
    Members: User[];
    Project: Project[];
}
