import { Component, EventEmitter, Input, Output } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() id = 'modal';
  @Input() title?: string;
  @Input() message?: string;
  @Output() success = new EventEmitter();
  open() {
    $('#' + this.id).modal('show');
  }
  close() {
    $('#' + this.id).modal('hide');
  }
  handleSuccess() {
    this.success.emit();
    this.close();
  }
}
