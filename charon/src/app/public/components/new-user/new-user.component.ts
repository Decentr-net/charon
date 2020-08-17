import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  constructor(private router: Router) {
  }

  toImportAccount() {
    this.router.navigate(['']);
  }

  toCreateAccount() {
    this.router.navigate(['']);
  }
}
