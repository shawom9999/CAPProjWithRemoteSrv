sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("emp.controller.Department", {
        onInit: function () {
            this.oRouter = this.getOwnerComponent().getRouter();
        },

        onDeptPress: function (oEvent) {
            let oSelItemObj = oEvent.getParameter("listItem").getBindingContext().getObject();
            this.oRouter.navTo("RouteEmployeeData", {
                deptId: oSelItemObj.DEPT_ID
            });
        }
    });
});
