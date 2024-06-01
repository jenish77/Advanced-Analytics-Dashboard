import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(24, "Password cannot exceed 50 characters")
    // .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]+/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]+/, "Password must contain at least one digit")
    .matches(
      /[#?!@$%^&*-]+/,
      "Password must contain at least one special character (!,@,#,$,%,^,&,*)"
    )
    .required("Password is required"),
});

// ----------------------------------------- ADD METHOD VALIDATION ----------------------------------------- //

export const addMethodValidationSchema = Yup.object().shape({
  gateway_name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z\s]+$/,
      "Gateway name can only contain alphabetic characters and spaces"
    )
    .required("Gateway name is required"),
  auto_reject: Yup.number().required("Auto Reject Minimum is required"),
  min_transaction: Yup.number()
    // .integer("Minimum transaction must be an integer")
    .min(0, "Minimum transaction must be at least 0")
    .required("Minimum transaction is required"),
  max_transaction: Yup.number()
    // .integer("Maximum transaction must be an integer")
    .min(
      Yup.ref("min_transaction"),
      "Maximum transaction must be greater than or equal to minimum transaction"
    )
    .max(99999999, "Maximum transaction must be less than or equal to 99999999")
    .required("Maximum transaction is required"),
  allow_currency: Yup.array()
    .min(1, "At least one currency must be selected")
    .required("At least one currency must be selected"),
  deposit: Yup.boolean().required("Deposit field is required"),
  withdraw: Yup.boolean().required("Withdraw field is required"),
  iFrame_access: Yup.boolean().required("iFrame access field is required"),
  image: Yup.mixed().required("Image is required"),
});

export const changepasswordValidationSchema = Yup.object().shape({
  old_password: Yup.string().trim().required("Current password is required"),
  new_password: Yup.string()
    .trim()
    .required("New password is required")
    .test(
      "passwords-match",
      "New password must be different from current password",
      function (value, context) {
        const { old_password } = context.parent;
        return value !== old_password || !old_password;
      }
    ),
  confirmPassword: Yup.string()
    .trim()
    .oneOf(
      [Yup.ref("new_password"), null],
      "Confirm password must match with new password"
    )
    .required("Confirm password is required"),
});

export const BusinessTypeValidationSchema = Yup.object().shape({
  business_type: Yup.string()
    .trim()
    .min(3, "Business type must be at least 3 characters long")
    .max(80, "Business type cannot exceed 80 characters")
    .matches(/^[a-zA-Z]+/, "Only letters are allowed")
    .required("Business type is required"),
});

export const subAdminValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .max(24, "Full name should be a maximum of 24 characters!")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password cannot exceed 50 characters")
    // .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]+/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]+/, "Password must contain at least one digit")
    .matches(
      /[#?!@$%^&*-]+/,
      "Password must contain at least one special character (!,@,#,$,%,^,&,*)"
    )
    .required("Password is required"),
  roleId: Yup.string().trim().required("Role is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf(
      [Yup.ref("password"), ""],
      "Confirm password must be match with new password"
    )
    .required("Confirm password is required"),
});

export const subAdminUpdateValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .max(24, "Full name should be a maximum of 24 characters!")
    .required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  roleId: Yup.string().trim().required("Role is required"),
});

export const addDealerValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(1, "First name must be at least 1 characters long")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(1, "Last name must be at least 1 characters long")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  company_name: Yup.string()
    .trim()
    .min(3, "Company name must be at least 3 characters long")
    .max(50, "Company name cannot exceed 100 characters")
    .required("Company name is required"),
  location: Yup.string().trim().required("Location is required"),
});

export const updateDealerValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(1, "First name must be at least 1 characters long")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(1, "Last name must be at least 1 characters long")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  company_name: Yup.string()
    .trim()
    .min(3, "Company name must be at least 3 characters long")
    .max(50, "Company name cannot exceed 50 characters")
    .required("Company name is required"),
  location: Yup.array().required("Location is required"),
  commission: Yup.string().required("Commission is required"),
  manual_commission: Yup.string()
    .trim()
    .required("Manual commission is required")
    .test(
      "is-valid-percentage",
      "Manual commission must be a number between 0 and 100",
      (value) => {
        if (!value) return true;
        const percentage = parseFloat(value);
        return !isNaN(percentage) && percentage >= 0 && percentage <= 100;
      }
    )
    .typeError("Manual commission must be a valid number"),
});

export const addDomainValidationSchema = Yup.object().shape({
  domain_name: Yup.string()
    .trim()
    .required("Domain name is required")
    .matches(
      /^(https?:\/\/)?((([a-zA-Z0-9]|(?:[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,}|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d{1,5})?)$/,
      "Invalid domain name format"
    ),
  merchant_id: Yup.string().trim().required("Merchant selection is required"),
});

export const addIpAddressValidationSchema = Yup.object().shape({
  ip_address: Yup.string()
    .trim()
    .required("IP address is required")
    .matches(
      /^(https?:\/\/)?((([a-zA-Z0-9]|(?:[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,}|((localhost)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d{1,5})?)$/,
      "Invalid IP address format"
    ),
  merchant_id: Yup.string().trim().required("Merchant selection is required"),
  country: Yup.string().required("Country selection is required"),
});

export const addCurrencyValidationSchema = Yup.object().shape({
  currency_code: Yup.string()
    .trim()
    .matches(/^[^\d\s]+$/, "Please enter valid Currency code.")
    .required("Currency code is required")
    .min(2, "Currency code must be at least 2 characters"),
  currency_name: Yup.string()
    .trim()
    .min(3, "Currency name must be at least 3 characters")
    .max(50, "Currency name must be at most 50 characters")
    .required("Currency name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Currency name must only contain letters and spaces"
    ),
  symbol: Yup.string()
    .trim()
    .required("Currency symbol is required")
    .matches(/^[^\s]+$/, "Currency symbol cannot contain spaces"),
  country: Yup.string().required("Country selection is required"),
});

export const addBankValidationSchema = Yup.object().shape({
  user_name: Yup.string().trim().required("User selection is required"),
  approval_type: Yup.string()
    .trim()
    .required("Approval type selection is required"),
  company_name: Yup.string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(50, "Company name must be at most 50 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Company name can only contain alphabetic characters and spaces"
    )
    .required("Company name is required"),
  bank_name: Yup.string()
    .trim()
    .min(2, "Bank name must be at least 2 characters")
    .max(50, "Bank name must be at most 50 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Bank name can only contain alphabetic characters and spaces"
    )
    .required("Bank name is required"),
  limit: Yup.number()
    .integer("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(500000, "Account owner must be at most 500000 characters")
    .required("Limit is required"),
  account_owner: Yup.string()
    .trim()
    .min(2, "Account owner must be at least 2 characters")
    .max(50, "Account owner must be at most 50 characters")
    .matches(
      /^[A-Za-z\s]+$/,
      "Account owner can only contain alphabetic characters and spaces"
    )
    .required("Account owner is required"),
  account_IBAN: Yup.string()
    .trim()
    .matches(
      /^[0-9]{6,30}$/,
      "Invalid account IBAN format. It should be between 6 to 30 digits."
    )
    .required("account IBAN is required"),
  api: Yup.string()
    .trim()
    .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Invalid API URL format")
    .required("API URL is required"),
});

export const addCommissionValidationSchema = Yup.object().shape({
  percentage: Yup.string()
    .trim()
    .required("Percentage is required")
    .test(
      "is-valid-percentage",
      "Percentage must be a number between 0 and 100",
      (value) => {
        if (!value) return true;
        const percentage = parseFloat(value);
        return !isNaN(percentage) && percentage >= 0 && percentage <= 100;
      }
    )
    .typeError("Percentage must be a valid number"),
});

// =================================== MERCHANT VALIDATION =================================== //

export const addMerchantValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(3, "Last name must be at least 3 characters long")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  business_name: Yup.string()
    .trim()
    .min(3, "Company name must be at least 3 characters long")
    .max(50, "Company name cannot exceed 50 characters")
    .required("Company name is required"),
  location: Yup.string().trim().required("Location is required"),
  business_type: Yup.string().trim().required("Business type is required"),
  allow_currency: Yup.array()
    .min(1, "At least one currency must be selected")
    .required("At least one currency must be selected"),
  dealer: Yup.string().trim().required("Dealer is required"),
  deposit: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one deposit option must be selected"),
  withdraw: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one withdraw option must be selected"),
});

export const updateMerchantValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "First name must contain only letters")
    .min(3, "First name must be at least 3 characters long")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),
  last_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, "Last name must contain only letters")
    .min(3, "Last name must be at least 3 characters long")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Must be a valid email address")
    .required("Email address is required"),
  business_name: Yup.string()
    .trim()
    .min(3, "Company name must be at least 3 characters long")
    .max(50, "Company name cannot exceed 50 characters")
    .required("Company name is required"),
  location: Yup.string().trim().required("Location is required"),
  business_type: Yup.string().trim().required("Business type is required"),
  allow_currency: Yup.array()
    .min(1, "At least one currency must be selected")
    .required("At least one currency must be selected"),
  dealer: Yup.string().trim().required("Dealer is required"),
  deposit: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one deposit option must be selected"),
  withdraw: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one withdraw option must be selected"),
});

export const addIframeValidationSchema = Yup.object().shape({
  user_id: Yup.string()
    .trim()
    .min(3, "User id must be at least 3 characters long")
    .max(10, "User id cannot exceed 10 characters")
    .required("User id is required"),
  user_name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]+(\s+[A-Za-z]+)?$/,
      "User name must contain only letters"
    )
    .min(3, "User name must be at least 3 characters long")
    .max(50, "User name cannot exceed 50 characters")
    .required("User name is required"),
  iframe_name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z]+(\s+[A-Za-z]+)?$/,
      "Iframe name must contain only letters"
    )
    .min(3, "Iframe name must be at least 3 characters long")
    .max(50, "Iframe name cannot exceed 50 characters")
    .required("Iframe name is required"),
  url: Yup.string()
    .trim()
    .matches(/^(ftp|http|https):\/\/[^ "]+$/, "Invalid URL format")
    .required("URL is required"),
  method_id: Yup.string().trim().required("Method selection is required"),
});
