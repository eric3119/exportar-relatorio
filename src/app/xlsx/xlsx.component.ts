import { Component, ElementRef, ViewChild } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { getImageBase64 } from '../utils';

declare const html2pdf: any;

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

      const buffer = await workbook.xlsx.writeBuffer();
      // XLSX
      // saveDataToFile(buffer, 'teste.xlsx', 'application/vnd.ms-excel');

      // PDF
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      this.renderXlsxAndDownload(ws);

      // saveDataToFile(buffer, 'teste.xlsx', 'application/vnd.ms-excel');
    });
  }

  onLogoChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.logo = target.files[0];
  }

  private renderXlsxAndDownload(ws: XLSX.WorkSheet) {
    if (!this.viewer.nativeElement) return;

    this.viewer.nativeElement.innerHTML = XLSX.utils.sheet_to_html(ws);

    html2pdf(this.viewer.nativeElement, {
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
      margin: .5,
      html2canvas: {
        useCORS: true,
      },
    });
  }
}
