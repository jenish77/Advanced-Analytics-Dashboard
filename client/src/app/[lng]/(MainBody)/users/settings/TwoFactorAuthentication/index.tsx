"use client"

import { Button, Card, CardBody, Col, Input, Label } from "reactstrap";
import { Fragment, useEffect, useMemo, useState } from "react";
import Google2FAModel from "./Google2FAModel";
import ChangePassword from "./ChangePassword";
import Switch from 'react-switch';
import { AUTH_API_URL, axiosPrivate } from "@/security/axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useQuery } from "react-query";
import Loader from "../../../../../loading";

const TwoFactorAuthentication = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [open, setOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const [step, setStep] = useState(1);
  const [admin2fadata, setAdminData]: any = useState("");
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const [textToCopy, setTextToCopy] = useState("");
  const [copyStatus, setCopyStatus] = useState(false);
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(true);

  const getProfile: any = useMemo(() => ["getProfileApi"], []);
  // const { data: getProfileApi, isFetching: isLoadingProfile, refetch } = useQuery(
  //   getProfile,
  //   async () => {
  //     const response = await axiosPrivate.get(AUTH_API_URL.getProfile);
  //     setAdminData(response.data);
  //     setIs2FAEnabled(response?.data?.is_2fa_enable);
  //     setTextToCopy(response?.data?.fa_token);
  //     return response?.data
  //   },
  //   {
  //     enabled: true,
  //     refetchOnWindowFocus: false,
  //     retry: false,
  //   }
  // );

  const toggle2FA = async (admin2fadata: any) => {
    try {
      const data: any = {
        userId: admin2fadata._id,
      }
      const response = await axiosPrivate.post(AUTH_API_URL.generateGoogle2fa, data);
      if (response) {
        setLoading(false);
        setQRCodeDataURL(response.data.profile_qr);
        setSecret(response.data.fa_token);
        // refetch();
      }
    } catch (err) {
      console.log('Error 2fa generate time', err)
    }
  }

  const next = async () => {
    setStep(step + 1);
    if (step == 1) {
      setLoading(true);
      await toggle2FA(admin2fadata);
    }
  }

  const prev = async () => {
    setStep(step - 1);
  }

  useEffect(() => {
    step == 4 ? setOpen(true) : setOpen(false)
  }, [step])

  const handleSwitchChange = () => {
    setOpen(!open)
  }

  const switchAction = () => {
    setIs2FAEnabled(!is2FAEnabled);
  }

  const onCopyText = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <Col sm="12">
      <Card>
        <CardBody>
          <ul className="tg-list common-flex">
            <Fragment key={0}>
              <li>
                <p>Two Factor Authentication</p>
              </li>
              <li className="tg-list-item">
                <Switch
                  checked={is2FAEnabled}
                  disabled={!is2FAEnabled}
                  onChange={() => handleSwitchChange()}
                  checkedIcon={<span className="d-flex"></span>}
                  uncheckedIcon={<span className="d-flex"></span>}
                />
              </li>
            </Fragment>
          </ul>
          <ul className="mt-4 tg-list common-flex">
            <Fragment key={1}>
              <li>
                <p>Change Password</p>
              </li>
              <li className="tg-list-item">
                <Button onClick={() => setChangePasswordModalOpen(true)} id={"email_2fa"} type="button" >Change</Button>
              </li>
            </Fragment>
          </ul>
        </CardBody>

      </Card>
      {!is2FAEnabled ? (
        <Card>
          <CardBody className="authentication-body w-100">
            <ChangePassword
              changePasswordModalOpen={changePasswordModalOpen}
              setChangePasswordModalOpen={setChangePasswordModalOpen}
            />
            <div className='steps mb-4'>
              <div className='step_main'>
                <div className='step_wrapper'>
                  <div className='step_curcle done'>1</div>
                  <p className="">Download App</p>
                </div>
                <div className={`step_wrapper ${step > 1 ? 'done_step' : ''} line`}>
                  <div className={`step_curcle`}>2</div>
                  <p className="title">Scan QR Code</p>
                </div>
                <div className={`step_wrapper ${step > 2 ? 'done_step' : ''} line`}>
                  <div className={`step_curcle`}>3</div>
                  <p className="title">Backup Key</p>
                </div>
                <div className={`step_wrapper ${step > 3 ? 'done_step' : ''} line`}>
                  <div className={`step_curcle`}>4</div>
                  <p className="title">Enabled Google Authenticator</p>
                </div>
              </div>
            </div>
            {
              step == 1 ?
                <div className="step-1">
                  <img src='/assets/images/google-authenticator-logo.webp' alt="" style={{ height: '40%', width: '40%' }} />
                  <p className="m-0">Download and install the Google Authenticator app</p>
                  <div className="">
                    <img src='/assets/images/google-play.webp' alt="" className="h-50 w-50" />
                    <img src='/assets/images/appstore.webp' alt="" className="h-50 w-50" />
                  </div>
                </div> :
                step == 2 ?
                  loading ? <Loader /> :
                    <div className="d-flex align-items-center flex-column gap-4">
                      <p className="m-0">Scan this QR code in the Google Authenticator App</p>
                      <img src={qrCodeDataURL} alt="qr-code" className="h-50 w-50" />
                      <div className="w-100">
                        <div className="copy_wrapper">
                          {copyStatus && (
                            <div className="copy_lable">copied</div>
                          )}
                          <div className="input_wrapper">
                            <Input
                              className='copy_input'
                              readOnly
                              value={secret}
                            />
                            <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                              <Button color="primary" className="btn-copy">
                                <i className="fa fa-copy" />
                              </Button>
                            </CopyToClipboard>
                          </div>
                        </div>
                      </div>
                    </div> :
                  <div className="d-flex align-items-center flex-column gap-4" style={{ maxWidth: '320px' }}>
                    <p className="m-0">Please save this key on paper. This Key will allow you to recover your Google Authenticator in case of phone loss.</p>
                    <img src='/assets/images/backup_key.webp' alt="" style={{ height: '40%', width: '40%' }} />
                    <p className="m-0">Resetting your Google Authentication requires opening a support ticket and takes at least 7 days to process.</p>
                    <div className="w-100">
                      <div className="copy_wrapper">
                        {copyStatus && (
                          <div className="copy_lable">copied</div>
                        )}
                        <div className="input_wrapper">
                          <Input
                            className='copy_input'
                            readOnly
                            value={secret}
                          />
                          <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                            <Button color="primary" className="btn-copy">
                              <i className="fa fa-copy" />
                            </Button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                  </div>
            }
            <div className="w-25 d-flex align-item-center gap-3 mt-3">
              {step > 1 && <Button className="w-100 bg-none" style={{ backgroundColor: '#989898' }} onClick={() => prev()}>Previous</Button>}
              {step < 4 && <Button color="primary" className="w-100" onClick={() => next()}>Next</Button>}
            </div>
          </CardBody>
          <Google2FAModel open={open} setOpen={setOpen} setStep={setStep} secret={secret} handleSwitchChange={switchAction}  />
        </Card>
      ) : (
        <Fragment>
          <ChangePassword
            changePasswordModalOpen={changePasswordModalOpen}
            setChangePasswordModalOpen={setChangePasswordModalOpen}
          />
          <Google2FAModel open={open} setOpen={setOpen} setStep={setStep} secret={secret} handleSwitchChange={switchAction} getProfileApi />
        </Fragment>
      )}

    </Col>
  );
};

export default TwoFactorAuthentication;
