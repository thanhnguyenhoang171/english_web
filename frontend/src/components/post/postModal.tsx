import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Select } from 'antd';
import type { Flashcard } from '../flashcard/flashcard.modal';
import { callFetchFlashcard } from '../../api/flashcardApi';
import { callPostNewPost } from '../../api/postApi';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { fetchPost } from '../../redux/auth/post.slice';
import TipTapEditor from '../TipTapEditor';

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
            title={
                <span style={{ fontWeight: 600, fontSize: 20 }}>
                    Tạo bài viết mới
                </span>
            }
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={loading}
            okText='Đăng bài'
            width={800}
            bodyStyle={{
                padding: '30px 40px',
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <Form
                form={form}
                layout='vertical'
                style={{
                    width: '100%',
                    fontSize: 16,
                    gap: 20,
                }}
            >
                <Form.Item
                    label='Tiêu đề'
                    name='title'
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề!' },
                    ]}
                >
                    <Input
                        placeholder='Nhập tiêu đề bài viết'
                        size='large'
                        style={{
                            height: 50,
                            borderRadius: 8,
                            padding: '0 15px',
                            fontSize: 16,
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label='Nội dung'
                    name='content'
                    rules={[
                        { required: true, message: 'Vui lòng nhập nội dung!' },
                    ]}
                >
                    <TipTapEditor placeholder='Nhập nội dung bài viết' />
                </Form.Item>

                <Form.Item
                    label='Meaning'
                    name='meaning'
                    rules={[
                        { required: true, message: 'Vui lòng nhập meaning!' },
                    ]}
                >
                    <TipTapEditor placeholder='Nhập nghĩa của bài viết' />
                </Form.Item>

                <Form.Item
                    label='Flashcard'
                    name='flashcards'
                    style={{ width: '100%' }}
                >
                    <Select
                        mode='multiple'
                        placeholder='Chọn flashcard'
                        optionLabelProp='label'
                        size='large'
                        style={{
                            fontSize: 16,
                            borderRadius: 8,
                        }}
                        dropdownStyle={{ maxHeight: 300 }}
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
                                                borderRadius: 4,
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
                                            borderRadius: 4,
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
