import { useContext, useEffect, useMemo, useRef, useState } from "react";
import SendMessage from "./SendMessage";
import { ImagePath } from "@/Constant";
import momentTimeZone from "moment-timezone";
import useAxiosPrivate from "@/security/useAxiosPrivate";
import { IMAGE_UPLOAD, TICKET_API_URL } from "@/security/axios";
import { authStore } from "@/context/AuthProvider";
import { useQuery } from "react-query";
import Loader from "../../../../../app/loading"
import { toast } from "react-toastify";
import { SocketContext } from "@/context/socketProvide";
import IcnPdf from "@/Components/Icons/IcoIcons/IconPdf";

const RightChatBody = () => {
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState<number | null>(null)
  const [selectedChat, setSelectedChat] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const axiosPrivate = useAxiosPrivate();
  const { ticketData } = authStore();
  const [Loading, setLoading] = useState(true);
  const { joinSupportChat, hanldeSendMessage, connected, chatClient } = useContext(SocketContext);
  const [filesData, setFilesData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollDown, setScrollDown] = useState(0);

  useEffect(() => {
    if (ticketData?.id) {
      joinSupportChat(ticketData?.id)
    }
  }, [ticketData])


  useEffect(() => {
    if (connected) {

      const sendMess = (value: any) => {

        setSelectedChat((prevSelectedChat: any) => {
          const updatedChat = [...prevSelectedChat, ...value];
          return updatedChat;
        });

        setScrollDown(scrollDown + 1);

      }

      chatClient.on('support_send_message', sendMess);
      return () => {
        chatClient.off(`support_send_message`, sendMess);
      };
    }
  }, [connected]);


  const queryKeys: [string] = useMemo(() => ["getMessage"], []);
  const { data: messageData, refetch } = useQuery(queryKeys,
    async () => {
      const response = await axiosPrivate.post(TICKET_API_URL.getMessage, { ticketId: ticketData.id });
      setSelectedChat(response.data)
      setLoading(false);
      setScrollDown(scrollDown + 1);
      srollToBottum();
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    setScroll(1);
  }, [ticketData]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollDown]);

  const TimeAgoDate = (date: any) => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const momentDate = momentTimeZone.utc(date).tz(timeZone);
    return momentDate.calendar(null, {
      sameDay: '[Today at] hh:mm A',
      lastDay: '[Yesterday at] hh:mm A',
      lastWeek: 'dddd [at] hh:mm A',
      sameElse: 'MMM DD, YYYY [at] hh:mm A'
    });
  };
  const srollToBottum = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
      block: "end",
      inline: "nearest",
    });
  };

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollDown]);

  const sendMessageAsync = async (messageInfo: any) => {
    try {
      setIsLoading(true)
      if (filesData.length) {
        const imageUrl = await uploadImage(filesData);

        messageInfo = {
          ...messageInfo,
          mediaMessage: imageUrl.files
        }
      }

      const response = await axiosPrivate.post(TICKET_API_URL.sendMessage, messageInfo);
      hanldeSendMessage(response.data[0])

      setSelectedChat((prevSelectedChat: any) => {
        const updatedChat = [...prevSelectedChat, ...response.data];
        return updatedChat;
      });
      setFilesData([]);
      setIsLoading(false)
      setScrollDown(scrollDown + 1);
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) toast.error(errorMessage);
      else if (error?.response?.status === 403) toast.error("Permission Denied");
    }
  };

  const uploadImage = async (imageFile: any) => {
    try {
      const formData = new FormData();
      imageFile.map((el: any) => {
        formData.append("file[]", el.file);
      })
      const response = await axiosPrivate.post(IMAGE_UPLOAD.uploadImage, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleFileUpload = async (event: any) => {
    const files = event.target.files;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const checkType = Array.from(files).every((file: any) => allowedTypes.includes(file.type));
    
    if (!checkType) {
      toast.error('Only PDF, JPEG, JPG, PNG files are allowed!');
      return false;
    }
    
    const newFilesData = Array.from(files).map((file: any) => {
      const fileData: any = { file };

      if (file.type === 'application/pdf') {
        fileData.icon = <IcnPdf />;
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          fileData.preview = reader.result;
          setFilesData((prevData: any) =>
            prevData.map((data: any) =>
              data.file === file ? { ...data, preview: reader.result } : data
            )
          );
        };
        reader.readAsDataURL(file);
      }

      return fileData;
    });

    setFilesData((prevData: any) => [...prevData, ...newFilesData]);
  };


  const handleIconClick = (pdf: any) => {
    const pdfUrl = process.env.NEXT_PUBLIC_UPLOAD_IMAGE + `/supports/${pdf}`
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="right-sidebar-Chats">
      <div className="msger">
        {Loading ?
          <Loader /> :
          <div className="msger-chat" ref={wrapperRef}>
            {selectedChat && selectedChat.length > 0 ? (
              selectedChat.map((item: any, id: number) => {
                return (
                  <div className={`msg ${item.senderType == 2 ? "left" : "right"}-msg`} key={id}>
                    <div className="msg-bubble mx-2">
                      <div className="msg-info">
                        <div className="msg-info-name">{item.senderType == 1 ? "Admin" : item.fullName}</div>
                        <div className="msg-info-time">{TimeAgoDate(item.createdAt)}</div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">

                        {
                          item.mediaMessage.length ? item.mediaMessage.map((el: any, key: number) =>
                            el.toLowerCase().endsWith(".pdf")
                              ?
                              <div style={{ width: '100%', maxWidth: '80px', cursor: 'pointer' }} onClick={() => handleIconClick(el)}>
                                <IcnPdf />
                              </div>
                              :
                              <img
                                onClick={() => handleIconClick(el)}
                                src={process.env.NEXT_PUBLIC_UPLOAD_IMAGE + `/supports/${el}`}
                                style={{ maxWidth: '80px', borderRadius: '5px', cursor: 'pointer' }}
                                alt="Uploaded"
                              />
                          ) : ""
                        }
                      </div>
                      <div className="msg-text">{item.message}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="d-flex align-items-center justify-content-center py-5">
                <img className="w-100" src={`${ImagePath}/start-conversion.jpg`} alt="start conversion" style={{ maxWidth: "480px", margin: "au" }} />
              </div>
            )}
            <div id={"bottomRef"} ref={bottomRef} />

          </div>
        }

        <SendMessage
          wrapperHeight={wrapperHeight!}
          sendMessageAsync={sendMessageAsync}
          handleFileUpload={handleFileUpload}
          uploadImage={uploadImage}
          filesData={filesData}
          setFilesData={setFilesData}
          isLoading={isLoading}
        />
      </div>
    </div >
  );
};

export default RightChatBody;
