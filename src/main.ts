import { ApiExpress } from "./api/express/api.express";
import { UsersController } from "./api/express/controllers/users.controller";

function main() {
    const api = ApiExpress.build();


    const usersController = UsersController.build();


    api.addGetRoute("/users/:id", usersController.find);
    api.addGetRoute("/users", usersController.list);
    api.addGetRoute("/usersarray", usersController.listArrayUsers);


    api.addGetRoute("/listuserforproduct", usersController.listUserForProduct);



    api.addPostRoute("/users", usersController.create);
    

    api.start(8000);
}

main();