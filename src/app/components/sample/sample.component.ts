import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Signal,
  effect,
  signal,
} from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
})
export class SampleComponent implements OnInit, OnDestroy {
  // Propetif og keyboard and devices height and width
  keyboardHeight: number = 0;
  deviceHeight: number = 0;
  deviceWidth: number = 0;
  viewportHeight: number = 0;
  // User form model
  userInfo = {
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    occupation: '',
  };
  heightVar =signal(`${window.innerHeight / 2}px`);

  users: any[] = []; // Array to hold user data
  private viewportHandler: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private cdr: ChangeDetectorRef) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.fetchRandomUsers();
    }

  }

  // Random user generator function
  generateRandomUser(id: number): any {
    const firstNames = ['John', 'Jane', 'Mary', 'Tom', 'Alex', 'Emily'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Davis', 'Williams'];
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];

    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]
      }`;
    const randomPhone = `+91-${Math.floor(Math.random() * 1000000000)}`;
    const randomWebsite = `${randomFirstName.toLowerCase()}${randomLastName.toLowerCase()}.com`;
    const randomPhoto = `https://picsum.photos/100/100?random=${id}`; // Placeholder image URL

    return {
      id,
      name: `${randomFirstName} ${randomLastName}`,
      email: randomEmail,
      phone: randomPhone,
      website: randomWebsite,
      photo: randomPhoto,
    };
  }

  // Function to fetch random users
  fetchRandomUsers() {
    const randomUsers = [];
    for (let i = 1; i <= 15; i++) {
      randomUsers.push(this.generateRandomUser(i));
    }
    this.users = randomUsers;
  }

  onSubmit() {
    console.log('Form submitted:', this.userInfo);
    // Here you would typically send the form data to a server
  }

  ngOnInit(): void {
    console.log('SampleComponent: ngOnInit');
    if (this.isBrowser) {
      console.log('SampleComponent: ngOnInit: isBrowser');
      this.initializeViewportHandler();
    }
   
    this.deviceHeight = window.innerHeight;
    this.deviceWidth = window.innerWidth;
    console.log('SampleComponent: ngOnInit: deviceHeight:', this.deviceHeight);
    console.log('SampleComponent: ngOnInit: deviceWidth:', this.deviceWidth);
  }

  keyboardAdjustmentHeight: string = '0px';
  private getWindowHeight(): string {
    return `${window.innerHeight / 2}px`; // Set the height as half of window height
  }

  private initializeViewportHandler(): void {
    if (window.visualViewport) {
      console.log('Window and visualViewport available', window.visualViewport);
      const height = window.innerHeight;
      const viewportHeight = window.visualViewport.height;
      this.viewportHeight = viewportHeight;
      this.keyboardAdjustmentHeight =
        height - viewportHeight > 0 ? `-${height - viewportHeight}px` : '0px';
      console.log('Inner Height:', height);
      console.log('Viewport Height:', viewportHeight);
      console.log('Keyboard Adjustment Height:', this.keyboardAdjustmentHeight);
      const handleViewportEvent = () => {
        const keyboardHeight = height - viewportHeight;
        console.log('Viewport event triggered');
        console.log('Inner Height:', height);
        console.log('Viewport Height:', viewportHeight);
        console.log('Calculated Keyboard Height:', keyboardHeight);

        this.keyboardAdjustmentHeight =
          keyboardHeight > 0 ? `-${keyboardHeight}px` : `-${keyboardHeight}px`;
        this.heightVar.set(`${this.keyboardAdjustmentHeight}`); 

        document.documentElement.style.setProperty(
          '--keyboard-offset',
          this.keyboardAdjustmentHeight
        );

        console.log(
          'CSS Variable --keyboard-offset set to:',
          this.keyboardAdjustmentHeight
        );
        this.cdr.markForCheck();
      };

      window.visualViewport.addEventListener('resize', handleViewportEvent);
      window.visualViewport.addEventListener('scroll', handleViewportEvent);
      this.cdr.markForCheck();
      console.log('Viewport handler initialized');
    } else {
      console.log('Window or visualViewport not available');
    }
  }

  ngOnDestroy() {
    if (
      this.isBrowser &&
      typeof window !== 'undefined' &&
      window.visualViewport &&
      this.viewportHandler
    ) {
      window.visualViewport.removeEventListener('resize', this.viewportHandler);
      window.visualViewport.removeEventListener('scroll', this.viewportHandler);
    }
  }
  onClick() {

    const height = window.innerHeight;

    setTimeout(() => {
      this.initializeViewportHandler();
      // if (window.visualViewport) {
      //   const viewportHeight = window.visualViewport.height;
      //   this.userInfo.firstName = viewportHeight.toString();
      // }
    }, 1000);
  }

  @HostListener('window:focusin', ['$event'])
  onFocusIn(event: any) {
    if (
      this.isBrowser &&
      this.viewportHandler &&
      (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA')
    ) {
      // iOS may need an additional timeout
      setTimeout(() => {
        this.viewportHandler();
      }, 100);
    }
  }
}
