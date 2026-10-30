// Common API Response wrapper
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface ApiError {
  error?: {
    code: string;
    reasons: string[];
  };
  message?: string;
  status?: number;
}

// Auth types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface RoleResponse {
  roleId: number;
  roleName: string;
  description: string;
}

// Loan Product types
export interface LoanProductResponse {
  loanProductId: number;
  productName: string;
  maxLoanAmount: number;
  minimumIncome: number;
  interestRate: number;
  minimumTermMonths: number;
  maximumTermMonths: number;
  processingFee: number;
  description?: string;
  status: "ACTIVE" | "INACTIVE" | string;
  reviewedBy?: number;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLoanProductRequest {
  productName: string;
  maxLoanAmount: number;
  minimumIncome: number;
  interestRate: number;
  minimumTermMonths: number;
  maximumTermMonths: number;
  processingFee: number;
  description?: string;
}

// Customer types
export interface CustomerResponse {
  customerId: number;
  userId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email?: string;
  nationalId: string;
  address?: string;
  profileImage?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email?: string;
  nationalId: string;
  address?: string;
  userId?: number;
}

export interface EmploymentResponse {
  employmentId: number;
  customerId: number;
  employerName: string;
  occupation: string;
  monthlyIncome: number;
  employmentStatus: string;
  employmentType: string;
  companyAddress?: string;
  companyPhone?: string;
  yearsOfService?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmploymentRequest {
  employerName: string;
  occupation: string;
  monthlyIncome: number;
  employmentStatus: string;
  employmentType?: string;
  companyAddress?: string;
  companyPhone?: string;
  yearsOfService?: number;
}

// Loan Application types
export type ApplicationStatus =
  | "DRAFT"
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED"
  | "CANCELLED";

export interface ApplicationResponse {
  applicationId: number;
  applicationNumber: string;
  customerId: number;
  customerName?: string;
  loanProductId: number;
  productName?: string;
  requestedAmount: number;
  requestedTermMonths: number;
  loanPurpose: string;
  applicationStatus: ApplicationStatus | string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateApplicationRequest {
  customerId: number;
  loanProductId: number;
  requestedAmount: number;
  requestedTermMonths: number;
  loanPurpose: string;
}

export interface ApplicationStatusHistoryResponse {
  historyId: number;
  applicationId: number;
  fromStatus: string;
  toStatus: string;
  changedBy: number;
  comments?: string;
  changedAt: string;
}

// Risk Assessment types
export interface RiskAssessmentResponse {
  assessmentId: number;
  applicationId: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  assessmentResult: string;
  assessmentComment?: string;
  assessedBy?: number;
  assessedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRiskAssessmentRequest {
  applicationId: number;
  riskScore: number;
  riskLevel: string;
  assessmentResult: string;
  assessmentComment?: string;
}

// Guarantor types
export interface GuarantorResponse {
  guarantorId: number;
  applicationId: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber: string;
  email?: string;
  nationalId: string;
  address?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  relationshipToCustomer: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | string;
  verifiedBy?: number;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGuarantorRequest {
  applicationId: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phoneNumber: string;
  email?: string;
  nationalId: string;
  address?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  relationshipToCustomer: string;
}

// Collateral types
export interface CollateralResponse {
  collateralId: number;
  applicationId: number;
  collateralType: string;
  description: string;
  estimatedValue: number;
  ownerName: string;
  ownerNationalId?: string;
  verificationStatus: string;
  verifiedBy?: number;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCollateralRequest {
  applicationId: number;
  collateralType: string;
  description: string;
  estimatedValue: number;
  ownerName: string;
  ownerNationalId?: string;
}

// Document types
export interface DocumentResponse {
  documentId: number;
  applicationId: number;
  documentType: string;
  filePath?: string;
  originalFileName?: string;
  mimeType?: string;
  fileSize?: number;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | string;
  verifiedBy?: number;
  verificationComment?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Loan Approval & Disbursement
export interface LoanApprovalRequest {
  applicationId: number;
  approvalStatus: "APPROVED" | "REJECTED";
  decisionReason?: string;
}

export interface LoanApprovalResponse {
  approvalId: number;
  applicationId: number;
  approvedBy: number;
  approvalStatus: string;
  decisionReason?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DisburseRequest {
  disbursementMethod?: string;
  bankAccountId?: number;
  referenceNumber?: string;
  notes?: string;
}

export interface DisburseResponse {
  loanId: number;
  loanNumber: string;
  applicationId: number;
  approvedAmount: number;
  disbursedAt: string;
  status: string;
}

// Loan & Repayment types
export interface LoanResponse {
  loanId: number;
  applicationId: number;
  loanNumber: string;
  customerName?: string;
  approvedAmount: number;
  interestRate: number;
  loanTermMonths: number;
  monthlyPayment: number;
  outstandingBalance: number;
  loanStatus: "ACTIVE" | "COMPLETED" | "DEFAULTED" | "OVERDUE" | string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoanPaymentResponse {
  paymentId: number;
  loanId: number;
  loanNumber?: string;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" | string;
  paymentDate?: string;
  paymentMethod?: string;
  referenceNumber?: string;
}

export interface RepaymentRequest {
  loanId: number;
  scheduleId?: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "MOBILE_BANKING" | string;
  totalAmount: number;
  currency?: string;
  bankAccountId?: number;
  bankReference?: string;
  paidAt: string;
  receivedByEmployeeId?: number;
  idempotencyKey?: string;
  notes?: string;
}

export interface RepaymentResponse {
  repaymentId: number;
  loanId: number;
  scheduleId?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string;
  notes?: string;
}

// Schedule & Collection types
export interface SchedulePaymentItemResponse {
  paymentId: number;
  installmentNumber: number;
  dueDate: string;
  principalDue: number;
  interestDue: number;
  totalDue: number;
  amountPaid: number;
  paymentStatus: "PENDING" | "PAID" | "OVERDUE" | "PARTIAL" | string;
  paymentDate?: string;
}

export interface LoanScheduleDetailResponse {
  scheduleId: number;
  loanId: number;
  loanNumber: string;
  customerId: number;
  customerName: string;
  customerPhone?: string;
  employeeId?: number;
  employeeName?: string;
  principalAmount: number;
  currency: string;
  duration: number;
  repaymentFrequency: string;
  startDate: string;
  endDate: string;
  installmentAmount: number;
  totalSchedules: number;
  paidSchedules: number;
  remainingSchedules: number;
  totalPayableAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  progressPercentage: number;
  status: string;
  payments: SchedulePaymentItemResponse[];
}

export interface LoanScheduleItemResponse {
  scheduleId: number;
  loanId: number;
  loanNumber: string;
  customerName?: string;
  principalAmount: number;
  totalSchedules: number;
  paidSchedules: number;
  remainingSchedules: number;
  totalPayableAmount: number;
  totalPaidAmount: number;
  totalRemainingAmount: number;
  progressPercentage: number;
  status: string;
}

export interface PaginatedLoanScheduleResponse {
  items: LoanScheduleItemResponse[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface ChannelCollectionResponse {
  count: number;
  totalAmount: number;
}

export interface DailyCollectionResponse {
  employee?: {
    employeeId: number;
    employeeName: string;
  };
  date: string;
  currency: string;
  cash?: ChannelCollectionResponse;
  bankTransfer?: ChannelCollectionResponse;
  grandTotal: number;
}

// Report types
export interface DashboardResponse {
  totalCustomers: number;
  totalApplications: number;
  totalLoans: number;
  activeLoans: number;
  completedLoans: number;
  defaultedLoans: number;
  totalDisbursed: number;
  totalCollected: number;
  overduePayments: number;
}

export interface LoanReportResponse {
  loanId: number;
  loanNumber: string;
  customerName: string;
  approvedAmount: number;
  outstandingBalance: number;
  loanStatus: string;
  startDate: string;
  endDate: string;
}

export interface PaymentReportResponse {
  paymentId: number;
  loanNumber: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  paymentStatus: string;
  paymentDate?: string;
}

export interface NotificationResponse {
  notificationId: number;
  customerId?: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
