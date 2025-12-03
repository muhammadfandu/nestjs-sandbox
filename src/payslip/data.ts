export const MOCK_PAYSLIP = {
    "id": "a63248c6-4ba7-4b97-9c88-fd10747037b0",
    "baseSalary": 0,
    "overtimeSalary": 0,
    "workHours": "00:00:00",
    "overtimeHours": "00:00:00",
    "payrollId": "6a326766-261b-45e0-8518-d97ebba2c6ad",
    "totalEarnings": 180,
    "totalDeduction": 0,
    "totalSalary": 180,
    "userId": "97959108-26a6-11f0-a1d7-0242ac12000f",
    "organisationId": "9777eff2-26a6-11f0-a1d7-0242ac12000f",
    "createdAt": 1747796645,
    "updatedAt": 1747796685,
    "components": [
        {
            "id": "7ca60d4c-6425-4dd3-af90-0d8aa1727cc7",
            "amount": 0,
            "metadata": null,
            "notes": null,
            "payComponentConfig": {
                "id": "07c44275-830f-4149-8cee-0ac5e20c22e1",
                "name": "CPF Employer Contribution",
                "type": "EMPLOYER_CONTRIBUTION",
                "description": null,
                "generated": "employee-social-security"
            }
        },
        {
            "id": "84cb5ea7-7a4e-4de8-bacd-c2a866d6876d",
            "amount": 0,
            "metadata": null,
            "notes": null,
            "payComponentConfig": {
                "id": "7cb04b65-1f28-438a-915d-8adc301b792f",
                "name": "CPF Employee Contribution",
                "type": "DEDUCTION",
                "description": null,
                "generated": "employee-social-security"
            }
        },
        {
            "id": "fa945ff2-8c5b-4934-9979-dbf84d2e14bc",
            "amount": 180,
            "metadata": null,
            "notes": "",
            "payComponentConfig": {
                "id": "09713fad-2726-4c73-89a9-3507fbf480f9",
                "name": "Bonus",
                "type": "EARNING",
                "description": "Additional bonus",
                "generated": "none"
            }
        }
    ],
    "payroll": {
        "id": "6a326766-261b-45e0-8518-d97ebba2c6ad",
        "payDate": 1748624400,
        "status": "PENDING",
        "startDate": 1746032400,
        "endDate": 1748710800,
        "payrollType": {
            "id": "3f180fdc-9110-4444-86ec-a89626f530cf",
            "name": "Time-based Contract",
            "description": "Payroll type for time-based contract",
            "organisationId": "9777eff2-26a6-11f0-a1d7-0242ac12000f",
            "createdAt": 1747796489,
            "updatedAt": 1747796489
        }
    },
    "user": {
        "id": "97959108-26a6-11f0-a1d7-0242ac12000f",
        "name": "Jinawi Yim",
        "departmentId": "0ad95498-c598-4f20-8d34-6bcdfd1a8d77",
        "departmentName": "IT",
        "roleId": "0ac9680c-828a-4fee-a65d-f22e8512208e",
        "roleName": "Manager"
    }
}