import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BaseChartDirective } from 'ng2-charts';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TableComponent } from './components/table/table.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectTasksComponent } from './components/project-tasks/project-tasks.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { TaskStatusChartComponent } from './components/task-status-chart/task-status-chart.component';
import { DateFormatPipe } from './pipes/date-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    DashboardComponent,
    ProjectTasksComponent,
    NewTaskComponent,
    TaskStatusChartComponent,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BaseChartDirective
  ],
  providers: [
    { provide: 'BASE_API_URL', useValue: 'http://localhost:44388/api' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }