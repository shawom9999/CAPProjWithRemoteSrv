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

        return Controller.extend("emp.controller.EmpDetail", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteEmpDetail").attachPatternMatched(this._onRouteMatched, this);
                this.oGlobalBusyDialog = new sap.m.BusyDialog();
            },

            _onRouteMatched: function (oEvent) {                
                this.oGlobalBusyDialog.open();
                let empId = oEvent.getParameter("arguments").empId;
                this._empId = typeof(empId) === 'string' ? parseInt(empId) : empId;
                this.getView().getParent().getParent().setMode("HideMode");

                if (this._empId) {
                    this.handleViewBinding(empId).then(() => {
                        let oContext = this.getView().getBindingContext(),
                            oObject = oContext.getObject(),
                            aSkills = oObject.SKILLS.map(oItem => oItem.DESCR);
                        this.oGlobalBusyDialog.close();
                        this.getView().setModel(new JSONModel({
                            "SKILLS": aSkills
                        }), "oEmpDetailModel");
                        
                    });
                } 
            },

             /**
             * Function for handling binding of the view
             */
             handleViewBinding: function (empId) {
                return new Promise((resolve, reject) => {
                    this.getView().bindElement({
                        path: "/Employees(" + empId + ")",
                        parameters: {
                            $expand: {
                                "LINK_TO_DEPARTMENT": {},
                                "SKILLS": {
                                    $select: "DESCR"
                                }
                            },
                            $select: "EMP_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,PHONE,EMAIL,DATEOFBIRTH,DEPT_ID",
                            $$updateGroupId: "empGroup"
                        },
                        events: {
                            dataReceived: function () {
                                resolve();
                            }.bind(this)
                        }
                    });
                });
            },

            onCancelPress: function () {
                this.oRouter.navTo("RouteDepartment");
                this.getView().getParent().getParent().setMode("ShowHideMode");
            },

            onSaveEmp: function () {
                let oView = this.getView(),
                    oController = this,
                    aSkills = [],
                    oEmpDetailModelData = oView.getModel("oEmpDetailModel").getData();
                
                sap.ui.getCore().getMessageManager().removeAllMessages();

                if (oEmpDetailModelData.SKILLS?.length > 0) {
                    aSkills = oEmpDetailModelData.SKILLS.split(",");
                    this._saveEmpSkills(aSkills);
                } else {
                    MessageBox.error("Please add skills to continue");
                    return;
                }

                this.oGlobalBusyDialog.open();
                oView.getModel().submitBatch("empGroup").then(function () {
                    oController.oGlobalBusyDialog.close();
                    MessageBox.success(`Employee ${oController._empId} \n updated successfully`,{
                        onClose: function () {
                            oView.getParent().getParent().setMode("ShowHideMode");
                            oController.oRouter.navTo("RouteDepartment");
                        }
                    });   
                }).catch(function (err) {
                    oController.oGlobalBusyDialog.close();
                    MessageBox.error(err.toString());
                });
            },

            _saveEmpSkills: function (aSkills) {
                let oController = this,
                    oView = oController.getView(),
                    oContext = oView.getBindingContext(),
                    aSavedSkills = oContext.getObject().SKILLS.map(oType => oType.DESCR),
                    bIsModified = false;

                //check if there were actual changes, only then update the Projects
                //check if something was added
                for (var skill of aSkills) {
                    if (!aSavedSkills.includes(skill)) {
                        bIsModified = true;
                        break;
                    }
                }

                //check if something was deleted
                if (aSavedSkills.length !== aSkills.length) {
                    bIsModified = true;
                }

                if (bIsModified) {               
                    let aModSkills = aSkills.map(oItem => {
                        return {
                            EMP_EMP_ID: oController._empId,
                            DESCR: oItem
                        }
                    });
                    let oUpdateAction = oView.getModel().bindContext("CatalogService.updateSelectedSkills(...)",
                        oContext, {
                        $$updateGroupId: "empGroup"
                    });

                    oUpdateAction.setParameter("selectedSkill", aModSkills);

                    oUpdateAction.execute("empGroup").catch(function (err) {
                        console.log(err)
                    });
                }

            }

        // End   

    });
});