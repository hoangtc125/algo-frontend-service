import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Image } from 'antd';

import { CARD_LIST } from '../utils/constant';

export default function LandingPage() {
    return (
        <div className='w-screen flex justify-center'>
            <ImageList className='w-[60vw]' variant="woven" cols={2} gap={24}>
                {CARD_LIST.map((item) => (
                    <ImageListItem key={item.key}>
                        <Image
                            src={item.card}
                            srcSet={item.card}
                            alt={item.key}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}