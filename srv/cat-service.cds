using db from '../db/data-model';
using { API_BUSINESS_PARTNER } from './external/API_BUSINESS_PARTNER';

@path: '/catalog'
service CatalogService {

    entity Departments as projection on db.DEPARTMENTS;
    entity EmpSkills   as projection on db.EMP_SKILLS;

    entity Employees   as
        projection on db.EMPLOYEES {
            *,
            LINK_TO_DEPARTMENT : redirected to Departments
        }
        actions {
            action updateSelectedSkills(selectedSkill : array of {
                EMP_EMP_ID : Integer64;
                DESCR : String(100)
            });
        };

    entity BusinessPartner as projection on API_BUSINESS_PARTNER.A_BusinessPartner;

}
