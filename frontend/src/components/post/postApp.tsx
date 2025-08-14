import React, { useState } from 'react';
import { Card, Input, Button, Typography, message } from 'antd';
import FlashcardModal from '../flashcard/flashcard.modal';
import type { Flashcard } from '../flashcard/flashcard.modal';
import type { IComment } from '../../types/backend';
import { callFetchComment, callPostComment } from '../../api/commentApi';
import CommentList from '../comment/commentList';
import DOMPurify from 'dompurify';
const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface PostProps {
    postId: string;
    title: string;
    content: string;
    email?: string;
    createdAt?: string;
    meaning?: string;
    initialComments?: IComment[]; // first comment
    flashcards?: Flashcard[];
    hasMoreComments?: boolean;
}

const PostComponent: React.FC<PostProps> = ({
    postId,
    title,
    content,
    email,
    createdAt,
    meaning,
    initialComments = [],
    flashcards = [],
    hasMoreComments = false,
}) => {
    const [comments, setComments] = useState<IComment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [showFlash, setShowFlash] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [posting, setPosting] = useState(false);

    // nếu chưa showAll -> fetch all rồi show
    const handleToggleShowAll = async () => {
        if (showAll) {
            setComments(initialComments);
            setShowAll(false);
            return;
        }

        try {
            setLoadingComments(true);
            const res = await callFetchComment(postId);

            if (res?.data?.data) {
                const allComments = Array.isArray(res.data.data)
                    ? res.data.data
                    : [res.data.data];
                setComments(allComments);
                setShowAll(true);
            } else {
                setShowAll(true);
            }
        } catch (err) {
            console.error('Lỗi khi lấy bình luận:', err);
        } finally {
            setLoadingComments(false);
        }
    };
    const handlePostComment = async () => {
        if (!newComment.trim()) {
            message.warning('Vui lòng nhập nội dung bình luận');
            return;
        }

        try {
            setPosting(true);
            const res = await callPostComment(postId, newComment.trim());

            // Ép kiểu rõ ràng
            const newCmt = res?.data?.data as IComment | undefined;

            if (newCmt) {
                setComments((prev) => [...prev, newCmt]);
                setNewComment('');
                message.success('Bình luận thành công!');
            } else {
                message.error('Server không trả về bình luận');
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi gửi bình luận');
        } finally {
            setPosting(false);
        }
    };
    return (
        <>
            <Card style={{ maxWidth: 600, margin: '20px auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                        <Title level={4} style={{ margin: 0 }}>
                            {title}
                        </Title>
                    </div>

                    <p
                        style={{
                            margin: 0,
                            fontSize: 11,
                            color: '#666',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                        }}
                        aria-label='post-meta'
                    >
                        By: {email || 'Unknown'} on{' '}
                        {createdAt ? new Date(createdAt).toLocaleString() : ''}
                    </p>
                </div>
                <Paragraph>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(content || ''),
                        }}
                    />
                </Paragraph>
                <Paragraph>
                    Meaning:
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(meaning || ''),
                        }}
                    />
                </Paragraph>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type='link'
                        onClick={() => setShowFlash(true)}
                        disabled={!flashcards.length}
                    >
                        Flashcards
                    </Button>
                </div>

                <CommentList
                    comments={comments}
                    initialComments={initialComments}
                    showAll={showAll}
                    loading={loadingComments}
                    hasMore={hasMoreComments}
                    onToggleShowAll={handleToggleShowAll}
                />

                {/* Add New Comment */}
                <div style={{ marginTop: 12 }}>
                    <TextArea
                        rows={2}
                        placeholder='Viết bình luận...'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        type='primary'
                        style={{ marginTop: 8 }}
                        loading={posting}
                        onClick={handlePostComment}
                    >
                        Gửi
                    </Button>
                </div>
            </Card>

            <FlashcardModal
                visible={showFlash}
                onClose={() => setShowFlash(false)}
                flashcards={flashcards}
            />
        </>
    );
};

export default PostComponent;
