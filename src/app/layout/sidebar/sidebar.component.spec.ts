import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  it('shows the main navigation links', async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dashboard');
    expect(fixture.nativeElement.textContent).toContain('Tasks');
  });

  it('uses router links for available navigation destinations', async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();

    const analyticsLink = fixture.nativeElement.querySelector(
      'a[href="/analytics"]',
    ) as HTMLAnchorElement;
    const teamLink = fixture.nativeElement.querySelector('a[href="/team"]') as HTMLAnchorElement;

    expect(analyticsLink).toBeTruthy();
    expect(teamLink).toBeTruthy();
  });
});
