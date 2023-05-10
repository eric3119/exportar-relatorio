import { Component, ElementRef, ViewChild } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { saveDataToFile } from '../docx/generate-docx';
import { getImageBase64 } from '../utils';

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

  onLogoChange({ target }: Event) {
    if (!(target instanceof HTMLInputElement))
      throw new Error('evento de input file não encontrado');
    if (!target.files) throw new Error('nenhum arquivo selecionado');

    this.logo = target.files[0];
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
