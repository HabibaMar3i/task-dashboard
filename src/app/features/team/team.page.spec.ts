import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { TeamPage } from './team.page';

describe('TeamPage', () => {
  const users = signal([{ id: '1', name: 'Alex Morgan', email: 'alex@example.com', avatar: 'AM' }]);
  const usersLoading = signal(false);
  const usersError = signal<string | null>(null);
  const loadUsers = vi.fn();

  beforeEach(async () => {
    loadUsers.mockClear();
    usersLoading.set(false);
    usersError.set(null);

    await TestBed.configureTestingModule({
      imports: [TeamPage],
      providers: [
        { provide: TasksStore, useValue: { users, usersLoading, usersError, loadUsers } },
      ],
    }).compileComponents();
  });

  it('loads users when the page starts and displays team members', () => {
    const fixture = TestBed.createComponent(TeamPage);
    fixture.detectChanges();

    expect(loadUsers).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');
    expect(fixture.nativeElement.textContent).toContain('alex@example.com');
    expect(fixture.nativeElement.textContent).toContain('AM');
  });

  it('shows a PrimeNG spinner while users are loading', () => {
    usersLoading.set(true);
    const fixture = TestBed.createComponent(TeamPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-progress-spinner')).toBeTruthy();
    expect(fixture.nativeElement.textContent).not.toContain('Alex Morgan');
  });

  it('shows a PrimeNG error message when users fail to load', () => {
    usersError.set('Could not load team members.');
    const fixture = TestBed.createComponent(TeamPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p-message')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Could not load team members.');
  });
});
