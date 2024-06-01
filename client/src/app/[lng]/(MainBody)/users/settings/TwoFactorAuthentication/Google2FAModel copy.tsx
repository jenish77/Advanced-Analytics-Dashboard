import { ScanQRCode, Submit } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { AUTH_API_URL, axiosPrivate } from "@/security/axios";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import OTPInput from "react-otp-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { Button, Form, Input, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";

const Google2FAModel = ({ open, setOpen, setStep, secret, handleSwitchChange, getProfileApi }: any) => {
  const [admin2fadata, setAdminData]: any = useState(getProfileApi);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const close = () => {
    setOpen(false);
    setStep(3);
  }

  useEffect(() => {
    setAdminData(getProfileApi)
  })

  const formik = useFormik({
    initialValues: {
      userId: "",
      type: "",
      token: "",
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = {
          userId: admin2fadata._id,
          type: admin2fadata.is_2fa_enable == true ? 2 : 1,
          token: String(values.token),
        }
        await verify2FA(response);
        queryClient.invalidateQueries(["getProfileApi"]);
      } catch (error) {
        setLoading(false); 
        toast.error("Error logging in. Please try again.");
      }
    },
  })

  const { mutateAsync: verify2FA } = useMutation(
    async (data: any) => {
      try {
        const response = await axiosPrivate.post(AUTH_API_URL.google2faCheck, data)
        if (response.status == 201) {
          setOpen(false);
          handleSwitchChange();
          setStep(1);
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error.response.data.error);
      } 
      finally {
        setLoading(false);
      }
    }
  );
  const {
    handleSubmit,
    getFieldProps,
    setFieldValue
  } = formik;

  const renderInput = (props: any) => (
    <input
      type="number"
      autoFocus={false}
      {...props}
    />
  );

  return (
    <Modal centered isOpen={open} toggle={() => close()}>
      <ModalHeader toggle={() => close()}>Google Authenticator</ModalHeader>
      <ModalBody className="main-qr-code">
        <div className="modal-toggle-wrapper d-flex align-items-center flex-column gap-4">
          <FormikProvider value={formik}>
            <Form className=" w-100" onSubmit={handleSubmit}>
              <p className="text-center mb-0">Enter your six-digit code to disable Google Authenticator</p>
              <br />
              <div className="otp-input-wrapper">
                <OTPInput
                  value={getFieldProps("token").value}
                  numInputs={6}
                  onChange={(token) => setFieldValue("token", token)}
                  shouldAutoFocus={true}
                  inputStyle="inputStyle"
                  containerStyle="containerStyle"
                  renderInput={renderInput}
                />
              </div>
              <br />
              {loading ? (
                <Button color="primary" className="mt-0" disabled>
                  <Spinner size="sm" color="light" />
                </Button>
              ) : (
                <Button color="primary" className="mt-0" type="submit">{Submit}</Button>
              )}
            </Form>
          </FormikProvider>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Google2FAModel;
