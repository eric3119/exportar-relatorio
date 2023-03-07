import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BLANK_PDF, Designer, Template } from '@pdfme/ui';

@Component({
  template: '<div id="container"></div>',
})
export class PDFMeDesignerComponent implements AfterViewInit {
  @ViewChild('#container', { static: true })
  domContainerRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const domContainer = this.domContainerRef.nativeElement;
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        {
          a: {
            type: 'text',
            position: { x: 0, y: 0 },
            width: 10,
            height: 10,
          },
          b: {
            type: 'text',
            position: { x: 10, y: 10 },
            width: 10,
            height: 10,
          },
          c: {
            type: 'text',
            position: { x: 20, y: 20 },
            width: 10,
            height: 10,
          },
        },
      ],
    };

    const designer = new Designer({ domContainer, template });
  }
}
