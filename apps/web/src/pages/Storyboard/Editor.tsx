import { useState, useEffect, useRef } from 'react'
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  message,
  List,
  Typography,
  Space,
  Tooltip,
  Popconfirm,
  Empty,
  Upload,
  Slider,
  Divider,
  Tag,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  DragOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CopyOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import { storyboardApi, projectApi, fileApi } from '../../services/api'
import type { Storyboard, StoryboardFrame } from '../../types/storyboard'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

// 镜头类型选项
const SHOT_TYPES = [
  { value: 'wide', label: '全景', desc: '展示场景全貌' },
  { value: 'medium', label: '中景', desc: '人物膝盖以上' },
  { value: 'close', label: '近景', desc: '人物胸部以上' },
  { value: 'extreme-close', label: '特写', desc: '面部或细节' },
  { value: 'aerial', label: '航拍', desc: '俯视角度' },
]

// 运镜方式选项
const CAMERA_MOVEMENTS = [
  { value: 'static', label: '固定' },
  { value: 'pan', label: '摇镜' },
  { value: 'tilt', label: '俯仰' },
  { value: 'zoom', label: '变焦' },
  { value: 'track', label: '跟拍' },
  { value: 'handheld', label: '手持' },
]

function StoryboardEditor() {
  const [storyboards, setStoryboards] = useState<Storyboard[]>([])
  const [currentStoryboard, setCurrentStoryboard] = useState<Storyboard | null>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [frameModalVisible, setFrameModalVisible] = useState(false)
  const [editingFrame, setEditingFrame] = useState<StoryboardFrame | null>(null)
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [draggedFrame, setDraggedFrame] = useState<StoryboardFrame | null>(null)
  const [form] = Form.useForm()
  const [frameForm] = Form.useForm()
  const canvasRef = useRef<HTMLDivElement>(null)
  
  // 分镜图上传状态
  const [frameImageUrl, setFrameImageUrl] = useState<string>('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 加载数据
  useEffect(() => {
    loadStoryboards()
    loadProjects()
  }, [])

  const loadStoryboards = async () => {
    setLoading(true)
    try {
      const data = await storyboardApi.getStoryboards()
      setStoryboards(data)
    } catch (error: any) {
      message.error('加载分镜失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('加载项目失败', error)
    }
  }

  // 创建分镜
  const handleCreateStoryboard = async (values: any) => {
    try {
      const data = await storyboardApi.createStoryboard(values)
      message.success('分镜创建成功')
      setCreateModalVisible(false)
      form.resetFields()
      loadStoryboards()
      setCurrentStoryboard(data)
    } catch (error: any) {
      message.error('创建失败: ' + error.message)
    }
  }

  // 删除分镜
  const handleDeleteStoryboard = async (id: string) => {
    try {
      await storyboardApi.deleteStoryboard(id)
      message.success('分镜删除成功')
      if (currentStoryboard?.id === id) {
        setCurrentStoryboard(null)
      }
      loadStoryboards()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // 添加镜头
  const handleAddFrame = async (values: any) => {
    if (!currentStoryboard) return

    try {
      const newFrame = {
        ...values,
        imageUrl: frameImageUrl,
        order: currentStoryboard.frames?.length || 0,
      }
      await storyboardApi.addFrame(currentStoryboard.id, newFrame)
      message.success('镜头添加成功')
      closeFrameModal()
      frameForm.resetFields()
      refreshCurrentStoryboard()
    } catch (error: any) {
      message.error('添加失败: ' + error.message)
    }
  }

  // 更新镜头
  const handleUpdateFrame = async (values: any) => {
    if (!currentStoryboard || !editingFrame) return

    try {
      await storyboardApi.updateFrame(currentStoryboard.id, editingFrame.id, {
        ...values,
        imageUrl: frameImageUrl,
      })
      message.success('镜头更新成功')
      closeFrameModal()
      setEditingFrame(null)
      frameForm.resetFields()
      refreshCurrentStoryboard()
    } catch (error: any) {
      message.error('更新失败: ' + error.message)
    }
  }

  // 删除镜头
  const handleDeleteFrame = async (frameId: string) => {
    if (!currentStoryboard) return

    try {
      await storyboardApi.deleteFrame(currentStoryboard.id, frameId)
      message.success('镜头删除成功')
      refreshCurrentStoryboard()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // 刷新当前分镜
  const refreshCurrentStoryboard = async () => {
    if (!currentStoryboard) return
    try {
      const data = await storyboardApi.getStoryboard(currentStoryboard.id)
      setCurrentStoryboard(data)
    } catch (error) {
      console.error('刷新失败', error)
    }
  }

  // 移动镜头位置
  const moveFrame = async (frameId: string, direction: 'up' | 'down') => {
    if (!currentStoryboard) return

    const frames = [...(currentStoryboard.frames || [])]
    const index = frames.findIndex(f => f.id === frameId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= frames.length) return

    // 交换位置
    const temp = frames[index]
    frames[index] = frames[newIndex]
    frames[newIndex] = temp

    // 更新 order
    const updatedFrames = frames.map((f, i) => ({ ...f, order: i }))

    try {
      await storyboardApi.updateStoryboard(currentStoryboard.id, { frames: updatedFrames })
      refreshCurrentStoryboard()
    } catch (error: any) {
      message.error('移动失败: ' + error.message)
    }
  }

  // 打开镜头编辑弹窗
  const openFrameModal = (frame?: StoryboardFrame) => {
    if (frame) {
      setEditingFrame(frame)
      setFrameImageUrl(frame.imageUrl || '')
      frameForm.setFieldsValue({
        description: frame.description,
        shotType: frame.shotType,
        cameraMovement: frame.cameraMovement,
        duration: frame.duration,
        notes: frame.notes,
      })
    } else {
      setEditingFrame(null)
      setFrameImageUrl('')
      frameForm.resetFields()
      frameForm.setFieldsValue({ duration: 3, shotType: 'medium', cameraMovement: 'static' })
    }
    setUploadProgress(0)
    setFrameModalVisible(true)
  }

  // 关闭弹窗时重置图片状态
  const closeFrameModal = () => {
    setFrameModalVisible(false)
    setFrameImageUrl('')
    setUploadingImage(false)
    setUploadProgress(0)
  }

  // 拖拽开始
  const handleDragStart = (frame: StoryboardFrame) => {
    setDraggedFrame(frame)
  }

  // 拖拽放置
  const handleDrop = async (targetFrame: StoryboardFrame) => {
    if (!currentStoryboard || !draggedFrame || draggedFrame.id === targetFrame.id) {
      setDraggedFrame(null)
      return
    }

    const frames = [...(currentStoryboard.frames || [])]
    const draggedIndex = frames.findIndex(f => f.id === draggedFrame.id)
    const targetIndex = frames.findIndex(f => f.id === targetFrame.id)

    if (draggedIndex === -1 || targetIndex === -1) return

    // 重新排序
    frames.splice(draggedIndex, 1)
    frames.splice(targetIndex, 0, draggedFrame)

    // 更新 order
    const updatedFrames = frames.map((f, i) => ({ ...f, order: i }))

    try {
      await storyboardApi.updateStoryboard(currentStoryboard.id, { frames: updatedFrames })
      refreshCurrentStoryboard()
      message.success('顺序已更新')
    } catch (error: any) {
      message.error('排序失败: ' + error.message)
    }

    setDraggedFrame(null)
  }

  // 计算总时长
  const totalDuration = currentStoryboard?.frames?.reduce((sum, f) => sum + (f.duration || 0), 0) || 0

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 140px)' }}>
      {/* 左侧分镜列表 */}
      <Card style={{ width: 300, marginRight: 16, overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={5} style={{ margin: 0 }}>分镜列表</Title>
          <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            新建
          </Button>
        </div>

        <List
          dataSource={storyboards}
          loading={loading}
          renderItem={(item) => (
            <List.Item
              style={{
                cursor: 'pointer',
                background: currentStoryboard?.id === item.id ? '#e6f7ff' : 'transparent',
                padding: '12px',
                borderRadius: '6px',
              }}
              onClick={() => setCurrentStoryboard(item)}
              actions={[
                <Popconfirm
                  key="delete"
                  title="确认删除"
                  onConfirm={() => handleDeleteStoryboard(item.id)}
                >
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: currentStoryboard?.id === item.id ? 600 : 400 }}>{item.title}</span>}
                description={`${item.frames?.length || 0} 个镜头 · ${item.project?.name || '未关联'}`}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 右侧画布区域 */}
      <Card style={{ flex: 1, overflow: 'auto' }}>
        {currentStoryboard ? (
          <div>
            {/* 头部工具栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>{currentStoryboard.title}</Title>
                <Text type="secondary">
                  {currentStoryboard.frames?.length || 0} 个镜头 · 
                  总时长 {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </Text>
              </div>
              <Space>
                <Button icon={<ThunderboltOutlined />}>AI 生成</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openFrameModal()}>
                  添加镜头
                </Button>
              </Space>
            </div>

            {/* 画布区域 */}
            <div
              ref={canvasRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
                minHeight: 400,
                padding: 16,
                background: '#f5f5f5',
                borderRadius: 8,
              }}
            >
              {currentStoryboard.frames?.map((frame, index) => (
                <Card
                  key={frame.id}
                  draggable
                  onDragStart={() => handleDragStart(frame)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(frame)}
                  style={{
                    cursor: 'move',
                    border: selectedFrameId === frame.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    opacity: draggedFrame?.id === frame.id ? 0.5 : 1,
                  }}
                  onClick={() => setSelectedFrameId(frame.id)}
                  title={`镜头 ${index + 1}`}
                  extra={
                    <Space size="small">
                      <DragOutlined style={{ cursor: 'grab' }} />
                    </Space>
                  }
                  actions={[
                    <Tooltip title="上移"><Button type="text" size="small" icon={<ArrowUpOutlined />} onClick={() => moveFrame(frame.id, 'up')} /></Tooltip>,
                    <Tooltip title="下移"><Button type="text" size="small" icon={<ArrowDownOutlined />} onClick={() => moveFrame(frame.id, 'down')} /></Tooltip>,
                    <Tooltip title="编辑"><Button type="text" size="small" icon={<EditOutlined />} onClick={() => openFrameModal(frame)} /></Tooltip>,
                    <Tooltip title="复制"><Button type="text" size="small" icon={<CopyOutlined />} /></Tooltip>,
                    <Popconfirm title="确认删除" onConfirm={() => handleDeleteFrame(frame.id)}>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  {/* 镜头画面 */}
                  <div
                    style={{
                      height: 150,
                      background: frame.imageUrl ? `url(${frame.imageUrl}) center/cover` : '#e8e8e8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                      marginBottom: 12,
                      position: 'relative',
                    }}
                  >
                    {!frame.imageUrl && <PictureOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                    }}>
                      {frame.duration || 3}s
                    </div>
                  </div>

                  {/* 镜头信息 */}
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>机位:</Text>{' '}
                      <Tag>
                        {SHOT_TYPES.find(s => s.value === frame.shotType)?.label || frame.shotType || '中景'}
                      </Tag>
                      <Tag>
                        {CAMERA_MOVEMENTS.find(c => c.value === frame.cameraMovement)?.label || '固定'}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 13, color: '#666', minHeight: 40 }}>
                      {frame.description || <Text type="secondary">暂无描述...</Text>}
                    </div>
                  </div>
                </Card>
              ))}

              {/* 添加按钮 */}
              <Card
                style={{
                  height: 280,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #d9d9d9',
                }}
                onClick={() => openFrameModal()}
                hoverable
              >
                <PlusOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
                <div style={{ marginTop: 8, color: '#888' }}>添加镜头</div>
              </Card>
            </div>
          </div>
        ) : (
          <Empty
            image={<FolderOpenOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
            description="选择一个分镜开始编辑"
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
              创建分镜
            </Button>
          </Empty>
        )}
      </Card>

      {/* 创建分镜弹窗 */}
      <Modal
        title="新建分镜"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateStoryboard}>
          <Form.Item
            label="分镜名称"
            name="title"
            rules={[{ required: true, message: '请输入分镜名称' }]}
          >
            <Input placeholder="输入分镜名称" />
          </Form.Item>
          <Form.Item
            label="关联项目"
            name="projectId"
            rules={[{ required: true, message: '请选择关联项目' }]}
          >
            <Select placeholder="选择项目">
              {projects.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 镜头编辑弹窗 */}
      <Modal
        title={editingFrame ? '编辑镜头' : '添加镜头'}
        open={frameModalVisible}
        onCancel={closeFrameModal}
        onOk={() => frameForm.submit()}
        width={600}
      >
        <Form form={frameForm} layout="vertical" onFinish={editingFrame ? handleUpdateFrame : handleAddFrame}>
          <Form.Item
            label="镜头描述"
            name="description"
          >
            <TextArea rows={3} placeholder="描述这个镜头的内容..." />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              label="镜头类型"
              name="shotType"
              initialValue="medium"
            >
              <Select placeholder="选择镜头类型">
                {SHOT_TYPES.map(type => (
                  <Option key={type.value} value={type.value}>{type.label} - {type.desc}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="运镜方式"
              name="cameraMovement"
              initialValue="static"
            >
              <Select placeholder="选择运镜方式">
                {CAMERA_MOVEMENTS.map(move => (
                  <Option key={move.value} value={move.value}>{move.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            label="时长（秒）"
            name="duration"
            initialValue={3}
          >
            <Slider min={1} max={30} marks={{ 1: '1s', 10: '10s', 20: '20s', 30: '30s' }} />
          </Form.Item>

          <Form.Item
            label="备注"
            name="notes"
          >
            <TextArea rows={2} placeholder="拍摄备注、设备要求等..." />
          </Form.Item>

          <Divider />

          <Form.Item label="分镜图">
            {frameImageUrl ? (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={frameImageUrl} 
                  alt="分镜图" 
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} 
                />
                <div style={{ marginTop: 8 }}>
                  <Button 
                    size="small" 
                    danger 
                    onClick={() => setFrameImageUrl('')}
                  >
                    删除图片
                  </Button>
                </div>
              </div>
            ) : (
              <Upload.Dragger
                accept="image/*"
                showUploadList={false}
                beforeUpload={async (file) => {
                  setUploadingImage(true)
                  setUploadProgress(0)
                  try {
                    const result = await fileApi.uploadStoryboard(file, (progress) => {
                      setUploadProgress(progress)
                    })
                    if (result.success) {
                      setFrameImageUrl(result.data.url)
                      message.success('图片上传成功')
                    }
                  } catch (error: any) {
                    message.error('上传失败: ' + error.message)
                  } finally {
                    setUploadingImage(false)
                    setUploadProgress(0)
                  }
                  return false
                }}
              >
                <p className="ant-upload-drag-icon">
                  <PictureOutlined />
                </p>
                <p className="ant-upload-text">
                  {uploadingImage ? `上传中 ${uploadProgress}%` : '点击或拖拽上传分镜图'}
                </p>
                <p className="ant-upload-hint">支持 JPG、PNG、WebP 格式，最大 50MB</p>
              </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StoryboardEditor
