import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-xlsx',
  templateUrl: './xlsx.component.html',
})
export class XLSXComponent {
  downloadXslx() {
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
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates');

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [['Name', 'Birthday']], {
      origin: 'A1',
    });

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet['!cols'] = [{ wch: max_width }];

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFile(workbook, 'Presidents.xlsx', { compression: true });
  }
}
