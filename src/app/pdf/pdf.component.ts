import { Component, ElementRef, ViewChild } from '@angular/core';
import * as docxPreview from 'docx-preview';
import { RelatorioService } from '../relatorio.service';

import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
})
export class PDFComponent {
  @ViewChild('viewer') viewer!: ElementRef;

  constructor(private relatorioService: RelatorioService) {}

  downloadPdf() {
    const docxWrapper = <HTMLElement>(
      document.querySelector('#viewer .docx-wrapper')
    );
    if (!docxWrapper) return;
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    pdf.html(docxWrapper, {
      html2canvas: {
        useCORS: true,
        width: 794,
        windowWidth: 794,
        scale: 0.75,
      },
      width: 794,
      windowWidth: 794,
      x: 0,
      y: 0,
      callback: function () {
        // Salve o PDF
        pdf.save('nome-do-arquivo.pdf');
      },
    });
  }

  viewPdf() {
    const viewer = document.getElementById('viewer');
    if (!viewer) return;

    docxPreview
      .renderAsync(this.relatorioService.relatorioDocxBlob, viewer, viewer, {
        ignoreLastRenderedPageBreak: true,
      })
      .then((x) => console.log('docx: finished'));
  }
}
