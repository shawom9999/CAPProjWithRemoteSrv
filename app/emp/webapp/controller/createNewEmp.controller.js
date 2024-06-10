
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("emp.controller.createNewEmp", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteNewEmpCreation").attachPatternMatched(this._onRouteMatched, this);
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },

            _onRouteMatched: function () {
                let oCreateEmpModel = this._createEmpModel();                
                this.getView().setModel(oCreateEmpModel, "oCreateEmpModel");
                this.getView().getParent().getParent().setMode("HideMode");
            },

            _createEmpModel: function () {
                return new JSONModel ({
                    "FIRST_NAME": "",
                    "MIDDLE_NAME": "",
                    "LAST_NAME": "",
                    "EMAIL": null,
                    "PHONE": null,
                    "DATEOFBIRTH": null,
                    "DEPT_ID": null,
                    "SKILLS": null
                });
            },

            onCancelPress: function () {
                this.oRouter.navTo("RouteDepartment");
                this.getView().getParent().getParent().setMode("ShowHideMode");
            },

            onSaveEmp: function () {
                let oView = this.getView(),
                    oController = this,
                    oCreateEmpModel = oView.getModel("oCreateEmpModel"),
                    oCreateEmpModelData = oCreateEmpModel.getData(),
                    aSkills = oCreateEmpModelData.SKILLS ? oCreateEmpModelData.SKILLS.split(",") : [];
                
                sap.ui.getCore().getMessageManager().removeAllMessages();

                if (aSkills?.length === 0) {
                    MessageBox.error("Please add skills to continue");
                    return;
                } else {
                    aSkills = aSkills.map(oItem => {
                        return {DESCR: oItem}
                    });
                }

                this.oGlobalBusyDialog.open();
                let oEmpObject = {
                    FIRST_NAME: oCreateEmpModelData.FIRST_NAME,
                    MIDDLE_NAME: oCreateEmpModelData.MIDDLE_NAME,
                    LAST_NAME: oCreateEmpModelData.LAST_NAME,
                    EMAIL: oCreateEmpModelData.EMAIL,
                    DATEOFBIRTH: oCreateEmpModelData.DATEOFBIRTH,
                    PHONE: parseInt(oCreateEmpModelData.PHONE),
                    // DEPT_ID: parseInt(oCreateEmpModelData.DEPT_ID.replace(",","")),
                    DEPT_ID: parseInt(oCreateEmpModelData.DEPT_ID),
                    SKILLS: aSkills
                }
                
                let oBinding = oView.getModel().bindList(
                    "/Employees",
                    undefined,
                    undefined,
                    undefined, {
                    $$updateGroupId: 'empGroup'
                });

               var oContext = oBinding.create(oEmpObject);

                oView.getModel().submitBatch("empGroup").then(function () {
                    let oObject = oContext.getObject();
                    oCreateEmpModel.setProperty("/EMP_ID", oObject.EMP_ID);
                    oController.oGlobalBusyDialog.close();
                    MessageBox.success(`Employee ${oObject.EMP_ID} \n created successfully`,{
                        onClose: function () {
                            oView.getParent().getParent().setMode("ShowHideMode");
                            oController.oRouter.navTo("RouteDepartment");
                        }
                    });
                }).catch(function (err) {
                    oController.oGlobalBusyDialog.close();
                    MessageBox.error(err.toString());
                }); 
            }
            
        });
    });
