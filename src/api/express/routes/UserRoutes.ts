import { ApiExpress } from "../ApiExpress";
import { UserController } from "../controllers/UserController";

export class UserRoutes {
    public static registerRoutes(api: ApiExpress) {
        api.addPostRoute("/user", UserController, 'create');
        api.addGetRoute("/user", UserController, 'list');
    }
}

