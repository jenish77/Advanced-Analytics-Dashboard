import React, { useEffect } from "react";
import { Container, Row } from "reactstrap";
import { useAppDispatch } from "@/Redux/Hooks";
import UserChat from "../../Chat/PrivateChat/UserChat";
import { fetchChatApiData, fetchChatMemberApiData } from "@/Redux/Reducers/ChatSlice";

const ChatContainer = () => {
    const dispatch = useAppDispatch()

    // useEffect(() => {
    //     dispatch(fetchChatMemberApiData());
    //     dispatch(fetchChatApiData());
    // }, []);
    return (
        <Container fluid>
            <Row className="g-0">
                <UserChat />
            </Row>
        </Container>
    );
};

export default ChatContainer;
