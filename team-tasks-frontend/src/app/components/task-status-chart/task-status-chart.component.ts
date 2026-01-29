import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-task-status-chart',
  standalone: false,
  template: `
    <div class="chart-container" *ngIf="statusStats && statusStats.length > 0">
      <h3>Tareas por Estado</h3>
      <div class="chart-content">
        <div class="chart-wrapper">
          <canvas baseChart [data]="chartData" [type]="chartType"></canvas>
        </div>
        <div class="stats-grid">
          <div class="stat-item" *ngFor="let stat of statusStats">
            <div class="stat-count">{{ stat.count }}</div>
            <div class="stat-label">{{ stat.status }}</div>
            <div class="stat-percentage">{{ stat.percentage }}%</div>
          </div>
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

    .chart-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }

    .chart-wrapper {
      position: relative;
      height: 250px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 6px;
      background: #f8f9fa;
      border-left: 4px solid #007bff;
    }

    .stat-count {
      font-size: 1.25rem;
      font-weight: bold;
      color: #007bff;
      margin-right: 1rem;
      min-width: 40px;
      text-align: center;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #495057;
      flex: 1;
    }

    .stat-percentage {
      font-size: 0.75rem;
      color: #28a745;
      font-weight: 500;
      min-width: 50px;
      text-align: right;
    }

    @media (max-width: 768px) {
      .chart-content {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .chart-wrapper {
        height: 200px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 0.5rem;
      }

      .stat-item {
        flex-direction: column;
        text-align: center;
        padding: 0.5rem;
      }

      .stat-count {
        margin-right: 0;
        margin-bottom: 0.25rem;
      }

      .stat-percentage {
        text-align: center;
      }
    }
  `]
})
export class TaskStatusChartComponent implements OnChanges {
  @Input() tasks: any[] = [];

  public chartData: ChartConfiguration['data'] | undefined = undefined;
  public chartType: ChartType = 'doughnut';
  public statusStats: any = null;
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = (context.parsed as number) || 0;
            const total = context.dataset.data.reduce((a: number, b: any) => a + (b || 0), 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.tasks || this.tasks.length === 0) {
      this.chartData = undefined;
      this.statusStats = null;
      return;
    }

    const statusCount = this.tasks.reduce((acc: { [key: string]: number }, task) => {
      const status = task.status || 'Sin estado';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statuses = Object.keys(statusCount);
    const counts = Object.values(statusCount);
    
    const colors = [
      '#007bff', // Primary blue
      '#28a745', // Success green
      '#ffc107', // Warning yellow
      '#dc3545', // Danger red
      '#6f42c1', // Purple
      '#17a2b8', // Cyan
      '#fd7e14', // Orange
      '#e83e8c', // Pink
      '#6c757d', // Gray
      '#20c997'  // Teal
    ];

    this.chartData = {
      labels: statuses,
      datasets: [{
        data: counts,
        backgroundColor: colors.slice(0, statuses.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    this.statusStats = statuses.map(status => ({
      status,
      count: statusCount[status],
      percentage: ((statusCount[status] / this.tasks.length) * 100).toFixed(1)
    }));
  }
}