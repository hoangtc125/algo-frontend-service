import { Tag } from 'antd'
import { Chip } from '@mui/material';

import HUST from '../assets/images/hust.png'
import HUST2 from '../assets/images/hust2.png'
import NEU from '../assets/images/neu.png'
import NEU2 from '../assets/images/neu2.png'
import HUCE from '../assets/images/huce.png'

export const BACKEND_URL = "http://localhost:8001"
export const HOST = "localhost"
export const IMAGE = "data:image/png;base64,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"
export const STUDENT_CARD = [
    {
        school: "Đại học Bách Khoa Hà Nội",
        cards: [
            {
                key: "HUST",
                card: HUST
            },
            {
                key: "HUST2",
                card: HUST2
            },
        ]
    },
    {
        school: "Đại học Kinh tế Quốc dân",
        cards: [
            {
                key: "NEU",
                card: NEU
            },
            {
                key: "NEU2",
                card: NEU2
            },
        ]
    },
    {
        school: "Đại học Xây Dựng",
        cards: [
            {
                key: "HUCE",
                card: HUCE
            },
        ]
    },
]

export const CARD_LIST = STUDENT_CARD.map((item) => item.cards).flat();

export const CLUSTER_FILE_PROCESS = [
    {
        title: 'Dữ liệu đầu vào',
        description: 'Tải file excel dữ liệu đơn tuyển thành viên',
        status: 'process',
    },
    {
        title: 'Chọn thuộc tính',
        description: 'Cập nhật loại dữ liệu và đánh trọng số cho các trường thuộc tính tham gia phân cụm',
        status: 'process',
    },
    {
        title: 'Chọn số lượng cụm',
        description: 'Chọn số lượng cụm dữ liệu muốn tao ra, có thể đặt tên cho các cụm như tập giám sát',
        status: 'process',
    },
    {
        title: 'Chọn dữ liệu phân cụm',
        description: 'Chọn các bản ghi để tiến hành phân cụm và giám sát cho các bản ghi nếu muốn',
        status: 'process',
    },
    {
        title: 'Tiến hành phân cụm',
        description: 'Kiểm tra dữ liệu đầu vào đã chọn và nhân nút tiến hành phân cụm',
        status: 'process',
    },
]

export const CLUSTER_TYPE = [
    {
        label: "Số",
        value: "numerical",
    },
    {
        label: "Tập hữu hạn",
        value: "categorical",
    },
    {
        label: "Văn bản",
        value: "text",
    },
]

export const COLOR = [
    "#EB2F96B3",
    "#722ED1B3",
    "#2F54EBB3",
    "#13A8A8B3",
    "#52C41AB3",
    "#8BBB11B3",
    "#FA8C16B3",
    "#F5222DB3",
    "#1677FFB3",
    "#FADB14",
]

export const COLOR_REAL = [
    '#F5222D',
    '#FA8C16',
    '#52C41A',
    '#13A8A8',
    '#1677FF',
    '#2F54EB',
    '#722ED1',
    '#EB2F96',
    '#8BBB11',
    '#FADB14',
]


export const formEl = [
    {
        label: "Văn bản 1 dòng",
        value: "text",
    },
    {
        label: "Văn bản nhiều dòng",
        value: "textarea",
    },
    {
        label: "Số",
        value: "number",
    },
    {
        label: "Chọn 1 đáp án",
        value: "radio",
    },
    {
        label: "Chọn nhiều đáp án",
        value: "select",
    },
    {
        label: "Chuyển hướng",
        value: "section",
    },
];

export const CLUB_ROLE = {
    "PRESIDENT": "Chủ nhiệm",
    "SUB_PRESIDENT": "Phó chủ nhiệm",
    "LEADER": "Trưởng ban",
    "SUB_LEADER": "Phó ban",
    "MEMBER": "Thành viên",
}

export const MEMBERSHIP_STATUS = {
    "ACTIVE": <Tag bordered={false} color='#52C41A'>Đang hoạt động</Tag>,
    "PAUSE": <Tag bordered={false} color='#1677FF'>Đang tạm dừng</Tag>,
    "INACTIVE": <Tag bordered={false} color='#F5222D'>Dừng hoạt động</Tag>,
}

export const CLUB_TYPE = {
    "EDU": "CLB Học thuật",
    "VN": "CLB Văn nghệ",
    "SPORT": "CLB Thể thao",
}

export const GUEST = {
    created_by: 'SYSTEM',
    created_at: 1685347370,
    last_modified_by: '',
    last_modified_at: 1685347677,
    name: 'Trần Công Hoàng',
    email: 'trconghoangg@gmail.com',
    photo_url: null,
    verify: {
        status: true,
        image: '032cf4d0-3e1d-445f-bfa1-071e784fdf12',
        detail: {
            school: 'HANOI UNIVERSITY OF SCIENCE AND TECHNOLOGY',
            major: 'Khoa học máy tính 01-K64 (IT1)',
            fullname: 'TRẦN CÔNG HOÀNG',
            birth: '12/05/2001',
            expired_card: '30/7/2023',
            number: '20194060',
            email: 'hoang.tc194060@sis.hust.edu.vn'
        },
        type: 'HUST'
    },
    role: 'USER',
    provider: 'SYSTEM',
    hashed_password: '$2b$12$FPeu680rPYZ9qLP5ylJxL.zeNGwCydf/GRTqD7r.R91LuzN5aEIDq',
    active: true,
    id: '5e1d45bc-1d80-49d6-8d0e-b1ac20643e1b'
}

export const FORM_BUILDER = {
    id: 'b62cd80f-7e84-4373-8f30-42ab09a34f5d',
    sections: [
        {
            id: 'b62cd80f-7e84-4373-8f30-42ab09a34f5d',
            title: 'Mẫu đơn tuyển thành viên',
            description: 'Mẫu đơn tuyển thành viên cho các Câu lạc bộ học thuật về Công nghệ thông tin',
            data: [
                {
                    id: '162b384f-b495-4c8a-b2d4-f3462c12147d',
                    value: 'Email cá nhân',
                    type: 'text',
                    answer: '',
                    disabled: true,
                    required: true,
                    options: [
                        {
                            id: '85000685-e1c5-4447-bb8f-3a541f45be7b',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: '04ed6a64-26f6-45ad-abd5-bf1c9d425608',
                    value: 'Họ và tên',
                    type: 'text',
                    answer: '',
                    disabled: true,
                    required: true,
                    options: [
                        {
                            id: '2a92e6d4-2ac8-4379-94d6-36cc75ae4c75',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: 'e75c816f-47ef-4bc2-a980-3771c5d8f306',
                    value: 'Số điện thoại',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd57cca4-5f69-4b41-9944-55a73ceebf07',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: 'c4b2ad58-f70a-441e-9f01-8d3aff725d5e',
                    value: 'Bạn đến từ trường nào',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: 'aeba1564-0c0a-471e-b0c2-cce94fbf531d',
                    value: 'Trường/Viện',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'b8306d1d-a143-45b4-9e5b-af51a32967f5',
                    value: 'Khoá',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '79bf0d3e-b29e-4263-b645-bb29de00175c',
                    value: 'MSSV',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'e8e902cc-7cce-4f7b-8295-686cafdef659',
                    value: 'Link Facebook',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '5ddd74a0-03d5-451a-8d18-9fb273a8992c',
                    value: 'Link Linkedln',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: false,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '4bc1c825-d1a5-467d-9923-1cda84961076',
                    value: 'Trình độ tiếng anh',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: false,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '569aa8e3-4764-492c-862d-2016960631a9',
                    value: 'Trình độ tin học văn phòng',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: false,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '120fa25d-c2f4-45d7-a675-c77e12e17fd4',
                    value: 'Thành tích cá nhân',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: false,
                    options: [
                        {
                            id: 'd0b69e93-b65d-4c24-9000-79ff4e3e621e',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '268bea27-2e37-4b63-a79a-b88a6d3131b0',
                    value: 'Bạn mong muốn tham gia vào ban nào?',
                    type: 'section',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '623ff26e-2e10-4560-a870-a186a84f78b7',
                            value: 'Chuyên môn',
                            to: '2c850c24-ddda-4dce-85fe-e11995d26bac'
                        },
                        {
                            id: 'df7b01f2-a2ef-4095-a390-4df4b73a90d3',
                            value: 'Đối ngoại',
                            to: '96f5dfc4-d0cc-422b-a905-c455d9d201d3'
                        },
                        {
                            id: '19497dc2-328d-4411-92ca-c3a49312258b',
                            value: 'Hậu cần',
                            to: '4560937c-ae58-429a-bcd4-48c6dead322a'
                        },
                        {
                            id: 'c8de7486-7fbc-4034-bb8c-cb722a9fba33',
                            value: 'Nhân sự',
                            to: 'cc9dc796-6028-4205-a8fb-f6dfbe8df61f'
                        },
                        {
                            id: '7a15014d-5434-4ec9-aafa-cf81b7ccd0c3',
                            value: 'Truyền thông',
                            to: '58aefe68-2611-4e7a-9868-bd1012a21481'
                        }
                    ]
                },
                {
                    id: '18755611-0a6b-4e0b-b61f-d39bcb905404',
                    value: 'Bạn hiểu gì về CLB',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '7a15014d-5434-4ec9-aafa-cf81b7ccd0c3',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'b440f258-70d5-4ec3-9620-dbc2c0bdb7d3',
                    value: 'Bạn có đóng góp gì cho CLB trong tương lai',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '7a15014d-5434-4ec9-aafa-cf81b7ccd0c3',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '1387642d-4a57-44cf-b298-2a74855d67b7',
                    value: 'Bạn có câu hỏi nào khác không',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: false,
                    options: [
                        {
                            id: '7a15014d-5434-4ec9-aafa-cf81b7ccd0c3',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        },
        {
            id: '2c850c24-ddda-4dce-85fe-e11995d26bac',
            title: 'Câu hỏi ban Chuyên môn',
            description: '',
            data: [
                {
                    id: 'e2eeed3d-96d5-4b4b-b00d-4aec74944f3b',
                    value: 'Bạn đang quan tâm về lĩnh vực nào? Bạn đã biết gì về lĩnh vực này?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'b5d53347-e768-4e5e-b5a5-13385787556d',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: '20f61227-5aaa-4f03-a12d-db3f72cedb2b',
                    value: 'Bạn có dự án nào không? Nếu có, hãy chia sẻ thêm về nó?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'b5d53347-e768-4e5e-b5a5-13385787556d',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'abf3b8ca-3cee-40a2-8d16-fccf48d7c783',
                    value: 'Bạn nghĩ mình có thể đóng góp gì cho CLB với tư cách là thành viên ban Chuyên Môn?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'b5d53347-e768-4e5e-b5a5-13385787556d',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '70fe461b-040c-47b5-96d8-1f7a04634d71',
                    value: 'Hãy nêu chi tiết một ý tưởng về công nghệ mà bạn đang muốn thực hiện.',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'b5d53347-e768-4e5e-b5a5-13385787556d',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '66459375-03ce-4655-ae4f-b6dc43aa5407',
                    value: 'Ngoài các sự kiện về CNTT, bạn còn tham gia các sự kiện nào khác không? Nếu có, hãy liệt kê nhiều nhất có thể.',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'b5d53347-e768-4e5e-b5a5-13385787556d',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        },
        {
            id: '96f5dfc4-d0cc-422b-a905-c455d9d201d3',
            title: 'Câu hỏi ban Đối ngoại',
            description: '',
            data: [
                {
                    id: '4595b822-9782-436c-832d-b5ab81d2fc52',
                    value: 'Bạn hiểu thế nào là đối ngoại? Bạn nghĩ vai trò của ban trong CLB là gì?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'fab0d660-a9b7-4354-adad-6b6044c8f8e4',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: '50e21cff-166f-494a-b535-210f6cda744f',
                    value: 'Bạn đã có kinh nghiệm gì về đối ngoại chưa?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'fab0d660-a9b7-4354-adad-6b6044c8f8e4',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'edd46d7e-d06c-485a-8223-959f1d5c7dfa',
                    value: 'Bạn mong muốn học hỏi được gì khi tham gia ban Đối ngoại?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'fab0d660-a9b7-4354-adad-6b6044c8f8e4',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '6a6fac7e-8a3f-4c15-98cf-70dd0b89c7d0',
                    value: 'Bạn nghĩ những tố chất nào của mình phù hợp với ban Đối ngoại?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'fab0d660-a9b7-4354-adad-6b6044c8f8e4',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'c4be26d0-6621-4d9b-a461-2f413986bca9',
                    value: 'Bạn đã từng có dự án (liên quan đến công nghệ, kinh doanh...) gì cho bản thân trước đây chưa?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'fab0d660-a9b7-4354-adad-6b6044c8f8e4',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        },
        {
            id: '4560937c-ae58-429a-bcd4-48c6dead322a',
            title: 'Câu hỏi ban Hậu cần',
            description: '',
            data: [
                {
                    id: '25a2d3a9-ad2a-4158-953d-ffd13eb7ceff',
                    value: 'Bạn đã tìm hiểu gì về ban Hậu cần chưa?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd505bfeb-4998-45d0-98bb-2d04c35733bb',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: 'd7c8ed23-5cc2-48d8-a9bc-af330690b0c1',
                    value: 'Tại sao bạn chọn tham gia ban Hậu cần?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd505bfeb-4998-45d0-98bb-2d04c35733bb',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '0d486c8f-039b-401f-9c9f-0b5da855a7af',
                    value: 'Bạn có kinh nghiệm gì trong việc tổ chức sự kiện chưa?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd505bfeb-4998-45d0-98bb-2d04c35733bb',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '24057426-4b2a-4a47-9409-33467fd8ea28',
                    value: 'Bạn có kinh nghiệm trong việc quản lí ngân sách cho tập thể chưa?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd505bfeb-4998-45d0-98bb-2d04c35733bb',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'a58960a6-9b10-4827-a4f9-cc70a675ec76',
                    value: 'Bạn mong muốn học hỏi được gì khi tham gia ban Hậu Cần',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'd505bfeb-4998-45d0-98bb-2d04c35733bb',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        },
        {
            id: 'cc9dc796-6028-4205-a8fb-f6dfbe8df61f',
            title: 'Câu hỏi ban Nhân sự',
            description: '',
            data: [
                {
                    id: 'dfc6e014-9d65-4cb6-8d04-d75b8fae7b90',
                    value: 'Hiện tại bạn có tham gia tổ chức nào không (đoàn hội, ban cán sự, đội tình nguyện, ...)? Nếu có, vai trò của bạn là gì?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd70788f-a7d0-4a67-a5c1-8094a552c19a',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: '3a9d685c-87ee-424b-8a47-821cc6ed1f24',
                    value: 'Bạn có thể chia sẻ một vài bản kế hoạch mà bạn đã thực hiện được không? (có thể là kế hoạch học tập, chi tiêu, hoạt động,..)',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd70788f-a7d0-4a67-a5c1-8094a552c19a',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '1566d644-bedc-4929-8479-076d4fa19e52',
                    value: 'Bạn đánh giá như nào về kỹ năng sử dụng tin học văn phòng của bản thân? Bạn có thể nêu một số công mà bạn nghĩ là bạn thành thạo?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd70788f-a7d0-4a67-a5c1-8094a552c19a',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '9790d1a9-3d11-4a22-9565-c3daa397538a',
                    value: 'Sau khi tham gia ban Nhân sự, bạn mong muốn học hỏi hay nhận được điều gì?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd70788f-a7d0-4a67-a5c1-8094a552c19a',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'ef363381-57d2-4753-bbd1-d74a2927ceb3',
                    value: 'Giả sử CLB đang cần một bộ quy tắc hoạt động mới, bạn là người được giao nhiệm vụ làm bộ quy tắc này. Nhưng sau khi làm xong, các thành viên lại không hưởng ứng các quy tắc mà bạn đặt ra, bạn sẽ làm gì trong trường hợp này?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: 'cd70788f-a7d0-4a67-a5c1-8094a552c19a',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        },
        {
            id: '58aefe68-2611-4e7a-9868-bd1012a21481',
            title: 'Câu hỏi ban Truyền thông',
            description: '',
            data: [
                {
                    id: '55426ea7-6879-4768-a078-39e617ac0a58',
                    value: 'Hãy nêu những kinh nghiệm và thế mạnh của bạn trong lĩnh vực này',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '12d408da-c127-4025-aa8c-633206fa8150',
                            value: '',
                            to: ''
                        }
                    ]
                },
                {
                    id: '5c6f2612-ecf7-44f4-8285-e8a8dac11690',
                    value: 'Bạn mong muốn gì khi được làm việc ở Ban Truyền Thông?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '12d408da-c127-4025-aa8c-633206fa8150',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '69f442c3-a81b-4c23-adca-fc3f87c1429f',
                    value: 'Bạn có ý tưởng truyền thông gì cho CLB không?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '12d408da-c127-4025-aa8c-633206fa8150',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: 'dbf75d9d-7af4-4d49-a96e-0210168c6f9d',
                    value: 'Khi xảy ra sự cố truyền thông thí dụ như sai tên doanh nghiệp bạn sẽ xử lí như thế nào?',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '12d408da-c127-4025-aa8c-633206fa8150',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                },
                {
                    id: '0a924f83-9c51-4aa3-a959-56ed717bbf10',
                    value: 'Hãy chia sẻ link đến một kế hoạch bạn đã làm cho một sự kiện và nhớ cấp quyền cho chúng mình nhé',
                    type: 'text',
                    answer: '',
                    disabled: false,
                    required: true,
                    options: [
                        {
                            id: '12d408da-c127-4025-aa8c-633206fa8150',
                            value: '',
                            to: ''
                        }
                    ],
                    children: []
                }
            ]
        }
    ]
}