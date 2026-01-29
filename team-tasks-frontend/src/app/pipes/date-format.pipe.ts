import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date_format',
  standalone: false
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return value;
    }
  }
}