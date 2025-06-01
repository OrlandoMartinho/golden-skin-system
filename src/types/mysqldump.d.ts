declare module 'mysqldump' {
    interface MysqldumpOptions {
      // Defina as opções de acordo com o seu uso do mysqldump
      connection: {
        host: string;
        user: string;
        password: string;
        database: string;
      };
      dump: {
        tables: string[];
        
      };
    }
    
    function mysqldump(options: MysqldumpOptions): Promise<void>;
    export = mysqldump;
  }
  