import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CoursesComponent } from './courses.component';
import { OrderByPipe } from '../../Pipes/orderBy/order-by.pipe';
import { CourseService } from '../../Services/course.service';
import { MdbModalModule, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { mockedCoursesList } from '../../constants';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { DurationPipe } from '../../Pipes/duration/duration.pipe';
import { ChangeBorderDirective } from '../../Directives/change-border.directive';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;
  let valueServiceSpy: jasmine.SpyObj<CourseService>;

  beforeEach(async () => {
    valueServiceSpy = jasmine.createSpyObj('CourseService', [
      'removeItem',
      'getList',
    ]);
    await TestBed.configureTestingModule({
      declarations: [
        CoursesComponent,
        OrderByPipe,
        CourseItemComponent,
        DurationPipe,
        ChangeBorderDirective,
      ],
      imports: [FontAwesomeModule, MdbModalModule],
      providers: [
        { provide: CourseService, useValue: valueServiceSpy },
        MdbModalService,
      ],
    }).compileComponents();

    valueServiceSpy.getCourses.and.returnValue(mockedCoursesList);
    valueServiceSpy.removeItem.and.callFake((id: string) => mockedCoursesList);
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have "Add course" button', () => {
    const button = fixture.nativeElement.querySelector('button');
    console.log(typeof button);
    expect(button.textContent).toContain('Add course');
  });

  it('should call console.log() after click "Load more" button', () => {
    console.log = jasmine.createSpy('log');
    const loadMoreBtn = fixture.debugElement.query(By.css('#loadMoreBtn'));
    loadMoreBtn.triggerEventHandler('click');
    expect(console.log).toHaveBeenCalled();
  });

  it('should call console.log() after call deleteCourse()', () => {
    const btn = fixture.debugElement.queryAll(By.css('.btn-info'))[2];
    btn.triggerEventHandler('click');
    fixture.detectChanges();
    const modalBtn = document.getElementById('deleteBtn');
    modalBtn?.click();
    console.log(document);
    // component.deleteCourse('testID');
    // const modalBtn = document.querySelector(
    //   '.btn-success'
    // ) as HTMLButtonElement;
    // modalBtn.click();
    // component.modalRef?.close(true);
    expect(valueServiceSpy.removeItem).toHaveBeenCalled();
  });
});
