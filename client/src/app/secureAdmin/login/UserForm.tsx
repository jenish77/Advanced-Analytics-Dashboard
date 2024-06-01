import { EmailAddressLogIn, Loading, Password, RememberPassword, SignIn, SignInToAccount } from "@/Constant";
import { useAppSelector } from "@/Redux/Hooks";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import imageOne from "../../../../public/assets/images/logo.png";
import imageTwo from "../../../../public/assets/images/logo.png";
import { FormikProvider, useFormik, Form, ErrorMessage } from "formik";
import { loginValidationSchema } from "../../../Components/validation/validation";
import { useMutation } from "react-query";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { AUTH_API_URL } from "@/security/axios";
import { authStore } from "@/context/AuthProvider";
import OTPInput from "react-otp-input";

export const UserForm = () => {
  const { i18LangStatus } = useAppSelector((store) => store.langSlice);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { setAdminData, updatePageTitle } = authStore();
  const [open, setOpen] = useState(false);
  const [loginResponseData, setLoginResponseData]: any = useState();

  const close = () => {
    setOpen(false);
  }

  const handleOpen = async () => {
    setOpen(true);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      type: 1,
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await loginApi(values);
      } catch (error) {
        toast.error("Error logging in. Please try again.");
      }
    },
  })

  const { mutateAsync: loginApi } = useMutation(
    async (data: any) => {
      setIsLoading(true)
      try {
        const response = await axiosPrivate.post(AUTH_API_URL.login, data);
        setLoginResponseData(JSON.parse(response?.data));
        const loginData = JSON.parse(response?.data);
        if (loginData?.admindata?.is_2fa_enable == true) {
          handleOpen();
        } else {
          setIsLoading(false)
          Cookies.set("admin_email", JSON.stringify(true));
          setAdminData(JSON.parse(response?.data));
          toast.success("login successful");
          updatePageTitle('Dashboard')
          router.push(`/en/dashboard`);
        }
      } catch (error) {

        setIsLoading(false);

        const errorData = error?.response.data;

        if (Object.keys(errorData?.error).length) {
          Object.keys(errorData?.error).forEach((key) => {
            setFieldError(key, errorData?.error[key]);
          });
        }
        if (errorData?.error) {
          toast.error(errorData?.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  );

  const {
    handleSubmit,
    getFieldProps,
    setFieldError,
    resetForm
  } = formik;


  // 2Fa

  const [secretCode, setSecretCode] = useState();

  const handleInputChange = async (token: any) => {
    setSecretCode(token);
    if (token.length === 6) {
      const data = {
        userId: loginResponseData?.admindata?.id,
        token: String(token),
      };
      setIsLoading(true);
      setTimeout(async () => {
        try {
          await handleVerify2FA(data);
        } catch (error) {
          toast.error("Error logging in. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }, 3000);
      // await handleVerify2FA(data);
    }
  };

  const handleVerify2FA = async (data: any) => {
    try {
      const response = await axiosPrivate.post(AUTH_API_URL.google2faCheckLoginTime, data);
      if (response.status === 201) {
        setOpen(false);
        Cookies.remove("admin_email");
        Cookies.set("admin_email", JSON.stringify(true));
        Cookies.remove("access_token");
        setAdminData(JSON.parse(response?.data));
        toast.success("Login successful");
        updatePageTitle('Dashboard');
        setTimeout(() => {
          router.push(`/en/dashboard`);
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      const errorData = error?.response.data;
      toast.error(errorData?.message || "Invalid OTP code. Please try again.");
      if (Object.keys(errorData?.error).length) {
        Object.keys(errorData?.error).forEach((key) => {
          setFieldError(key, errorData?.error[key]);
        });
      }
    }
  };

  const { mutateAsync: verify2FA } = useMutation(
    async (data: any) => {
      try {
        const response = await axiosPrivate.post(AUTH_API_URL.google2faCheckLoginTime, data)
        if (response.status == 201) {
          setOpen(false);
          Cookies.remove("admin_email");
          Cookies.set("admin_email", JSON.stringify(true));
          Cookies.remove("access_token");
          setAdminData(JSON.parse(response?.data));
          toast.success("login successful");
          updatePageTitle('Dashboard')
          setTimeout(() => {
            router.push(`/en/dashboard`);
          }, 1000);
        }
      } catch (error) {
        setIsLoading(false);
        const errorData = error?.response.data;
        toast.error(errorData?.message);
        if (Object.keys(errorData?.error).length) {
          Object.keys(errorData?.error).forEach((key) => {
            setFieldError(key, errorData?.error[key]);
          });
        } else if (errorData?.error) {
          toast.error(errorData?.message);
        }
      }
    }
  );

  const renderInput = (props: any) => (
    <input
      type="number"
      autoFocus={false}
      {...props}
    />
  );

  return (
    <div>

      <div className="login-main">
        <div>
          <Link className="logo" href={`/${i18LangStatus}/dashboard`}>
            <img className="img-fluid for-light" src={imageOne.src} alt="login page" />
            <img className="img-fluid for-dark" src={imageTwo.src} alt="login page" />
          </Link>
        </div>
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit} className="theme-form" autoComplete="off">
            <h4>{SignInToAccount}</h4>
            <p>Enter your email & password to login</p>
            <FormGroup>
              <Label className="col-form-label">{EmailAddressLogIn}</Label>
              <Input type="email" {...getFieldProps("email")} placeholder="Enter email address" />
              <ErrorMessage name="email" component="span" className="pt-1 text-danger" />

            </FormGroup>
            <FormGroup>
              <Label className="col-form-label">{Password}</Label>
              <div className="position-relative">
                <Input type={show ? "text" : "password"} {...getFieldProps("password")} placeholder="Enter password" />
                <div className="show-hide" onClick={() => setShow(!show)}><span className={show ? "hide" : "show"}> </span></div>
                <ErrorMessage name="password" component="span" className="pt-1 text-danger" />

              </div>
            </FormGroup>
            <FormGroup className="mb-0">
              {/* <div className="checkbox p-0">
                <Input id="checkbox1" type="checkbox" />
                <Label className="text-muted" htmlFor="checkbox1">{RememberPassword}</Label>
              </div> */}
              <div className="text-end mt-3">
                <Button color="primary" block className="w-100" type="submit" disabled={isLoading}>{isLoading == true ? Loading : SignIn}</Button>
              </div>
            </FormGroup>
          </Form>
        </FormikProvider>
        <Modal centered isOpen={open} toggle={() => close()}>
          <ModalHeader toggle={() => close()}>Google Authenticator</ModalHeader>
          <ModalBody className="main-qr-code">
            <div className="modal-toggle-wrapper d-flex align-items-center flex-column">
              <FormikProvider value={formik}>
                <p className="text-center mb-0">Enter your six-digit code to verify Google Authenticator</p>
                <br />
                <div className="otp-input-wrapper">
                  <OTPInput
                    value={secretCode}
                    numInputs={6}
                    onChange={handleInputChange}
                    shouldAutoFocus={true}
                    containerStyle="containerStyle"
                    inputStyle="inputStyle"
                    renderInput={renderInput}
                  />
                </div>
                <br />
                {isLoading && (
                  <Button color="primary" className="mt-0" disabled>
                    <Spinner size="sm" color="light" />
                  </Button>
                )}
              </FormikProvider>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};
