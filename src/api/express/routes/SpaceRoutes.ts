import { ApiExpress } from "../ApiExpress";
import { SpaceController } from "../controllers/SpaceController";
import { MulterConfig } from "../../../util/multer/MulterConfig"; // Importa a classe do multer

export class SpaceRoutes {
    public static registerRoutes(api: ApiExpress) {
        const upload = MulterConfig.getMulterInstance(); // Instância do multer

        api.addPostRoute("/spaces", SpaceController, 'create', upload.single('file'));
        api.addGetRoute("/spaces", SpaceController, 'listSpaces');
        api.addGetRoute("/spaces/find/detalhes/:id", SpaceController, 'findSpace');
        api.addGetRoute("/spaces/:id", SpaceController, 'find');
        api.addPutRoute("/spaces/:id", SpaceController, 'update');
        api.addDeleteRoute("/spaces/:id", SpaceController, 'delete');
    }
}

