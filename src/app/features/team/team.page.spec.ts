import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { TeamPage } from './team.page';

describe('TeamPage', () => {
  const users = signal([{ id: '1', name: 'Alex Morgan', email: 'alex@example.com', avatar: 'AM' }]);
  const loadUsers = vi.fn();

  beforeEach(async () => {
    loadUsers.mockClear();

    await TestBed.configureTestingModule({
      imports: [TeamPage],
      providers: [{ provide: TasksStore, useValue: { users, loadUsers } }],
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
});
