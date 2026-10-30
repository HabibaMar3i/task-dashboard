import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { AnalyticsPage } from './analytics.page';

describe('AnalyticsPage', () => {
  let httpMock: HttpTestingController;
  const tasks = signal([
    { status: 'todo', priority: 'high' },
    { status: 'in_progress', priority: 'medium' },
    { status: 'done', priority: 'low' },
    { status: 'todo', priority: 'high' },
  ]);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const loadTasks = vi.fn();

  beforeEach(async () => {
    loadTasks.mockClear();
    loading.set(false);
    error.set(null);

    await TestBed.configureTestingModule({
      imports: [AnalyticsPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TasksStore, useValue: { tasks, loading, error, loadTasks } },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads tasks and requests recent activity on initialization', async () => {
    const fixture = TestBed.createComponent(AnalyticsPage);
    fixture.detectChanges();

    expect(loadTasks).toHaveBeenCalled();
    httpMock.expectOne('/api/activities').flush([]);
    await fixture.whenStable();
  });

  it('counts tasks by status and priority in the charts', async () => {
    const fixture = TestBed.createComponent(AnalyticsPage);
    fixture.detectChanges();
    httpMock.expectOne('/api/activities').flush([]);
    await fixture.whenStable();

    expect(fixture.componentInstance.statusChart().datasets[0].data).toEqual([2, 1, 1]);
    expect(fixture.componentInstance.priorityChart().datasets[0].data).toEqual([2, 1, 1]);
  });

  it('configures charts to resize within their containers', () => {
    const fixture = TestBed.createComponent(AnalyticsPage);

    expect(fixture.componentInstance.chartOptions.responsive).toBe(true);
    expect(fixture.componentInstance.chartOptions.maintainAspectRatio).toBe(false);
  });

  it('shows a PrimeNG spinner while tasks load', () => {
    loading.set(true);
    const fixture = TestBed.createComponent(AnalyticsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-progress-spinner')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Tasks by status');

    httpMock.expectOne('/api/activities').flush([]);
  });

  it('shows a PrimeNG error message when task loading fails', () => {
    error.set('Could not load tasks.');
    const fixture = TestBed.createComponent(AnalyticsPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-message')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Could not load tasks.');

    httpMock.expectOne('/api/activities').flush([]);
  });
});
