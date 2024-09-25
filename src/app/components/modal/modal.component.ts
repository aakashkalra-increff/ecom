import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() successBtnMLabel = 'Yes';
  @Input() cancelBtnLabel = 'No';
  @Output() success = new EventEmitter();
  @ViewChild('modal') modal?: ElementRef;
  modalInstance: any;
  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modal?.nativeElement);
  }
  open() {
    this.modalInstance.show();
  }
  close() {
    this.modalInstance.hide();
  }
  handleSuccess() {
    this.success.emit();
    this.close();
  }
}
