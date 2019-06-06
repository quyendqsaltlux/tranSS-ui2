import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {UsersService} from '../../service/users.service';
import {PrincipleService} from '../../service/principle.service';
import {MyAccount} from '../../model/MyAccount';
import {AvatarUploaderComponent} from '../avatar-uploader/avatar-uploader.component';
import {AVATAR_FOLDER} from '../../AppConstant';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  @ViewChild('f') candidateForm: NgForm;
  bsModalRef: BsModalRef;
  id = null;
  model: MyAccount = {} as MyAccount;
  currentUser;

  constructor(private userService: UsersService,
              private toastr: ToastrService,
              private principleService: PrincipleService,
              public router: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.currentUser = this.principleService.getUserInfo().username;
    if (this.currentUser) {
      this.userService.findByUsername(this.currentUser).subscribe((resp) => {
        this.model = resp.body;
      });
    }
  }

  onSubmit() {
    this.userService.updateProfile(this.model).subscribe(
      (resp) => {
        this.toastr.success('Save successfully!');
      },
      (err) => {
        this.toastr.error('Fail to save!', '', {timeOut: 10000} as Partial<GlobalConfig>);
      });
  }

  openCvModal() {
    const initialState = {
      title: 'Upload Avatar',
      folder: AVATAR_FOLDER
    };
    this.bsModalRef = this.modalService.show(AvatarUploaderComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.event.subscribe(result => {
      if (result && result.data) {
        this.model.avatar = result.data;
      }
    });
  }
}
