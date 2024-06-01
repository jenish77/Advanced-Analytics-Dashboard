import CommonModal from "@/Components/UiKits/Modal/Common/CommonModal";
import { changepasswordValidationSchema } from "@/Components/validation/validation";
import { ChangePasswordButton } from "@/Constant";
import { AUTH_API_URL } from "@/security/axios";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import React, { FC, SetStateAction, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Button, Col, Form, FormGroup, Input, Label, Row, Spinner } from "reactstrap";

type Props = {
  changePasswordModalOpen: boolean;
  setChangePasswordModalOpen: React.Dispatch<SetStateAction<boolean>>;
};

const ChangePassword: FC<Props> = ({
  changePasswordModalOpen,
  setChangePasswordModalOpen,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const modalToggle = () => {
    resetForm();
    setChangePasswordModalOpen(!changePasswordModalOpen);
  }

  const axiosPrivate = useAxiosPrivate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const Title = () => (
    <div className="d-flex justify-center align-items-center gap-2">
      <i className="fa fa-plus" />
      Change Password
    </div>
  );

  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirmPassword: "",
    },
    validationSchema: changepasswordValidationSchema,
    onSubmit: async (values: any) => {
      try {
        await changePasswordApi(values);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutateAsync: changePasswordApi } = useMutation(async (data: any) => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.post(AUTH_API_URL.changePassword, data);
      if (response.status == 201) {
        toast.success("Password changed successfully");
        resetForm();
        modalToggle();
        setIsLoading(false);
      }
    } catch (error) {
      const errorData = error?.response.data;
      if (Object.keys(errorData?.error).length) {
        Object.keys(errorData?.error).forEach((key) => {
          setFieldError(key, errorData?.error[key]);
        });
      }
      if (errorData?.error) {
        toast.error(errorData?.message);
      }
      if (errorData.statusCode == 403) {
        toast.error("Permission Denied");
        modalToggle()
        resetForm()
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    } // toast.error(error.response.data.message);
  });

  const {
    getFieldProps,
    resetForm,
    handleSubmit,
    setFieldError,
  } = formik;

  return (
    <CommonModal size="lg" isOpen={changePasswordModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
      <FormikProvider value={formik}>
        <Form className="g-3" onSubmit={handleSubmit}>
          <Row>
            <Col sm="12">
              <FormGroup>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="position-relative">
                  <Input type={showCurrentPassword ? "text" : "password"} autoComplete={showCurrentPassword ? 'off' : 'password'} {...getFieldProps("old_password")} />
                  {!showCurrentPassword ? (
                    <FaEyeSlash
                      className='view-icon'
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  ) : (
                    <FaEye
                      className='view-icon'
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                  )}
                </div>
                <ErrorMessage name="old_password" component="span" className="pt-1 text-danger" />
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup>
                <Label htmlFor="new-password">New Password</Label>
                <div className="position-relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    autoComplete={showNewPassword ? 'off' : 'password'}
                    {...getFieldProps("new_password")}
                  />
                  {!showNewPassword ? (
                    <FaEyeSlash
                      className='view-icon'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  ) : (
                    <FaEye
                      className='view-icon'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  )}
                </div>
                <ErrorMessage name="new_password" component="span" className="pt-1 text-danger" />
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="position-relative">
                  <Input type={showConfirmPassword ? "text" : "password"} autoComplete={showConfirmPassword ? 'off' : 'password'}{...getFieldProps("confirmPassword")} />
                  {!showConfirmPassword ? (
                    <FaEyeSlash
                      className='view-icon'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  ) : (
                    <FaEye
                      className='view-icon'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  )}
                </div>
                <ErrorMessage name="confirmPassword" component="span" className="pt-1 text-danger" />
              </FormGroup>
            </Col>
            <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
              <Button color="primary pt-2 pb-2" onClick={modalToggle}>Close</Button>
              {isLoading ? (
                <Button color="primary" className="mt-0" disabled>
                  <Spinner size="sm" color="light" />
                </Button>
              ) : (
                <Button color="primary" className="mt-0" type="submit">{ChangePasswordButton}</Button>
              )}
            </div>
          </Row>
        </Form>
      </FormikProvider>

    </CommonModal>
  );
};

export default ChangePassword;
