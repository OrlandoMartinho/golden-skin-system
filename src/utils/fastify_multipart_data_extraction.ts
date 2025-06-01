class DataExtracMultipart {

  

  constructor() {
    
  }

 public async extractFields(file: any): Promise<Record<string, any>> {
    const fields = file?.fields || {};
    const extractedFields: Record<string, any> = {};

    for (const [fieldname, fieldvalue] of Object.entries(fields)) {
      if (Array.isArray(fieldvalue)) {
        // Se for um array de Multipart, mapear os valores
        extractedFields[fieldname] = fieldvalue.map(f => ('value' in f ? f.value : f));
      } else if (fieldvalue && typeof fieldvalue === 'object' && 'value' in fieldvalue) {
        // Se for um único objeto Multipart e tiver a propriedade value
        extractedFields[fieldname] = fieldvalue.value;
      } else {
        console.log(`Campo: ${fieldname} is undefined or has an unexpected structure`);
      }
    }

    return extractedFields;
  }
  
}

export default DataExtracMultipart;
