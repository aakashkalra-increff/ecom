import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent {
  @Input() checkedOptions?: string[] = [];
  @Input() options: string[] = [];
  @Input() name?: string;
  @Output() checkboxChange = new EventEmitter();
  expanded = false;
  visibleOptions: string[] = [];
  optionsLimit = 4;
  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) this.visibleOptions = this.options.slice(0, this.optionsLimit);
  }
  handleChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const checked = (event.target as HTMLInputElement).checked;
    const oldVal = this.checkedOptions || [];
    let newValue = [...oldVal];
    if (checked) {
      newValue.push(value);
    } else {
      newValue = newValue.filter((e: string) => e !== value);
    }
    this.checkboxChange.emit({ name: this.name, value: newValue });
  }
  showAllOption() {
    this.expanded = true;
    this.visibleOptions = this.options;
  }
}
