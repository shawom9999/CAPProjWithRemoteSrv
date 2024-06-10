sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, MessageBox) {
        "use strict";

        return Controller.extend("emp.controller.EmpMaster", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteDepartment").attachPatternMatched(this._onRebindEmpTable, this);
                this.oRouter.getRoute("RouteEmployeeData").attachPatternMatched(this._onRouteMatched, this);
            },

            _onRebindEmpTable: function () {
                let deptEmpTable = this.getView().byId("deptEmpTable");
                deptEmpTable.getBinding("items").filter();
                deptEmpTable.getBinding("items").refresh();
            },

            _onRouteMatched: function (oEvent) {
                let deptId = oEvent.getParameter("arguments").deptId,
                    deptEmpTable = this.getView().byId("deptEmpTable");

                if (deptId) {
                    let aFilters = [new Filter('DEPT_ID', "EQ", deptId)];
                    deptEmpTable.getBinding("items").filter(aFilters);                    
                }
            },

            handleEmpTableUpdateFinished: function (oEvent) {
                let tabLength = oEvent.getParameter("total"),
                    headerText = `List Of Employees (${tabLength})`;
                this.getView().byId("deptEmpTableTitle").setText(headerText);
            },

            onEmpCreate: function () {
                this.oRouter.navTo("RouteNewEmpCreation");
                this.getView().getParent().getParent().setMode("HideMode");
            },

            navigateToEmpDetail: function (oEvent) {
                let oItem = oEvent.getParameters().listItem,
                    oSelectedObject = oItem.getBindingContext().getObject(),
                    empId = parseInt(oSelectedObject.EMP_ID);
                this.oRouter.navTo("RouteEmpDetail", {
                    empId : empId
                });
            },
            
            onEmpDelete: function () {
                let deptEmpTable = this.getView().byId("deptEmpTable"),
                    selItem = deptEmpTable.getSelectedItem();
                if (selItem) {
                    MessageBox.confirm(
                        "Are you sure you want to delete selected items?", {
                        onClose: function (oAction) {
                            if (oAction === "OK") {
                                selItem.getBindingContext().delete("$auto")
                                .then(() => {
                                    MessageBox.success("Employee Deleted successfully");
                                })
                                .catch(err => {
                                    MessageBox.error(err);
                                });
                            } else {
                                deptEmpTable.removeSelections();
                            }                      
                        }
                    });
                    
                } else {
                    MessageBox.error("Please select an employee row to delete");
                }
            },

            handleInitialView: function () {
                this.oRouter.navTo("RouteDepartment");
            }
            
        });
    });