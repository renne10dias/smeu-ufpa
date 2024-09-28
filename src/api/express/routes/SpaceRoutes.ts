import { ApiExpress } from "../ApiExpress";
import { SpaceController } from "../controllers/SpaceController";

export class SpaceRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/spaces", SpaceController, 'create');
        api.addGetRoute("/spaces/:id", SpaceController, 'find');
        api.addPutRoute("/spaces/:id", SpaceController, 'update');
        api.addDeleteRoute("/spaces/:id", SpaceController, 'delete');
    }
}

