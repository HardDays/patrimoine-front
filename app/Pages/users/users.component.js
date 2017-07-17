"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_service_1 = require("../../services/http.service");
var main_service_1 = require("./../../services/main.service");
var UsersComponent = (function () {
    function UsersComponent(router, mainService) {
        this.router = router;
        this.mainService = mainService;
        this.isLoggedIn = false;
    }
    UsersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mainService.onAuthChange$.subscribe(function (bool) {
            _this.isLoggedIn = bool;
        });
        if (!this.isLoggedIn)
            this.router.navigate(["401"]);
        else
            this.mainService.GetAllUsers("").subscribe(function (data) {
                _this.Users = data.users;
                console.log(_this.Users);
            });
    };
    UsersComponent.prototype.OnSelectUser = function (sel) {
        this.router.navigate(["users", sel.id]);
    };
    return UsersComponent;
}());
UsersComponent = __decorate([
    core_1.Component({
        selector: "users",
        templateUrl: "app/Pages/users/users.component.html",
        providers: [http_service_1.HttpService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        main_service_1.MainService])
], UsersComponent);
exports.UsersComponent = UsersComponent;
//# sourceMappingURL=users.component.js.map