import { useState, useEffect } from 'react'
import { 
  Button, 
  Table, 
  Tag, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Space,
  Drawer
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FileTextOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { scriptApi } from '../../services/api'
import { projectApi } from '../../services/api'
import type { Script } from '../../types/script'

const { Option } = Select
const { TextArea } = Input

function ScriptList() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [editingScript, setEditingScript] = useState<Script | null>(null)
  const [form] = Form.useForm()
  const [aiForm] = Form.useForm()
  const navigate = useNavigate()

  // 加载剧本列表
  const loadScripts = async () => {
    setLoading(true)
    try {
      const data = await scriptApi.getScripts()
      setScripts(data)
    } catch (error: any) {
      message.error('加载剧本失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 加载项目列表（用于关联）
  const loadProjects = async () => {
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('加载项目失败', error)
    }
  }

  useEffect(() => {
    loadScripts()
    loadProjects()
  }, [])

  // 打开新建/编辑弹窗
  const openModal = (script?: Script) => {
    if (script) {
      setEditingScript(script)
      form.setFieldsValue({
        title: script.title,
        content: script.content,
        genre: script.genre,
        projectId: script.projectId,
      })
    } else {
      setEditingScript(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false)
    setEditingScript(null)
    form.resetFields()
  }

  // 保存剧本
  const handleSave = async (values: any) => {
    try {
      if (editingScript) {
        await scriptApi.updateScript(editingScript.id, values)
        message.success('剧本更新成功')
      } else {
        await scriptApi.createScript(values)
        message.success('剧本创建成功')
      }
      closeModal()
      loadScripts()
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    }
  }

  // 删除剧本
  const handleDelete = async (id: string) => {
    try {
      await scriptApi.deleteScript(id)
      message.success('剧本删除成功')
      loadScripts()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // AI 生成剧本
  const handleAiGenerate = async (values: { prompt: string; genre?: string; projectId?: string }) => {
    setAiLoading(true)
    try {
      const data = await scriptApi.generateScript(values)
      // 保存生成的剧本
      await scriptApi.createScript({
        title: data.title,
        content: data.content,
        genre: values.genre,
        projectId: values.projectId,
      })
      message.success('AI 剧本生成成功')
      setAiDrawerVisible(false)
      aiForm.resetFields()
      loadScripts()
    } catch (error: any) {
      message.error('生成失败: ' + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  const columns = [
    {
      title: '剧本标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Script) => (
        <Space>
          <FileTextOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{title}</span>
          {record.aiGenerated && <Tag color="purple">AI</Tag>}
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'genre',
      key: 'genre',
      render: (genre: string) => genre || '-',
    },
    {
      title: '所属项目',
      dataIndex: 'project',
      key: 'project',
      render: (project: any) => project?.name || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          draft: 'default',
          completed: 'green',
          archived: 'orange',
        }
        const labels: Record<string, string> = {
          draft: '草稿',
          completed: '已完成',
          archived: '已归档',
        }
        return <Tag color={colors[status] || 'default'}>{labels[status] || status}</Tag>
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Script) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/scripts/${record.id}`)}
          >
            编辑
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            设置
          </Button>
          <Popconfirm
            title="确认删除"
            description="删除后无法恢复，是否继续？"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24 }}>剧本管理</h1>
          <p style={{ margin: '8px 0 0', color: '#888' }}>
            共 {scripts.length} 个剧本
          </p>
        </div>
        <Space>
          <Button 
            icon={<ThunderboltOutlined />}
            onClick={() => setAiDrawerVisible(true)}
          >
            AI 生成
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => openModal()}
          >
            新建剧本
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={scripts} 
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingScript ? '编辑剧本' : '新建剧本'}
        open={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        width={600}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="剧本标题"
            name="title"
            rules={[{ required: true, message: '请输入剧本标题' }]}
          >
            <Input placeholder="输入剧本标题" />
          </Form.Item>

          <Form.Item
            label="类型"
            name="genre"
          >
            <Select placeholder="选择剧本类型" allowClear>
              <Option value="short">短视频</Option>
              <Option value="movie">电影</Option>
              <Option value="tv">电视剧</Option>
              <Option value="ad">广告</Option>
              <Option value="animation">动画</Option>
              <Option value="documentary">纪录片</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="所属项目"
            name="projectId"
          >
            <Select placeholder="关联到项目" allowClear>
              {projects.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="剧本内容"
            name="content"
          >
            <TextArea rows={6} placeholder="输入剧本内容（可选，可在编辑器中详细编辑）" />
          </Form.Item>

          {editingScript && (
            <Form.Item
              label="状态"
              name="status"
            >
              <Select>
                <Option value="draft">草稿</Option>
                <Option value="completed">已完成</Option>
                <Option value="archived">已归档</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* AI 生成抽屉 */}
      <Drawer
        title="🤖 AI 生成剧本"
        width={500}
        open={aiDrawerVisible}
        onClose={() => setAiDrawerVisible(false)}
      >
        <Form
          form={aiForm}
          layout="vertical"
          onFinish={handleAiGenerate}
        >
          <Form.Item
            label="生成提示词"
            name="prompt"
            rules={[{ required: true, message: '请输入生成提示' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="描述你想要的剧本内容，例如：一个关于人工智能觉醒的科幻短片，主角是一个家用机器人..."
            />
          </Form.Item>

          <Form.Item
            label="类型"
            name="genre"
          >
            <Select placeholder="选择剧本类型" allowClear>
              <Option value="short">短视频</Option>
              <Option value="movie">电影</Option>
              <Option value="tv">电视剧</Option>
              <Option value="ad">广告</Option>
              <Option value="animation">动画</Option>
              <Option value="documentary">纪录片</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="关联项目"
            name="projectId"
          >
            <Select placeholder="将生成的剧本关联到项目" allowClear>
              {projects.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<ThunderboltOutlined />}
              loading={aiLoading}
              block
              size="large"
            >
              {aiLoading ? '生成中...' : '开始生成'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  )
}

export default ScriptList
