import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase',
  standalone: true
})
export class UppercasePipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    if (!value) return '';
    return value.toUpperCase();
  }

}
