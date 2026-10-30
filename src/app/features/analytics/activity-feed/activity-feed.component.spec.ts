import { TestBed } from '@angular/core/testing';
import { ActivityFeedComponent } from './activity-feed.component';
import { Activity } from '../../../core/models/activity.model';

describe('ActivityFeedComponent', () => {
  it('displays activity details and its timestamp', async () => {
    const activity: Activity = {
      id: '1',
      taskId: 'task-1',
      taskTitle: 'Prepare report',
      userName: 'Alex',
      type: 'completed',
      timestamp: '2026-10-30T10:00:00Z',
    };

    await TestBed.configureTestingModule({
      imports: [ActivityFeedComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ActivityFeedComponent);
    fixture.componentRef.setInput('activities', [activity]);
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('li') as HTMLLIElement;
    const time = fixture.nativeElement.querySelector('time') as HTMLTimeElement;

    expect(item.textContent).toContain('Alex');
    expect(item.textContent).toContain('completed');
    expect(item.textContent).toContain('Prepare report');
    expect(time.getAttribute('datetime')).toBe(activity.timestamp);
  });

  it('shows an empty message when there are no activities', async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFeedComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ActivityFeedComponent);
    fixture.componentRef.setInput('activities', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No recent activity.');
  });
});
