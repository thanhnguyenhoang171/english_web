import React, { useEffect, useState } from 'react';
import { Modal,  Form, Input, message, Select } from 'antd';
import type { Flashcard } from '../flashcard/flashcard.modal';
import { callFetchFlashcard } from '../../api/flashcardApi';
import { callPostNewPost } from '../../api/postApi';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchPost } from '../../redux/auth/post.slice';

interface PostModalProps {
    visible: boolean;
    onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ visible, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const dispatch = useAppDispatch();
    const { meta } = useAppSelector((state) => state.post);

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
        fetchFlashcards();
    }, []);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // call api create new post
            await callPostNewPost(values);

            message.success('Tạo bài viết thành công!');
            form.resetFields();
            onClose();

            //Reload danh sách post page 1
            dispatch(
                fetchPost({
                    query: `current=1&pageSize=${meta.pageSize}`,
                    append: false,
                }),
            );
        } catch (error) {
            message.error('Tạo bài viết thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            title='Tạo bài viết mới'
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText='Đăng bài'
        >
            <Form form={form} layout='vertical'>
                <Form.Item
                    label='Tiêu đề'
                    name='title'
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề!' },
                    ]}
                >
                    <Input placeholder='Nhập tiêu đề bài viết' />
                </Form.Item>

                <Form.Item
                    label='Nội dung'
                    name='content'
                    rules={[
                        { required: true, message: 'Vui lòng nhập nội dung!' },
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder='Nhập nội dung bài viết'
                    />
                </Form.Item>

                <Form.Item
                    label='Meaning'
                    name='meaning'
                    rules={[
                        { required: true, message: 'Vui lòng nhập nội dung!' },
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder='Nhập nội dung bài viết'
                    />
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
    );
};

export default PostModal;
