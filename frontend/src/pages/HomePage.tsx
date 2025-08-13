import { Button, message } from 'antd';

import { EditOutlined } from '@ant-design/icons';
import PostModal from '../components/post/postModal';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hook';
import { fetchPost } from '../redux/auth/post.slice';
import PostList from '../components/post/poststList';
interface HomePageProps {
    isAuthenticated: boolean;
}

export function HomePage({ isAuthenticated }: HomePageProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useAppDispatch();
    const { result: posts, meta } = useAppSelector((state) => state.post);
    const [messageApi, contextHolder] = message.useMessage();
    // Fetch first page
    useEffect(() => {
        dispatch(
            fetchPost({
                query: `current=1&pageSize=${meta.pageSize}`,
                append: false,
            }),
        );
    }, [dispatch]);
    const handleButtonClick = () => {
        if (!isAuthenticated) {
            messageApi.warning('Bạn cần đăng nhập để sử dụng chức năng này');
            return;
        }
        setModalVisible(true);
    };
    return (
        <div>
            {contextHolder}
            <Button
                type='primary'
                shape='round'
                icon={<EditOutlined />}
                size='large'
                onClick={handleButtonClick}
                style={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                }}
            >
                Đăng bài
            </Button>

            <PostList posts={posts} meta={meta} />

            <PostModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </div>
    );
}
