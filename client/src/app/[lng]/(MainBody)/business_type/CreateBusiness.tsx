import CommonModal from "@/Components/UiKits/Modal/Common/CommonModal";
import React, { FC, SetStateAction, useState } from "react";
import { Button, CardBody, Col, Form, FormGroup, Input, Label, Row, } from "reactstrap";
import { FormikProvider, useFormik, ErrorMessage } from "formik";
import { BUSINESS_TYPE_URL } from "@/security/axios";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { BusinessTypeValidationSchema } from "@/Components/validation/validation";

type Props = {
  createBusinessModalOpen: boolean;
  refetch: any;
  setCreateBusinessModalOpen: React.Dispatch<SetStateAction<boolean>>;

};

const CreateBusinessType: FC<Props> = ({
  createBusinessModalOpen,
  refetch,
  setCreateBusinessModalOpen,

}) => {
  const modalToggle = () => {
    setCreateBusinessModalOpen(!createBusinessModalOpen);
    setErrors({})
    resetForm();
  }
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const Title = () => (
    <div className="d-flex justify-center align-items-center gap-2">
      <i className="fa fa-plus" />
      Create Business Type
    </div>
  );
  const formik = useFormik({
    initialValues: {
      business_type: "",
    },
    validationSchema: BusinessTypeValidationSchema,
    onSubmit: async (values) => {
      try {
        await CreateBusinessTypeApi({
          ...values,
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { mutateAsync: CreateBusinessTypeApi } = useMutation(
    async (data: any) => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.post(BUSINESS_TYPE_URL.addbusinesstype, data);
        if (response.status == 201) {
          toast.success("Business type created successfully");
          refetch()
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
        } else if (errorData?.error) {
          toast.error(errorData?.message);
        }
        if (errorData.statusCode == 403) {
          toast.error("Permission Denied");
          modalToggle()
          resetForm()
        }
        setIsLoading(false);

      }
    }
  );

  const {
    getFieldProps,
    setFieldError,
    touched,
    errors,
    values,
    resetForm,
    handleSubmit,
    setErrors
  } = formik;

  //   const Footer = () => (
  //     <Button color="primary pt-2 pb-2" onClick={modalToggle} type="submit">Change Password</Button>
  //     <Button color="primary pt-2 pb-2" type="submit">
  //       Change Password
  //     </Button>
  //   );

  //   console.log(values);

  return (
    <CommonModal isOpen={createBusinessModalOpen} toggle={modalToggle} sizeTitle={<Title />} modalBodyClassName="dark-modal">
      <FormikProvider value={formik}>
        <Form className="g-3" onSubmit={handleSubmit}>
          <Row>
            <Col sm="12">
              <FormGroup>
                <Label htmlFor="username">Business Type</Label>
                <Input type="text" placeholder="Enter Business Type" {...getFieldProps("business_type")} errorMsg={errors.business_type && touched.business_type && errors.business_type} />
                <ErrorMessage name="business_type" component="span" className="pt-1 text-danger" />
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2">
            <Button color="primary pt-2 pb-2" onClick={modalToggle}>
              Close
            </Button>
            <Button color="primary pt-2 pb-2" type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : "Submit"}
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </CommonModal>
  );
};

export default CreateBusinessType;
