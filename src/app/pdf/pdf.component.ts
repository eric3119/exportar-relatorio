import { Component, ElementRef, ViewChild } from '@angular/core';
import { generate } from '@pdfme/generator';
import * as docxPreview from 'docx-preview';
import { RelatorioService } from '../relatorio.service';
import { getImageBase64 } from '../utils';
import { template } from './pdfme/relatorio-template';

declare const html2pdf: any;

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
})
export class PDFComponent {
  @ViewChild('viewer') viewer!: ElementRef;
  private logo?: File;

  constructor(private relatorioService: RelatorioService) {}

  downloadPdf() {
    const docxWrapper = document.querySelector('#viewer .docx-wrapper');
    if (!docxWrapper) return;
    html2pdf(docxWrapper, {
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      margin: 0,
      html2canvas: {
        useCORS: true,
      },
    });
    // if (!this.logo) {
    //   console.error('Logo não encontrado');
    //   return;
    // }
    // getImageBase64(this.logo, (image) => {
    //   generatePDF(getDocDef(image)).download('relatorio.pdf');
    // });
  }

  viewPdf() {
    const viewer = document.getElementById('viewer');
    if (!viewer) return;

    docxPreview
      .renderAsync(this.relatorioService.relatorioDocxBlob, viewer, viewer, {
        ignoreLastRenderedPageBreak: true,
      })
      .then((x) => console.log('docx: finished'));
    // if (!this.logo) {
    //   console.error('Logo não encontrado');
    //   return;
    // }
    // getImageBase64(this.logo, (image) => {
    //   generatePDF(getDocDef(image)).getDataUrl((dataUrl) => {
    //     const targetElement = document.querySelector('#iframeContainer');
    //     if (!targetElement) {
    //       console.error('iframeContainer não encontrado');
    //       return;
    //     }

    //     const iframe = document.createElement('iframe');
    //     iframe.src = dataUrl;
    //     iframe.style.width = '100%';
    //     iframe.style.height = '80vh';
    //     targetElement.appendChild(iframe);
    //   });
    // });
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
