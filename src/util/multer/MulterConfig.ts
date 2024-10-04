import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express'; // Importa Request para tipagem

export class MulterConfig {
  private static storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../../uploads')); // Caminho onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Gera nome único
    }
  });

  // Método estático para retornar o middleware do multer
  public static getMulterInstance() {
    return multer({
      storage: this.storage,
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Apenas arquivos de imagem são permitidos!')); // Mensagem de erro personalizada
        }
      }
    });
  }

  // Função estática para retornar o caminho da imagem carregada
  public static getUploadedFilePath(req: Request): string | null {
    if (req.file) {
      // Retorna o caminho completo do arquivo
      return path.join(__dirname, '../../../uploads', req.file.filename);
    }
    // Se o arquivo não existir, retorna null
    return null;
  }
}
