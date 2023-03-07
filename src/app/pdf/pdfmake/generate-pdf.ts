import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PageSize, TDocumentDefinitions } from 'pdfmake/interfaces';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function generatePDF(docDef: TDocumentDefinitions) {
  const pageMargins: [number, number, number, number] = [40, 40, 40, 40];
  const def = {
    pageSize: 'A4' as PageSize,
    pageMargins,
    ...docDef,
  };
  return pdfMake.createPdf(def);
}
