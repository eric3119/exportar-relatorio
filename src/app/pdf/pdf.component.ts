import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { generate } from '@pdfme/generator';
import { generatePDF } from './pdfmake/generate-pdf';
import { getImageBase64 } from '../utils';
import { getDocDef } from './pdfmake/template';
import { template } from './pdfme/relatorio-template';
import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
})
export class PDFComponent implements AfterViewInit {
  @ViewChild('viewer') viewer!: ElementRef;
  wvInstance!: WebViewerInstance;
  private logo?: File;

  ngAfterViewInit(): void {
    WebViewer(
      {
        path: '../lib',
        initialDoc: '../files/webviewer-demo-annotated.pdf',
      },
      this.viewer.nativeElement
    ).then((instance) => {
      this.wvInstance = instance;

      // this.coreControlsEvent.emit(instance.UI.LayoutMode.Single);

      const { documentViewer, Annotations, annotationManager } = instance.Core;

      instance.UI.openElements(['notesPanel']);

      documentViewer.addEventListener('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      documentViewer.addEventListener('documentLoaded', () => {
        // this.documentLoaded$.next();
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser(),
        });
        annotationManager.addAnnotation(rectangleAnnot);
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }

  downloadPdf() {
    if (!this.logo) {
      console.error('Logo não encontrado');
      return;
    }
    getImageBase64(this.logo, (image) => {
      generatePDF(getDocDef(image)).download('relatorio.pdf');
    });
  }

  viewPdf() {
    if (!this.logo) {
      console.error('Logo não encontrado');
      return;
    }
    getImageBase64(this.logo, (image) => {
      generatePDF(getDocDef(image)).getDataUrl((dataUrl) => {
        const targetElement = document.querySelector('#iframeContainer');
        if (!targetElement) {
          console.error('iframeContainer não encontrado');
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.src = dataUrl;
        iframe.style.width = '100%';
        iframe.style.height = '80vh';
        targetElement.appendChild(iframe);
      });
    });
  }

  pdfMe() {
    if (!this.logo) {
      console.error('Logo não encontrado');
      return;
    }
    getImageBase64(this.logo, (image) => {
      const inputs = [
        {
          logo: image,
          poco: 'teste campo poço',
          versao: 'teste campo versão',
          sonda: 'teste campo sonda',
          lda: 'teste campo lda',
          mr: 'teste campo mr',
          data: 'teste campo data',
          ns: 'teste campo ns',
          ew: 'teste campo ew',
        },
      ];

      generate({ template, inputs }).then((pdf) => {
        const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
        window.open(URL.createObjectURL(blob));
      });
    });
  }

  onLogoChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.logo = target.files[0];
  }
}
