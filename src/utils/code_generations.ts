class GenerateVerificationCode {
  private length: number;

  constructor(length: number = 4) {
    this.length = length;
  }
 
  public generate_code(): string {
    let code = '';
    for (let i = 0; i < this.length; i++) {
      code += Math.floor(Math.random() * 10).toString(); 
    }
    return code;
  }
}

export default GenerateVerificationCode;