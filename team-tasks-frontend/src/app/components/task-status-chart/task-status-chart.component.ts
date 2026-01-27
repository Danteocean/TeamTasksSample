import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-task-status-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" *ngIf="statusStats">
      <h3>Tareas por Estado</h3>
      <div class="stats-grid">
        <div class="stat-item" *ngFor="let stat of statusStats">
          <div class="stat-count">{{ stat.count }}</div>
          <div class="stat-label">{{ stat.status }}</div>
          <div class="stat-percentage">{{ stat.percentage }}%</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .chart-container h3 {
      color: #495057;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      border-left: 4px solid #007bff;
      padding-left: 0.75rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .stat-item {
      text-align: center;
      padding: 0.75rem;
      border-radius: 6px;
      background: #f8f9fa;
    }

    .stat-count {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }

    .stat-percentage {
      font-size: 0.75rem;
      color: #28a745;
      font-weight: 500;
    }
  `]
})
export class TaskStatusChartComponent implements OnChanges {
  @Input() tasks: any[] = [];

  public chartData: any = null;
  public statusStats: any = null;

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.tasks || this.tasks.length === 0) {
      this.chartData = null;
      this.statusStats = null;
      return;
    }

    const statusCount = this.tasks.reduce((acc: { [key: string]: number }, task) => {
      const status = task.status || 'Sin estado';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    this.statusStats = Object.keys(statusCount).map(status => ({
      status,
      count: statusCount[status],
      percentage: ((statusCount[status] / this.tasks.length) * 100).toFixed(1)
    }));
  }
}