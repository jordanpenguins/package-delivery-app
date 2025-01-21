import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgToG',
  standalone: true
})
export class KgToGPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    if (typeof value !== 'number') {
      return '';
    }
    const grams = value * 1000;
    return `${grams}g`;
  }
}
