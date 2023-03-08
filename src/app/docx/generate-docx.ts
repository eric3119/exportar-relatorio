import { UserOptions } from 'docx-templates/lib/types';

declare const docxTemplates: { createReport: (opt: UserOptions) => BlobPart };

const { createReport } = docxTemplates;

export async function getDocxReport(file: File, data: () => unknown) {
  console.log('Template chosen');

  // Read template
  const template = await readFileIntoArrayBuffer(file);

  if (template === null)
    throw new Error('Erro ao gerar o report docx: template nulo');
  if (typeof template === 'string')
    throw new Error(
      'Erro ao gerar o report docx: template deve ser uma string'
    );

  // Create report
  console.log('Creating report (can take some time) ...');
  const report = await createReport({
    cmdDelimiter: ['{', '}'],
    template: template as Buffer,
    data,
  });
  return report;
}

export async function downloadDocx(
  file: File,
  filename: string,
  data: () => unknown
) {
  const report = await getDocxReport(file, data);
  // Save report
  saveDataToFile(
    report,
    filename,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
}

// ==============================================
// Helpers
// ==============================================
const readFileIntoArrayBuffer = async (fd: File) =>
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(fd);
  });

export const saveDataToFile = (
  data: BlobPart,
  fileName: string,
  mimeType: string
) => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

const downloadURL = (data: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = data;
  a.download = fileName;
  document.body.appendChild(a);
  a.style.display = 'none';
  a.click();
  a.remove();
};
