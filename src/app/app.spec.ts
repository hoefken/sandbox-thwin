import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    // #given
    const fixture = TestBed.createComponent(App);
    // #when
    const app = fixture.componentInstance;
    // #then
    expect(app).toBeTruthy();
  });

  it('should render router-outlet', async () => {
    // #given
    const fixture = TestBed.createComponent(App);
    // #when
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    // #then
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
