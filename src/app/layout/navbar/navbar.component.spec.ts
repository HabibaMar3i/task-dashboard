import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TasksStore } from '../../core/stores/tasks.store';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  it('sends search text to the task store', async () => {
    const setSearch = vi.fn();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        {
          provide: TasksStore,
          useValue: { filters: () => ({ search: '' }), setSearch },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;
    searchInput.value = 'weekly report';
    searchInput.dispatchEvent(new Event('input'));

    expect(setSearch).toHaveBeenCalledWith('weekly report');
  });
});
