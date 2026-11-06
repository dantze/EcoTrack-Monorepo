package com.example.damiProd.dto;

/** Body of the admin's approve call: which role this person gets. */
public class ApproveRequestBody {
    private String roleName;
    /** What the requester reads out from their own screen. Required. */
    private String verificationCode;
    /** Re-enrol this existing employee instead of creating one; roleName is then ignored. */
    private Long employeeId;

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
}
