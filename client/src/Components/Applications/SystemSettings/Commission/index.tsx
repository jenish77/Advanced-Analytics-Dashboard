import { useMemo, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label } from "reactstrap";
import { Container, Row } from "reactstrap";
import { useMutation, useQuery } from "react-query";
import { COMMISSION_API_URL, axiosPrivate } from "@/security/axios";
import { toast } from "react-toastify";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { addCommissionValidationSchema } from "@/Components/validation/validation";

const CommissionListsContainer = () => {
    const [Loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const { data: getCommissionApi, isFetching: isLoadingProfile, refetch } = useQuery(
        ['getCommissionApi'],
        async () => {
            const response = await axiosPrivate.get(COMMISSION_API_URL.getCommission);
            const info = response.data
            if (info.length) {
                info.map((val: any) => {
                    if (val.type == 2) {
                        values.percentage = val.percentage;
                        values.type = val.type;
                    }
                    if (val.type == 1) {
                        valuesForm2.percentage = val.percentage;
                        valuesForm2.type = val.type;
                    }
                })
                return response?.data
            }
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            retry: false,
        }
    );

    const formik = useFormik({
        initialValues: {
            percentage: "",
            type: 2,
        },
        validationSchema: addCommissionValidationSchema,
        onSubmit: async (values: any) => {
            await addCommissionApi(values);
        },
    })

    const formik2 = useFormik({
        initialValues: {
            percentage: "",
            type: 1,
        },
        validationSchema: addCommissionValidationSchema,
        onSubmit: async (values: any) => {
            await addCommissionApi(values);
        },
    })

    const { mutateAsync: addCommissionApi } = useMutation(
        async (data: any) => {
            try {

                const loadingSetter = data.type === 1 ? setLoading : setIsLoading;
                loadingSetter(true);
                const response = await axiosPrivate.post(COMMISSION_API_URL.addEditCommission, data);
                if (response.status == 201) {
                    toast.success("Commission added successfully");
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
            } finally {
                setIsLoading(false);
                setLoading(false);
            }
        }
    );

    const {
        handleSubmit,
        getFieldProps,
        setFieldError,
        touched,
        errors,
        values,
    } = formik;

    const {
        handleSubmit: handleSubmitForm2,
        getFieldProps: getFieldPropsForm2,
        touched: touchedForm2,
        errors: errorsForm2,
        values: valuesForm2,
    } = formik2;



    return (
        <>
            <Container fluid>
                <Row>
                    <Col sm="6">
                        <Card>
                            <CardHeader className="pb-0 card-no-border">
                                Dealer Commision
                            </CardHeader>
                            <CardBody>
                                <div className="list-product">
                                    <div className="">

                                        <FormikProvider value={formik}>
                                            <Form className="g-3" onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col sm="12">
                                                        <FormGroup>
                                                            <Label htmlFor="first-name">Percentage</Label>
                                                            <Input type="text" {...getFieldProps('percentage')} />
                                                            {touched.percentage && errors.percentage && <ErrorMessage name="percentage" component="span" className="pt-1 text-danger" />}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                                                    <Button disabled={isLoading} color="primary pt-2 pb-2" type="submit" name="submit">{isLoading ? "Loading.." : "Submit"} </Button>
                                                </div>
                                            </Form>
                                        </FormikProvider>

                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm="6">
                        <Card>
                            <CardHeader className="pb-0 card-no-border">
                                Admin Commision
                            </CardHeader>
                            <CardBody>
                                <div className="list-product">
                                    <div className="">

                                        <FormikProvider value={formik2}>
                                            <Form className="g-3" onSubmit={handleSubmitForm2}>
                                                <Row>
                                                    <Col sm="12">
                                                        <FormGroup>
                                                            <Label htmlFor="first-name">Percentage</Label>
                                                            <Input type="text" {...getFieldPropsForm2('percentage')} />
                                                            {touchedForm2.percentage && errorsForm2.percentage && <ErrorMessage name="percentage" component="span" className="pt-1 text-danger" />}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <div className="d-flex justify-content-end gap-2 border-top mt-3 py-2 pt-4">
                                                    <Button color="primary pt-2 pb-2" type="submit" name="submit" disabled={Loading}>{Loading ? "Loading.." : "Submit"} </Button>
                                                </div>
                                            </Form>
                                        </FormikProvider>

                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>

    );
};

export default CommissionListsContainer;
