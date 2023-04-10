import { Component, ElementRef, ViewChild } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveDataToFile } from '../docx/generate-docx';
import { getImageBase64 } from '../utils';

// declare const html2pdf: any;

@Component({
  selector: 'app-xlsx',
  templateUrl: './xlsx.component.html',
})
export class XLSXComponent {
  @ViewChild('viewer') viewer!: ElementRef<HTMLDivElement>;
  private logo?: File;

  downloadXslx() {
    if (!this.logo) return;

    getImageBase64(this.logo, async (image) => {
      const buffer = await this.generateXlsx(image);
      saveDataToFile(buffer, 'teste.xlsx', 'application/vnd.ms-excel');
    });
  }

  downloadXslxConvertido() {
    if (!this.logo) return;

    getImageBase64(this.logo, async (image) => {
      const buffer = await this.generateXlsx(image);
      this.renderXlsxAndDownload(buffer);
    });
  }

  onLogoChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.logo = target.files[0];
  }

  private renderXlsxAndDownload(buffer: ExcelJS.Buffer) {
    if (!this.viewer.nativeElement) return;
    const wb = XLSX.read(buffer);
    const ws = wb.Sheets[wb.SheetNames[0]];

    this.viewer.nativeElement.innerHTML = XLSX.utils.sheet_to_html(ws);
    if (!this.viewer.nativeElement) return;
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });
    pdf.html(this.viewer.nativeElement, {
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

    // html2pdf(this.viewer.nativeElement, {
    //   jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    //   margin: 0.5,
    //   html2canvas: {
    //     useCORS: true,
    //   },
    // });
  }

  private async generateXlsx(image: string): Promise<ExcelJS.Buffer> {
    const rows = [
      {
        name: 'name',
        birthday: '1999-01-01',
      },
      {
        name: 'name',
        birthday: '1999-01-01',
      },
      {
        name: 'name',
        birthday: '1999-01-01',
      },
    ];

    /* generate worksheet and workbook */
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dates');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 10 },
      { header: 'Birthday', key: 'birthday', width: 10 },
    ];
    worksheet.addRows(rows);

    const imageId = workbook.addImage({
      base64: image,
      extension: 'png',
    });

    worksheet.addImage(imageId, 'B6:D7');

    return await workbook.xlsx.writeBuffer();
  }
}
