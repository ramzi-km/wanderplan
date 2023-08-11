import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
  @ViewChild('exampleSection') exampleSection!: ElementRef;

  scrollTo(sectionId: string): void {
    let sectionElement: HTMLElement | undefined;

    if (sectionId === 'exampleSection') {
      sectionElement = this.exampleSection.nativeElement;
    }

    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
