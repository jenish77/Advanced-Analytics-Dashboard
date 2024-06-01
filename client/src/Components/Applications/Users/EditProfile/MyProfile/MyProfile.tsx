import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { Bio, MyProfiles, Save } from "@/Constant";
import CommonUserFormGroup from "../Common/CommonUserFormGroup";
import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { useMemo, useState } from "react";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { AUTH_API_URL } from "@/security/axios";
import { PhoneInput } from "react-international-phone";
import { authStore } from "@/context/AuthProvider";
import * as Yup from 'yup';

const MyProfile = () => {

  // ------------------------------- VARIABLES ------------------------------- //

  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [initialValues, setInitialValues] = useState({});
  const { adminData, updateAdminProfile } = authStore();

  // ------------------------------- COMMON FUNCTIONS ------------------------------- //

  const getAdminData: any = useMemo(() => ["getAdminData", adminData], [adminData]);
  // const { data: getAdminDataApi, isFetching, refetch } = useQuery(
  //   getAdminData,
  //   async () => {
  //     const response = await axiosPrivate.get(
  //       AUTH_API_URL.getProfile
  //     );
  //     const dataResponseObject: any = {
  //       _id: adminData?._id,
  //       email: response.data.email,
  //       fullName: response.data.fullName,
  //       bio: response.data.bio,
  //       mobile: response.data.mobile
  //     }
  //     setInitialValues({ email: dataResponseObject.email, fullName: dataResponseObject.fullName, bio: dataResponseObject.bio, mobile: dataResponseObject.mobile })
  //     setPhone(dataResponseObject.mobile);
  //     return dataResponseObject
  //   },
  //   {
  //     enabled: true,
  //     refetchOnWindowFocus: false,
  //     retry: false,
  //   }
  // );

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .min(2, 'Full Name must be at least 2 characters long')
      .max(50, 'Full Name cannot be longer than 50 characters')
      .matches(
        /^[A-Za-z\s]+$/,
        "Full Name can only contain alphabetic characters and spaces"
      )
      .required("Full Name is required"),
    bio: Yup.string()
      .trim()
      .min(2, 'Bio must be at least 2 characters long')
      .max(255, 'Bio cannot be longer than 255 characters')
      .matches(
        /^(?!\s*$)[\s\S]*$/,
        "Bio cannot be only spaces"
      )
      .required("Bio is required"),
    mobile: Yup.string()
      .required('Mobile is required'),
  });

  // ------------------------------- FORMIK FUNCTIONS ------------------------------- //

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: async (values: any) => {
      // let object;
      // if (phone.length <= 4) {
      //   delete values.mobile
      //   object = values
      // } else {
      //   object = { ...values, mobile: phone }
      // }
      const dataToUpdate = { ...values, mobile: phone };
      setIsLoading(true)
      await updateProfile(dataToUpdate)
    },
  })

  const { mutateAsync: updateProfile } = useMutation(
    async (data: any) => {
      try {
        const response = await axiosPrivate.post(AUTH_API_URL.updateProfile, data);
        if (response.status == 200 || response.status == 201) {
          toast.success("Profile updated successfully");
          const responseData = response?.data?.response;
          updateAdminProfile({
            id: responseData?._id,
            fullName: responseData?.fullName,
            email: responseData?.email,
            hasSubAdmin: responseData?.hasSubAdmin,
            fa_token: responseData?.fa_token,
            profile_qr: responseData?.profile_qr,
            is_2fa_enable: responseData?.is_2fa_enable
          });
          // refetch();
        }
      } catch (error) {
        const errorData = error?.response.data;
        if (errorData?.error && errorData.statusCode == 400) {
          Object.keys(errorData?.error).forEach((key) => {
            setFieldError(key, errorData?.error[key]);
          });
        } else if (errorData?.message) {
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
    errors,
    values
  } = formik;

  return (
    <Col xl="4">
      <Card>
        <CommonCardHeader title={MyProfiles} />
        <CardBody>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <h6 className="form-label">Full Name</h6>
                <Input type="text" {...getFieldProps("fullName")} title="Full Name" />
                <ErrorMessage name="fullName" component="span" className="pt-1 text-danger" />
              </FormGroup>
              <FormGroup>
                <h6 className="form-label">{Bio}</h6>
                <Input type="textarea" {...getFieldProps("bio")} rows={5} />
                <ErrorMessage name="bio" component="span" className="pt-1 text-danger" />
              </FormGroup>
              <CommonUserFormGroup {...getFieldProps("email")} type="email" title="Email Address" disabled={true} />
              <Col sm="12">
                <FormGroup>
                  <Label>{"Mobile"}</Label>
                  <PhoneInput
                    className='phone-dropdown'
                    forceDialCode
                    defaultCountry="ua"
                    value={phone}
                    onChange={(phone) => {
                      setPhone(phone);
                      formik.setFieldValue('mobile', phone);
                    }}
                  />
                  <ErrorMessage name="mobile" component="span" className="pt-1 text-danger" />
                </FormGroup>
              </Col>
              <div className="form-footer">
                <Button color="primary" className="d-block" type="submit" disabled={isLoading}>{isLoading ? "Loading..." : Save}</Button>
              </div>
            </Form>
          </FormikProvider >
        </CardBody>
      </Card>
    </Col>
  );
};

export default MyProfile;
