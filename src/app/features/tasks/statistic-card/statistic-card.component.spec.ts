import { TestBed } from '@angular/core/testing';
import { StatCardComponent } from './statistic-card.component';
import { Statistic } from '../../../core/models/statistic.model';

describe('StatCardComponent', () => {
  it('displays the statistic title and value', async () => {
    const statistic: Statistic = {
      id: '1',
      title: 'Total tasks',
      icon: 'T',
      value: 12,
      change: '+2',
      changeLabel: 'this week',
      changeType: 'positive',
      color: 'green',
    };

    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(StatCardComponent);
    fixture.componentRef.setInput('statistic', statistic);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Total tasks');
    expect(fixture.nativeElement.textContent).toContain('12');
  });
});
