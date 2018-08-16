import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'projectTaskStatus' })
export class ProjectTaskStatusPipe implements PipeTransform {
    transform(projectTaskStatus:number):string {

        if (projectTaskStatus == 0)
            return "Unassigned";

        if (projectTaskStatus == 1)
            return "In Progress";

        return "Done";

    }
}