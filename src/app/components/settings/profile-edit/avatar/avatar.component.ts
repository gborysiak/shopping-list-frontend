import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FileSelectEvent, FileUpload} from "primeng/fileupload";
import {ImageCropperComponent} from "../../../common/image-cropper/image-cropper.component";
import {MessageService} from "primeng/api";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: AvatarComponent
        }
    ],
    standalone: false
})
export class AvatarComponent implements OnInit, ControlValueAccessor {
  @Input() image!: Uint8Array | string | undefined;
  @Output() imageChange = new EventEmitter<string>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  api = `${environment.webserviceurl}/profil/uploadFile`;
  file: string = '';
  ref: DynamicDialogRef | undefined;

  onChange = (fileUrl: string) => {
  };
  onTouched = () => {
  };

  disabled: boolean = false;

  constructor(private messageService: MessageService, private dialogService: DialogService) {

  }

  ngOnInit(): void {
  }

  writeValue(_file: string): void {
    this.file = _file;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(event: FileSelectEvent) {
    const file = event.files[0];
    if (file) {
      const _file = URL.createObjectURL(file);
      this.file = _file;

      this.resetInput();

      this.openAvatarEditor(_file);
    }
  }

  openAvatarEditor(image: string): void {
    this.ref = this.dialogService.open(ImageCropperComponent, {
      style: {'max-width': '100%'},
      data: image,
    });

    this.ref.onClose.subscribe((result: any) => {
      if (result) {
        this.file = result;
        this.onChange(this.file);
        this.imageChange.emit(this.file);
      }
    });
  }

  resetInput() {
    this.fileUpload.clear();
  }
}
