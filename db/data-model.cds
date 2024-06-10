using {cuid, managed} from '@sap/cds/common';

namespace db;

entity EMPLOYEES: managed {
  key EMP_ID        : Integer64;
      FIRST_NAME    : String(32);
      MIDDLE_NAME   : String(32);
      LAST_NAME     : String(32);
      PHONE         : Integer64;
      EMAIL         : String(100);
      DATEOFBIRTH   : Date;
      DEPT_ID       : Integer64;
      SKILLS        : Composition of many EMP_SKILLS on SKILLS.EMP = $self;
      LINK_TO_DEPARTMENT : Association to one DEPARTMENTS on LINK_TO_DEPARTMENT.DEPT_ID = DEPT_ID;
}

entity DEPARTMENTS {
  key DEPT_ID       : Integer64;
    DEPT_NAME       : String(100);
}

entity EMP_SKILLS: cuid {
    DESCR      : String(100);  
    EMP        : Association to EMPLOYEES;
}