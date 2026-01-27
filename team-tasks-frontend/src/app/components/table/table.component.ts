import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-container">
      <table class="custom-table">
        <thead>
          <tr>
            <th 
              *ngFor="let column of columns"
              [style.width]="column.width || 'auto'"
              (click)="onSort(column.key)"
              [class.sortable]="column.sortable"
            >
              {{ column.header }}
              <span *ngIf="column.sortable && sortKey === column.key" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            *ngFor="let row of data; let i = index"
            [class.highlight]="shouldHighlight(row, i)"
            (click)="onRowClick(row)"
          >
            <td *ngFor="let column of columns">
              {{ getCellValue(row, column.key) }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <div *ngIf="!data || data.length === 0" class="no-data">
        No hay datos disponibles
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      overflow-x: auto;
      margin: 1rem 0;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .custom-table th {
      background: #f8f9fa;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #495057;
      border-bottom: 2px solid #dee2e6;
    }

    .custom-table th.sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }

    .custom-table th.sortable:hover {
      background: #e9ecef;
    }

    .sort-indicator {
      margin-left: 8px;
      color: #007bff;
    }

    .custom-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #dee2e6;
      color: #495057;
    }

    .custom-table tr:hover {
      background: #f8f9fa;
    }

    .custom-table tr.highlight {
      background: #fff3cd;
    }

    .custom-table tr.highlight:hover {
      background: #ffeaa7;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .custom-table {
        font-size: 14px;
      }
      
      .custom-table th,
      .custom-table td {
        padding: 8px 12px;
      }
    }
  `]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() highlightCondition?: (row: any, index: number) => boolean;
  @Output() rowClick = new EventEmitter<any>();
  @Output() sort = new EventEmitter<{ key: string; order: 'asc' | 'desc' }>();

  sortKey: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortOrder = 'asc';
    }
    this.sort.emit({ key, order: this.sortOrder });
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  shouldHighlight(row: any, index: number): boolean {
    return this.highlightCondition ? this.highlightCondition(row, index) : false;
  }

  getCellValue(row: any, key: string): string {
    return key.split('.').reduce((obj, k) => obj && obj[k], row) || '';
  }
}