import { Form, Input, message, Modal, Upload, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormInstance, UploadProps, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import { callPostFlashcard, callUpdateFlashcard } from '../../api/flashcardApi';
import type { Flashcard } from './flashcard.modal';

interface flashcardAddModalProps {
    form: FormInstance<any>;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    editingFlashcard: Flashcard | null;
    onSuccess?: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

export const FlashcardAddModal: React.FC<flashcardAddModalProps> = ({
    form,
    modalVisible,
    setModalVisible,
    editingFlashcard,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [fileObj, setFileObj] = useState<File | null>(null);

    const typeValue = Form.useWatch('type', form); // Theo dõi giá trị type
    useEffect(() => {
        if (editingFlashcard) {
            form.setFieldsValue({
                ...editingFlashcard,
                tags: editingFlashcard.tags.join(', '),
            });
            setImageUrl(editingFlashcard.frontImage || undefined);
        } else {
            form.resetFields();
            setImageUrl(undefined);
        }
    }, [editingFlashcard, form]);
    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (
            info.file.status === 'done' ||
            info.file.status === 'removed' ||
            !info.file.status
        ) {
            setFileObj(info.file.originFileObj as File);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type='button'>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('type', values.type);
            formData.append('back', values.back);
            if (values.example) formData.append('example', values.example);
            if (values.tags) {
                (values.tags as string)
                    .split(',')
                    .map((t: string) => t.trim())
                    .forEach((tag: string) => formData.append('tags', tag));
            }

            if (values.type === 'text') {
                formData.append('frontText', values.frontText);
            }
            if (values.type === 'image') {
                if (fileObj) {
                    formData.append('file', fileObj);
                } else if (!editingFlashcard) {
                    message.error('Vui lòng chọn ảnh cho flashcard!');
                    return;
                }
            }

            if (editingFlashcard?._id) {
                await callUpdateFlashcard(editingFlashcard._id, formData);
                message.success('Cập nhật flashcard thành công!');
            } else {
                await callPostFlashcard(formData);
                message.success('Thêm flashcard thành công!');
            }
            if (onSuccess) {
                onSuccess();
            }

            setModalVisible(false);
            form.resetFields();
            setFileObj(null);
            setImageUrl(undefined);
        } catch (err) {
            console.error(err);
            message.error(
                editingFlashcard ? 'Cập nhật thất bại!' : 'Thêm thất bại!',
            );
        }
    };

    return (
        <Modal
            title={editingFlashcard ? 'Sửa flashcard' : 'Thêm flashcard mới'}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleOk}
            okText={editingFlashcard ? 'Lưu' : 'Thêm'}
        >
            <Form form={form} layout='vertical'>
                <Form.Item
                    label='Type'
                    name='type'
                    rules={[{ required: true, message: 'Vui lòng chọn type!' }]}
                >
                    <Select
                        placeholder='Chọn loại'
                        options={[
                            { label: 'Text', value: 'text' },
                            { label: 'Image', value: 'image' },
                        ]}
                        disabled={!!editingFlashcard} // 🔹 Chỉ disable khi đang edit
                    />
                </Form.Item>

                <Form.Item
                    label='Front Text'
                    name='frontText'
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    getFieldValue('type') === 'text' &&
                                    !value
                                ) {
                                    return Promise.reject(
                                        'frontText is required for text type',
                                    );
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]}
                >
                    <Input disabled={typeValue === 'image'} />
                </Form.Item>

                <Form.Item label='Front Image' name='frontImage'>
                    <Upload
                        disabled={typeValue === 'text'}
                        listType='picture-card'
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        customRequest={({  onSuccess }) => {
                            setTimeout(() => {
                                onSuccess && onSuccess('ok');
                            }, 0);
                        }}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt='avatar'
                                style={{ width: '100%' }}
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>

                <Form.Item
                    label='Back'
                    name='back'
                    rules={[{ required: true, message: 'Vui lòng nhập back!' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label='Example' name='example'>
                    <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item label='Tags (phân cách bằng dấu phẩy)' name='tags'>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
