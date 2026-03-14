import { useState, useEffect } from 'react'
import { 
  Button, 
  Table, 
  Tag, 
  Progress, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Space
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { projectApi } from '../../services/api'
import type { Project } from '../../types/project'

const { Option } = Select
const { TextArea } = Input

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form] = Form.useForm()

  // 加载项目列表
  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await projectApi.getProjects()
      setProjects(data)
    } catch (error: any) {
      message.error('加载项目失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // 打开新建/编辑弹窗
  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      form.setFieldsValue(project)
    } else {
      setEditingProject(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭弹窗
  const closeModal = () => {
    setModalVisible(false)
    setEditingProject(null)
    form.resetFields()
  }

  // 保存项目
  const handleSave = async (values: any) => {
    try {
      if (editingProject) {
        await projectApi.updateProject(editingProject.id, values)
        message.success('项目更新成功')
      } else {
        await projectApi.createProject(values)
        message.success('项目创建成功')
      }
      closeModal()
      loadProjects()
    } catch (error: any) {
      message.error('保存失败: ' + error.message)
    }
  }

  // 删除项目
  const handleDelete = async (id: string) => {
    try {
      await projectApi.deleteProject(id)
      message.success('项目删除成功')
      loadProjects()
    } catch (error: any) {
      message.error('删除失败: ' + error.message)
    }
  }

  // 更新进度
  // const handleProgressChange = async (id: string, progress: number) => {
  //   try {
  //     await projectApi.updateProject(id, { progress })
  //     message.success('进度更新成功')
  //     loadProjects()
  //   } catch (error: any) {
  //     message.error('更新失败: ' + error.message)
  //   }
  // }

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Project) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{name}</span>
          <span style={{ fontSize: 12, color: '#888' }}>
            {new Date(record.createdAt).toLocaleDateString()}
          </span>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => desc || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'blue',
          completed: 'green',
          paused: 'orange',
          archived: 'default',
        }
        const labels: Record<string, string> = {
          active: '进行中',
          completed: '已完成',
          paused: '已暂停',
          archived: '已归档',
        }
        return <Tag color={colors[status] || 'default'}>{labels[status] || status}</Tag>
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress 
          percent={progress} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Project) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => window.open(`/projects/${record.id}`, '_blank')}
          >
            查看
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => openModal(record)}
          >
            编辑
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
          <h1 style={{ margin: 0, fontSize: 24 }}>项目管理</h1>
          <p style={{ margin: '8px 0 0', color: '#888' }}>
            共 {projects.length} 个项目
          </p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large"
          onClick={() => openModal()}
        >
          新建项目
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={projects} 
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
        title={editingProject ? '编辑项目' : '新建项目'}
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
          initialValues={{ status: 'active' }}
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="输入项目名称" />
          </Form.Item>

          <Form.Item
            label="项目描述"
            name="description"
          >
            <TextArea rows={4} placeholder="输入项目描述（可选）" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="active">进行中</Option>
              <Option value="paused">已暂停</Option>
              <Option value="completed">已完成</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>

          {editingProject && (
            <Form.Item
              label="进度"
              name="progress"
            >
              <Select>
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => (
                  <Option key={p} value={p}>{p}%</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  )
}

export default ProjectList
