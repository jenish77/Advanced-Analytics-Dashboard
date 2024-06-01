import { TypeMessageHere } from "@/Constant";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useRef, useState } from "react";
import { Button, Form, Input } from "reactstrap";
import ChatDropMenu from "./ChatDropMenu";
import { authStore } from "@/context/AuthProvider";
import { toast } from "react-toastify";

const SendMessage = ({ wrapperHeight, sendMessageAsync, handleFileUpload, uploadImage, filesData, setFilesData, isLoading }: any) => {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPossition, setCurrentPossition] = useState(0);
  const { ticketData } = authStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addEmoji = (e: any) => {

    if (!inputRef.current) return;
    const textarea = inputRef.current;
    const { selectionStart, selectionEnd }: any = textarea;
    const start = messageInput.substring(0, selectionStart);
    const end = messageInput.substring(selectionEnd);
    const updatedMessage = start + e.native + end;
    setMessageInput(updatedMessage);
    const newSelectionStart = selectionStart + e.native.length;
    const newSelectionEnd = newSelectionStart;

    setTimeout(() => {
      textarea.selectionStart = newSelectionStart;
      textarea.selectionEnd = newSelectionEnd;
    }, 0);
    textarea.focus()
  };



  const handleMessageChange = (e: any) => {
    setMessageInput(e.target.value);
  };

  const handleMessagePress = () => {
    var container = document.getElementsByClassName("msger-chat")[0];
    setTimeout(function () {
      container?.scrollBy({ top: wrapperHeight, behavior: "smooth" });
    }, 310);

    const messageInfo = {
      "ticketId": ticketData?.id,
      "to": ticketData?.userId,
      "message": messageInput.trim(),
      "mediaMessage": [],
      "senderType": 1
    }
    if (messageInput.trim().length > 255) {
      toast.error("Please Enter maximum 255 character")
      return false
    }
    if (filesData.length > 5) {
      toast.error("Please Enter maximum 5 media")
      return false
    }
    if (filesData.length > 0 || messageInput.trim().length > 0) {
      sendMessageAsync(messageInfo)
      setMessageInput("");
      setShowEmojiPicker(false);
    }
  };

  const fileInputRef: any = useRef(null);

  const handleClosePreview = (key: number) => {
    const updatedFilesData = filesData.filter((el: any, index: number) => index !== key);
    setFilesData(updatedFilesData);
  };

  const renderFilePreviews = () => {
    return filesData.map((el: any, key: any) => (
      <div>
        <div key={key} className="file-preview">
          {el.preview ? <img src={el.preview} className="preview-image" alt="Preview" /> : el.icon}
          <span className="icon_wrapper close-icon" onClick={() => handleClosePreview(key)}>X</span>
        </div>
        <h6 className="text-center">{el.file.name}</h6>
      </div>
    ));
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleMessagePress(); // Implement handleMessagePress as per your requirements
    }
  };
  const handleFocus = () => {
    const inputElement = inputRef.current;

    if (inputElement) {
      const cursorPosition = inputElement.selectionStart;
      setCurrentPossition(Number(cursorPosition))
    }
  };
  return (
    <Form className="msger-inputarea py-0 position-relative">
      <div className="main-preview-wrapper">{renderFilePreviews()}</div>

      {!ticketData?.is_open ? (
          <p className="mx-auto">Ticket closed</p>
      ) : (
        <>
          <ChatDropMenu fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} uploadImage={uploadImage} />
          <input
            ref={inputRef}
            type="text"
            className="msger-input two uk-textarea shadow-none"
            value={messageInput}
            placeholder="Type a message here"
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
          />
          <div className="open-emoji">
            {showEmojiPicker ? (<Picker data={data} onEmojiSelect={addEmoji} />) : null}
          </div>
          <div className="smiley-box">
            <div className="picker second-btn uk-button px-1" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          </div>
          <Button
            color="primary"
            className="msger-send-btn"
            onClick={handleMessagePress}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fa fa-spinner" aria-hidden="true" />
            ) : (
              <i className="fa fa-location-arrow" />
            )}
          </Button>
        </>
      )}
    </Form>
  );
};

export default SendMessage;