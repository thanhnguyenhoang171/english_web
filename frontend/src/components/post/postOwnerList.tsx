import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
    Select,
} from 'antd';
import type { IPost } from '../../types/backend';
import { callFetchFlashcard } from '../../api/flashcardApi';
import {
    callDeletePost,
    callFetchOwnerPost,
    callUpdatePost,
} from '../../api/postApi';
import type { Flashcard } from '../flashcard/flashcard.modal';

// interface IFlashcard {
//     _id: string;
//     title: string;
// }

const PostOwnerList: React.FC = () => {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingPost, setEditingPost] = useState<IPost | null>(null);
    const [form] = Form.useForm();

    // Fetch posts
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await callFetchOwnerPost();
            if (Array.isArray(res.data?.data)) {
                setPosts(res.data.data);
            }
        } catch {
            message.error('Lấy danh sách bài viết thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Fetch flashcards
    const fetchFlashcards = async () => {
        try {
            const res = await callFetchFlashcard();
            if (Array.isArray(res.data?.data)) {
                setFlashcards(res.data.data);
            }
        } catch {
            message.error('Lấy danh sách flashcard thất bại');
        }
    };

    useEffect(() => {
        fetchPosts();
        fetchFlashcards();
    }, []);

    const openEditModal = (post: IPost) => {
        setEditingPost(post);
        form.setFieldsValue({
            ...post,
            flashcards: Array.isArray(post.flashcards)
                ? post.flashcards.map((f: any) =>
                      typeof f === 'string' ? f : f._id,
                  )
                : [],
        });
        setModalVisible(true);
    };

    const handleDelete = async (_id: string | undefined) => {
        if (!_id) return; // nếu không có _id thì không làm gì
        try {
            await callDeletePost(_id);
            setPosts((prev) => prev.filter((p) => p._id !== _id));
            message.success('Xóa bài viết thành công');
        } catch {
            message.error('Xóa bài viết thất bại');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // ép flashcards thành string[]
            const payload = {
                ...values,
                flashcards: values.flashcards?.map((id: string) => id) || [],
            };

            console.log("Check update payload = ", payload)
            if (editingPost?._id) {
                const res = await callUpdatePost(editingPost._id, payload);
                if (res.data?.data) {
                    message.success('Cập nhật bài viết thành công');
                    await fetchPosts();
                }
            }

            setModalVisible(false);
            form.resetFields();
        } catch {
            // validation failed
        }
    };
    const columns = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (value: string) => {
                // Nếu là link ảnh
                if (
                    typeof value === 'string' &&
                    value.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                ) {
                    return (
                        <img
                            src={value}
                            alt='content'
                            style={{
                                width: 60,
                                height: 60,
                                objectFit: 'cover',
                                borderRadius: 4,
                            }}
                        />
                    );
                }
                // Nếu là text
                return (
                    <div
                        style={{
                            maxHeight: 50,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {value}
                    </div>
                );
            },
        },
        { title: 'Nghĩa', dataIndex: 'meaning', key: 'meaning' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: IPost) => (
                <Space>
                    <Button type='link' onClick={() => openEditModal(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title='Bạn có chắc muốn xóa bài viết này?'
                        onConfirm={() => handleDelete(record._id)}
                        okText='Có'
                        cancelText='Không'
                    >
                        <Button type='link' danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Table
                loading={loading}
                dataSource={posts}
                columns={columns}
                rowKey='_id' // dùng _id thay vì id
            />

            <Modal
                title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleSubmit}
                okText={editingPost ? 'Lưu' : 'Thêm'}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item
                        label='Tiêu đề'
                        name='title'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tiêu đề!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label='Nội dung'
                        name='content'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập nội dung!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item
                        label='Nghĩa'
                        name='meaning'
                        rules={[
                            { required: true, message: 'Vui lòng nhập nghĩa!' },
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label='Flashcard' name='flashcards'>
                        <Select
                            mode='multiple'
                            placeholder='Chọn flashcard'
                            optionLabelProp='label'
                        >
                            {flashcards.map((f) => (
                                <Select.Option
                                    key={f._id}
                                    value={f._id}
                                    label={
                                        f.type === 'image' ? (
                                            <img
                                                src={f.frontImage || ''}
                                                alt='flashcard'
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            f.frontText || ''
                                        )
                                    }
                                >
                                    {f.type === 'image' ? (
                                        <img
                                            src={f.frontImage || ''}
                                            alt='flashcard'
                                            style={{
                                                width: 50,
                                                height: 50,
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <span>{f.frontText}</span>
                                    )}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PostOwnerList;
