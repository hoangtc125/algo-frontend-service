import { Card, Empty, Image, List, Modal, Skeleton, Tag } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import { CLUB_TYPE, COLOR_REAL } from '../../utils/constant';
import UserList from './UserList';
import CLUB1 from '../../assets/images/club/club1.png'
import CLUB2 from '../../assets/images/club/club2.png'
import CLUB3 from '../../assets/images/club/club3.png'
import CLUB4 from '../../assets/images/club/club4.png'
import CLUB5 from '../../assets/images/club/club5.png'
const CLUB = [CLUB1, CLUB2, CLUB3, CLUB4, CLUB5]

const Clubs = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0)
  const navigate = useNavigate()

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await post(`/club/get-all?page_size=6&page_number=${page + 1}&orderby=created_at&sort=-1`)
      if (res?.status_code == 200) {
        setData([...data, ...res?.data]);
        setPage(page + 1)
      } else {
        errorNotification(res?.status_code, res?.msg, "bottomRight")
      }
    } catch (e) {
      console.log({ e });
      errorNotification("Đã có lỗi xảy ra", "Hãy thử load lại", "bottomRight")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const handleViewUser = (header, data) => {
    Modal.info({
      title: header,
      className: "min-w-[70vw] max-w-[80vw]",
      centered: true,
      content: (
        <Box className="w-full max-h-[60vh] overflow-auto">
          <UserList data={data} />
        </Box>
      ),
      onOk() { },
      onCancel() { },
    });
  }

  const handleViewGroup = (group) => {
    Modal.info({
      title: group.name,
      className: "min-w-[70vw] max-w-[80vw]",
      centered: true,
      content: (
        <Box className="w-full max-h-[60vh] overflow-auto flex flex-col items-center justify-center space-y-2">
          <Typography variant='h6'>{group.name}</Typography>
          <Typography variant='body1'>{group.description}</Typography>
          <Card title="Danh sách thành viên" className='w-full'>
            <UserList data={group.members.map(e => e.user)} />
          </Card>
        </Box>
      ),
      onOk() { },
      onCancel() { },
    });
  }

  return (
    <Card bordered={false} className='w-full bg-gray-100 border' title="Câu lạc bộ">
      <div
        id="scrollableDivClub"
        style={{
          overflow: 'auto',
        }}
        className='w-full max-h-[80vh]'
      >
        <InfiniteScroll
          dataLength={data.length}
          next={loadMoreData}
          hasMore={true}
          loader={
            loading &&
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          scrollableTarget="scrollableDivClub"
          className="p-4 flex flex-wrap items-center justify-center"
        >
          {
            data.map((club, idx) => {
              const members = club?.groups.reduce((total, group) => [...total, ...group.members.map(e => e.user)], [])
              return (
                <Card
                  key={idx}
                  hoverable
                  className='m-4 w-[300px] 2xl:w-[500px]'
                  cover={
                    <Box
                      className='relative'
                    >
                      <Image
                        src={club?.image}
                        fallback={CLUB[idx % CLUB.length]}
                        preview={false}
                        className='h-48 opacity-70'
                      />
                      <Box className='absolute top-2 right-2'>
                        {CLUB_TYPE[club?.type]}
                      </Box>
                      <Box className='absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-start p-2'>
                        {
                          (club?.groups || []).map((group, idGroup) => {
                            return (
                              <Tag key={idGroup} color={COLOR_REAL[idGroup]} className='text-sm 2xl:text-base m-1 hover:text-lg' onClick={() => { handleViewGroup(group) }}>
                                {group.name}
                              </Tag>
                            )
                          })
                        }
                      </Box>
                    </Box>
                  }
                  actions={[
                    <Button
                      className='w-full h-full'
                      onClick={() => {
                        handleViewUser("Thành viên", members)
                      }}
                    >{`${members.length || 0} thành viên`}</Button>,
                    <Button
                      className='w-full h-full'
                      onClick={() => {
                        handleViewUser("Quan tâm", club.followers.map(e => e.user))
                      }}
                    >{`${club.followers.length || 0} quan tâm`}</Button>,
                  ]}
                >
                  <Box className="w-full flex flex-col items-center justify-center space-y-1">
                    <Box className="w-full flex flex-col items-center justify-center whitespace-pre-line">
                      <strong className='text-3xl uppercase mb-1'>
                        {club?.nickname}
                      </strong>
                      <p className='text-2xl mb-1'>
                        {club?.name}
                      </p>
                    </Box>
                  </Box>
                </Card>
              )
            })
          }
          {
            data.length == 0 &&
            <Empty
              className='w-full items-center text-center'
            />
          }
        </InfiniteScroll>
      </div>
    </Card>
  );
};
export default Clubs;