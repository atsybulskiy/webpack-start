"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User = /** @class */ (function () {
    function User() {
        var _this = this;
        this.log = function () {
            _this.sumTo(_this.age);
        };
        this.age = 32;
        this.name = 'Саня';
    }
    User.prototype.sumTo = function (n) {
        var array = [0, 1, 2];
        console.log('n', array.concat([n]));
    };
    return User;
}());
exports.User = User;
var user = new User;
console.log(user.age);
console.log('hello');
//# sourceMappingURL=main.js.map