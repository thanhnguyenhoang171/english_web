import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin } from 'antd';
import { useAppDispatch } from '../../redux/hook';
import { fetchPost } from '../../redux/auth/post.slice';
import PostComponent from './postApp';
import { callFetchComment } from '../../api/commentApi';
import type { IPost, IComment } from '../../types/backend';

interface IPostListProps {
    posts: IPost[];
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
}

const PostList: React.FC<IPostListProps> = ({ posts, meta }) => {
    const dispatch = useAppDispatch();
    const [commentsMap, setCommentsMap] = useState<Record<string, IComment[]>>(
        {},
    );

    const hasMore = posts.length < meta.total;

    // Fetch comment cho posts mới
    useEffect(() => {
        const fetchComments = async () => {
            const newMap: Record<string, IComment[]> = {};
            await Promise.all(
                posts.map(async (post) => {
                    if (!post._id) return;
                    const res = await callFetchComment(post._id);
                    const comments = Array.isArray(res.data.data)
                        ? res.data.data
                        : [res.data.data];
                    newMap[post._id] = comments.slice(-1);
                }),
            );
            setCommentsMap((prev) => ({ ...prev, ...newMap }));
        };
        fetchComments();
    }, [posts]);

    const fetchMorePosts = async () => {
        if (!hasMore) return;
        const nextPage = meta.current + 1;
        await dispatch(
            fetchPost({
                query: `current=${nextPage}&pageSize=${meta.pageSize}`,
                append: true,
            }),
        );
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMore}
                loader={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: 20,
                        }}
                    >
                        <Spin />
                    </div>
                }
                endMessage={<p style={{ textAlign: 'center' }}>Hết bài viết</p>}
            >
                {posts.map((post) => (
                    <PostComponent
                        key={post._id}
                        postId={post._id!}
                        title={post.title}
                        content={post.content}
                        email={post.createdBy?.email}
                        createdAt={post.createdAt}
                        meaning={post.meaning}
                        initialComments={commentsMap[post._id!] || []}
                        flashcards={post.flashcards || []}
                        hasMoreComments={
                            (commentsMap[post._id!]?.length || 0) === 1
                        }
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default PostList;
