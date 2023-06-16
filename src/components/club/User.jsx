import { Card, Input, List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { post } from '../../utils/request';
import { errorNotification } from '../../utils/notification';
import UserList from './UserList';
import { Box, Typography } from '@mui/material';

const User = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0)
  const [searchValue, setSearchValue] = useState("")

  console.log("re-render");

  const loadMoreData = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const res = await post(`/account/get-all?page_size=10&page_number=${page + 1}&orderby=created_at&sort=-1`)
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

  return (
    <Card bordered={false} className='w-full bg-gray-100 border' title={
      <Box className="w-full flex flex-col md:flex-row items-center justify-between space-x-4">
        <Typography variant='h6' >Danh sách người dùng</Typography>
        <Input.Search
          placeholder="Nhập tên người dùng hoặc email"
          className="w-[400px] focus-within:w-[600px] transition-width duration-300 ease-in-out max-w-full"
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={(value) => { setSearchValue(value.toLowerCase().replace(/[\u0300-\u036f]/g, '')) }}
        />
      </Box>
    }>
      <div
        id="scrollableDivUser"
        style={{
          overflow: 'auto',
        }}
        className='w-full max-h-[50vh]'
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
          scrollableTarget="scrollableDivUser"
        >
          <UserList data={data.filter(item => (
            item.email.toLowerCase().replace(/[\u0300-\u036f]/g, '').includes(searchValue) || item.name.toLowerCase().replace(/[\u0300-\u036f]/g, '').includes(searchValue)
          ))} />
        </InfiniteScroll>
      </div>
    </Card>
  );
};
export default User;