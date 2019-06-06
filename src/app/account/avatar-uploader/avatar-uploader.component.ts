import {Component, ElementRef, EventEmitter, OnInit, Renderer2, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {FileUploadService} from '../../service/file-upload.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './avatar-uploader.component.html',
  styleUrls: ['./avatar-uploader.component.scss']
})
export class AvatarUploaderComponent implements OnInit {
  @ViewChild('cv') cvFileRef: ElementRef;
  folder: string;
  isMultiple: boolean;
  title: string;
  closeBtnName: string;
  cvFile: File = null;
  cvFiles: FileList;
  isRequired = false;
  isDuplicatedCv = false;
  isTooLarge = false;
  public event: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,
              private fileUploadService: FileUploadService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  onCVChanged(files: FileList) {
    if (!this.isMultiple) {
      this.cvFile = files.item(0);
    } else if (this.isMultiple) {
      this.cvFiles = files;
    }
  }

  onSubmit() {
    if (!this.isMultiple) {
      this.uploadFile(this.cvFile);
    } else if (this.isMultiple) {
      for (let i = 0; i < this.cvFiles.length; i++) {
        this.uploadFile(this.cvFiles.item(i));
      }
    }
  }

  uploadFile(file) {
    if (!this.clearAndValidate()) {
      return;
    }
    this.fileUploadService.uploadFile(file, this.folder).subscribe((resp) => {
      this.event.emit({data: resp.path});
      this.bsModalRef.hide();
    }, (err) => {
      this.focusAndInvalidFile();
      switch (err.status) {
        case 509:
          this.isTooLarge = true;
          break;
        case 409:
          this.isDuplicatedCv = true;
          break;
      }
    });
  }

  clearAndValidate() {
    this.isRequired = false;
    this.isDuplicatedCv = false;
    this.isTooLarge = false;
    if ((!this.isMultiple && !this.cvFile) || (this.isMultiple && this.cvFiles.length === 0)) {
      this.isRequired = true;
      this.focusAndInvalidFile();
      return false;
    }
    return true;
  }

  focusAndInvalidFile() {
    this.cvFileRef.nativeElement.focus();
    this.renderer.addClass(this.cvFileRef.nativeElement, 'is-invalid');
  }

  public onCancel(): void {
    this.bsModalRef.hide();
  }
}
