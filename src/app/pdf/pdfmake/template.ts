import {
  ContentText,
  TableCellProperties,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

export function getDocDef(logoBase64: string): TDocumentDefinitions {
  return {
    content: [
      {
        alignment: 'justify',
        columns: [
          {
            text: 'PROJETO DE BROCAS DE PERFURAÇÃO',
          },
          {
            image: logoBase64,
            width: 200,
          },
        ],
      },
      {
        table: {
          body: [
            [
              'Poço: ',
              '--',
              'LDA: ',
              '--',
              { text: 'Coord. UTM CABP: ', colSpan: 2 },
              '',
            ],
            ['Versão: ', '--', 'MR: ', '--', 'N/S: ', '--'],
            ['Sonda: ', '--', 'Data: ', '--', 'E/W: ', '--'],
          ],
        },
      },
    ],
  };
}
