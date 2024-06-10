module.exports = (srv => {
    const {
        EMP_SKILLS
    } = cds.entities('db');

    srv.on("CREATE", "Employees", async (req) => {
        try {
            let query = await cds.run(`SELECT MAX(EMP_ID) from DB_EMPLOYEES`);
            req.data.EMP_ID = query[0]["MAX(EMP_ID)"] + 1;
            await cds.run(req.query);
            req.reply(req.data);
        } catch (err) {
            throw err;
        }
    });
    
    srv.on("updateSelectedSkills", "Employees", async (req) => {
        try {
            const empId = req.params[0].EMP_ID;
            let aSelSkills = req.data.selectedSkill;

            await cds.run(`DELETE from DB_EMP_SKILLS where EMP_EMP_ID = ?`, [empId]).catch((error) => {
                throw error;
            });
            if (aSelSkills.length > 0) {
                await cds.run(INSERT.into(EMP_SKILLS).entries(aSelSkills)).catch((error) => {
                    throw error;
                });
            }
        } catch (err) {
            throw err;
        }
    });

    srv.on("READ", "BusinessPartner", async (req) => {
        const businessPartner = await cds.connect.to('API_BUSINESS_PARTNER');
        return businessPartner.run(req.query);
    });
})
