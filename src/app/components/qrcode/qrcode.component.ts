import { Component, Input } from '@angular/core';

@Component({
  selector: 'qrcode',
  template: `<img [src]="qrCodeUrl" />`,
})
export class QrcodeComponent {
  @Input() data: string;

  constructor() {
    this.data = '';
  }

  get qrCodeUrl() {
    return `google.com`;
  }
}
