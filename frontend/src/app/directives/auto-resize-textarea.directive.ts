import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appAutoResizeTextarea]',
})
export class AutoResizeTextareaDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('input', ['$event.target'])
  onInput(textarea: HTMLTextAreaElement): void {
    this.adjustTextAreaHeight(textarea);
  }
  ngAfterViewInit(): void {
    this.adjustTextAreaHeight(this.el.nativeElement);
  }
  adjustTextAreaHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.overflowY = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
