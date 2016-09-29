import { Component } from '@angular/core';
import { UsersService } from '../shared/api/users.service';
/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent {

  errorMessage: string;
  users: any[] = [];

  constructor(
    public usersService: UsersService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.usersService.get()
      .subscribe(
        (result: any) => {
          this.users = result.data;
          console.log(this.users)
        },
        error =>  this.errorMessage = <any>error
      )
  }

}
