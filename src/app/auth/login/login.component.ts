import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {PrincipleService} from '../../service/principle.service';
import {AuthService} from '../../service/auth.service';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;

  constructor(private  authService: AuthService,
              private principleService: PrincipleService,
              private router: Router,
              private userService: UserService) {
  }

  ngOnInit() {
    if (this.principleService.hasToken()) {
      this.router.navigate(['']);
    }
  }

  onSubmit(f: NgForm) {
    this.isLoading = true;
    this.authService.login(f.value).subscribe((_resp) => {
      this.isLoading = false;
      if (_resp && _resp.body) {
        this.principleService.setToken(_resp.body.accessToken);
        /*GET PERMISSION*/
        this.userService.getInfo(f.value.usernameOrEmail).subscribe((resp) => {
          if (resp && resp.body) {
            this.principleService.setUserInfo(resp.body);
          }
          this.router.navigate(['']);
        });
      }
    });
  }
}
