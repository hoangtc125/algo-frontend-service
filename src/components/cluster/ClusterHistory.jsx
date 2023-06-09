import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Card, Empty, Modal } from 'antd';
import ClusterInfoHistory from './ClusterInfoHistory';
import { useSelector } from 'react-redux';
const { Meta } = Card;

import CLUSTER from '../../assets/images/cluster.png'
import { clusterHistorySelector } from '../../redux/selectors';
import ClusteringResult from './ClusteringResult';
import ClusterChart from './ClusterChart';

const ClusterHistory = () => {
    const clusterHistory = useSelector(clusterHistorySelector)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [record, setRecord] = useState()

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleViewHistory = (id) => {
        const record = clusterHistory.find(e => e.id == id)
        setRecord(record)
        setIsModalOpen(true);
    }

    return (
        <Box className="w-full flex flex-col items-center justify-center min-h-[50vh]">
            <Typography variant='h6'>
                Lịch sử phân cụm
            </Typography>
            {
                clusterHistory.length > 0
                    ?
                    <Box className="p-4 w-full flex justify-center items-center flex-wrap">
                        {
                            clusterHistory.map(item => {
                                return (
                                    <Card
                                        key={item.id}
                                        className='sm:w-52 w-72 shadow-lg m-2 lg:m-4'
                                        hoverable={true}
                                        cover={
                                            <img
                                                alt="example"
                                                src={CLUSTER}
                                                className='p-2 shadow-md'
                                            />
                                        }
                                        onClick={() => { handleViewHistory(item.id) }}
                                    >
                                        <Meta
                                            className='h-6'
                                            title={item.title}
                                        />
                                    </Card>
                                )
                            })
                        }
                    </Box>
                    :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            <Modal centered width={1500} open={isModalOpen} onOk={handleOk} onCancel={handleOk} destroyOnClose={true}>
                <Box className="w-full flex flex-col items-center justify-center space-y-8">
                    <Box className="w-full flex flex-col items-start space-y-2 p-2">
                        <Typography variant='h6'>
                            Thông tin đầu vào
                        </Typography>
                        {
                            record &&
                            <ClusterInfoHistory data={record.data} />
                        }
                    </Box>
                    <Box className="w-full flex flex-col items-start space-y-2 p-2">
                        <Typography variant='h6'>
                            Kết quả phân cụm
                        </Typography>
                        {
                            record &&
                            <ClusteringResult data={record.data} />
                        }
                        {
                            record &&
                            <ClusterChart data={record.data} />
                        }
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default ClusterHistory;
