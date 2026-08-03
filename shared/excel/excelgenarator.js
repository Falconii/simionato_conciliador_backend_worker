
const db = require("../infra/database");
const ExcelJS = require('exceljs');
const funcoes = require("../email/funcoes");
const fs = require('fs').promises;
const path = require('path');



function numeroParaColunaExcel(n) {
  let coluna = "";
  while (n > 0) {
    let resto = (n - 1) % 26;
    coluna = String.fromCharCode(65 + resto) + coluna;
    n = Math.floor((n - 1) / 26);
  }
  return coluna;
}


async function gerarExcelGenerico(rows, config, caminhoArquivo) {
  const caminhoTmp = caminhoArquivo + ".tmp";

  const dir = path.dirname(caminhoTmp);
  await fs.mkdir(dir, { recursive: true });

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: caminhoTmp,
    useStyles: true,
    useSharedStrings: true
  });

  const worksheet = workbook.addWorksheet(config.sheetName || "Relatório");

  worksheet.columns = config.columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 20
  }));

  const ultimaColuna = numeroParaColunaExcel(config.columns.length);
  worksheet.autoFilter = { from: "A1", to: `${ultimaColuna}1` };

  for (const origRow of rows) {
    const row = { ...origRow };

    for (const col of config.columns) {
      const valor = row[col.key];
      if (col.format && valor != null && typeof valor === "string") {
        row[col.key] = Number(valor.replace(/\./g, "").replace(",", "."));
      }
    }

    const rowExcel = worksheet.addRow(row);

    config.columns.forEach((col, idx) => {
      if (col.format) {
        rowExcel.getCell(idx + 1).numFmt = col.format;
      }
    });

    rowExcel.commit();
  }

  worksheet.commit();

  // 🔥 FECHA O STREAM
  await workbook.commit();

  if (workbook.stream && workbook.stream.writable) {
    workbook.stream.end();
  }

  // 🔥 DRENA O EVENT LOOP PARA GARANTIR QUE O STREAM FECHOU
  await new Promise(resolve => setImmediate(resolve));

  // 🔥 PEQUENO DELAY PARA O SO LIBERAR O HANDLE
  await new Promise(resolve => setTimeout(resolve, 30));

  await fs.rename(caminhoTmp, caminhoArquivo);

  console.log("Finalizado Arquivo", caminhoArquivo);
}




/* async function gerarExcelGenerico(rows, config, caminhoArquivo) {
   const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    filename: caminhoArquivo,
    useStyles: true,
    useSharedStrings: true
  });
  const worksheet = workbook.addWorksheet(config.sheetName || "Relatório");

  console.log("gerarExcelGenerico.....");

  // 1. Monta colunas dinamicamente (sem style aqui)
  worksheet.columns = config.columns.map(col => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
    alignment: { horizontal: col.align || 'left' }
  }));

  console.log("2. Converte valores e adiciona linhas");
  //2. Converte valores e adiciona linhas
  rows.forEach(origRow => {
    const row = { ...origRow }; // cópia para não mexer no objeto original

    config.columns.forEach(col => {
      const valor = row[col.key];

      if (col.format && valor != null) {
        // se vier string, tenta converter para número
        if (typeof valor === 'string') {
          row[col.key] = Number(
            valor
              .replace(/\./g, '')   // tira separador de milhar
              .replace(',', '.')    // troca vírgula por ponto
          );
        }
      }
    }); 

    worksheet.addRow(origRow);
  });

  //console.log("Colocando a rows");
  //worksheet.addRows(rows);

  console.log("3. Aplica numFmt nas colunas que têm format");
  // 3. Aplica numFmt nas colunas que têm format
  config.columns.forEach((col, index) => {
    if (col.format) {
      const excelCol = worksheet.getColumn(index + 1);
      excelCol.numFmt = col.format;
    }
  });

  console.log("4. Estiliza cabeçalho");
  // 4. Estiliza cabeçalho
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  // 5. Congelar cabeçalho
  if (config.freezeHeader) {
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
  }
 
  console.log("6. Filtro automático");
  // 6. Filtro automático
  if (config.autoFilter) {
    worksheet.autoFilter = {
      from: 'A1',
      to: `${String.fromCharCode(64 + config.columns.length)}1`
    };
  }

  console.log("Gravando Planilha");
  await workbook.xlsx.writeFile(caminhoArquivo);
   console.log("Terminou Planilha");
}
 */

async function exceltoemailordownload(res, usuario, owner, config, rows, tipo,file_name) {
  try {

    const caminhoArquivo = path.join(__dirname, '..',  'planilhas', file_name);

    res.status(200).json({ message: "Arquivo Sendo Processado. Aguarde !" , file_name : file_name});

    await gerarExcelGenerico(rows, config , caminhoArquivo);
  } catch (err) {
       console.log("Erro exceltoemailordownload:",err);
  }
};



module.exports = { gerarExcelGenerico , exceltoemailordownload};
