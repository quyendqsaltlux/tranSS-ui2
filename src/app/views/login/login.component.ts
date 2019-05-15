import {Component} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  principle = {
    username: null,
    password: null
  };

  constructor() {
  }

  onSubmit(loginForm) {
    console.log(loginForm);
    console.log(this.principle);
  }
}
