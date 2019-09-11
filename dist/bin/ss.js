"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ss = (function () {
    function Ss() {
    }
    Ss.prototype.constuctor = function () {
        console.log(1);
    };
    Ss.prototype.setName = function (name) {
        this.name = name;
    };
    Ss.prototype.getName = function () {
        var Season;
        (function (Season) {
            Season[Season["Winter"] = 0] = "Winter";
            Season[Season["Spring"] = 1] = "Spring";
            Season[Season["Summer"] = 2] = "Summer";
            Season[Season["Autumn"] = 3] = "Autumn";
        })(Season || (Season = {}));
        ;
        return Season;
    };
    return Ss;
}());
exports.default = Ss;
//# sourceMappingURL=ss.js.map