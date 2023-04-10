import { Component, ElementRef, ViewChild } from '@angular/core';
// Importe o jsPDF
import jsPDF from 'jspdf';

@Component({
  selector: 'app-jspdf',
  template:
    '<button (click)="exportar()">exportar</button><div #texto>texto</div>',
})
export class JsPdfComponent {
  @ViewChild('texto', { static: true })
  texto!: ElementRef<HTMLElement>;

  exportar() {
    console.log(this.texto.nativeElement);
    const pdf = new jsPDF();
    pdf.html(this.texto.nativeElement, {
      callback: function () {
        // Salve o PDF
        pdf.save('nome-do-arquivo.pdf');
      },
    });
  }
}
