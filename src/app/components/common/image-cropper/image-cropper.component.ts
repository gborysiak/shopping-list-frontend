import {AfterViewInit, Component, OnInit} from '@angular/core';
import Cropper from 'cropperjs';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {MessageService} from "primeng/api";

@Component({
    providers: [DialogService, MessageService],
    imports: [ButtonModule],
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {
  cropper!: Cropper;
  sanitizedUrl: SafeUrl = '';

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.config.data);
  }

  ngAfterViewInit(): void {
    this.initCropper();
  }

  initCropper() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,

    });
  }

  getRoundedCanvas(sourceCanvas: any) {
    const canvas = document.createElement('canvas');
    const context: any = canvas.getContext('2d');
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    return canvas;
  }

//get the cropped image and closes the dialog
//returning an url or null if no image
  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    let roundedImage = document.createElement('img');

    if (roundedImage) {
      this.ref.close(roundedCanvas.toDataURL('image/jpeg', 0.6));
    } else {
      return this.ref.close(null);
    }
  }

// resets the cropper
  reset() {
    this.cropper.clear();
    this.cropper.crop();
  }

}
