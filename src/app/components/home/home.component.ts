import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  OnInit,
  HostListener,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  heightVar = signal('100px');
  userInfo = {
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    occupation: '',
  };
  visualHeightState:any
  constructor() {
    if (window) {
      this.heightVar.set(`${window.innerHeight}px`);
    }
 }

  ngOnInit(): void {
  
    if (window.visualViewport) {
  
      this.visualHeightState = window.visualViewport.height;
    }
  }

 
  click: number = 0;
  onClick() {
    this.click++;
    console.log('Click event triggered', this.click);
    
    setTimeout(() => {
      console.log(this.heightVar());
      if (window.visualViewport) {
        console.log('Window and visualViewport available', window.visualViewport.height);
        console.log('Window height available', window.innerHeight);
        const height = window.innerHeight;
        const viewportHeight = window.visualViewport.height;
        this.heightVar.set(`${viewportHeight}px`);
        console.log(this.heightVar());
       
      }
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    setTimeout(() => {
    if (window.visualViewport) {
      console.log('Window and visualViewport available', window.visualViewport.height);
      console.log('Window height available', window.innerHeight);
      const height = window.innerHeight;
      const viewportHeight = window.visualViewport.height;
      if (this.visualHeightState !== viewportHeight) {
        this.heightVar.set(`${viewportHeight}px`);
        this.visualHeightState = viewportHeight;
          console.log(this.heightVar());
        }
      }
    }, 1000);
    console.log('Touch started', event);
  }
  

}
