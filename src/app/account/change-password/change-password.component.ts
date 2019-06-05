import {Component, OnInit} from '@angular/core';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UsersService} from '../../service/users.service';
import {Password} from '../../model/Password';
import {PrincipleService} from "../../service/principle.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  id = null;
  model: Password = {} as Password;
  currentUser;

  constructor(private userService: UsersService,
              private toastr: ToastrService,
              private principleService: PrincipleService,
              public router: Router) {
  }

  ngOnInit() {
    this.currentUser = this.principleService.getUserInfo();
    this.model.username = this.currentUser.username;
  }

  onSubmit() {
    this.userService.updatePassword(this.model).subscribe(
      (resp) => {
        this.toastr.success('Save successfully!');
      },
      (err) => {
        this.toastr.error('Fail to save!', '', {timeOut: 10000} as Partial<GlobalConfig>);
      });
  }
}
