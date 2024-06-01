import { Card, Col } from 'reactstrap'
import RightChatHeader from './RightChatHeader'
import RightChatBody from './RightChatBody'
import { useLayoutEffect, useState } from 'react';
import { authStore } from '@/context/AuthProvider';
import Error403Container from '@/Components/Other/Error/Error403';

const UserChat = () => {
  const [showError, setShowError] = useState(false);
  const { permission } = authStore();

  useLayoutEffect(() => {
    const handleStorageChange = () => {

      const permissionsMap = {
        'support_ticket': setShowError,
      };

      if (permission) {
        for (const [perm, setError] of Object.entries(permissionsMap)) {
          setError(!permission.includes(perm));
        }
      }
    }
    handleStorageChange()
  }, [permission]);
  return (
    <>
      {
        showError ?
          <Error403Container />
          :
          <Col sm='12' className="box-col-7">
            <Card className="right-sidebar-chat">
              <RightChatHeader />
              <RightChatBody />
            </Card>
          </Col>
      }
    </>
  )
}

export default UserChat