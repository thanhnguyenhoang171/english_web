import React from 'react';
import { List, Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { IComment } from '../../types/backend';

interface CommentListProps {
    comments: IComment[]; // danh sách hiện đang hiển thị
    initialComments: IComment[]; // comments ban đầu (để restore khi ẩn)
    showAll: boolean; // đang ở trạng thái show all hay không
    loading: boolean; // loading khi fetch all
    hasMore: boolean; // backend báo còn comment chưa load
    onToggleShowAll: () => Promise<void>; // callback: khi bấm xem thêm / ẩn
}

const CommentList: React.FC<CommentListProps> = ({
    comments,
    showAll,
    loading,
    hasMore,
    onToggleShowAll,
}) => {
    return (
        <div>
            {comments.length > 0 && (
                <List
                    header={showAll ? 'Tất cả bình luận' : 'Bình luận mới nhất'}
                    itemLayout='horizontal'
                    dataSource={showAll ? comments : comments.slice(-1)}
                    renderItem={(comment) => (
                        <List.Item key={comment._id ?? (comment as any).id}>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={comment.createdBy?.email ?? 'Ẩn danh'}
                                description={comment.content}
                            />
                        </List.Item>
                    )}
                />
            )}

            {(hasMore || showAll) && (
                <Button
                    type='link'
                    loading={loading}
                    onClick={onToggleShowAll}
                    style={{ paddingLeft: 0 }}
                >
                    {showAll ? 'Ẩn bình luận' : 'Xem thêm bình luận'}
                </Button>
            )}
        </div>
    );
};

export default CommentList;
